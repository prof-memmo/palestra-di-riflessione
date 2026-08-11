(function() {
    const GAME_ID = window.HUB_GAME_ID || "palestra-di-riflessione";
    
    // Default allowed plans if DB fails or is missing
    let allowedPlans = {
        base: true,
        viandante: true,
        docente_didattico: true,
        docente_ecosistema: true
    };

    const PalestraPermissions = {
        init: function() {
            // Listen to Hub Firebase for allowedPlans
            const checkInterval = setInterval(() => {
                if (typeof firebase !== 'undefined' && firebase.apps.length > 0) {
                    const hubApp = firebase.apps.find(a => a.name === "HubGuardApp");
                    if (hubApp) {
                        clearInterval(checkInterval);
                        hubApp.firestore().collection('games_status').doc(GAME_ID).onSnapshot(doc => {
                            if (doc.exists) {
                                const data = doc.data();
                                if (data.allowedPlans) {
                                    allowedPlans = data.allowedPlans;
                                } else if (data.isFreeBaseVersion !== undefined) {
                                    allowedPlans.base = data.isFreeBaseVersion;
                                }
                                // Re-evaluate access se l'utente è già loggato
                                if (window.currentUser) {
                                    // Ricaviamo il piano dell'utente se salvato, di base è 'base'
                                    let userPlanStr = localStorage.getItem('palestra_user_plan') || 'base';
                                    this.checkAccess(userPlanStr);
                                }
                            }
                        });
                    }
                }
            }, 500);

            // Stili Lucchetti
            const style = document.createElement('style');
            style.innerHTML = `
                .permission-locked {
                    position: relative;
                    opacity: 0.6;
                    cursor: not-allowed !important;
                }
                .permission-locked::after {
                    content: '🔒';
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    font-size: 1.5rem;
                    background: rgba(255,255,255,0.9);
                    border-radius: 50%;
                    padding: 5px;
                    z-index: 10;
                }
                #plan-block-overlay {
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    background: rgba(255,255,255,0.98); z-index: 999999;
                    display: none; flex-direction: column; align-items: center; justify-content: center;
                    font-family: 'Outfit', sans-serif; text-align: center;
                }
                #plan-block-overlay h2 { font-size: 2.5rem; color: #ef4444; margin-bottom: 1rem; }
                #plan-block-overlay p { font-size: 1.2rem; color: #6b7280; max-width: 500px; line-height: 1.5; margin-bottom: 2rem; }
                #plan-block-overlay .btn-upgrade {
                    background: linear-gradient(135deg, #8b5cf6, #d946ef); color: white;
                    padding: 15px 30px; font-size: 1.2rem; border-radius: 50px; font-weight: bold;
                    text-decoration: none; border: none; cursor: pointer; box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
                }
            `;
            document.head.appendChild(style);

            const overlay = document.createElement('div');
            overlay.id = 'plan-block-overlay';
            overlay.innerHTML = `
                <div style="font-size: 4rem; margin-bottom: 1rem;">⛔</div>
                <h2>Accesso non incluso</h2>
                <p>Il tuo abbonamento (<span id="user-current-plan-display"></span>) non include Palestra di Riflessione.</p>
                <a href="https://prof-memmo-hub.web.app" class="btn-upgrade">Passa a un Piano Superiore</a>
            `;
            document.documentElement.appendChild(overlay);

            // Osserva cambiamenti nel DOM per applicare i lucchetti in tempo reale
            const observer = new MutationObserver(() => this.lockUI());
            observer.observe(document.body, { childList: true, subtree: true });
        },

        checkAccess: function(userPlanStr) {
            let planKey = 'base';
            if (userPlanStr) {
                const p = userPlanStr.toLowerCase();
                if (p.includes('viandante')) planKey = 'viandante';
                else if (p.includes('docente') && p.includes('ecosistema')) planKey = 'docente_ecosistema';
                else if (p.includes('docente')) planKey = 'docente_didattico';
            }
            
            const overlay = document.getElementById('plan-block-overlay');
            if (allowedPlans[planKey] === false) {
                document.getElementById('user-current-plan-display').textContent = userPlanStr || 'Base';
                overlay.style.display = 'flex';
            } else {
                overlay.style.display = 'none';
            }
        },

        can: function(action) {
            let planKey = 'base';
            let userPlanStr = localStorage.getItem('palestra_user_plan') || 'base';
            const p = userPlanStr.toLowerCase();
            if (p.includes('viandante')) planKey = 'viandante';
            else if (p.includes('docente') && p.includes('ecosistema')) planKey = 'docente_ecosistema';
            else if (p.includes('docente')) planKey = 'docente_didattico';

            if (planKey === 'docente_didattico' || planKey === 'docente_ecosistema') return true;

            // Il Viandante ha accesso a tutti i test, non alle classi. 
            // In Palestra non ci sono classi al momento, quindi il Viandante ha tutto sbloccato.
            if (planKey === 'viandante') return true;

            if (planKey === 'base') {
                if (action === 'analisiLogica' || action === 'analisiPeriodo' || action === 'culturagenerale') return false;
                if (action === 'livello_b1' || action === 'livello_b2') return false;
            }

            return true;
        },

        lockUI: function() {
            if (!this.can('analisiLogica')) {
                // Blocca Analisi Logica
                document.querySelectorAll('[onclick*="analisiLogica"]').forEach(el => this.applyLock(el));
            }
            if (!this.can('analisiPeriodo')) {
                // Blocca Analisi Periodo
                document.querySelectorAll('[onclick*="analisiPeriodo"]').forEach(el => this.applyLock(el));
            }
            if (!this.can('culturagenerale')) {
                // Blocca Test Cultura Generale
                document.querySelectorAll('[onclick*="culturagenerale"]').forEach(el => this.applyLock(el));
            }
            if (!this.can('livello_b1')) {
                // Blocca testi B1 e B2 nella lettura
                document.querySelectorAll('.filter-btn').forEach(btn => {
                    if (btn.textContent.includes('B1') || btn.textContent.includes('B2')) {
                        this.applyLock(btn);
                    }
                });
                document.querySelectorAll('.list-item').forEach(item => {
                    if (item.textContent.includes('B1') || item.textContent.includes('B2')) {
                        this.applyLock(item);
                    }
                });
            }
        },

        applyLock: function(element) {
            if (element.classList.contains('permission-locked')) return;
            element.classList.add('permission-locked');
            
            // Rimuoviamo gli eventi onclick originali
            element.removeAttribute('onclick');
            
            // Aggiungiamo il listener custom
            element.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                alert("Questa funzione è riservata alla Versione Completa. Passa a un abbonamento superiore per sbloccarla.");
            }, true); // Use capture per intercettare prima
        }
    };

    window.PalestraPermissions = PalestraPermissions;
    document.addEventListener('DOMContentLoaded', () => PalestraPermissions.init());
})();

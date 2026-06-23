const SessionTimer = {
    SESSION_DURATION: 45 * 60, // 45 minuti in secondi
    BREAK_DURATION: 15 * 60,   // 15 minuti in secondi
    MAX_SESSIONS_PER_DAY: 2,
    
    data: null,
    timerInterval: null,
    saveInterval: null,

    init: async function() {
        if (!window.Auth || !window.Auth.getUser) return;
        const user = window.Auth.getUser();
        if (!user || user.role !== 'studente') return;

        await this.loadSessionData(user);
        this.startEngine(user);
    },

    loadSessionData: async function(user) {
        try {
            const doc = await window.fbDb.collection('users').doc(user.uid).get();
            let data = doc.data().sessionData || null;
            const today = new Date().toLocaleDateString();
            
            if (!data || data.date !== today) {
                data = {
                    date: today,
                    sessionsPlayed: 0,
                    timeLeft: this.SESSION_DURATION,
                    breakEndTime: null
                };
                await this.saveSessionData(user.uid, data);
            }
            this.data = data;
        } catch(e) { console.error("Error loading timer", e); }
    },

    saveSessionData: async function(uid, data) {
        this.data = data;
        try {
            await window.fbDb.collection('users').doc(uid).update({ sessionData: data });
        } catch(e) {}
    },

    startEngine: function(user) {
        if (this.timerInterval) clearInterval(this.timerInterval);
        if (this.saveInterval) clearInterval(this.saveInterval);

        this.timerInterval = setInterval(() => this.tick(user), 1000);
        this.saveInterval = setInterval(() => this.saveSessionData(user.uid, this.data), 10000);
    },

    tick: function(user) {
        if (!this.data) return;
        const now = Date.now();
        
        // 1. Check se è in pausa
        if (this.data.breakEndTime) {
            if (now >= this.data.breakEndTime) {
                // Pausa finita
                this.data.breakEndTime = null;
                this.data.timeLeft = this.SESSION_DURATION;
                this.saveSessionData(user.uid, this.data);
                
                // Torna al gioco
                if (window.currentSection === 'pausa-obbligatoria') {
                    if (window.navigateTo) window.navigateTo('home');
                    else window.location.hash = 'home';
                }
            } else {
                // Mostra pausa
                if (window.currentSection !== 'pausa-obbligatoria') {
                    this.showPausaObbligatoria();
                }
                const remainingBreak = Math.ceil((this.data.breakEndTime - now) / 1000);
                this.updateBreakUI(remainingBreak);
            }
            return;
        }

        // 2. Non è in pausa. Check se bloccato per oggi
        if (this.data.sessionsPlayed >= this.MAX_SESSIONS_PER_DAY) {
            if (window.currentSection !== 'pausa-obbligatoria') {
                this.showPausaObbligatoria();
            }
            this.updateBlockUI();
            return;
        }

        // 3. Gioco in corso
        if (this.data.timeLeft > 0) {
            this.data.timeLeft--;
            this.updateTimerUI(this.data.timeLeft);
        } else {
            // Sessione terminata
            this.data.sessionsPlayed++;
            if (this.data.sessionsPlayed < this.MAX_SESSIONS_PER_DAY) {
                this.data.breakEndTime = now + (this.BREAK_DURATION * 1000);
            }
            this.saveSessionData(user.uid, this.data);
            this.tick(user); // Force immediate UI update
        }
    },

    showPausaObbligatoria: function() {
        window.currentSection = 'pausa-obbligatoria';
        const appContainer = document.getElementById('app');
        if (!appContainer) return;

        appContainer.innerHTML = `
            <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:80vh; text-align:center; padding:2rem;">
                <div style="font-size: 5rem; margin-bottom: 1rem;">🐈</div>
                <h2 style="font-weight: 900; color: #2c3e50; font-size: 2rem; margin-bottom: 1rem;">MIAO! PAUSA OBBLIGATORIA</h2>
                
                <div id="pausa-timer-display" style="font-size: 4rem; font-weight: 900; color: #e74c3c; font-variant-numeric: tabular-nums; letter-spacing: -2px; margin: 2rem 0; display: none;"></div>
                
                <div id="pausa-block-msg" style="display: none; background: #fff3e0; border: 2px solid #ffb74d; padding: 2rem; border-radius: 20px; max-width: 500px; margin: 2rem auto;">
                    <h3 style="color: #ef6c00; margin-bottom: 1rem; font-weight: 800;">Hai raggiunto il limite giornaliero!</h3>
                    <p style="color: #e65100; font-weight: 600;">Per oggi hai studiato abbastanza. Il cervello ha bisogno di riposare per assimilare le informazioni.</p>
                    <p style="margin-top: 1rem; font-size: 0.9rem; color: #666;">Torna domani per continuare il tuo allenamento!</p>
                </div>
            </div>
        `;
    },

    updateTimerUI: function(secsLeft) {
        // Nascondi timer se in onboarding
        const onboardingViews = ['intro', 'login'];
        
        const dropdownContainer = document.getElementById('dropdown-timer-container');
        const dropdownTimer = document.getElementById('dropdown-session-timer');
        
        const m = Math.floor(secsLeft / 60);
        const s = secsLeft % 60;
        const timeStr = `${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
        
        if (onboardingViews.includes(window.currentSection) || !window.currentSection) {
            if (dropdownContainer) dropdownContainer.style.display = 'none';
        } else {
            if (dropdownContainer && dropdownTimer) {
                dropdownContainer.style.display = 'block';
                dropdownTimer.textContent = timeStr;
            }
        }
    },

    updateBreakUI: function(secsLeft) {
        const blockMsg = document.getElementById('pausa-block-msg');
        const timerDisplay = document.getElementById('pausa-timer-display');
        if (blockMsg) blockMsg.style.display = 'none';
        if (timerDisplay) {
            timerDisplay.style.display = 'block';
            const m = Math.floor(secsLeft / 60);
            const s = secsLeft % 60;
            timerDisplay.textContent = `${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
        }
    },

    updateBlockUI: function() {
        const blockMsg = document.getElementById('pausa-block-msg');
        const timerDisplay = document.getElementById('pausa-timer-display');
        if (timerDisplay) timerDisplay.style.display = 'none';
        if (blockMsg) blockMsg.style.display = 'block';
    }
};

window.SessionTimer = SessionTimer;

// Inizializza il timer dopo il caricamento o al login
document.addEventListener('DOMContentLoaded', () => {
    // Si aggancia al sistema di login per far partire il timer
    const originalLogin = window.Auth ? window.Auth.login : null;
    if (originalLogin) {
        // Se c'è già un utente, fa partire il timer
        setTimeout(() => {
            SessionTimer.init();
        }, 2000);
    }
});

/**
 * LIVE EDITOR DIDATTICO (Quick-Edit al Volo)
 * Consente all'Amministratore (prof.memmo@gmail.com) di correggere al volo
 * testi ed esercizi direttamente dal gioco, salvandoli su Firestore
 * senza modificare o alterare i file di codice sorgente.
 */

(function() {
    window.LiveEditor = {
        platformKey: 'palestra_riflessione',
        overrides: {},
        isLoaded: false,

        init: async function() {
            if (!window.fbDb) return;
            try {
                // Carichiamo tutte le modifiche per questa piattaforma in 1 sola query
                const snapshot = await window.fbDb.collection('hub_didactic_overrides')
                    .where('platform', '==', this.platformKey)
                    .get();
                
                snapshot.forEach(doc => {
                    this.overrides[doc.id] = { docId: doc.id, ...doc.data() };
                });
                this.isLoaded = true;
                console.log(`✏️ Live Editor: Caricati ${Object.keys(this.overrides).length} override didattici.`);
            } catch (e) {
                console.warn("Live Editor: Impossibile caricare override cloud:", e);
            }
        },

        isAdmin: function() {
            if (typeof Auth === 'undefined' || !Auth.getUser) return false;
            const u = Auth.getUser();
            return u && u.email && u.email.toLowerCase() === 'prof.memmo@gmail.com';
        },

        // Applica l'override se presente, altrimenti restituisce l'oggetto intatto
        apply: function(itemKey, originalItem) {
            if (!originalItem) return originalItem;
            const key = String(itemKey);
            const override = this.overrides[key];
            if (!override || !override.data) {
                return originalItem;
            }
            // Merge sicuro: preserva campi originali e applica le correzioni dell'admin
            return { ...originalItem, ...override.data, _isOverridden: true };
        },

        // Genera il pulsantino matitina visibile SOLO all'admin
        renderBtn: function(itemKey, rawItemJson) {
            if (!this.isAdmin()) return '';
            const safeKey = String(itemKey).replace(/'/g, "\\'");
            let encodedData = '';
            try {
                encodedData = btoa(encodeURIComponent(JSON.stringify(rawItemJson)));
            } catch(e) { encodedData = ''; }

            return `
                <button type="button" class="live-edit-quick-btn" onclick="event.stopPropagation(); LiveEditor.openModal('${safeKey}', '${encodedData}')" title="Modifica al volo questo esercizio (Solo Admin)">
                    ✏️
                </button>
            `;
        },

        // Apertura del modal di modifica al volo
        openModal: function(itemKey, encodedData) {
            let item = null;
            if (encodedData) {
                try {
                    item = JSON.parse(decodeURIComponent(atob(encodedData)));
                } catch(e) {}
            }
            const existingOverride = this.overrides[itemKey] || {};
            const currentData = existingOverride.data || item || {};

            let modal = document.getElementById('live-editor-modal');
            if (!modal) {
                modal = document.createElement('div');
                modal.id = 'live-editor-modal';
                modal.className = 'modal-overlay';
                modal.style.cssText = 'display: none; align-items: center; justify-content: center; z-index: 100000; background: rgba(15,23,42,0.75); backdrop-filter: blur(4px); position: fixed; inset: 0; padding: 20px;';
                document.body.appendChild(modal);
            }

            const currentText = currentData.text || currentData.frase || currentData.sentence || currentData.domanda || '';
            const currentSolution = currentData.solution || currentData.correctAnswer || currentData.risposta || '';
            const currentExplanation = currentData.explanation || currentData.spiegazione || currentData.hint || '';

            modal.innerHTML = `
                <div class="modal-content" style="background: white; border-radius: 24px; width: 100%; max-width: 600px; padding: 25px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.3); font-family: inherit; position: relative;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 2px solid #f1f5f9; padding-bottom: 15px;">
                        <h3 style="margin: 0; color: #1e293b; font-size: 1.3rem; display: flex; align-items: center; gap: 8px;">
                            ✏️ Modifica al Volo Esercizio
                        </h3>
                        <button onclick="document.getElementById('live-editor-modal').style.display='none'" style="background: transparent; border: none; font-size: 1.5rem; color: #94a3b8; cursor: pointer; line-height: 1;">&times;</button>
                    </div>

                    <p style="font-size: 0.85rem; color: #64748b; margin-top: 0; margin-bottom: 15px;">
                        Le modifiche salvate verranno applicate <strong>istantaneamente per tutti gli studenti</strong> via cloud, lasciando intatti i file su GitHub.
                    </p>

                    <form onsubmit="event.preventDefault(); LiveEditor.save('${itemKey}');">
                        <div style="margin-bottom: 15px;">
                            <label style="display: block; font-weight: 700; font-size: 0.85rem; color: #334155; margin-bottom: 5px;">Testo dell'Esercizio / Frase:</label>
                            <textarea id="live-edit-text" class="input-field" rows="4" style="width: 100%; padding: 10px; border-radius: 10px; border: 1.5px solid #cbd5e1; font-size: 0.95rem;" required>${currentText}</textarea>
                        </div>

                        ${currentSolution ? `
                        <div style="margin-bottom: 15px;">
                            <label style="display: block; font-weight: 700; font-size: 0.85rem; color: #334155; margin-bottom: 5px;">Risposta Corretta / Soluzione:</label>
                            <input type="text" id="live-edit-solution" class="input-field" style="width: 100%; padding: 10px; border-radius: 10px; border: 1.5px solid #cbd5e1; font-size: 0.95rem;" value="${currentSolution}">
                        </div>` : ''}

                        ${currentExplanation !== undefined ? `
                        <div style="margin-bottom: 20px;">
                            <label style="display: block; font-weight: 700; font-size: 0.85rem; color: #334155; margin-bottom: 5px;">Spiegazione Didattica / Suggerimento:</label>
                            <textarea id="live-edit-explanation" class="input-field" rows="2" style="width: 100%; padding: 10px; border-radius: 10px; border: 1.5px solid #cbd5e1; font-size: 0.9rem;">${currentExplanation}</textarea>
                        </div>` : ''}

                        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; border-top: 2px solid #f1f5f9; padding-top: 15px;">
                            ${existingOverride.docId ? `
                                <button type="button" onclick="LiveEditor.remove('${itemKey}')" class="btn btn-secondary" style="background: #fee2e2; color: #dc2626; border: none; padding: 8px 16px; border-radius: 10px; font-weight: 700; font-size: 0.85rem; cursor: pointer;">
                                    🔄 Ripristina Originale
                                </button>
                            ` : '<div></div>'}

                            <div style="display: flex; gap: 10px;">
                                <button type="button" onclick="document.getElementById('live-editor-modal').style.display='none'" class="btn" style="background: #f1f5f9; color: #475569; border: none; padding: 10px 18px; border-radius: 10px; font-weight: 700; cursor: pointer;">
                                    Annulla
                                </button>
                                <button type="submit" class="btn" style="background: #4f46e5; color: white; border: none; padding: 10px 22px; border-radius: 10px; font-weight: 700; cursor: pointer; box-shadow: 0 4px 12px rgba(79,70,229,0.3);">
                                    💾 Salva Modifica
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            `;

            modal.style.display = 'flex';
        },

        // Salvataggio su Firestore
        save: async function(itemKey) {
            const textInput = document.getElementById('live-edit-text');
            const solutionInput = document.getElementById('live-edit-solution');
            const explanationInput = document.getElementById('live-edit-explanation');

            const text = textInput ? textInput.value.trim() : '';
            const solution = solutionInput ? solutionInput.value.trim() : '';
            const explanation = explanationInput ? explanationInput.value.trim() : '';

            if (!text) {
                alert("Il testo non può essere vuoto.");
                return;
            }

            const docId = `${this.platformKey}_${itemKey.replace(/[^a-zA-Z0-9_-]/g, '_')}`;
            const overridePayload = {
                platform: this.platformKey,
                platformName: 'Palestra di Riflessione',
                itemKey: itemKey,
                data: {
                    text: text,
                    frase: text,
                    sentence: text,
                    ...(solution ? { solution: solution, correctAnswer: solution, risposta: solution } : {}),
                    ...(explanation ? { explanation: explanation, spiegazione: explanation, hint: explanation } : {})
                },
                updatedAt: new Date().toISOString(),
                author: 'prof.memmo@gmail.com',
                status: 'pending_github_sync'
            };

            try {
                await window.fbDb.collection('hub_didactic_overrides').doc(docId).set(overridePayload);
                this.overrides[itemKey] = { docId: docId, ...overridePayload };
                
                document.getElementById('live-editor-modal').style.display = 'none';
                alert("✅ Modifica didattica salvata con successo! È ora attiva per tutti gli studenti.");
                
                // Ricarica la vista o l'esercizio corrente per mostrare subito il testo aggiornato
                if (typeof renderProfiloPage === 'function' && window.currentSection === 'profilo') {
                    renderProfiloPage();
                } else if (typeof startExercise === 'function' && window.currentExercise) {
                    // Ricarica esercizio
                }
            } catch (e) {
                console.error("Errore salvataggio override didattico:", e);
                alert("Errore durante il salvataggio: " + e.message);
            }
        },

        // Ripristino del testo originale
        remove: async function(itemKey) {
            if (!confirm("Sei sicuro di voler eliminare questa personalizzazione e ripristinare il testo originale di base?")) return;
            const docId = `${this.platformKey}_${itemKey.replace(/[^a-zA-Z0-9_-]/g, '_')}`;
            try {
                await window.fbDb.collection('hub_didactic_overrides').doc(docId).delete();
                delete this.overrides[itemKey];
                document.getElementById('live-editor-modal').style.display = 'none';
                alert("✅ Ripristinato il testo originale!");
                if (typeof renderProfiloPage === 'function' && window.currentSection === 'profilo') {
                    renderProfiloPage();
                }
            } catch (e) {
                console.error("Errore ripristino override:", e);
                alert("Errore: " + e.message);
            }
        }
    };

    // Stile CSS per il pulsante matitina
    const style = document.createElement('style');
    style.textContent = `
        .live-edit-quick-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background: rgba(79, 70, 229, 0.1);
            color: #4f46e5;
            border: 1px solid rgba(79, 70, 229, 0.25);
            border-radius: 8px;
            padding: 4px 8px;
            font-size: 0.85rem;
            cursor: pointer;
            transition: all 0.2s ease;
            vertical-align: middle;
            margin-left: 8px;
        }
        .live-edit-quick-btn:hover {
            background: #4f46e5;
            color: white;
            transform: scale(1.1);
        }
    `;
    document.head.appendChild(style);

    // Inizializzazione automatica al caricamento
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => window.LiveEditor.init(), 100);
    });
})();

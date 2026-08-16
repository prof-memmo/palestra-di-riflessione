/**
 * LIVE EDITOR DIDATTICO (Quick-Edit al Volo) - Palestra di Riflessione
 * Consente all'Amministratore / Docente (prof.memmo@gmail.com) di correggere
 * e modificare al volo testi, frasi ed esercizi direttamente dal gioco o dal Pannello Admin,
 * salvandoli su Firestore nell'Hub senza toccare i file di codice sorgente.
 */

(function() {
    // Utility di conversione HTML <-> Testo Semplice per visualizzazione pulita
    function htmlToPlainText(html) {
        if (!html) return '';
        if (typeof html !== 'string') return String(html);
        if (!/<[a-z][\s\S]*>/i.test(html)) return html;

        const temp = document.createElement('div');
        temp.innerHTML = html;

        // Se contiene una lista ordinata <ol>
        const ols = temp.querySelectorAll('ol');
        if (ols.length > 0) {
            let lines = [];
            temp.querySelectorAll('li').forEach((li, idx) => {
                lines.push(`${idx + 1}. ${li.textContent.trim()}`);
            });
            if (lines.length > 0) return lines.join('\n');
        }

        // Se contiene una lista non ordinata <ul>
        const uls = temp.querySelectorAll('ul');
        if (uls.length > 0) {
            let lines = [];
            temp.querySelectorAll('li').forEach(li => {
                lines.push(`- ${li.textContent.trim()}`);
            });
            if (lines.length > 0) return lines.join('\n');
        }

        // Conversione generale
        return html
            .replace(/<br\s*[\/]?>/gi, '\n')
            .replace(/<\/p>/gi, '\n\n')
            .replace(/<\/div>/gi, '\n')
            .replace(/<[^>]+>/g, '')
            .replace(/&nbsp;/g, ' ')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&amp;/g, '&')
            .trim();
    }

    function plainTextToHtml(text, originalHtml) {
        if (!text) return '';
        const trimmed = text.trim();
        if (trimmed.startsWith('<') && trimmed.endsWith('>')) {
            return trimmed;
        }

        const lines = trimmed.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        const isNumberedList = lines.length > 1 && lines.every(l => /^\d+[\.\)]\s*/.test(l));
        const isBulletList = lines.length > 1 && lines.every(l => /^[-*•]\s*/.test(l));

        if (isNumberedList || (originalHtml && originalHtml.includes('<ol>'))) {
            const lis = lines.map(l => {
                const clean = l.replace(/^\d+[\.\)]\s*/, '').trim();
                return `<li>${clean}</li>`;
            }).join('');
            return `<div style="text-align:left;padding-left:2rem"><ol>${lis}</ol></div>`;
        }

        if (isBulletList || (originalHtml && originalHtml.includes('<ul>'))) {
            const lis = lines.map(l => {
                const clean = l.replace(/^[-*•]\s*/, '').trim();
                return `<li>${clean}</li>`;
            }).join('');
            return `<div style="text-align:left;padding-left:2rem"><ul>${lis}</ul></div>`;
        }

        if (lines.length > 1 && originalHtml && (originalHtml.includes('<br>') || originalHtml.includes('<p>'))) {
            return lines.join('<br>');
        }

        return trimmed;
    }

    window.LiveEditor = {
        platformKey: 'palestra_riflessione',
        platformName: 'Palestra di Riflessione',
        overrides: {},
        isLoaded: false,
        _originalCache: {},

        init: async function() {
            const db = window.fbDb || window.db || (typeof firebase !== 'undefined' && firebase.firestore ? firebase.firestore() : null);
            if (!db) return;
            try {
                const snapshot = await db.collection('hub_didactic_overrides')
                    .where('platform', '==', this.platformKey)
                    .get();
                
                this.overrides = {};
                snapshot.forEach(doc => {
                    this.overrides[doc.id] = { docId: doc.id, ...doc.data() };
                });
                this.isLoaded = true;
                console.log(`✏️ Live Editor [Palestra]: ${Object.keys(this.overrides).length} override caricati.`);
            } catch (e) {
                console.warn("Live Editor: impossibile caricare override cloud:", e);
            }
        },

        isAdmin: function() {
            let u = null;
            if (typeof Auth !== 'undefined' && Auth.getUser) u = Auth.getUser();
            else if (window.EroiAuth && window.EroiAuth.getUser) u = window.EroiAuth.getUser();
            if (u) {
                if (u.email && u.email.toLowerCase() === 'prof.memmo@gmail.com') return true;
                if (u.role === 'admin' || u.role === 'docente') return true;
            }

            if (typeof currentUserEmail !== 'undefined' && currentUserEmail && currentUserEmail.toLowerCase() === 'prof.memmo@gmail.com') return true;
            if (window.currentUser && window.currentUser.email && window.currentUser.email.toLowerCase() === 'prof.memmo@gmail.com') return true;

            try {
                for (let k of ['palestra_user', 'gym_user', 'hub_user_session', 'fanta_user', 'corte_user_session', 'hub_user']) {
                    const raw = localStorage.getItem(k);
                    if (raw) {
                        const parsed = JSON.parse(raw);
                        if (parsed.email && parsed.email.toLowerCase() === 'prof.memmo@gmail.com') return true;
                        if (parsed.role === 'admin' || parsed.role === 'docente') return true;
                    }
                }
            } catch(e){}
            return false;
        },

        apply: function(itemKey, originalItem) {
            if (!originalItem) return originalItem;
            const key = String(itemKey);
            this._originalCache[key] = originalItem;
            const override = this.overrides[key];
            if (!override || !override.data) return originalItem;
            return { ...originalItem, ...override.data, _isOverridden: true };
        },

        scanAndInjectPencils: function() {
            if (!this.isAdmin()) return;
            // Seleziona i contenitori di esercizi, lezioni, teoria e testi a schermo
            const selectors = [
                '.exercise-header', '.exercise-title', '.sentence-display', '.quiz-question-text', 
                '.section-title', '.theory-schema', '.theory-box', '.concept-card', 
                '.scopri-container', '.scopri-definition', '.ripassa-card', '.produzione-prompt',
                '#exercise-mount h2', '#exercise-mount h3', '#exercise-mount .theory-schema h4'
            ];
            selectors.forEach(sel => {
                document.querySelectorAll(sel).forEach(el => {
                    if (el.querySelector('.live-edit-quick-btn')) return;
                    // Prova a recuperare la chiave
                    const key = el.getAttribute('data-live-key') || (window.currentPath ? (window.currentPath.join('_') + '_' + (window.currentExerciseIndex || 0)) : null);
                    if (key) {
                        const btn = document.createElement('button');
                        btn.type = 'button';
                        btn.className = 'live-edit-quick-btn';
                        btn.title = 'Modifica al volo questo testo/lezione (Solo Docente/Admin)';
                        btn.innerHTML = '✏️';
                        btn.onclick = (e) => {
                            e.stopPropagation();
                            window.LiveEditor.openModal(key, '');
                        };
                        el.appendChild(btn);
                    }
                });
            });
        },

        renderBtn: function(itemKey, rawItemJson) {
            if (!this.isAdmin()) return '';
            const safeKey = String(itemKey).replace(/'/g, "\\'");
            let encodedData = '';
            try {
                encodedData = btoa(encodeURIComponent(JSON.stringify(rawItemJson)));
            } catch(e) { encodedData = ''; }

            return `
                <button type="button" class="live-edit-quick-btn" onclick="event.stopPropagation(); LiveEditor.openModal('${safeKey}', '${encodedData}')" title="Modifica al volo questo esercizio (Solo Docente/Admin)">
                    ✏️
                </button>
            `;
        },

        openModal: function(itemKey, encodedData) {
            let item = null;
            if (encodedData) {
                try {
                    item = JSON.parse(decodeURIComponent(atob(encodedData)));
                } catch(e) {}
            }
            if (!item && this._originalCache[itemKey]) {
                item = this._originalCache[itemKey];
            }

            const existingOverride = this.overrides[itemKey] || {};
            const currentData = existingOverride.data || item || {};

            let rawText = currentData.text || currentData.frase || currentData.sentence || currentData.domanda || '';
            const currentSolution = currentData.solution || currentData.correctAnswer || currentData.risposta || '';
            const currentExplanation = currentData.explanation || currentData.spiegazione || currentData.hint || '';

            // Convertiamo l'HTML grezzo in testo pulito naturale per il docente
            const cleanText = htmlToPlainText(rawText);

            let modal = document.getElementById('live-editor-modal');
            if (!modal) {
                modal = document.createElement('div');
                modal.id = 'live-editor-modal';
                modal.className = 'modal-overlay';
                modal.style.cssText = 'display: none; align-items: center; justify-content: center; z-index: 100000; background: rgba(15,23,42,0.8); backdrop-filter: blur(5px); position: fixed; inset: 0; padding: 20px;';
                document.body.appendChild(modal);
            }

            modal.innerHTML = `
                <div class="modal-content" style="background: white; border-radius: 20px; width: 100%; max-width: 620px; padding: 24px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.35); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; position: relative;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1.5px solid #f1f5f9; padding-bottom: 12px;">
                        <h3 style="margin: 0; color: #0f172a; font-size: 1.2rem; display: flex; align-items: center; gap: 8px;">
                            ✏️ Modifica al Volo Esercizio [${itemKey}]
                        </h3>
                        <button onclick="document.getElementById('live-editor-modal').style.display='none'" style="background: transparent; border: none; font-size: 1.4rem; color: #94a3b8; cursor: pointer;">&times;</button>
                    </div>

                    <p style="font-size: 0.85rem; color: #64748b; margin-top: 0; margin-bottom: 14px; line-height: 1.4;">
                        Puoi modificare il testo liberamente in italiano. Il sistema lo formatterà automaticamente per gli studenti in modo pulito e immediato.
                    </p>

                    <form onsubmit="event.preventDefault(); LiveEditor.save('${itemKey}', '${btoa(encodeURIComponent(rawText))}');">
                        <div style="margin-bottom: 14px;">
                            <label style="display: block; font-weight: 700; font-size: 0.85rem; color: #334155; margin-bottom: 6px;">
                                📝 Testo dell'Esercizio / Frase:
                            </label>
                            <textarea id="live-edit-text" class="input-field" rows="5" style="width: 100%; padding: 10px 12px; border-radius: 10px; border: 1.5px solid #cbd5e1; font-size: 0.95rem; font-family: inherit; line-height: 1.5; resize: vertical;" required oninput="LiveEditor.updatePreview('${btoa(encodeURIComponent(rawText))}');">${cleanText}</textarea>
                        </div>

                        <!-- Box Anteprima Live -->
                        <div style="margin-bottom: 14px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px 14px;">
                            <span style="font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 4px;">👁️ Anteprima per lo Studente:</span>
                            <div id="live-edit-preview" style="font-size: 0.9rem; color: #1e293b; line-height: 1.4;">${rawText || cleanText}</div>
                        </div>

                        <div style="margin-bottom: 14px;">
                            <label style="display: block; font-weight: 700; font-size: 0.85rem; color: #334155; margin-bottom: 6px;">
                                🎯 Risposta Corretta / Soluzione (opzionale):
                            </label>
                            <input type="text" id="live-edit-solution" class="input-field" style="width: 100%; padding: 8px 12px; border-radius: 10px; border: 1.5px solid #cbd5e1; font-size: 0.95rem;" value="${currentSolution}">
                        </div>

                        <div style="margin-bottom: 18px;">
                            <label style="display: block; font-weight: 700; font-size: 0.85rem; color: #334155; margin-bottom: 6px;">
                                💡 Spiegazione Didattica / Suggerimento (opzionale):
                            </label>
                            <textarea id="live-edit-explanation" class="input-field" rows="2" style="width: 100%; padding: 8px 12px; border-radius: 10px; border: 1.5px solid #cbd5e1; font-size: 0.9rem; font-family: inherit;">${currentExplanation}</textarea>
                        </div>

                        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; border-top: 1.5px solid #f1f5f9; padding-top: 14px;">
                            ${existingOverride.docId ? `
                                <button type="button" onclick="LiveEditor.remove('${itemKey}')" style="background: #fee2e2; color: #dc2626; border: 1px solid #fca5a5; padding: 8px 14px; border-radius: 8px; font-weight: 700; font-size: 0.85rem; cursor: pointer;">
                                    🔄 Ripristina Originale
                                </button>
                            ` : '<div></div>'}

                            <div style="display: flex; gap: 10px;">
                                <button type="button" onclick="document.getElementById('live-editor-modal').style.display='none'" style="background: #f1f5f9; color: #475569; border: none; padding: 9px 16px; border-radius: 8px; font-weight: 700; cursor: pointer;">
                                    Annulla
                                </button>
                                <button type="submit" style="background: #2563eb; color: white; border: none; padding: 9px 20px; border-radius: 8px; font-weight: 700; cursor: pointer; box-shadow: 0 4px 12px rgba(37,99,235,0.25);">
                                    💾 Salva Modifica
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            `;

            modal.style.display = 'flex';
        },

        updatePreview: function(encodedOriginal) {
            const textarea = document.getElementById('live-edit-text');
            const preview = document.getElementById('live-edit-preview');
            if (!textarea || !preview) return;
            let originalHtml = '';
            try { originalHtml = decodeURIComponent(atob(encodedOriginal)); } catch(e){}
            const formatted = plainTextToHtml(textarea.value, originalHtml);
            preview.innerHTML = formatted;
        },

        save: async function(itemKey, encodedOriginal) {
            const textInput = document.getElementById('live-edit-text');
            const solutionInput = document.getElementById('live-edit-solution');
            const explanationInput = document.getElementById('live-edit-explanation');

            const rawText = textInput ? textInput.value.trim() : '';
            const solution = solutionInput ? solutionInput.value.trim() : '';
            const explanation = explanationInput ? explanationInput.value.trim() : '';

            if (!rawText) {
                alert("Il testo non può essere vuoto.");
                return;
            }

            let originalHtml = '';
            try { originalHtml = decodeURIComponent(atob(encodedOriginal)); } catch(e){}

            const formattedText = plainTextToHtml(rawText, originalHtml);

            const docId = `${this.platformKey}_${itemKey.replace(/[^a-zA-Z0-9_-]/g, '_')}`;
            const overridePayload = {
                platform: this.platformKey,
                platformName: this.platformName,
                itemKey: itemKey,
                data: {
                    text: formattedText,
                    frase: formattedText,
                    sentence: formattedText,
                    ...(solution ? { solution: solution, correctAnswer: solution, risposta: solution } : {}),
                    ...(explanation ? { explanation: explanation, spiegazione: explanation, hint: explanation } : {})
                },
                updatedAt: new Date().toISOString(),
                author: 'prof.memmo@gmail.com',
                status: 'pending_github_sync'
            };

            const db = window.fbDb || window.db || (typeof firebase !== 'undefined' && firebase.firestore ? firebase.firestore() : null);
            try {
                await db.collection('hub_didactic_overrides').doc(docId).set(overridePayload);
                this.overrides[itemKey] = { docId: docId, ...overridePayload };
                
                const modal = document.getElementById('live-editor-modal');
                if (modal) modal.style.display = 'none';
                alert("✅ Modifica salvata con successo! È ora attiva per tutti gli studenti.");
                this.refreshAdminPanels();

                if (typeof loadUdaPhase === 'function' && window.currentPath) {
                    loadUdaPhase(window.currentPath);
                }
            } catch (e) {
                console.error("Errore salvataggio override didattico:", e);
                alert("Errore durante il salvataggio: " + e.message);
            }
        },

        remove: async function(itemKey) {
            if (!confirm("Sei sicuro di voler eliminare questa personalizzazione e ripristinare il testo originale?")) return;
            const docId = `${this.platformKey}_${itemKey.replace(/[^a-zA-Z0-9_-]/g, '_')}`;
            const db = window.fbDb || window.db || (typeof firebase !== 'undefined' && firebase.firestore ? firebase.firestore() : null);
            try {
                await db.collection('hub_didactic_overrides').doc(docId).delete();
                delete this.overrides[itemKey];
                const modal = document.getElementById('live-editor-modal');
                if (modal) modal.style.display = 'none';
                alert("✅ Ripristinato il testo originale!");
                this.refreshAdminPanels();
                if (typeof loadUdaPhase === 'function' && window.currentPath) {
                    loadUdaPhase(window.currentPath);
                }
            } catch (e) {
                console.error("Errore ripristino override:", e);
                alert("Errore: " + e.message);
            }
        },

        refreshAdminPanels: function() {
            if (document.getElementById('admin-live-editor-container')) {
                this.renderAdminPanel('admin-live-editor-container');
            }
        },

        /**
         * Renderizza il pannello completo all'interno della pagina Admin di Palestra
         */
        renderAdminPanel: function(containerId = 'admin-live-editor-container') {
            const container = document.getElementById(containerId);
            if (!container) return;

            const overrideList = Object.values(this.overrides);
            const count = overrideList.length;

            let rowsHtml = '';
            if (count === 0) {
                rowsHtml = `
                    <div style="text-align: center; padding: 25px 15px; color: #64748b; background: #f8fafc; border-radius: 10px; border: 1px dashed #cbd5e1;">
                        <i class="fa-solid fa-check-circle" style="color: #10b981; font-size: 1.8rem; margin-bottom: 8px; display: block;"></i>
                        <strong>Nessuna modifica al volo attiva per Palestra di Riflessione.</strong>
                        <p style="font-size: 0.85rem; margin: 5px 0 0 0;">Tutti gli esercizi, le frasi e le fasi UdA utilizzano i testi didattici originali.</p>
                    </div>
                `;
            } else {
                rowsHtml = `
                    <div style="display: flex; flex-direction: column; gap: 10px; max-height: 380px; overflow-y: auto; padding-right: 5px;">
                        ${overrideList.map(item => {
                            const snippet = (item.data && (item.data.text || item.data.frase || item.data.sentence || ''))
                                .replace(/<[^>]+>/g, ' ')
                                .slice(0, 110);
                            const dateStr = item.updatedAt ? new Date(item.updatedAt).toLocaleString('it-IT') : 'N/D';
                            const keyClean = item.itemKey || item.docId || '';

                            return `
                                <div style="display: flex; justify-content: space-between; align-items: center; background: white; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px 16px; gap: 15px; flex-wrap: wrap;">
                                    <div style="flex: 1; min-width: 220px;">
                                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                                            <span style="background: #eff6ff; color: #2563eb; padding: 2px 8px; border-radius: 6px; font-size: 0.75rem; font-weight: bold; text-transform: uppercase;">${keyClean}</span>
                                            <span style="font-size: 0.75rem; color: #94a3b8;"><i class="fa-regular fa-clock"></i> ${dateStr}</span>
                                        </div>
                                        <div style="font-size: 0.85rem; color: #1e293b; line-height: 1.4;">
                                            "${snippet}..."
                                        </div>
                                    </div>
                                    <div style="display: flex; gap: 8px;">
                                        <button type="button" class="btn" style="background: #2563eb; color: white; padding: 6px 12px; font-size: 0.8rem; font-weight: bold; border-radius: 6px; border: none; cursor: pointer;" onclick="LiveEditor.openModal('${keyClean}', '')">
                                            ✏️ Modifica
                                        </button>
                                        <button type="button" class="btn" style="background: #fee2e2; color: #dc2626; border: 1px solid #fca5a5; padding: 6px 12px; font-size: 0.8rem; font-weight: bold; border-radius: 6px; cursor: pointer;" onclick="LiveEditor.remove('${keyClean}')">
                                            🔄 Ripristina
                                        </button>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                `;
            }

            container.innerHTML = `
                <div style="margin-bottom: 25px; padding: 20px; border: 1px solid #bfdbfe; border-radius: 16px; background: #f0fdf4;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; flex-wrap: wrap; gap: 10px;">
                        <div>
                            <h3 style="color: #1e40af; margin: 0; font-size: 1.15rem; display: flex; align-items: center; gap: 8px;">
                                <i class="fa-solid fa-pen-to-square"></i> Live Editor Didattico (Correzioni al Volo)
                            </h3>
                            <p style="font-size: 0.85rem; color: #64748b; margin: 4px 0 0 0;">
                                Modifica in tempo reale frasi, esercizi e lezioni di grammatica/analisi per tutti gli studenti.
                            </p>
                        </div>
                        <div style="display: flex; gap: 8px; align-items: center;">
                            <span style="background: ${count > 0 ? '#2563eb' : '#e2e8f0'}; color: ${count > 0 ? 'white' : '#475569'}; font-weight: 800; font-size: 0.8rem; padding: 4px 12px; border-radius: 20px;">
                                ${count} ${count === 1 ? 'override attivo' : 'override attivi'}
                            </span>
                            <button type="button" class="btn" style="background: white; border: 1px solid #cbd5e1; color: #334155; padding: 6px 14px; font-size: 0.8rem; font-weight: bold; border-radius: 8px; cursor: pointer;" onclick="LiveEditor.init().then(() => LiveEditor.renderAdminPanel('${containerId}'))">
                                <i class="fa-solid fa-arrows-rotate"></i> Aggiorna
                            </button>
                            <button type="button" class="btn" style="background: #2563eb; color: white; padding: 6px 14px; font-size: 0.8rem; font-weight: bold; border-radius: 8px; border: none; cursor: pointer;" onclick="const k = prompt('✏️ Inserisci la chiave dell\\'esercizio o frase da modificare:', ''); if(k) LiveEditor.openModal(k.trim(), '');">
                                <i class="fa-solid fa-plus"></i> Modifica Nuovo
                            </button>
                        </div>
                    </div>

                    ${rowsHtml}
                </div>
            `;
        }
    };

    // Stile CSS per i pulsanti matita
    const style = document.createElement('style');
    style.textContent = `
        .live-edit-quick-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background: rgba(37, 99, 235, 0.1);
            color: #2563eb;
            border: 1px solid rgba(37, 99, 235, 0.25);
            border-radius: 6px;
            padding: 2px 6px;
            font-size: 0.8rem;
            cursor: pointer;
            transition: all 0.2s ease;
            vertical-align: middle;
            margin-left: 6px;
        }
        .live-edit-quick-btn:hover {
            background: #2563eb;
            color: white;
            transform: scale(1.1);
        }
    `;
    document.head.appendChild(style);

    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(async () => {
            await window.LiveEditor.init();
            if (document.getElementById('admin-live-editor-container')) {
                window.LiveEditor.renderAdminPanel('admin-live-editor-container');
            }
            window.LiveEditor.scanAndInjectPencils();
        }, 500);
    });

    setInterval(() => {
        if (window.LiveEditor && typeof window.LiveEditor.scanAndInjectPencils === 'function') {
            window.LiveEditor.scanAndInjectPencils();
        }
    }, 2500);
})();

/**
 * RULES-SERVICE.JS - Modulo Centralizzato e Dinamico di "Scopri il Progetto / Regolamento"
 * Progetto: Palestra di Riflessione sulla Lingua
 * Autore: Prof. Memmo
 * Sincronizzato in Realtime su Cloud Firestore (palestra_settings/official_rules)
 * Preserva al 100% le card native con bordi colorati e il layout originale.
 */

(function() {
    'use strict';

    const SUPER_ADMIN_EMAIL = "prof.memmo@gmail.com";

    const DEFAULT_PALESTRA_RULES_TEXT = `[INNOVAZIONE]
1. Innovazione e Tradizione
Questa piattaforma integra l'esperienza didattica con i nuovi strumenti digitali. Tutto il materiale è stato elaborato con l'aiuto dell'Intelligenza Artificiale, ma è interamente gestito, revisionato e guidato dall'uomo. L'IA è uno strumento prezioso, ma la professionalità docente resta il cuore che dà senso e direzione a ogni proposta.

[AUTONOMIA]
1. Autonomia e Competenze Digitali
L'obiettivo della Palestra è rendere ogni studente protagonista autonomo del proprio percorso. Attraverso l'uso attivo della piattaforma, raggiungerai traguardi fondamentali:
• Consapevolezza: imparerai a gestire i tuoi tempi di studio e a monitorare i tuoi sforzi.
• Padronanza Digitale: utilizzerai interfacce moderne e l'IA in modo critico.
• Imparare a imparare: svilupperai la capacità di reperire e rielaborare informazioni in autonomia.

[LETTURA]
1. Il piacere della Lettura
Nella sezione Lettura troverai testi originali e coinvolgenti divisi per:
• Generi: dall'Avventura al Giallo, dal Fantasy all'Attualità.
• Livelli (A1-B2): percorsi calibrati sulle tue reali capacità di comprensione.
Ogni testo è una sfida per migliorare la tua comprensione e scoprire nuovi mondi.

[PROFILO]
1. Il Tuo Profilo Digitale
Le funzioni avanzate sono ora attive per aumentare la tua autonomia:
• Account Personale: crea il tuo profilo per scegliere il tuo avatar e tenere traccia di ogni esercizio completato.
• Click & Learn: nelle letture puoi cliccare su qualsiasi parola difficile per scoprirne il significato e aggiungerla istantaneamente al tuo Vocabolario Personale.
• Dashboard Avanzata: consulta il tuo dizionario personalizzato nella sezione Profilo e guarda come crescono le tue competenze nel tempo.

[FUNZIONAMENTO]
1. Come funziona la Palestra?
La Palestra è divisa in aree tematiche (Grammatica, Lettura, Lessico, Produzione). Per ogni argomento troverai le fasi di SCOPRI (teoria) e ALLENATI (pratica).
• Navigazione Flessibile: Se un esercizio è troppo difficile, usa il tasto "RIPROVA PIÙ TARDI" per saltarlo e procedere oltre: potrai affrontarlo di nuovo quando vorrai!

[STUDENTI]
1. Per gli Studenti
• Accesso Semplice: Entra con il codice fornito dal tuo docente (es. ALFA24). Nessuna email richiesta.
• Vocabolario Personale: Clicca sulle parole difficili e aggiungile al tuo dizionario.
• Gamification: Scegli il tuo avatar e guarda crescere i tuoi punti XP allenamento dopo allenamento.

[DOCENTI]
1. Per i Docenti
• Classi Digitali: Accedi con Google, crea la tua classe e genera un Codice Univoco.
• Distribuzione Rapida: Condividi il codice con gli studenti per collegarli istantaneamente al tuo profilo.
• Monitoraggio: Visualizza i progressi della classe e scopri quali argomenti richiedono più ripasso.
• Gestione Flessibile: Sposta gli studenti tra le tue classi, modificale o rimuovile in ogni momento.
• Assegnazione Diretta: Assegna qualsiasi esercizio alle tue classi o condividilo su Google Classroom con un click.

[SETUP]
1. Guida Rapida al Setup
• 1️⃣ CONFIGURA: Accedi come Docente e crea la tua prima classe.
• 2️⃣ CONDIVIDI: Dai il Codice Classe ai tuoi studenti.
• 3️⃣ ALLENA: Guarda i risultati apparire nella tua dashboard.

[CITAZIONE]
"La scuola deve restare fedele ai suoi valori, ma aperta al cambiamento. Il cuore e la passione educativa sono assolutamente umani!" 😊`;

    const RulesService = {
        _gameKey: 'palestra',
        _collectionName: 'palestra_settings',
        _docId: 'official_rules',
        _storageKey: 'palestra_rules_official_text',
        _rawText: '',
        _lastUpdated: null,
        _updatedBy: '',
        _isInitialized: false,
        _listeners: [],
        _unsubscribeFirestore: null,

        getDefaultText() {
            return DEFAULT_PALESTRA_RULES_TEXT.trim();
        },

        isSuperAdmin(email) {
            const fbUser = (window.fbAuth && window.fbAuth.currentUser) ||
                           (window.firebase && window.firebase.auth && window.firebase.auth().currentUser);
            const user = (window.Auth && typeof window.Auth.getUser === 'function') ? window.Auth.getUser() : null;
            const userEmail = (email || (fbUser && fbUser.email) || (user && user.email) || '').toLowerCase();
            return userEmail === SUPER_ADMIN_EMAIL.toLowerCase();
        },

        getRawText() {
            return (this._rawText && this._rawText.trim().length > 0) ? this._rawText : this.getDefaultText();
        },

        subscribe(callback) {
            if (typeof callback === 'function' && !this._listeners.includes(callback)) {
                this._listeners.push(callback);
            }
            return () => {
                this._listeners = this._listeners.filter(cb => cb !== callback);
            };
        },

        _notify() {
            const text = this.getRawText();
            if (window.currentSection === 'intro' && typeof this.renderPublicView === 'function') {
                this.renderPublicView('app');
            }
            const textarea = document.getElementById('palestra-rules-textarea');
            if (textarea && document.activeElement !== textarea) {
                textarea.value = text;
            }
            this._listeners.forEach(cb => {
                try {
                    cb(text);
                } catch (e) {
                    console.error("Errore listener RulesService (Palestra):", e);
                }
            });
        },

        async init() {
            // 1. Carica istantaneamente da cache locale o default (Zero-flicker)
            try {
                const cached = localStorage.getItem(this._storageKey);
                if (cached) {
                    const parsed = JSON.parse(cached);
                    if (parsed && parsed.text) {
                        this._rawText = parsed.text;
                        this._lastUpdated = parsed.lastUpdated || null;
                        this._updatedBy = parsed.updatedBy || '';
                    }
                }
            } catch (e) {
                console.warn("Errore lettura cache regolamento Palestra:", e);
            }

            if (!this._rawText) {
                this._rawText = this.getDefaultText();
            }

            // 2. Connessione Realtime su Cloud Firestore
            this._setupFirestoreListener();
            this._isInitialized = true;
            return this._rawText;
        },

        _setupFirestoreListener() {
            if (!window.fbDb) {
                setTimeout(() => this._setupFirestoreListener(), 1000);
                return;
            }

            try {
                const docRef = window.fbDb.collection(this._collectionName).doc(this._docId);
                if (this._unsubscribeFirestore) {
                    this._unsubscribeFirestore();
                }

                this._unsubscribeFirestore = docRef.onSnapshot((docSnap) => {
                    if (docSnap && docSnap.exists) {
                        const data = docSnap.data();
                        if (data && data.text && data.text.trim().length > 0) {
                            this._rawText = data.text;
                            this._lastUpdated = data.lastUpdated || null;
                            this._updatedBy = data.updatedBy || '';

                            try {
                                localStorage.setItem(this._storageKey, JSON.stringify({
                                    text: this._rawText,
                                    lastUpdated: this._lastUpdated,
                                    updatedBy: this._updatedBy
                                }));
                            } catch (e) {}

                            this._notify();
                        }
                    } else {
                        // Se non esiste ancora su Firestore, salva i default per inizializzare il documento
                        this.saveToCloud(this.getDefaultText()).catch(() => {});
                    }
                }, (err) => {
                    console.warn("Realtime listener Firestore offline/non disponibile (Palestra):", err.message);
                });
            } catch (err) {
                console.warn("Impossibile agganciare listener realtime per il regolamento:", err);
            }
        },

        async saveToCloud(newText) {
            const trimmed = (newText || '').trim();
            if (!trimmed) throw new Error("Il testo del regolamento non può essere vuoto.");

            const fbUser = (window.fbAuth && window.fbAuth.currentUser) ||
                           (window.firebase && window.firebase.auth && window.firebase.auth().currentUser);
            const user = (window.Auth && typeof window.Auth.getUser === 'function') ? window.Auth.getUser() : null;
            const userEmail = (fbUser && fbUser.email ? fbUser.email : (user && user.email ? user.email : '')).toLowerCase();

            if (userEmail !== SUPER_ADMIN_EMAIL.toLowerCase()) {
                throw new Error(`Permesso negato: solo il Super-Admin (${SUPER_ADMIN_EMAIL}) può salvare le modifiche su Firestore.`);
            }

            if (!window.fbDb) {
                throw new Error("Connessione Firestore non attiva. Riprova più tardi.");
            }

            const payload = {
                text: trimmed,
                lastUpdated: new Date().toISOString(),
                updatedBy: userEmail,
                gameKey: this._gameKey
            };

            await window.fbDb.collection(this._collectionName).doc(this._docId).set(payload, { merge: true });

            this._rawText = trimmed;
            this._lastUpdated = payload.lastUpdated;
            this._updatedBy = payload.updatedBy;

            try {
                localStorage.setItem(this._storageKey, JSON.stringify(payload));
            } catch (e) {}

            this._notify();
            return true;
        },

        async resetToDefault() {
            const defText = this.getDefaultText();
            await this.saveToCloud(defText);
            return defText;
        },

        // ===================================================================
        // PARSER DELLE SEZIONI
        // ===================================================================
        parseSections(rawText) {
            const text = (rawText || this.getRawText()).trim();
            const sections = {
                innovazione: '',
                autonomia: '',
                lettura: '',
                profilo: '',
                funzionamento: '',
                studenti: '',
                docenti: '',
                setup: '',
                citazione: ''
            };

            const tagMap = {
                '[INNOVAZIONE]': 'innovazione',
                '[AUTONOMIA]': 'autonomia',
                '[LETTURA]': 'lettura',
                '[PROFILO]': 'profilo',
                '[FUNZIONAMENTO]': 'funzionamento',
                '[STUDENTI]': 'studenti',
                '[DOCENTI]': 'docenti',
                '[SETUP]': 'setup',
                '[CITAZIONE]': 'citazione'
            };

            const regex = /\[(INNOVAZIONE|AUTONOMIA|LETTURA|PROFILO|FUNZIONAMENTO|STUDENTI|DOCENTI|SETUP|CITAZIONE)\]/gi;
            const parts = text.split(regex);

            if (parts.length <= 1) {
                sections.innovazione = text;
                return sections;
            }

            for (let i = 1; i < parts.length; i += 2) {
                const tag = `[${parts[i].toUpperCase()}]`;
                const content = (parts[i + 1] || '').trim();
                const key = tagMap[tag];
                if (key) {
                    sections[key] = content;
                }
            }

            return sections;
        },

        _formatParagraph(rawContent, defaultTitle = '', titleColor = '') {
            if (!rawContent) return '';
            const lines = rawContent.split('\n').map(l => l.trim()).filter(Boolean);
            if (lines.length === 0) return '';

            let title = defaultTitle;
            let bodyLines = lines;

            if (/^[0-9]+\.\s*/.test(lines[0])) {
                title = lines[0].replace(/^[0-9]+\.\s*/, '');
                bodyLines = lines.slice(1);
            }

            const formattedBody = bodyLines.map(line => {
                if (line.startsWith('•')) {
                    const clean = line.replace(/^•\s*/, '');
                    const parts = clean.split(':');
                    if (parts.length > 1) {
                        return `<br>• <b>${parts[0].trim()}</b>: ${parts.slice(1).join(':').trim()}`;
                    }
                    return `<br>• ${clean}`;
                }
                return line;
            }).join(' ');

            return {
                title,
                html: formattedBody.startsWith('<br>') ? formattedBody.substring(4) : formattedBody
            };
        },

        // ===================================================================
        // VISTA PUBBLICA NATIVA (SCOPRI IL PROGETTO)
        // ===================================================================
        renderPublicView(containerId = 'app') {
            const container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
            if (!container) return;

            const sections = this.parseSections(this.getRawText());

            const pInnovazione = this._formatParagraph(sections.innovazione, '💡 Innovazione e Tradizione');
            const pAutonomia = this._formatParagraph(sections.autonomia, '🌱 Autonomia e Competenze Digitali');
            const pLettura = this._formatParagraph(sections.lettura, '📚 Il piacere della Lettura');
            const pProfilo = this._formatParagraph(sections.profilo, '🌟 Il Tuo Profilo Digitale');
            const pFunzionamento = this._formatParagraph(sections.funzionamento, '🎯 Come funziona la Palestra?');
            const pStudenti = this._formatParagraph(sections.studenti, '🎓 Per gli Studenti');
            const pDocenti = this._formatParagraph(sections.docenti, '👨‍🏫 Per i Docenti');

            // Format setup cards
            let setupItems = [
                { num: '1️⃣', title: 'CONFIGURA', desc: 'Accedi come Docente e crea la tua prima classe.' },
                { num: '2️⃣', title: 'CONDIVIDI', desc: 'Dai il Codice Classe ai tuoi studenti.' },
                { num: '3️⃣', title: 'ALLENA', desc: 'Guarda i risultati apparire nella tua dashboard.' }
            ];

            if (sections.setup) {
                const sLines = sections.setup.split('\n').map(l => l.trim()).filter(l => l.startsWith('•'));
                if (sLines.length >= 3) {
                    setupItems = sLines.slice(0, 3).map((line, idx) => {
                        const clean = line.replace(/^•\s*/, '');
                        const numMatch = clean.match(/^([0-9️⃣🔟]+)\s*([A-Z\s]+):\s*(.*)$/);
                        if (numMatch) {
                            return { num: numMatch[1], title: numMatch[2].trim(), desc: numMatch[3].trim() };
                        }
                        const parts = clean.split(':');
                        return {
                            num: idx === 0 ? '1️⃣' : idx === 1 ? '2️⃣' : '3️⃣',
                            title: parts[0].trim(),
                            desc: parts.slice(1).join(':').trim()
                        };
                    });
                }
            }

            const citazioneText = sections.citazione ? sections.citazione.trim() : `"La scuola deve restare fedele ai suoi valori, ma aperta al cambiamento. Il cuore e la passione educativa sono assolutamente umani!" 😊`;

            container.innerHTML = `
                <div class="exercise-container">
                    <h2 class="exercise-title">👋 BENVENUTI NELLA PALESTRA</h2>
                    <div style="background: white; padding: 2rem; border-radius: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); line-height: 1.8;">
                        
                        <!-- 1. Card Verde (Innovazione) -->
                        <div style="background: #f8f9fa; padding: 2rem; border-radius: 20px; border-left: 8px solid #27ae60; margin-bottom: 2rem;">
                            <h4 style="color: #27ae60; margin-bottom: 1rem; font-size: 1.4rem;">${pInnovazione.title || '💡 Innovazione e Tradizione'}</h4>
                            <p>${pInnovazione.html}</p>
                        </div>

                        <!-- 2. Card Blu (Autonomia) -->
                        <div style="background: #eef7ff; padding: 2rem; border-radius: 20px; border-left: 8px solid #2980b9; margin-bottom: 2rem;">
                            <h4 style="color: #2980b9; margin-bottom: 1rem; font-size: 1.4rem;">${pAutonomia.title || '🌱 Autonomia e Competenze Digitali'}</h4>
                            <p>${pAutonomia.html}</p>
                        </div>

                        <!-- 3. Card Gialla (Lettura) -->
                        <div style="background: #fff9db; padding: 2rem; border-radius: 20px; border-left: 8px solid #f1c40f; margin-bottom: 2rem;">
                            <h4 style="color: #d4ac0d; margin-bottom: 1rem; font-size: 1.4rem;">${pLettura.title || '📚 Il piacere della Lettura'}</h4>
                            <p>${pLettura.html}</p>
                        </div>

                        <!-- 4. Card Viola (Profilo) -->
                        <div style="background: #f5eef8; padding: 2rem; border-radius: 20px; border-left: 8px solid #8e44ad; margin-bottom: 2rem;">
                            <h4 style="color: #8e44ad; margin-bottom: 1rem; font-size: 1.4rem;">${pProfilo.title || '🌟 Il Tuo Profilo Digitale'}</h4>
                            <p>${pProfilo.html}</p>
                        </div>

                        <!-- 5. Card Rossa (Funzionamento) -->
                        <div style="background: #fdf2f2; padding: 2rem; border-radius: 20px; border-left: 8px solid #e74c3c; margin-bottom: 2rem;">
                            <h4 style="color: #e74c3c; margin-bottom: 1rem; font-size: 1.4rem;">${pFunzionamento.title || '🎯 Come funziona la Palestra?'}</h4>
                            <p>${pFunzionamento.html}</p>
                        </div>

                        <!-- Griglia Studenti / Docenti -->
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
                            <div style="background: #e8f5e9; padding: 1.5rem; border-radius: 20px; border-top: 5px solid #2e7d32;">
                                <h4 style="color: #2e7d32; margin-bottom: 0.8rem; font-size: 1.2rem;">${pStudenti.title || '🎓 Per gli Studenti'}</h4>
                                <p style="font-size: 0.95rem; line-height: 1.6;">${pStudenti.html}</p>
                            </div>
                            <div style="background: #e3f2fd; padding: 1.5rem; border-radius: 20px; border-top: 5px solid #1565c0;">
                                <h4 style="color: #1565c0; margin-bottom: 0.8rem; font-size: 1.2rem;">${pDocenti.title || '👨‍🏫 Per i Docenti'}</h4>
                                <p style="font-size: 0.95rem; line-height: 1.6;">${pDocenti.html}</p>
                            </div>
                        </div>

                        <!-- Setup Rapido -->
                        <div style="background: #fff5f5; padding: 2rem; border-radius: 20px; border: 1px solid #ffcdd2; margin-bottom: 2rem;">
                            <h4 style="color: #c62828; margin-bottom: 1rem; font-size: 1.3rem;">🚀 Guida Rapida al Setup</h4>
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; text-align: center;">
                                <div>
                                    <div style="font-size: 2rem; margin-bottom: 0.5rem;">${setupItems[0].num}</div>
                                    <h5 style="margin-bottom: 0.5rem; font-weight: 800;">${setupItems[0].title}</h5>
                                    <p style="font-size: 0.85rem; opacity: 0.85;">${setupItems[0].desc}</p>
                                </div>
                                <div>
                                    <div style="font-size: 2rem; margin-bottom: 0.5rem;">${setupItems[1].num}</div>
                                    <h5 style="margin-bottom: 0.5rem; font-weight: 800;">${setupItems[1].title}</h5>
                                    <p style="font-size: 0.85rem; opacity: 0.85;">${setupItems[1].desc}</p>
                                </div>
                                <div>
                                    <div style="font-size: 2rem; margin-bottom: 0.5rem;">${setupItems[2].num}</div>
                                    <h5 style="margin-bottom: 0.5rem; font-weight: 800;">${setupItems[2].title}</h5>
                                    <p style="font-size: 0.85rem; opacity: 0.85;">${setupItems[2].desc}</p>
                                </div>
                            </div>
                        </div>

                        <p style="text-align: center; font-style: italic; color: #777; margin-top: 2rem;">
                            ${citazioneText}
                        </p>

                        <div style="text-align: center; margin-top: 4rem; padding-top: 2rem; border-top: 1px solid #eee;">
                            <img src="https://gestionesiti.profmemmo.it/shared/assets/branding/prof-memmo/avatar.png" alt="Logo Progetto" style="width: 120px; opacity: 0.9; background: transparent;">
                        </div>
                    </div>
                </div>
            `;
        },

        // ===================================================================
        // VISTA SUPER-ADMIN (Dashboard Admin)
        // ===================================================================
        renderAdminEditor(containerId = 'admin-rules-editor-container') {
            const container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
            if (!container) return;

            const text = this.getRawText();
            const isAuthAdmin = this.isSuperAdmin();
            const fbUser = (window.fbAuth && window.fbAuth.currentUser);
            const userEmail = fbUser ? (fbUser.email || '') : '';

            container.innerHTML = `
                <div style="background: #ffffff; padding: 24px; border-radius: 16px; border: 1.5px solid #e2e8f0; box-shadow: 0 4px 15px rgba(0,0,0,0.03); margin-bottom: 25px;">
                    <div style="margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; border-bottom: 1px solid #f1f5f9; padding-bottom: 14px;">
                        <div>
                            <h3 style="margin: 0 0 4px 0; font-size: 1.15rem; color: #1e293b; display: flex; align-items: center; gap: 8px;">
                                <span style="font-size: 1.3rem;">📜</span> Regolamento Palestra • Live Editor
                            </h3>
                            <p style="margin: 0; font-size: 0.85rem; color: #64748b; line-height: 1.4;">
                                Modifica i testi di "Scopri il Progetto" ([INNOVAZIONE], [AUTONOMIA], [LETTURA], [PROFILO], [FUNZIONAMENTO], [STUDENTI], [DOCENTI], [SETUP], [CITAZIONE]).
                            </p>
                        </div>
                        <div>
                            ${isAuthAdmin ? `
                                <span style="font-size: 0.75rem; background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; padding: 6px 12px; border-radius: 20px; display: inline-flex; align-items: center; gap: 5px; font-weight: 600;">
                                    <i class="fa-solid fa-circle-check" style="color: #22c55e;"></i> Super-Admin Autenticato (${userEmail || SUPER_ADMIN_EMAIL})
                                </span>
                            ` : `
                                <span style="font-size: 0.75rem; background: #fef9c3; color: #854d0e; border: 1px solid #fde047; padding: 6px 12px; border-radius: 20px; display: inline-flex; align-items: center; gap: 5px; font-weight: 600;">
                                    <i class="fa-solid fa-cloud-arrow-up" style="color: #ca8a04;"></i> Cloud Sync (${SUPER_ADMIN_EMAIL})
                                </span>
                            `}
                        </div>
                    </div>

                    <div style="margin-bottom: 18px;">
                        <textarea id="palestra-rules-textarea" rows="20" style="width: 100%; box-sizing: border-box; background: #0f172a; border: 1.5px solid #cbd5e1; border-radius: 10px; color: #f8fafc; padding: 16px; font-size: 0.9rem; line-height: 1.6; font-family: monospace, sans-serif; resize: vertical; outline: none; box-shadow: inset 0 2px 4px rgba(0,0,0,0.2);">${text}</textarea>
                    </div>

                    <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
                        <button type="button" id="btn-save-palestra-rules" onclick="window.PalestraRulesService.handleSaveButton()" style="background: #27ae60; color: #fff; border: none; padding: 10px 24px; border-radius: 20px; font-weight: 800; font-size: 0.85rem; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; text-transform: uppercase; box-shadow: 0 4px 12px rgba(39,174,96,0.3); transition: transform 0.2s;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='none'">
                            <i class="fa-solid fa-floppy-disk"></i> SALVA REGOLAMENTO
                        </button>
                        
                        <button type="button" onclick="window.PalestraRulesService.handleResetButton()" style="background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; padding: 10px 20px; border-radius: 20px; font-size: 0.82rem; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: background 0.2s;" onmouseover="this.style.background='#e2e8f0'" onmouseout="this.style.background='#f1f5f9'">
                            <i class="fa-solid fa-rotate-left"></i> Ripristina Predefinito
                        </button>
                    </div>
                </div>
            `;
        },

        async handleSaveButton() {
            const textarea = document.getElementById('palestra-rules-textarea');
            if (!textarea) return;

            const btn = document.getElementById('btn-save-palestra-rules');
            const originalHtml = btn ? btn.innerHTML : '';
            if (btn) {
                btn.disabled = true;
                btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> SALVATAGGIO...`;
            }

            try {
                await this.saveToCloud(textarea.value);
                if (btn) {
                    btn.innerHTML = `<i class="fa-solid fa-check"></i> SALVATO CON SUCCESSO!`;
                    btn.style.background = '#16a34a';
                    btn.style.color = '#fff';
                }
                setTimeout(() => {
                    if (btn) {
                        btn.disabled = false;
                        btn.innerHTML = originalHtml;
                        btn.style.background = '#27ae60';
                        btn.style.color = '#fff';
                    }
                }, 2000);
            } catch (err) {
                alert("Errore salvataggio: " + err.message);
                if (btn) {
                    btn.disabled = false;
                    btn.innerHTML = originalHtml;
                }
            }
        },

        async handleResetButton() {
            if (!confirm("Sei sicuro di voler ripristinare il testo predefinito di 'Scopri il Progetto / Regolamento'? Le modifiche attuali verranno sovrascritte.")) {
                return;
            }
            try {
                await this.resetToDefault();
                const textarea = document.getElementById('palestra-rules-textarea');
                if (textarea) textarea.value = this.getDefaultText();
                alert("✅ Regolamento ripristinato ai valori predefiniti.");
            } catch (err) {
                alert("Errore ripristino: " + err.message);
            }
        }
    };

    window.RulesService = RulesService;
    window.PalestraRulesService = RulesService;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => RulesService.init());
    } else {
        RulesService.init();
    }

})();

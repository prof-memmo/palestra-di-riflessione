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

    const DEFAULT_PALESTRA_RULES_TEXT = `1. Cos'è la Palestra di Riflessione e Profilo Centrale
Come tutti i giochi dell'ecosistema Prof. Memmo, la Palestra di Riflessione nasce da una libera interpretazione e ha scopo puramente formativo e culturale. È un ambiente digitale dedicato al potenziamento della grammatica, del lessico, della comprensione del testo e della scrittura autonoma. Integra strumenti di Intelligenza Artificiale controllata, sempre supervisionata e guidata dalla sensibilità didattica del docente. L'accesso, la gestione del proprio account, dei piani e delle classi avvengono tramite il Profilo Docente sul portale principale: https://prof-memmo.github.io/games/.

2. Classi Digitali, Codice Univoco e Accesso Studenti
Il docente configura le classi e i nominativi dal portale principale, generando il Codice Classe Univoco (es. ALFA24) valido per tutti i giochi che ne fanno uso. Gli studenti accedono istantaneamente senza registrazioni o credenziali personali con email: inseriscono il codice, scelgono il proprio nome dall'elenco di classe e trovano subito i compiti assegnati, le letture e il proprio Vocabolario Personale Digitale.

3. Le 4 Aree di Allenamento: Teoria e Pratica
La piattaforma si struttura in 4 aree cardine: Grammatica, Lessico, Lettura e Produzione Scritta. Per ciascun argomento gli studenti affrontano due fasi distinte:
• SCOPRI: schede teoriche visive, chiare ed essenziali.
• ALLENATI: esercizi interattivi a correzione immediata. Grazie alla funzione "Riprova più tardi", se un esercizio risulta momentaneamente troppo complesso lo studente può accantonarlo e riprenderlo successivamente senza frustrazione.

4. Letture per Generi, Livelli QCER e Click & Learn
I percorsi di lettura offrono brani originali suddivisi per Generi (Avventura, Giallo, Fantasy, Attualità) e calibrati sui livelli del Quadro Comune Europeo (A1-B2). Grazie alla tecnologia interattiva "Click & Learn", durante la lettura basta cliccare su qualsiasi vocabolo complesso per aprirne la definizione e aggiungerlo istantaneamente al proprio Vocabolario Personale Digitale consultabile nel profilo.

5. Gamification, Livelli XP e Autonomia
Completando gli esercizi e arricchendo il proprio vocabolario, ogni studente accumula Punti Esperienza (XP), fa evolvere il proprio avatar ed espande la propria dashboard personale. Il sistema premia l'autonomia, l'imparare a imparare e la curiosità lessicale.

6. Benessere degli Studenti e Riposo Digitale
A tutela del benessere visivo e della concentrazione, dopo 45 minuti di esercitazione continua sulla piattaforma ogni sessione verrà temporaneamente bloccata per una Pausa obbligatoria di 15 minuti (Diritto al riposo digitale). Agli studenti non è consentito superare le 2 sessioni giornaliere (max 90 minuti al giorno complessivi). Questa limitazione oraria non si applica ai profili dei docenti né a chi si allena privatamente.

7. Codice Etico e Alleanza Educativa
L'innovazione tecnologica e l'Intelligenza Artificiale sono al servizio della crescita umana: il cuore dell'apprendimento risiede nella relazione educativa tra studente e docente. Ogni esercizio va affrontato con onestà intellettuale e impegno personale. Il regolamento potrà subire variazioni e integrazioni ufficiali da parte del Team Prof. Memmo.`;

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

        _resolveUserEmail(providedEmail) {
            if (providedEmail && typeof providedEmail === 'string' && providedEmail.trim()) {
                return providedEmail.trim().toLowerCase();
            }
            const fbUser = (window.fbAuth && window.fbAuth.currentUser) ||
                           (window.firebase && window.firebase.auth && window.firebase.auth().currentUser);
            if (fbUser && fbUser.email) {
                return fbUser.email.trim().toLowerCase();
            }
            const user = (window.Auth && typeof window.Auth.getUser === 'function') ? window.Auth.getUser() : null;
            if (user && user.email) {
                return user.email.trim().toLowerCase();
            }
            if (window.currentUser && window.currentUser.email) {
                return window.currentUser.email.trim().toLowerCase();
            }
            if (window.currentUserEmail && typeof window.currentUserEmail === 'string') {
                return window.currentUserEmail.trim().toLowerCase();
            }
            try {
                const stored = JSON.parse(localStorage.getItem('currentUser') || '{}');
                if (stored && stored.email) return stored.email.trim().toLowerCase();
            } catch (e) {}
            try {
                const storedHub = JSON.parse(localStorage.getItem('hub_user') || '{}');
                if (storedHub && storedHub.email) return storedHub.email.trim().toLowerCase();
            } catch (e) {}
            return '';
        },

        _getFirestoreDb() {
            if (window.fbDb && typeof window.fbDb.collection === 'function') return window.fbDb;
            if (window.db && typeof window.db.collection === 'function') return window.db;
            if (window.hubDb && typeof window.hubDb.collection === 'function') return window.hubDb;
            if (typeof firebase !== 'undefined' && firebase.firestore && typeof firebase.firestore === 'function') {
                return firebase.firestore();
            }
            return null;
        },

        isSuperAdmin(email) {
            const userEmail = this._resolveUserEmail(email);
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
            try {
                const text = this.getRawText();
                // Non sovrascrivere mai #app se ci troviamo in sezioni diverse da 'intro' (es. admin)
                if (window.currentSection === 'intro' && typeof this.renderPublicView === 'function') {
                    const appEl = document.getElementById('app');
                    if (appEl) {
                        this.renderPublicView(appEl);
                    }
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
            } catch (err) {
                console.warn("Errore safe in _notify (Palestra):", err);
            }
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

            const userEmail = this._resolveUserEmail();
            const isAdmin = this.isSuperAdmin(userEmail) ||
                            (window.currentUser && (window.currentUser.role === 'admin' || window.currentUser.role === 'docente')) ||
                            !!localStorage.getItem('currentUser') ||
                            !!localStorage.getItem('hub_user');

            if (!isAdmin) {
                throw new Error(`Permesso negato: solo il Super-Admin (${SUPER_ADMIN_EMAIL}) o un docente autenticato possono salvare le modifiche.`);
            }

            const nowIso = new Date().toISOString();
            const payload = {
                text: trimmed,
                lastUpdated: nowIso,
                updatedBy: userEmail || SUPER_ADMIN_EMAIL,
                gameKey: this._gameKey
            };

            // 1. Salvataggio locale immediato (Zero data-loss garantito)
            this._rawText = trimmed;
            this._lastUpdated = nowIso;
            this._updatedBy = payload.updatedBy;

            try {
                localStorage.setItem(this._storageKey, JSON.stringify(payload));
            } catch (e) {
                console.warn("Salvataggio cache locale non riuscito (Palestra):", e);
            }

            this._notify();

            // 2. Sincronizzazione Cloud Firestore (palestra_settings e hub_settings)
            const db = this._getFirestoreDb();
            if (db) {
                try {
                    await db.collection(this._collectionName).doc(this._docId).set(payload, { merge: true });
                } catch (cloudErr) {
                    console.warn("Salvataggio Firestore palestra_settings non riuscito (persiste in locale):", cloudErr.message || cloudErr);
                }
                try {
                    await db.collection('hub_settings').doc('palestra_official_rules').set(payload, { merge: true });
                } catch (hubErr) {}
            }

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

        _formatLinks(str, linkColor = '#2563eb') {
            if (!str || typeof str !== 'string') return '';
            // 1. Markdown link: [Label](https://url)
            let res = str.replace(/\[([^\]]+)\]\((https?:\/\/[^\s\)]+)\)/g, (m, label, url) => {
                const cleanHref = url.replace(/&amp;/g, '&');
                return `<a href="${cleanHref}" target="_blank" rel="noopener noreferrer" style="color: ${linkColor}; text-decoration: underline; font-weight: 700; word-break: break-all;">${label} <span style="font-size: 0.8em; margin-left: 2px;">↗</span></a>`;
            });
            // 2. Plain URL: https://...
            res = res.replace(/(^|[\s(>])(https?:\/\/[^\s<]+)/g, (m, prefix, url) => {
                let cleanUrl = url;
                let trailing = '';
                const trailMatch = url.match(/([.,;:!?)]+)$/);
                if (trailMatch) {
                    trailing = trailMatch[1];
                    cleanUrl = url.substring(0, url.length - trailing.length);
                }
                const cleanHref = cleanUrl.replace(/&amp;/g, '&');
                return `${prefix}<a href="${cleanHref}" target="_blank" rel="noopener noreferrer" style="color: ${linkColor}; text-decoration: underline; font-weight: 700; word-break: break-all;">${cleanUrl} <span style="font-size: 0.8em; margin-left: 2px;">↗</span></a>${trailing}`;
            });
            return res;
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
                        return `<br>• <b>${this._formatLinks(parts[0].trim(), '#2563eb')}</b>: ${this._formatLinks(parts.slice(1).join(':').trim(), '#2563eb')}`;
                    }
                    return `<br>• ${this._formatLinks(clean, '#2563eb')}`;
                }
                return this._formatLinks(line, '#2563eb');
            }).join(' ');

            return {
                title: this._formatLinks(title, titleColor || '#2563eb'),
                html: formattedBody.startsWith('<br>') ? formattedBody.substring(4) : formattedBody
            };
        },

        // Parsing dinamico a punti numerati (Standard FantaLetteratura / Ecosistema)
        parseTextToItems(text) {
            const src = (text || this.getRawText()).trim();
            if (!src) return [];

            const blocks = src.split(/\n\s*\n/).map(b => b.trim()).filter(Boolean);
            const items = [];

            blocks.forEach((block, index) => {
                const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
                if (lines.length === 0) return;

                let firstLine = lines[0].replace(/^[\u2022\*\-]\s*/, '').trim();
                let title = '';
                let content = '';

                let detectedNumber = null;
                const matchNumbered = firstLine.match(/^(\d+)[\.\)]\s*(.*)$/);
                if (matchNumbered) {
                    detectedNumber = parseInt(matchNumbered[1], 10);
                    firstLine = matchNumbered[2].trim();
                }

                if (lines.length > 1) {
                    title = firstLine;
                    content = lines.slice(1).join('\n').trim();
                } else {
                    const colonMatch = firstLine.match(/^([^:]{3,60}):\s*(.+)$/);
                    if (colonMatch) {
                        title = colonMatch[1].trim();
                        content = colonMatch[2].trim();
                    } else {
                        content = firstLine;
                    }
                }

                if (title) {
                    title = title.replace(/:\s*$/, '').trim();
                }

                items.push({
                    index: detectedNumber !== null ? detectedNumber : index + 1,
                    title: title || `Punto ${detectedNumber !== null ? detectedNumber : index + 1}`,
                    text: content || title,
                    fullText: block
                });
            });

            return items;
        },

        _formatItemHtml(text, linkColor = '#2563eb') {
            if (!text) return '';
            const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
            return lines.map(line => {
                if (line.startsWith('•') || line.startsWith('-')) {
                    const clean = line.replace(/^[•\-]\s*/, '');
                    const colonIdx = clean.indexOf(':');
                    if (colonIdx !== -1) {
                        const lbl = clean.substring(0, colonIdx).trim();
                        const val = clean.substring(colonIdx + 1).trim();
                        return `<div style="margin: 6px 0; padding-left: 12px; border-left: 3px solid #cbd5e1;"><strong>${lbl}:</strong> ${this._formatLinks(val, linkColor)}</div>`;
                    }
                    return `<div style="margin: 6px 0; padding-left: 12px; border-left: 3px solid #cbd5e1;">• ${this._formatLinks(clean, linkColor)}</div>`;
                }
                return `<p style="margin: 0 0 10px 0; font-size: 0.95rem; line-height: 1.7; color: #334155;">${this._formatLinks(line, linkColor)}</p>`;
            }).join('');
        },

        // ===================================================================
        // VISTA PUBBLICA (SCOPRI IL PROGETTO / REGOLAMENTO)
        // Supporto ibrido: Layout dinamico a punti (standard) o card storiche (legacy)
        // ===================================================================
        renderPublicView(containerId = 'app') {
            const container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
            if (!container) return;

            const raw = this.getRawText();
            const hasLegacyTags = /\[(INNOVAZIONE|AUTONOMIA|LETTURA|PROFILO|FUNZIONAMENTO|STUDENTI|DOCENTI|SETUP|CITAZIONE)\]/i.test(raw);

            if (hasLegacyTags) {
                this._renderLegacyPublicView(container);
            } else {
                this._renderDynamicItemsView(container);
            }
        },

        _renderDynamicItemsView(container) {
            const items = this.parseTextToItems();
            const borderColors = ['#27ae60', '#2980b9', '#d4ac0d', '#8e44ad', '#e74c3c', '#0d9488', '#4f46e5', '#e11d48'];
            const bgTints = ['#f8f9fa', '#eef7ff', '#fff9db', '#f5eef8', '#fdf2f2', '#f0fdfa', '#eef2ff', '#fff1f2'];

            container.innerHTML = `
                <div class="exercise-container" style="max-width: 950px; margin: 0 auto; padding: 20px;">
                    <div style="text-align: center; margin-bottom: 25px;">
                        <h2 class="exercise-title" style="margin: 0; font-size: 2rem; color: #2c3e50;">
                            Regolamento
                        </h2>
                    </div>

                    <div style="background: white; padding: 2rem; border-radius: 26px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); line-height: 1.8;">
                        ${items.map((item, idx) => {
                            const color = borderColors[idx % borderColors.length];
                            const bg = bgTints[idx % bgTints.length];
                            return `
                                <div style="background: ${bg}; padding: 1.6rem 2rem; border-radius: 18px; border-left: 8px solid ${color}; margin-bottom: 1.8rem; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
                                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 0.8rem;">
                                        <span style="background: ${color}; color: #fff; width: 30px; height: 30px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.9rem; flex-shrink: 0;">
                                            ${item.index}
                                        </span>
                                        <h4 style="margin: 0; color: ${color}; font-size: 1.25rem; font-weight: 800;">
                                            ${this._formatLinks(item.title, color)}
                                        </h4>
                                    </div>
                                    <div style="padding-left: 40px;">
                                        ${this._formatItemHtml(item.text, color)}
                                    </div>
                                </div>
                            `;
                        }).join('')}

                        <div style="text-align: center; margin-top: 3rem; padding-top: 1.8rem; border-top: 1px solid #eee;">
                            <img src="https://prof-memmo.github.io/prof-memmo-gestione-siti/shared/assets/branding/prof-memmo/avatar.png" alt="Logo Progetto" style="width: 110px; opacity: 0.95; background: transparent;">
                            <p style="font-size: 0.82rem; color: #94a3b8; margin-top: 8px;">&copy; Prof. Memmo • Palestra di Riflessione sulla Lingua</p>
                        </div>
                    </div>
                </div>
            `;
        },

        _renderLegacyPublicView(container) {
            const sections = this.parseSections(this.getRawText());

            const pInnovazione = this._formatParagraph(sections.innovazione, '💡 Innovazione e Tradizione');
            const pAutonomia = this._formatParagraph(sections.autonomia, '🌱 Autonomia e Competenze Digitali');
            const pLettura = this._formatParagraph(sections.lettura, '📚 Il piacere della Lettura');
            const pProfilo = this._formatParagraph(sections.profilo, '🌟 Il Tuo Profilo Digitale');
            const pFunzionamento = this._formatParagraph(sections.funzionamento, '🎯 Come funziona la Palestra?');
            const pStudenti = this._formatParagraph(sections.studenti, '🎓 Per gli Studenti');
            const pDocenti = this._formatParagraph(sections.docenti, '👨‍🏫 Per i Docenti');

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
                    <h2 class="exercise-title" style="text-align: center; margin-bottom: 25px;">Regolamento</h2>
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
                            <img src="https://prof-memmo.github.io/prof-memmo-gestione-siti/shared/assets/branding/prof-memmo/avatar.png" alt="Logo Progetto" style="width: 120px; opacity: 0.9; background: transparent;">
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
            const userEmail = this._resolveUserEmail();
            const isAuthAdmin = this.isSuperAdmin(userEmail);

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

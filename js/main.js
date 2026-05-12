window.currentSection = 'home';
window.currentSubType = null;
window.currentLevel = null;
window.currentExerciseIndex = 0;
window.currentExtra = null;
window.currentPathKey = null;
window.pendingRoute = null; // Store route to redirect after login

// --- LOGIN HANDLERS ---
function showLoginOverlay(redirectRoute = null) {
    const overlay = document.getElementById('login-overlay');
    if (overlay) {
        overlay.classList.remove('hidden');
        window.pendingRoute = redirectRoute;
    }
}

function hideLoginOverlay() {
    const overlay = document.getElementById('login-overlay');
    if (overlay) overlay.classList.add('hidden');
}

// UI Helpers
if (!window.UI) window.UI = {};
window.UI.hideModal = function() {
    const modal = document.getElementById('feedback-modal');
    if (modal) modal.classList.add('hidden');
};

// Role selection logic
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('role-opt')) {
        document.querySelectorAll('.role-opt').forEach(opt => opt.classList.remove('active'));
        e.target.classList.add('active');
    }
});

const LEGAL_TEXTS = {
    privacy: `
        <h2>🔒 Privacy Policy</h2>
        <h3>1. Titolare del trattamento</h3>
        <p>Il titolare del trattamento è Guglielmo Piersanti, contattabile all’indirizzo email: prof.memmo@gmail.com</p>
        <h3>2. Finalità del sito</h3>
        <p>“Palestra di Riflessione” è un’applicazione web didattica, utilizzata a scopo educativo e ludico e senza fini di lucro per l'apprendimento della lingua italiana.</p>
        <h3>3. Dati raccolti</h3>
        <p>Il sito può raccogliere i seguenti dati: nome utente (scelto dall'utente); informazioni di utilizzo relative agli esercizi (punteggi, attività completate, progressi); messaggi inviati tramite il modulo di contatto (nome, email, messaggio); dati tecnici minimi per il funzionamento (es. tipo di dispositivo tramite browser).</p>
        <h3>4. Finalità del trattamento</h3>
        <p>I dati vengono trattati esclusivamente per consentire l’accesso alle funzionalità della Palestra, gestire l’esperienza didattica personalizzata (come il salvataggio dei progressi e del vocabolario), rispondere alle richieste inviate tramite il modulo di contatto e migliorare il servizio didattico. Non vengono utilizzati per scopi commerciali o pubblicitari.</p>
        <h3>5. Base giuridica</h3>
        <p>Il trattamento dei dati si basa sul consenso fornito dall’utente al momento del primo accesso e sull'utilizzo delle funzionalità didattiche del sito.</p>
        <h3>6. Conservazione dei dati</h3>
        <p>I dati sono salvati localmente sul browser dell'utente (LocalStorage) e, se implementato, su database sicuri. Non vengono venduti né ceduti a terzi. Sono mantenuti solo per il tempo necessario al funzionamento didattico o fino alla richiesta di cancellazione da parte dell'utente.</p>
        <h3>8. Diritti dell’utente</h3>
        <p>L'utente può richiedere in qualsiasi momento l'accesso ai propri dati o la loro cancellazione (che può avvenire anche tramite il proprio profilo utente cancellando i dati locali). Per assistenza, è possibile contattare il titolare all’indirizzo email sopra indicato.</p>
        <h3>9. Cookie</h3>
        <p>Il sito non utilizza cookie di profilazione a scopo pubblicitario. Utilizza esclusivamente elementi tecnici necessari per il salvataggio dei progressi di studio.</p>
        <h3>9. Utenti minori</h3>
        <p>Il sito è destinato a un uso didattico scolastico. Per l'utilizzo da parte di minori, è responsabilità di un genitore o di un docente assicurare la supervisione necessaria. I tutori possono richiedere la cancellazione dei dati in qualsiasi momento.</p>
        <h3>10. Modifiche alla Policy</h3>
        <p>Questa informativa può essere aggiornata per riflettere nuove funzionalità didattiche. Le modifiche rilevanti verranno segnalate agli utenti.</p>
        <h3>11. Riferimenti normativi</h3>
        <p>Questa informativa è redatta in conformità ai principi del GDPR.</p>
    `,
    terms: `
        <h2>📜 Termini e Condizioni</h2>
        <p>Ultimo aggiornamento: 02/05/26</p>
        <h3>1. Titolare del sito</h3>
        <p>Il presente sito web "Palestra di Riflessione" è gestito da: Guglielmo Piersanti. Email di contatto: prof.memmo@gmail.com</p>
        <h3>2. Accettazione dei termini</h3>
        <p>L’accesso alla Palestra implica l’accettazione dei presenti Termini e Condizioni. Se non si accettano tali condizioni, si invita a non utilizzare il sito.</p>
        <h3>3. Descrizione del servizio</h3>
        <p>Il sito offre esercizi interattivi di grammatica, lettura, lessico e produzione per la scuola secondaria di primo grado. Gli utenti possono: svolgere esercizi, monitorare i propri progressi e contattare il gestore per supporto o collaborazione.</p>
        <h3>4. Utilizzo del sito</h3>
        <p>L’utente si impegna a utilizzare il sito in modo corretto, evitando comportamenti che possano danneggiare la piattaforma o gli altri utenti. È vietato l'invio di messaggi offensivi o spam tramite il modulo di contatto.</p>
        <h3>5. Modulo di contatto</h3>
        <p>L’utente è responsabile dei dati inviati tramite il modulo. Il titolare si riserva il diritto di non rispondere a messaggi non pertinenti o inappropriati.</p>
        <h3>6. Proprietà intellettuale</h3>
        <p>I testi e i materiali didattici originali contenuti nel sito sono di proprietà del titolare, salvo dove diversamente indicato (es. fonti letterarie citate). È vietata la riproduzione per scopi commerciali senza autorizzazione.</p>
        <h3>7. Limitazione di responsabilità</h3>
        <p>Il sito è fornito a scopo didattico gratuito. Il titolare non è responsabile per eventuali problemi tecnici temporanei o per l'uso improprio delle informazioni contenute. L'obiettivo è fornire uno strumento di supporto all'apprendimento il più accurato possibile.</p>
        <h3>8. Link esterni</h3>
        <p>Eventuali link a siti esterni sono forniti per approfondimento didattico; il titolare non è responsabile del contenuto di tali siti.</p>
        <h3>9. Modifiche</h3>
        <p>Il titolare può modificare i presenti Termini in base all'evoluzione del progetto didattico.</p>
        <h3>10. Legge applicabile</h3>
        <p>I presenti Termini sono regolati dalla normativa italiana.</p>
    `
};


let _currentLegalType = null;
let _hasConfirmedPrivacy = false;
let _hasConfirmedTerms = false;

window.showLegal = function(type) {
    const modal = document.getElementById('legal-modal');
    const container = document.getElementById('legal-text-container');
    if (modal && container) {
        _currentLegalType = type;
        container.innerHTML = LEGAL_TEXTS[type] || 'Contenuto non disponibile.';
        modal.classList.remove('hidden');
    }
};

window.hideLegal = function() {
    const modal = document.getElementById('legal-modal');
    if (modal) modal.classList.add('hidden');
};

window.confirmLegal = function() {
    if (_currentLegalType === 'privacy') _hasConfirmedPrivacy = true;
    if (_currentLegalType === 'terms') _hasConfirmedTerms = true;

    // Se entrambi confermati, spunta automaticamente la checkbox privacy
    if (_hasConfirmedPrivacy && _hasConfirmedTerms) {
        const checkPrivacy = document.getElementById('check-privacy');
        if (checkPrivacy) checkPrivacy.checked = true;
    }

    hideLegal();
};

window.handleEmailLogin = async function() {
    const checkAge = document.getElementById('check-age');
    const checkPrivacy = document.getElementById('check-privacy');

    if (!checkAge.checked || !checkPrivacy.checked) {
        alert("Per procedere devi accettare i termini e confermare l'età.");
        return;
    }

    const email = (document.getElementById('login-email')?.value || '').trim();
    const password = (document.getElementById('login-password')?.value || '').trim();

    await Auth.loginWithEmail('', email, password);
};

window.handleGoogleLogin = function() {
    const checkAge = document.getElementById('check-age');
    const checkPrivacy = document.getElementById('check-privacy');

    if (!checkAge.checked || !checkPrivacy.checked) {
        alert("Per procedere devi accettare i termini e confermare l'età.");
        return;
    }
    
    Auth.loginWithGoogle();
};

window.handleGuestAccess = function() {
    Auth.continueAsGuest();
    hideLoginOverlay();
    if (typeof updateSidebarMenu === 'function') updateSidebarMenu();
    
    // Refresh UI immediately
    window.location.hash = 'home';
    handleRoute();
};

// Avatar selection logic
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('avatar-opt')) {
        document.querySelectorAll('.avatar-opt').forEach(opt => opt.classList.remove('active'));
        e.target.classList.add('active');
    }
});

function updateHistory(title, icon, hash) {
    let history = JSON.parse(localStorage.getItem('palestra_history') || '[]');
    history = history.filter(h => h.hash !== hash);
    history.unshift({
        title: title,
        icon: icon,
        hash: hash,
        date: new Date().toLocaleDateString('it-IT') + ' ' + new Date().toLocaleTimeString('it-IT', {hour: '2-digit', minute:'2-digit'})
    });
    localStorage.setItem('palestra_history', JSON.stringify(history.slice(0, 10)));
}

// Router Initialization
window.addEventListener('load', async () => {
    // Aspetta che l'autenticazione sia risolta (fondamentale per i redirect Google su mobile)
    if (window.Auth && typeof window.Auth.whenReady === 'function') {
        await window.Auth.whenReady();
    }
    
    // Piccolo ritardo per assicurarsi che il DOM sia stabile e exercisesData caricato
    setTimeout(handleRoute, 100);
});
window.addEventListener('hashchange', handleRoute);

function handleRoute() {
    const appContainer = document.getElementById('app');
    if (!appContainer) return;

    // Se l'autenticazione non è ancora pronta, aspettiamo che lo sia prima di decidere se mostrare il login
    if (window.Auth && window.Auth._readyPromise && !window.Auth._isReady) {
        window.Auth._readyPromise.then(handleRoute);
        return;
    }

    try {
        const hash = window.location.hash.substring(1);
        const parts = hash.split('/').filter(p => p && p !== 'null');
        const section = parts[0] || 'home';
        const subType = parts[1] || null;
        const level = parts[2] || null;
        const extra = parts[3] || null;

        // Render immediato della Home se siamo all'inizio
        if (section === 'home' || section === '') {
            renderHomePage();
        }

        // Aspetta i dati se non ci sono ancora
        if (!window.exercisesData) {
            console.log("Waiting for exercisesData...");
            setTimeout(handleRoute, 200);
            return;
        }

        // LOGIN LOGIC
        if (!Auth.isLoggedIn() && !window.hasShownInitialLogin) {
            window.hasShownInitialLogin = true;
            showLoginOverlay(hash);
            return;
        }

        if (!Auth.isLoggedIn() && subType && section !== 'intro') {
            showLoginOverlay(hash);
            return;
        }

        // Nasconde l'overlay di login per tutti i path autenticati.
        // Fondamentale per il redirect Google su mobile: _handleFirebaseUser
        // potrebbe aver chiamato hideLoginOverlay() prima che main.js fosse
        // completamente caricato, lasciando l'overlay visibile.
        if (Auth.isLoggedIn()) {
            hideLoginOverlay();
        }

        const user = Auth.getUser();
        // Se loggato ma onboarding non completo, forza redirect (tranne che per admin che saltano)
        if (Auth.isLoggedIn() && user.setupComplete === false && section !== 'onboarding') {
            window.location.hash = 'onboarding';
            return;
        }

        if (section === 'onboarding') {
            renderOnboardingPage();
            return;
        }

        if (!MATERIE_HIERARCHY[section] && !['home', 'contatti', 'profilo', 'ripassa', 'intro', 'admin'].includes(section)) {
            appContainer.innerHTML = `<div style="padding: 2rem; text-align: center;"><h2>Ops! Pagina non trovata</h2><p>La sezione <b>${section}</b> non esiste.</p><button class="btn" onclick="window.location.hash='home'">Torna alla Home</button></div>`;
            return;
        }

        if (section === 'intro') {
            window.currentSection = 'intro';
            renderIntroPage();
            if (typeof updateSidebarMenu === 'function') updateSidebarMenu();
        } else if (section !== 'home') {
            navigateTo(section, subType, level, false, extra);
        } else {
            // Se siamo in home e loggati, aggiorniamo solo il menu
            if (typeof updateSidebarMenu === 'function') updateSidebarMenu();
        }
    } catch (err) {
        console.error("Critical Routing Error:", err);
        appContainer.innerHTML = `<div style="padding: 2rem; color: #e74c3c; background: #fdf2f2; border-radius: 20px; margin: 2rem;">
            <h3>⚠️ Errore di Caricamento</h3>
            <p>${err.message}</p>
            <button class="btn" onclick="window.location.reload()">Ricarica Pagina</button>
        </div>`;
    }
}

function renderHomePage() {
    const appContainer = document.getElementById('app');
    appContainer.innerHTML = `
        <div id="home" class="section active">
            <div class="home-header">
                <h1 class="main-title">PALESTRA DI <span class="accent">RIFLESSIONE</span> SULLA LINGUA</h1>
                <p class="home-description">Lo spazio interattivo per allenare l'analisi grammaticale, logica e del periodo con testi lunghi e coinvolgenti per la scuola secondaria di primo grado.</p>
                <div style="margin-top: 1rem;">
                    <button class="btn" onclick="window.location.hash = 'intro'" style="background: rgba(39, 174, 96, 0.1); color: #27ae60; border: 1px solid #27ae60; padding: 0.6rem 1.2rem; font-size: 0.9rem; border-radius: 50px; font-weight: 700; transition: all 0.3s; cursor: pointer;">SCOPRI IL PROGETTO 👋</button>
                </div>
            </div>
            
            <div class="home-main-layout">
                <div class="home-side left-side">
                    <div class="materia-card-home" onclick="navigateTo('riflessione')">
                        <span class="materia-icon">🧠</span>
                        <div class="materia-label">Grammatica</div>
                    </div>
                    <div class="materia-card-home" onclick="navigateTo('lettura')">
                        <span class="materia-icon">📚</span>
                        <div class="materia-label">Lettura</div>
                    </div>
                </div>
                
                <div class="home-center">
                    <img src="assets/hero.png" alt="Studente che impara" class="hero-image-new">
                </div>
                
                <div class="home-side right-side">
                    <div class="materia-card-home" onclick="navigateTo('lessico')">
                        <span class="materia-icon">📖</span>
                        <div class="materia-label">Lessico</div>
                    </div>
                    <div class="materia-card-home" onclick="navigateTo('produzione')">
                        <span class="materia-icon">✍️</span>
                        <div class="materia-label">Produzione</div>
                    </div>
                </div>
            </div>
        </div>
    `;
    currentSection = 'home';
}

function renderIntroPage() {
    const appContainer = document.getElementById('app');
    appContainer.innerHTML = `
        <div class="exercise-container">
            <h2 class="exercise-title">👋 BENVENUTI NELLA PALESTRA</h2>
            <div style="background: white; padding: 2rem; border-radius: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); line-height: 1.8;">
                
                <div style="background: #f8f9fa; padding: 2rem; border-radius: 20px; border-left: 8px solid #27ae60; margin-bottom: 2rem;">
                    <h4 style="color: #27ae60; margin-bottom: 1rem; font-size: 1.4rem;">💡 Innovazione e Tradizione</h4>
                    <p>
                        Questa piattaforma integra l'esperienza didattica con i nuovi strumenti digitali. 
                        Tutto il materiale è stato elaborato con l'aiuto dell'<b>Intelligenza Artificiale</b>, 
                        ma è interamente <b>gestito, revisionato e guidato dall'uomo</b>. 
                        L'IA è uno strumento prezioso, ma la professionalità docente resta il cuore che dà senso e direzione a ogni proposta.
                    </p>
                </div>

                <div style="background: #eef7ff; padding: 2rem; border-radius: 20px; border-left: 8px solid #2980b9; margin-bottom: 2rem;">
                    <h4 style="color: #2980b9; margin-bottom: 1rem; font-size: 1.4rem;">🌱 Autonomia e Competenze Digitali</h4>
                    <p>
                        L'obiettivo della Palestra è rendere ogni studente <b>protagonista autonomo</b> del proprio percorso. Attraverso l'uso attivo della piattaforma, raggiungerai traguardi fondamentali:
                        <br>• <b>Consapevolezza</b>: imparerai a gestire i tuoi tempi di studio e a monitorare i tuoi sforzi.
                        <br>• <b>Padronanza Digitale</b>: utilizzerai interfacce moderne e l'IA in modo critico.
                        <br>• <b>Imparare a imparare</b>: svilupperai la capacità di reperire e rielaborare informazioni in autonomia.
                    </p>
                </div>

                <div style="background: #fff9db; padding: 2rem; border-radius: 20px; border-left: 8px solid #f1c40f; margin-bottom: 2rem;">
                    <h4 style="color: #d4ac0d; margin-bottom: 1rem; font-size: 1.4rem;">📚 Il piacere della Lettura</h4>
                    <p>
                        Nella sezione <b>Lettura</b> troverai testi originali e coinvolgenti divisi per:
                        <br>• <b>Generi</b>: dall'Avventura al Giallo, dal Fantasy all'Attualità.
                        <br>• <b>Livelli (A1-B2)</b>: percorsi calibrati sulle tue reali capacità di comprensione.
                        <br>Ogni testo è una sfida per migliorare la tua comprensione e scoprire nuovi mondi.
                    </p>
                </div>

                <div style="background: #f5eef8; padding: 2rem; border-radius: 20px; border-left: 8px solid #8e44ad; margin-bottom: 2rem;">
                    <h4 style="color: #8e44ad; margin-bottom: 1rem; font-size: 1.4rem;">🌟 Il Tuo Profilo Digitale</h4>
                    <p>
                        Le funzioni avanzate sono ora attive per aumentare la tua autonomia:
                        <br>• <b>Account Personale</b>: crea il tuo profilo per scegliere il tuo avatar e tenere traccia di ogni esercizio completato.
                        <br>• <b>Click & Learn</b>: nelle letture puoi <b>cliccare su qualsiasi parola difficile</b> per scoprirne il significato e aggiungerla istantaneamente al tuo <b>Vocabolario Personale</b>.
                        <br>• <b>Dashboard Avanzata</b>: consulta il tuo dizionario personalizzato nella sezione Profilo e guarda come crescono le tue competenze nel tempo.
                    </p>
                </div>

                <div style="background: #fdf2f2; padding: 2rem; border-radius: 20px; border-left: 8px solid #e74c3c; margin-bottom: 2rem;">
                    <h4 style="color: #e74c3c; margin-bottom: 1rem; font-size: 1.4rem;">🎯 Come funziona la Palestra?</h4>
                    <p>
                        La Palestra è divisa in aree tematiche (Grammatica, Lettura, Lessico, Produzione). 
                        Per ogni argomento troverai le fasi di <b>SCOPRI</b> (teoria) e <b>ALLENATI</b> (pratica).
                        <br>• <b>Navigazione Flessibile</b>: Se un esercizio è troppo difficile, usa il tasto <b>"RIPROVA PIÙ TARDI"</b> per saltarlo e procedere oltre: potrai affrontarlo di nuovo quando vorrai!
                    </p>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 2rem;">
                    <div style="background: #e8f5e9; padding: 1.5rem; border-radius: 20px; border-top: 5px solid #2e7d32;">
                        <h4 style="color: #2e7d32; margin-bottom: 0.8rem; font-size: 1.2rem;">🎓 Per gli Studenti</h4>
                        <p style="font-size: 0.95rem; line-height: 1.6;">
                            • <b>Accesso Semplice</b>: Entra con il codice fornito dal tuo docente (es. ALFA24). Nessuna email richiesta.<br>
                            • <b>Vocabolario Personale</b>: Clicca sulle parole difficili e aggiungile al tuo dizionario.<br>
                            • <b>Gamification</b>: Scegli il tuo avatar e guarda crescere i tuoi punti XP allenamento dopo allenamento.
                        </p>
                    </div>
                    <div style="background: #e3f2fd; padding: 1.5rem; border-radius: 20px; border-top: 5px solid #1565c0;">
                        <h4 style="color: #1565c0; margin-bottom: 0.8rem; font-size: 1.2rem;">👨‍🏫 Per i Docenti</h4>
                        <p style="font-size: 0.95rem; line-height: 1.6;">
                            • <b>Classi Digitali</b>: Accedi con Google, crea la tua classe e genera un <b>Codice Univoco</b>.<br>
                            • <b>Distribuzione Rapida</b>: Condividi il codice con gli studenti per collegarli istantaneamente al tuo profilo.<br>
                            • <b>Monitoraggio</b>: Visualizza i progressi della classe e scopri quali argomenti richiedono più ripasso.<br>
                            • <b>Gestione Flessibile</b>: Sposta gli studenti tra le tue classi, modificale o rimuovile in ogni momento.<br>
                            • <b>Assegnazione Diretta</b>: Assegna qualsiasi esercizio alle tue classi o condividilo su <b>Google Classroom</b> con un click.
                        </p>
                    </div>
                </div>

                <div style="background: #fff5f5; padding: 2rem; border-radius: 20px; border: 1px solid #ffcdd2; margin-bottom: 2rem;">
                    <h4 style="color: #c62828; margin-bottom: 1rem; font-size: 1.3rem;">🚀 Guida Rapida al Setup</h4>
                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; text-align: center;">
                        <div>
                            <div style="font-size: 2rem; margin-bottom: 0.5rem;">1️⃣</div>
                            <h5 style="margin-bottom: 0.5rem;">CONFIGURA</h5>
                            <p style="font-size: 0.85rem; opacity: 0.8;">Accedi come Docente e crea la tua prima classe.</p>
                        </div>
                        <div>
                            <div style="font-size: 2rem; margin-bottom: 0.5rem;">2️⃣</div>
                            <h5 style="margin-bottom: 0.5rem;">CONDIVIDI</h5>
                            <p style="font-size: 0.85rem; opacity: 0.8;">Dai il Codice Classe ai tuoi studenti.</p>
                        </div>
                        <div>
                            <div style="font-size: 2rem; margin-bottom: 0.5rem;">3️⃣</div>
                            <h5 style="margin-bottom: 0.5rem;">ALLENA</h5>
                            <p style="font-size: 0.85rem; opacity: 0.8;">Guarda i risultati apparire nella tua dashboard.</p>
                        </div>
                    </div>
                </div>

                <p style="text-align: center; font-style: italic; color: #777; margin-top: 2rem;">
                    "La scuola deve restare fedele ai suoi valori, ma aperta al cambiamento. 
                    Il cuore e la passione educativa sono assolutamente umani!" 😊
                </p>

                <div style="text-align: center; margin-top: 4rem; padding-top: 2rem; border-top: 1px solid #eee;">
                    <img src="assets/avatar.png" alt="Logo Progetto" style="width: 120px; opacity: 0.9; background: transparent;">
                </div>
            </div>
        </div>
    `;
    window.currentSection = 'intro';
    if (typeof updateSidebarMenu === 'function') updateSidebarMenu();
}

function renderContattiPage() {
    const appContainer = document.getElementById('app');
    appContainer.innerHTML = `
        <div class="contact-card-wrapper">
            <!-- Lato Sinistro: Informazioni -->
            <div class="contact-info-side">
                <div>
                    <h2>Mettiamoci in contatto</h2>
                    <p>Hai domande, vuoi provare un gioco nella tua classe o proporre una collaborazione? Scrivimi!</p>
                </div>
                
                <div class="contact-method">
                    <div class="contact-method-icon">✉️</div>
                    <span>prof.memmo@gmail.com</span>
                </div>

                <div class="info-card-box">
                    <div class="info-card-icon">📦</div>
                    <div class="info-card-text">
                        <h4>Vuoi un gioco o un materiale?</h4>
                        <p>Puoi richiedere giochi specifici o materiali didattici direttamente tramite questo modulo. Descrivimi cosa stai cercando e ti risponderò al più presto!</p>
                    </div>
                </div>
            </div>

            <!-- Lato Destro: Modulo -->
            <div class="contact-form-side">
                <div class="form-group-contact">
                    <label for="contact-name">Nome</label>
                    <input type="text" id="contact-name" placeholder="Il tuo nome">
                </div>
                
                <div class="form-group-contact">
                    <label for="contact-email">Email</label>
                    <input type="email" id="contact-email" placeholder="La tua email">
                </div>

                <div class="form-group-contact">
                    <label for="contact-message">Messaggio</label>
                    <textarea id="contact-message" placeholder="Come posso aiutarti?"></textarea>
                </div>

                <div class="contact-legal">
                    <input type="checkbox" id="contact-check">
                    <label for="contact-check">
                        Ho almeno 16 anni o sono sotto la supervisione di un adulto. 
                        Accetto la <a href="javascript:void(0)" onclick="showLegal('privacy')">Privacy Policy</a> e i <a href="javascript:void(0)" onclick="showLegal('terms')">Termini e Condizioni</a>.
                    </label>
                </div>

                <button class="btn-contact-submit" onclick="handleContactSubmit()">Invia Messaggio</button>
            </div>
        </div>
    `;
    currentSection = 'contatti';
}

window.handleContactSubmit = function() {
    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const message = document.getElementById('contact-message').value.trim();
    const check = document.getElementById('contact-check').checked;

    if (!name || !email || !message) {
        alert("Per favore, compila tutti i campi obbligatori.");
        return;
    }

    if (!check) {
        alert("Devi accettare la Privacy Policy e i Termini per inviare il messaggio.");
        return;
    }

    // Simulazione invio
    const btn = document.querySelector('.btn-contact-submit');
    const originalText = btn.innerText;
    btn.innerText = "Invio in corso...";
    btn.disabled = true;

    setTimeout(() => {
        UI.showFeedback(true, {
            map: "Messaggio inviato con successo!",
            reasoning: "Grazie per avermi contattato. Ti risponderò il prima possibile all'indirizzo email fornito.",
            example: "Puoi continuare ad allenarti nella Palestra mentre aspetti la mia risposta!"
        }, () => {
            navigateTo('home');
        });
        
        btn.innerText = originalText;
        btn.disabled = false;
    }, 1500);
};


async function renderProfiloPage() {
    const appContainer = document.getElementById('app');
    const user = Auth.getUser();
    const vocabulary = JSON.parse(localStorage.getItem('palestra_vocab') || '[]');
    const history = JSON.parse(localStorage.getItem('palestra_history') || '[]');
    let classes = JSON.parse(localStorage.getItem('palestra_classes') || '[]');
    
    // Se docente, sincronizziamo le classi dal database
    if (user.role === 'docente' && !user.isGuest && window.fbDb) {
        try {
            // Recupera sia le classi con il vecchio formato (teacherId string) 
            // che quelle nuove (teacherIds array)
            const classesSnapshot = await window.fbDb.collection('classes').where('teacherIds', 'array-contains', user.uid).get();
            const legacySnapshot = await window.fbDb.collection('classes').where('teacherId', '==', user.uid).get();
            
            const firestoreClasses = [];
            classesSnapshot.forEach(doc => {
                firestoreClasses.push({ id: doc.id, ...doc.data() });
            });
            
            legacySnapshot.forEach(doc => {
                if (!firestoreClasses.find(c => c.id === doc.id)) {
                    firestoreClasses.push({ id: doc.id, ...doc.data() });
                }
            });
            
            // Merge e Aggiornamento: aggiorna le classi locali con i dati freschi di Firestore
            firestoreClasses.forEach(fc => {
                const localIdx = classes.findIndex(lc => lc.id === fc.id || lc.code === fc.code);
                if (localIdx !== -1) {
                    // Aggiorna la classe esistente (importante per nuovi teacherIds)
                    classes[localIdx] = { ...classes[localIdx], ...fc };
                } else {
                    // Aggiunge la nuova classe
                    classes.push(fc);
                }
            });
            
            // De-duplica e pulisci
            classes = classes.filter((c, index, self) =>
                index === self.findIndex(t => t.code === c.code)
            );
            
            localStorage.setItem('palestra_classes', JSON.stringify(classes));

            // Recupero nomi dei docenti per la visualizzazione
            const allTeacherIds = new Set();
            classes.forEach(c => {
                if (c.teacherIds && Array.isArray(c.teacherIds)) {
                    c.teacherIds.forEach(tid => allTeacherIds.add(tid));
                }
                if (c.teacherId) allTeacherIds.add(c.teacherId);
            });

            if (allTeacherIds.size > 0) {
                const teacherIdsArr = Array.from(allTeacherIds);
                const teacherMap = window._teacherNames || {};
                
                // Firestore limit di 10 per query 'in'
                try {
                    const teacherDocs = await window.fbDb.collection('users')
                        .where(window.firebase.firestore.FieldPath.documentId(), 'in', teacherIdsArr.slice(0, 10))
                        .get();
                    
                    teacherDocs.forEach(tdoc => {
                        teacherMap[tdoc.id] = tdoc.data().name || 'Docente';
                    });
                    window._teacherNames = teacherMap;
                } catch (err) {
                    console.warn("Errore recupero nomi docenti:", err);
                }
            }
        } catch (e) {
            console.error("Errore sincronizzazione classi:", e);
        }
    }
    const assignments = JSON.parse(localStorage.getItem('palestra_assignments') || '[]');
    const studentClassCode = localStorage.getItem('palestra_student_class_code') || null;

    // Calculate rank and precision
    let rank = "Cadetto";
    let completedCount = window.Progress.getCompletedCount();
    let points = window.Progress.getPoints();
    
    // Calculate precision
    let precision = 0;
    let totalEx = parseInt(localStorage.getItem('user_total_exercises_attempted') || '0');
    let correctEx = parseInt(localStorage.getItem('user_correct_exercises') || '0');
    if (totalEx > 0) {
        precision = Math.round((correctEx / totalEx) * 100);
    }
    if (points > 1000) rank = "Maestro";
    else if (points > 500) rank = "Veterano";
    else if (points > 100) rank = "Esploratore";

    const isImage = user.avatar.includes('/') || user.avatar.includes('.');
    const avatarHtml = isImage ? `<img src="${user.avatar}" alt="Avatar" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">` : `<span>${user.avatar}</span>`;

    appContainer.innerHTML = `
        <div class="exercise-container">
            <h2 class="exercise-title">👤 IL TUO PROFILO</h2>
            
            <div class="profile-header">
                <div class="profile-avatar-large">
                    ${avatarHtml}
                </div>
                <div>
                    <h3 style="font-size: 1.8rem; font-weight: 800;">${user.name}</h3>
                    <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
                        <p style="background: var(--primary-color); color: white; padding: 0.3rem 1rem; border-radius: 20px; font-size: 0.9rem; font-weight: 700;">${rank}</p>
                        <p style="background: #f1f2f6; color: #57606f; padding: 0.3rem 1rem; border-radius: 20px; font-size: 0.9rem; font-weight: 700;">${(user.roleLabel || user.role || 'studente').toUpperCase()}</p>
                    </div>
                    ${user.isGuest ? `<p style="color: #ffa502; font-size: 0.8rem; margin-top: 0.5rem; font-weight: 700;">📍 PROFILO LOCALE (I dati sono salvati solo su questo dispositivo)</p>` : ''}
                </div>
                <div style="margin-left: auto; display: flex; flex-direction: column; gap: 0.5rem;">
                    <button class="btn" onclick="showEditProfileModal()" style="background: rgba(52, 152, 219, 0.1); color: #3498db; border: 1px solid #3498db; padding: 0.5rem 1rem; border-radius: 50px; font-weight: 700; cursor: pointer;">✏️ Modifica</button>
                    <button class="btn btn-secondary" onclick="Auth.logout()" style="color: #e74c3c; border-color: #fceaea; padding: 0.5rem 1rem;">Esci</button>
                </div>
            </div>

            ${user.email === 'prof.memmo@gmail.com' ? `
                <div style="margin-top: 3rem; margin-bottom: 3rem; padding: 2.5rem; background: #fff5f5; border-radius: 40px; border: 2px solid #feb2b2; box-shadow: 0 10px 30px rgba(231, 76, 60, 0.05);">
                    <h3 style="color: #c53030; margin-bottom: 2rem; display: flex; align-items: center; gap: 0.8rem; font-weight: 900; font-size: 1.6rem;">🛡️ DASHBOARD AMMINISTRATORE</h3>
                    <p style="margin-bottom: 2rem; color: #742a2a; font-weight: 500;">Benvenuto, Amministratore. Qui puoi monitorare e gestire tutti gli iscritti alla Palestra.</p>
                    
                    <div id="admin-users-list" style="display: flex; flex-direction: column; gap: 1rem;">
                        <div style="text-align: center; padding: 2rem;">
                            <div class="spinner"></div>
                            <p>Caricamento utenti...</p>
                        </div>
                    </div>
                </div>
            ` : ''}

            ${user.role === 'docente' ? `
                <div class="teacher-area" style="margin-bottom: 3rem; padding: 2rem; background: #f0f7ff; border-radius: 30px; border: 2px dashed #3498db;">
                    <h3 style="color: #2980b9; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.8rem;">
                        👨‍🏫 AREA CLASSI
                        <span onclick="window.showTeacherGuide()" title="Clicca per la Guida Docente" style="background: white; color: #3498db; width: 22px; height: 22px; display: inline-flex; align-items: center; justify-content: center; border-radius: 50%; font-size: 0.75rem; cursor: pointer; border: 2px solid #3498db; font-weight: 900; font-family: serif; font-style: italic; transition: all 0.2s; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">i</span>
                    </h3>
                    

                    
                    <div style="display: grid; grid-template-columns: 1fr; gap: 2rem; max-width: 600px; margin: 0 auto;">
                        <!-- Gestione Classi -->
                        <div class="profile-card">
                            <h4 class="profile-card-title">📁 LE MIE CLASSI</h4>
                            
                            <div style="margin-bottom: 1rem; position: relative;">
                                <input type="text" id="teacher-class-filter" placeholder="🔍 Filtra per docente o classe..." 
                                    oninput="window.filterTeacherClasses(this.value)"
                                    style="width: 100%; padding: 0.8rem 1rem 0.8rem 2.5rem; border-radius: 12px; border: 1px solid #ddd; font-size: 0.85rem; border-color: #3498db44;">
                                <i style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: #3498db; font-style: normal; font-size: 0.9rem;">🔍</i>
                            </div>

                            <div id="classes-list" style="margin-bottom: 1rem;">
                                ${classes.length > 0 ? classes.map((c, idx) => {
                                    const teacherNames = [];
                                    const rawTeacherNames = []; // Per il filtro
                                    if (c.teacherIds) {
                                        c.teacherIds.forEach(tid => {
                                            const name = window._teacherNames && window._teacherNames[tid] ? window._teacherNames[tid] : 'Docente';
                                            rawTeacherNames.push(name);
                                            if (tid === user.uid) teacherNames.push('<b>Tu</b>');
                                            else teacherNames.push(name);
                                        });
                                    } else if (c.teacherId) {
                                        const name = window._teacherNames && window._teacherNames[c.teacherId] ? window._teacherNames[c.teacherId] : 'Docente';
                                        rawTeacherNames.push(name);
                                        if (c.teacherId === user.uid) teacherNames.push('<b>Tu</b>');
                                        else teacherNames.push(name);
                                    }
                                    
                                    const teachersHtml = teacherNames.length > 0 ? `<div style="font-size: 0.7rem; color: #7f8c8d; margin-top: 0.3rem; display: flex; align-items: center; gap: 0.3rem;"><span>👨‍🏫</span> ${teacherNames.join(', ')}</div>` : '';

                                    return `
                                    <div class="teacher-class-item" data-teachers="${rawTeacherNames.join(' ').toLowerCase()}" data-classname="${c.name.toLowerCase()}" style="display: flex; justify-content: space-between; align-items: center; padding: 0.8rem; background: white; border-radius: 12px; margin-bottom: 0.5rem; border: 1px solid #e0e0e0;">
                                        <div>
                                            <span style="font-weight: 800;">Classe ${c.name}</span>
                                            ${c.school ? `<span style="color: #7f8c8d; font-size: 0.75rem; margin-left: 0.5rem;">${c.school}${c.city ? ', ' + c.city : ''}</span>` : ''}
                                            ${teachersHtml}
                                            <div style="font-size: 0.7rem; color: var(--primary-color); font-weight: 800; cursor: pointer; margin-top: 0.2rem;" onclick="navigator.clipboard.writeText('${c.code}'); alert('Codice copiato!')">
                                                CODICE: ${c.code} 📋 <span style="color: #7f8c8d; font-weight: 400; margin-left: 0.5rem; font-style: italic;">(condividi il codice con la classe)</span>
                                            </div>
                                            <div style="margin-top: 0.5rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
                                                <button onclick="window.viewClassStudents('${c.code}', '${c.name.replace(/'/g, "\\'")}', '${c.id}')" style="background: #eef2f7; border: none; color: #57606f; padding: 0.3rem 0.6rem; border-radius: 8px; font-size: 0.7rem; font-weight: 700; cursor: pointer;">👥 STUDENTI</button>
                                                <button onclick="window.viewClassTeachers('${c.id}', '${c.name.replace(/'/g, "\\'")}', '${c.code}')" style="background: #eef2f7; border: none; color: #3498db; padding: 0.3rem 0.6rem; border-radius: 8px; font-size: 0.7rem; font-weight: 700; cursor: pointer;">👨‍🏫 DOCENTI</button>
                                                <button onclick="window.editTeacherClass('${c.id}', '${c.name.replace(/'/g, "\\'")}', '${(c.school || '').replace(/'/g, "\\'")}', '${(c.city || '').replace(/'/g, "\\'")}')" style="background: #eef2f7; border: none; color: #2980b9; padding: 0.3rem 0.6rem; border-radius: 8px; font-size: 0.7rem; font-weight: 700; cursor: pointer;">✏️ MODIFICA</button>
                                                <button onclick="window.removeTeacherClass(${idx})" style="background: #fceaea; border: none; color: #e74c3c; padding: 0.3rem 0.6rem; border-radius: 8px; font-size: 0.7rem; font-weight: 700; cursor: pointer;">🗑️ ELIMINA</button>
                                            </div>
                                        </div>
                                    </div>
                                `;}).join('') : '<p style="color: #888; font-size: 0.9rem;">Non hai ancora creato nessuna classe.</p>'}
                            </div>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-bottom: 0.5rem;">
                                <input type="text" id="new-class-school" placeholder="Istituto (es: I.C. Manzoni)" style="padding: 0.7rem; border-radius: 10px; border: 1px solid #ddd; font-size: 0.85rem;">
                                <input type="text" id="new-class-city" placeholder="Città (es: Roma)" style="padding: 0.7rem; border-radius: 10px; border: 1px solid #ddd; font-size: 0.85rem;">
                            </div>
                            <div style="display: flex; gap: 0.5rem;">
                                <input type="text" id="new-class-name" placeholder="Classe (es: 3D)" style="flex: 1; padding: 0.8rem; border-radius: 10px; border: 1px solid #ddd;">
                                <button class="btn btn-primary" onclick="window.addTeacherClass()" style="padding: 0.8rem 1.2rem;">CREA</button>
                            </div>
                            <div style="display: flex; gap: 0.5rem; margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #eee;">
                                <input type="text" id="recover-class-code" placeholder="Recupera con Codice (es: PG-MCC5)" style="flex: 1; padding: 0.8rem; border-radius: 10px; border: 1px solid #ddd; font-family: monospace; font-size: 0.8rem;">
                                <button class="btn" onclick="window.recoverTeacherClass()" style="padding: 0.8rem 1.2rem; background: #f1f2f6; color: #57606f; border: none; border-radius: 10px; font-weight: 700; cursor: pointer; font-size: 0.8rem;">RECUPERA</button>
                            </div>
                        </div>
                    </div>

                    <!-- Card Registro Permanente -->
                    <div class="profile-card" style="margin-top: 2rem; max-width: 800px; margin-left: auto; margin-right: auto;">
                        <h4 class="profile-card-title">📊 REGISTRO PROGRESSI</h4>
                        <div id="class-register-content">
                            <p style="color: #888; font-size: 0.9rem; text-align: center; padding: 2rem;">
                                Crea una classe in <b>Area Classi</b> oppure clicca sul tasto <b>👥 STUDENTI</b> di una classe per visualizzare qui il registro dei punteggi e delle attività completate.
                            </p>
                        </div>
                    </div>
                </div>
            ` : ''}

            ${user.role === 'studente' ? `
                <div class="student-area" style="margin-bottom: 3rem;">
                    <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 2rem;">
                        <div class="profile-card">
                            <h4 class="profile-card-title">🏫 LA MIA CLASSE</h4>
                            ${studentClassCode ? `
                                <div style="text-align: center; padding: 1rem; background: #f0f7ff; border-radius: 15px; border: 2px solid var(--primary-color);">
                                    <div style="font-size: 0.8rem; color: var(--primary-color); font-weight: 800; margin-bottom: 0.3rem;">CODICE CLASSE ATTIVO</div>
                                    <div style="font-size: 2rem; font-weight: 900; color: var(--primary-color);">${studentClassCode}</div>
                                    <button onclick="window.leaveClass()" style="margin-top: 1rem; background: none; border: none; color: #888; text-decoration: underline; cursor: pointer; font-size: 0.8rem;">Esci dalla classe</button>
                                </div>
                            ` : `
                                <p style="font-size: 0.85rem; color: #666; margin-bottom: 1rem;">Inserisci il <b>codice classe</b> per vedere i compiti.</p>
                                <div style="display: flex; gap: 0.5rem;">
                                    <input type="text" id="join-class-code" placeholder="Es: PG-XXXX" style="flex: 1; padding: 0.8rem; border-radius: 10px; border: 1px solid #ddd;">
                                    <button class="btn btn-primary" onclick="window.joinClass()" style="padding: 0.8rem 1.2rem;">ENTRA</button>
                                </div>
                            `}
                        </div>

                        <div class="profile-card">
                            <h4 class="profile-card-title">📔 LE MIE ATTIVITÀ</h4>
                            <div id="assignments-list">
                                ${myAssignments.length > 0 ? myAssignments.map(a => {
                                    const isCompleted = window.Progress.isExerciseCompleted(a.topic);
                                    return `
                                        <div onclick="window.location.hash='${a.topic}'" style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: white; border-radius: 15px; margin-bottom: 0.8rem; border: 1px solid #eee; cursor: pointer; transition: all 0.2s;">
                                            <div>
                                                <div style="font-weight: 800; color: #2c3e50;">${a.topic.split('/').map(p => p.replace('_', ' ').toUpperCase()).join(' > ')}</div>
                                                <div style="font-size: 0.75rem; color: #888;">Assegnato il ${new Date(a.date).toLocaleDateString()}</div>
                                            </div>
                                            <div style="padding: 0.4rem 0.8rem; border-radius: 20px; font-size: 0.75rem; font-weight: 800; ${isCompleted ? 'background: #e8f5e9; color: #2e7d32;' : 'background: #fff3e0; color: #ef6c00;'}">
                                                ${isCompleted ? '✅ COMPLETATO' : '⏳ DA FARE'}
                                            </div>
                                        </div>
                                    `;
                                }).join('') : '<p style="color: #888; font-size: 0.9rem; text-align: center; padding: 2rem;">Nessuna attività assegnata per ora. Buon riposo!</p>'}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon">⭐</div>
                        <div class="stat-content">
                            <div class="stat-label">PUNTI XP</div>
                            <div class="stat-value">${points}</div>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">✅</div>
                        <div class="stat-content">
                            <div class="stat-label">COMPLETATI</div>
                            <div class="stat-value">${completedCount}</div>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">🎯</div>
                        <div class="stat-content">
                            <div class="stat-label">PRECISIONE</div>
                            <div class="stat-value">${precision}%</div>
                        </div>
                    </div>
                </div>

                <div class="profile-sections">
                    <div class="profile-card">
                        <h4 class="profile-card-title">📖 IL MIO VOCABOLARIO</h4>
                        ${vocabulary.length > 0 ? `
                            <p style="color: #666; margin-bottom: 1.5rem;">Hai salvato <b>${vocabulary.length}</b> parole durante le tue letture.</p>
                            <button class="btn btn-primary" onclick="renderVocabularyPage()" style="width: 100%; background: #ff7f7f; border-color: #ff7f7f;">APRI DIZIONARIO COMPLETO</button>
                        ` : `
                            <p style="color: #888; font-style: italic; text-align: center; padding: 2rem;">Nessuna parola salvata ancora.</p>
                            <button class="btn btn-primary" onclick="renderVocabularyPage()" style="width: 100%; background: #ff7f7f; border-color: #ff7f7f;">APRI DIZIONARIO COMPLETO</button>
                        `}
                    </div>

                    <div class="profile-card">
                        <h4 class="profile-card-title">🕒 ATTIVITÀ RECENTE</h4>
                        <div class="history-list">
                            ${history.length > 0 ? history.map(item => `
                                <div class="history-item" onclick="window.location.hash='${item.hash.substring(1)}'">
                                    <div class="history-icon">${item.icon}</div>
                                    <div class="history-details">
                                        <div class="history-name">${item.title}</div>
                                        <div class="history-date">${item.date}</div>
                                    </div>
                                </div>
                            `).join('') : '<p style="color: #888; font-style: italic; text-align: center; padding: 2rem;">Inizia un esercizio per vederlo qui!</p>'}
                        </div>
                    </div>
                </div>
            ` : ''}
        </div>
    `;
    window.currentSection = 'profilo';
    if (user.email === 'prof.memmo@gmail.com') {
        loadAdminUsersInProfile();
    }
    if (typeof updateSidebarMenu === 'function') updateSidebarMenu();
}

async function loadAdminUsersInProfile() {
    if (!window.fbDb) return;
    const container = document.getElementById('admin-users-list');
    if (!container) return;

    try {
        const [usersSnapshot, progressSnapshot, classesSnapshot] = await Promise.all([
            window.fbDb.collection('users').get(),
            window.fbDb.collection('progress').get(),
            window.fbDb.collection('classes').get()
        ]);
        
        const progressMap = {};
        progressSnapshot.forEach(doc => { progressMap[doc.id] = doc.data(); });

        const schoolsMap = {}; 
        const citiesMap = {};  
        const allClasses = [];
        
        // 1. Mappiamo le classi e iniziamo a riempire scuole/città dalle classi
        classesSnapshot.forEach(doc => { 
            const d = doc.data();
            allClasses.push({ id: doc.id, ...d });
            if (d.school) {
                if (!schoolsMap[d.school]) schoolsMap[d.school] = { classCount: 0, studentCount: 0 };
                schoolsMap[d.school].classCount++;
            }
            if (d.city) {
                if (!citiesMap[d.city]) citiesMap[d.city] = { userCount: 0 };
                citiesMap[d.city].userCount++;
            }
        });
        window.allClassesForAdmin = allClasses;

        // 2. Processiamo gli utenti e integriamo i conteggi (con ereditarietà)
        const allUsers = [];
        usersSnapshot.forEach(doc => {
            const u = doc.data();
            const userData = { id: doc.id, ...u, _progress: progressMap[doc.id] || {} };
            allUsers.push(userData);

            let uSchool = u.school;
            let uCity = u.city;

            // Inheritance: se manca nel profilo, prendi dalla classe
            if (!uSchool && u.classId) {
                const c = allClasses.find(cls => cls.id === u.classId);
                if (c) { uSchool = c.school; uCity = uCity || c.city; }
            }

            if (uSchool) {
                if (!schoolsMap[uSchool]) schoolsMap[uSchool] = { classCount: 0, studentCount: 0 };
                schoolsMap[uSchool].studentCount++;
            }
            if (uCity) {
                if (!citiesMap[uCity]) citiesMap[uCity] = { userCount: 0 };
                citiesMap[uCity].userCount++;
            }
        });

        const counts = { 
            tutti: allUsers.length, 
            docente: allUsers.filter(u => u.role === 'docente').length, 
            studente: allUsers.filter(u => u.role === 'studente' || u.role === 'admin').length, 
            amico: allUsers.filter(u => u.role === 'amico' || u.role === 'guest').length,
            classi: allClasses.length,
            scuole: Object.keys(schoolsMap).length,
            citta: Object.keys(citiesMap).length
        };

        window.adminData = {
            users: allUsers,
            classes: allClasses,
            schools: Object.keys(schoolsMap).map(name => ({ name, ...schoolsMap[name] })),
            cities: Object.keys(citiesMap).map(name => ({ name, ...citiesMap[name] }))
        };

        container.innerHTML = `
            <!-- Clickable Stats Bar -->
            <div id="admin-stats-filters" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(110px, 1fr)); gap: 1rem; margin-bottom: 2.5rem;">
                <div class="admin-stat-card active" onclick="window.setActiveAdminFilter('tutti')" data-filter="tutti" style="background: white; padding: 1.2rem; border-radius: 20px; text-align: center; border: 2px solid var(--primary-color); cursor: pointer; transition: all 0.2s; box-shadow: 0 10px 20px rgba(0,0,0,0.02);">
                    <div style="font-size: 1.6rem; font-weight: 900; color: var(--primary-color);">${counts.tutti}</div>
                    <div style="font-size: 0.75rem; color: #888; font-weight: 800; text-transform: uppercase;">Tutti</div>
                </div>
                <div class="admin-stat-card" onclick="window.setActiveAdminFilter('docente')" data-filter="docente" style="background: white; padding: 1.2rem; border-radius: 20px; text-align: center; border: 2px solid transparent; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 10px rgba(0,0,0,0.02);">
                    <div style="font-size: 1.6rem; font-weight: 900; color: #2980b9;">${counts.docente}</div>
                    <div style="font-size: 0.75rem; color: #888; font-weight: 800; text-transform: uppercase;">Docenti</div>
                </div>
                <div class="admin-stat-card" onclick="window.setActiveAdminFilter('studente')" data-filter="studente" style="background: white; padding: 1.2rem; border-radius: 20px; text-align: center; border: 2px solid transparent; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 10px rgba(0,0,0,0.02);">
                    <div style="font-size: 1.6rem; font-weight: 900; color: #27ae60;">${counts.studente}</div>
                    <div style="font-size: 0.75rem; color: #888; font-weight: 800; text-transform: uppercase;">Studenti</div>
                </div>
                <div class="admin-stat-card" onclick="window.setActiveAdminFilter('amico')" data-filter="amico" style="background: white; padding: 1.2rem; border-radius: 20px; text-align: center; border: 2px solid transparent; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 10px rgba(0,0,0,0.02);">
                    <div style="font-size: 1.6rem; font-weight: 900; color: #8e44ad;">${counts.amico}</div>
                    <div style="font-size: 0.75rem; color: #888; font-weight: 800; text-transform: uppercase;">Amici</div>
                </div>
                <div class="admin-stat-card" onclick="window.setActiveAdminFilter('classi')" data-filter="classi" style="background: white; padding: 1.2rem; border-radius: 20px; text-align: center; border: 2px solid transparent; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 10px rgba(0,0,0,0.02);">
                    <div style="font-size: 1.6rem; font-weight: 900; color: #e67e22;">${counts.classi}</div>
                    <div style="font-size: 0.75rem; color: #888; font-weight: 800; text-transform: uppercase;">Classi</div>
                </div>
                <div class="admin-stat-card" onclick="window.setActiveAdminFilter('scuole')" data-filter="scuole" style="background: white; padding: 1.2rem; border-radius: 20px; text-align: center; border: 2px solid transparent; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 10px rgba(0,0,0,0.02);">
                    <div style="font-size: 1.6rem; font-weight: 900; color: #2c3e50;">${counts.scuole}</div>
                    <div style="font-size: 0.75rem; color: #888; font-weight: 800; text-transform: uppercase;">Scuole</div>
                </div>
                <div class="admin-stat-card" onclick="window.setActiveAdminFilter('citta')" data-filter="citta" style="background: white; padding: 1.2rem; border-radius: 20px; text-align: center; border: 2px solid transparent; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 10px rgba(0,0,0,0.02);">
                    <div style="font-size: 1.6rem; font-weight: 900; color: #7f8c8d;">${counts.citta}</div>
                    <div style="font-size: 0.75rem; color: #888; font-weight: 800; text-transform: uppercase;">Città</div>
                </div>
            </div>

            <!-- Search Bar -->
            <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 25px; margin-bottom: 2rem;">
                <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                    <input type="text" id="admin-search-input" oninput="window.filterAdminEntities()" placeholder="Cerca in questo elenco..." style="flex: 1; min-width: 250px; padding: 1.1rem 1.5rem; border-radius: 50px; border: 2px solid #eee; outline: none; font-size: 1rem; transition: all 0.3s;">
                </div>

                <!-- Admin Management Bar -->
                <div id="admin-management-bar" style="margin-top: 1rem; background: #fff9f0; padding: 1rem; border-radius: 20px; border: 1px solid #ffeaa7; display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; display: none;">
                    <span style="font-weight: 800; font-size: 0.8rem; color: #d35400;">GESTIONE SELEZIONATI:</span>
                    <select id="admin-move-destination" style="padding: 0.6rem; border-radius: 12px; border: 1px solid #ddd; font-size: 0.9rem; outline: none;">
                        <option value="">Sposta in classe...</option>
                        ${allClasses.sort((a,b) => a.name.localeCompare(b.name)).map(c => `<option value="${c.id}">${c.name} (${c.code})</option>`).join('')}
                    </select>
                    <button onclick="window.adminActionOnSelected('move')" style="background: #e67e22; color: white; border: none; padding: 0.6rem 1.5rem; border-radius: 12px; font-weight: 800; cursor: pointer; transition: all 0.2s;">SPOSTA</button>
                    <button onclick="window.adminActionOnSelected('delete')" style="background: #e74c3c; color: white; border: none; padding: 0.6rem 1.5rem; border-radius: 12px; font-weight: 800; cursor: pointer; transition: all 0.2s;">ELIMINA DALLA CLASSE</button>
                </div>
            </div>

            <div id="admin-entities-list" style="display: flex; flex-direction: column; gap: 1rem;">
                <!-- Content injected by filterAdminEntities -->
            </div>
        `;
        
        window.currentAdminFilter = 'tutti';
        window.filterAdminEntities();

    } catch (e) {
        console.error("Errore recupero utenti admin in profilo:", e);
        container.innerHTML = `<p style="color: #e74c3c;">Errore nel caricamento dei dati: ${e.message}</p>`;
    }
}

window.setActiveAdminFilter = function(filter) {
    document.querySelectorAll('.admin-stat-card').forEach(card => {
        const isActive = card.dataset.filter === filter;
        card.classList.toggle('active', isActive);
        card.style.border = isActive ? `2px solid ${card.querySelector('div').style.color}` : '2px solid transparent';
        card.style.boxShadow = isActive ? '0 10px 25px rgba(0,0,0,0.08)' : '0 4px 10px rgba(0,0,0,0.02)';
    });
    window.currentAdminFilter = filter;
    window.filterAdminEntities();
};

window.filterAdminEntities = function() {
    const search = (document.getElementById('admin-search-input')?.value || '').toLowerCase();
    const filter = window.currentAdminFilter || 'tutti';
    const container = document.getElementById('admin-entities-list');
    if (!container || !window.adminData) return;

    let html = '';
    if (['tutti', 'docente', 'studente', 'amico'].includes(filter)) {
        const filtered = window.adminData.users.filter(u => {
            const matchesSearch = !search || (u.name || '').toLowerCase().includes(search) || (u.email || '').toLowerCase().includes(search) || (u.school || '').toLowerCase().includes(search) || (u.className || '').toLowerCase().includes(search);
            let matchesFilter = filter === 'tutti';
            if (filter === 'docente' && u.role === 'docente') matchesFilter = true;
            if (filter === 'studente' && (u.role === 'studente' || u.role === 'admin')) matchesFilter = true;
            if (filter === 'amico' && (u.role === 'amico' || u.role === 'guest')) matchesFilter = true;
            return matchesSearch && matchesFilter;
        });
        html = filtered.map(u => renderAdminUserRow(u)).join('');
    } 
    else if (filter === 'classi') {
        const filtered = window.adminData.classes.filter(c => !search || (c.name || '').toLowerCase().includes(search) || (c.code || '').toLowerCase().includes(search) || (c.school || '').toLowerCase().includes(search));
        html = filtered.map(c => `
            <div class="admin-user-row" style="display: flex; align-items: center; gap: 1.5rem; padding: 1.5rem; background: white; border-radius: 20px; border: 1px solid #eee;">
                <div style="font-size: 2rem;">📁</div>
                <div style="flex: 1;">
                    <h4 style="margin: 0; font-weight: 800;">${c.name} <span style="color: #999; font-weight: 400; font-size: 0.8rem;">(${c.code})</span></h4>
                    <p style="margin: 0; font-size: 0.85rem; color: #666;">${c.school ? `🏫 ${c.school}` : 'Nessuna scuola'} • ${c.city ? `📍 ${c.city}` : 'Nessuna città'}</p>
                </div>
                <div style="display: flex; gap: 0.5rem;">
                    <button class="btn" onclick="window.editTeacherClass('${c.id}', '${c.name}', '${c.school || ''}', '${c.city || ''}')" style="background: #f0f7ff; color: #3498db; border: none; padding: 0.6rem 1rem; border-radius: 12px; font-weight: 700;">MODIFICA</button>
                    <button class="btn" onclick="window.adminDeleteEntity('classes', '${c.id}', '${c.name}')" style="background: #fff0f0; color: #e74c3c; border: none; padding: 0.6rem 1rem; border-radius: 12px; font-weight: 700;">ELIMINA</button>
                </div>
            </div>
        `).join('');
    }
    else if (filter === 'scuole') {
        const filtered = window.adminData.schools.filter(s => !search || s.name.toLowerCase().includes(search));
        html = filtered.map(s => `
            <div class="admin-user-row" style="display: flex; align-items: center; gap: 1.5rem; padding: 1.5rem; background: white; border-radius: 20px; border: 1px solid #eee;">
                <div style="font-size: 2rem;">🏫</div>
                <div style="flex: 1;">
                    <h4 style="margin: 0; font-weight: 800;">${s.name}</h4>
                    <p style="margin: 0; font-size: 0.85rem; color: #666;">${s.classCount} Classi • ${s.studentCount} Utenti con questa scuola</p>
                </div>
                <div style="display: flex; gap: 0.5rem;">
                    <button class="btn" onclick="window.adminEditAttribute('school', '${s.name.replace(/'/g, "\\'")}')" style="background: #f0f7ff; color: #3498db; border: none; padding: 0.6rem 1rem; border-radius: 12px; font-weight: 700;">RINOMINA</button>
                </div>
            </div>
        `).join('');
    }
    else if (filter === 'citta') {
        const filtered = window.adminData.cities.filter(c => !search || c.name.toLowerCase().includes(search));
        html = filtered.map(c => `
            <div class="admin-user-row" style="display: flex; align-items: center; gap: 1.5rem; padding: 1.5rem; background: white; border-radius: 20px; border: 1px solid #eee;">
                <div style="font-size: 2rem;">📍</div>
                <div style="flex: 1;">
                    <h4 style="margin: 0; font-weight: 800;">${c.name}</h4>
                    <p style="margin: 0; font-size: 0.85rem; color: #666;">Presente in ${c.userCount} tra classi e profili</p>
                </div>
                <div style="display: flex; gap: 0.5rem;">
                    <button class="btn" onclick="window.adminEditAttribute('city', '${c.name.replace(/'/g, "\\'")}')" style="background: #f0f7ff; color: #3498db; border: none; padding: 0.6rem 1rem; border-radius: 12px; font-weight: 700;">RINOMINA</button>
                </div>
            </div>
        `).join('');
    }

    container.innerHTML = html || '<p style="text-align: center; color: #999; padding: 3rem;">Nessun risultato trovato per questa selezione.</p>';

    if (['tutti', 'docente', 'studente', 'amico'].includes(filter)) {
        document.querySelectorAll('.admin-student-checkbox').forEach(cb => {
            cb.addEventListener('change', () => {
                const selected = document.querySelectorAll('.admin-student-checkbox:checked').length;
                const mbar = document.getElementById('admin-management-bar');
                if (mbar) mbar.style.display = selected > 0 ? 'flex' : 'none';
            });
        });
    }
};

function renderAdminUserRow(userData) {
    const allClasses = window.adminData.classes || [];
    const userProgress = userData._progress || {};
    const isImage = userData.avatar && (userData.avatar.includes('/') || userData.avatar.includes('.'));
    const avatarHtml = isImage ? `<img src="${userData.avatar}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;">` : `<span style="font-size: 1.5rem;">${userData.avatar || '👤'}</span>`;
    const role = (userData.role || 'studente').toLowerCase();
    const roleColors = { docente: '#2980b9', amico: '#8e44ad', guest: '#8e44ad', studente: '#27ae60', admin: '#e74c3c' };
    const roleColor = roleColors[role] || '#27ae60';

    let classLabel = '';
    if (userData.classId) {
        const c = allClasses.find(cl => cl.id === userData.classId);
        classLabel = c ? `${c.name} (${c.code})` : userData.className || 'Classe N/D';
    }

    return `<div class="admin-user-row" style="display: flex; flex-wrap: wrap; align-items: center; gap: 1rem; padding: 1.2rem; background: white; border-radius: 20px; border: 1px solid #eee;">
        <div style="width: 40px; text-align: center;">
            ${role === 'studente' ? `<input type="checkbox" class="admin-student-checkbox" data-uid="${userData.id}" data-name="${userData.name}">` : ''}
        </div>
        <div style="width: 50px; height: 50px; background: #f8f9fa; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #eee; overflow: hidden; flex-shrink: 0;">
            ${avatarHtml}
        </div>
        <div style="flex: 1; min-width: 200px;">
            <h4 style="margin: 0; font-weight: 800;">${userData.name || 'Anonimo'}</h4>
            <p style="margin: 0; font-size: 0.85rem; color: #666;">${userData.email || 'No email'} • <span style="color: ${roleColor}; font-weight: 700;">${userData.roleLabel || userData.role || 'Studente'}</span></p>
            <p style="margin: 0; font-size: 0.75rem; color: #999;">${userData.school ? `🏫 ${userData.school} • ` : ''} ${classLabel ? `📁 ${classLabel} • ` : ''} Iscritto il: ${userData.joinedAt ? new Date(userData.joinedAt).toLocaleDateString() : 'N/D'}</p>
        </div>
        <div style="text-align: right; margin-right: 1rem;">
            <div style="font-weight: 800; color: var(--primary-color);">${userProgress.points || 0} XP</div>
        </div>
        <button onclick="adminDeleteUserInProfile('${userData.id}', '${(userData.name || 'Anonimo').replace(/'/g, "\\'")}')" style="background: #fff0f0; border: none; padding: 0.8rem; border-radius: 15px; cursor: pointer; color: #e74c3c;">🗑️</button>
    </div>`;
}

// AZIONI ADMIN PER ENTITÀ
window.adminDeleteEntity = async function(collection, id, name) {
    if (!confirm(`Sei sicuro di voler eliminare definitivamente ${name}?`)) return;
    try {
        await window.fbDb.collection(collection).doc(id).delete();
        alert("Eliminato con successo.");
        loadAdminUsersInProfile();
    } catch (e) { alert("Errore: " + e.message); }
};

window.adminEditAttribute = async function(type, oldValue) {
    const newValue = prompt(`Inserisci il nuovo nome per ${type === 'school' ? 'la scuola' : 'la città'} "${oldValue}":`, oldValue);
    if (!newValue || newValue === oldValue) return;

    try {
        const batch = window.fbDb.batch();
        const collection = type === 'school' ? 'classes' : 'users'; // Semplificazione per esempio
        
        // Cerca in classi
        const classQ = await window.fbDb.collection('classes').where(type, '==', oldValue).get();
        classQ.forEach(doc => batch.update(doc.ref, { [type]: newValue }));
        
        // Cerca in utenti
        const userQ = await window.fbDb.collection('users').where(type, '==', oldValue).get();
        userQ.forEach(doc => batch.update(doc.ref, { [type]: newValue }));

        await batch.commit();
        alert("Aggiornamento completato su tutti i record.");
        loadAdminUsersInProfile();
    } catch (e) { alert("Errore durante l'aggiornamento massivo: " + e.message); }
};



window.adminActionOnSelected = async function(action) {
    const selectedCbs = document.querySelectorAll('.admin-student-checkbox:checked');
    if (selectedCbs.length === 0) return;

    if (action === 'move') {
        const destClassId = document.getElementById('admin-move-destination').value;
        if (!destClassId) { alert("Seleziona una classe di destinazione."); return; }
        
        const destClass = window.allClassesForAdmin.find(c => c.id === destClassId);
        if (!destClass) return;

        if (!confirm(`Vuoi spostare ${selectedCbs.length} studenti nella classe ${destClass.name}?`)) return;

        try {
            const batch = window.fbDb.batch();
            selectedCbs.forEach(cb => {
                const uid = cb.dataset.uid;
                batch.update(window.fbDb.collection('users').doc(uid), {
                    classId: destClassId,
                    className: destClass.name,
                    teacherId: destClass.teacherId
                });
            });
            await batch.commit();
            alert("✅ Studenti spostati con successo!");
            loadAdminUsersInProfile();
        } catch (e) { alert("Errore: " + e.message); }
    } else if (action === 'delete') {
        if (!confirm(`Vuoi rimuovere ${selectedCbs.length} studenti dalle loro classi attuali?`)) return;

        try {
            const batch = window.fbDb.batch();
            selectedCbs.forEach(cb => {
                const uid = cb.dataset.uid;
                batch.update(window.fbDb.collection('users').doc(uid), {
                    classId: window.firebase.firestore.FieldValue.delete(),
                    className: window.firebase.firestore.FieldValue.delete(),
                    teacherId: window.firebase.firestore.FieldValue.delete()
                });
            });
            await batch.commit();
            alert("✅ Studenti rimossi dalle classi!");
            loadAdminUsersInProfile();
        } catch (e) { alert("Errore: " + e.message); }
    }
};

window.adminDeleteUserInProfile = async function(uid, name) {
    if (!confirm(`Sei sicuro di voler eliminare definitivamente l'utente "${name}"? \n\nVerranno cancellati tutti i suoi dati e i suoi progressi dalla Palestra.`)) return;
    
    try {
        await window.fbDb.collection('users').doc(uid).delete();
        await window.fbDb.collection('progress').doc(uid).delete();
        alert(`Utente "${name}" eliminato con successo.`);
        loadAdminUsersInProfile();
    } catch (e) {
        console.error("Errore eliminazione utente:", e);
        alert("Impossibile eliminare l'utente: " + e.message);
    }
};

async function renderAdminPage() {
    const appContainer = document.getElementById('app');
    appContainer.innerHTML = `
        <div class="exercise-container">
            <h2 class="exercise-title">🛡️ DASHBOARD AMMINISTRATORE</h2>
            <div style="background: white; padding: 2rem; border-radius: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
                <p style="margin-bottom: 2rem; color: #666;">Benvenuto, <b>prof.memmo</b>. Qui puoi monitorare tutti gli iscritti alla Palestra.</p>
                
                <div id="admin-users-list" style="display: flex; flex-direction: column; gap: 1rem;">
                    <div style="text-align: center; padding: 2rem;">
                        <div class="spinner"></div>
                        <p>Caricamento utenti in corso...</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    window.currentSection = 'admin';

    // Recupera utenti da Firestore
    if (window.fbDb) {
        try {
            const usersSnapshot = await window.fbDb.collection('users').get();
            const progressSnapshot = await window.fbDb.collection('progress').get();
            
            const progressMap = {};
            progressSnapshot.forEach(doc => { progressMap[doc.id] = doc.data(); });

            let html = '';
            if (usersSnapshot.empty) {
                html = '<p style="text-align: center; color: #999;">Nessun utente registrato ancora.</p>';
            } else {
                usersSnapshot.forEach(doc => {
                    const userData = doc.data();
                    const userProgress = progressMap[doc.id] || {};
                    const isImage = userData.avatar && (userData.avatar.includes('/') || userData.avatar.includes('.'));
                    const avatarHtml = isImage ? `<img src="${userData.avatar}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;">` : `<span style="font-size: 1.5rem;">${userData.avatar || '👤'}</span>`;

                    html += `
                        <div class="admin-user-row" style="display: flex; flex-wrap: wrap; align-items: center; gap: 1rem; padding: 1.2rem; background: #f8f9fa; border-radius: 20px; border: 1px solid #eee; transition: all 0.2s;">
                            <div style="width: 50px; height: 50px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #eee; overflow: hidden; flex-shrink: 0;">
                                ${avatarHtml}
                            </div>
                            <div style="flex: 1; min-width: 200px;">
                                <h4 style="margin: 0; font-weight: 800; font-size: 1.1rem;">${userData.name || 'Anonimo'}</h4>
                                <p style="margin: 0; font-size: 0.85rem; color: #666;">
                                    ${userData.email || 'No email'} • 
                                    <span style="color: #27ae60; font-weight: 700;">${userData.roleLabel || userData.role || 'Studente'}</span>
                                </p>
                                <p style="margin: 0; font-size: 0.75rem; color: #999;">Iscritto il: ${userData.joinedAt ? new Date(userData.joinedAt).toLocaleDateString() : 'N/D'}</p>
                            </div>
                            <div style="text-align: right; margin-right: 1rem; flex-shrink: 0;">
                                <div style="font-weight: 800; color: var(--primary-color); font-size: 1.1rem;">${userProgress.points || 0} XP</div>
                                <div style="font-size: 0.8rem; color: #999;">${userProgress.vocab ? userProgress.vocab.length : 0} parole</div>
                            </div>
                            <button onclick="adminDeleteUser('${doc.id}', '${(userData.name || 'Anonimo').replace(/'/g, "\\'")}')" style="background: #fff0f0; border: none; padding: 0.8rem; border-radius: 15px; cursor: pointer; color: #e74c3c; font-size: 1.2rem; transition: all 0.2s; margin-left: auto;" title="Elimina Utente">
                                🗑️
                            </button>
                        </div>
                    `;
                });
            }
            document.getElementById('admin-users-list').innerHTML = html;
        } catch (e) {
            console.error("Errore recupero utenti admin:", e);
            document.getElementById('admin-users-list').innerHTML = `<p style="color: #e74c3c;">Errore nel caricamento dei dati: ${e.message}</p>`;
        }
    }
}

window.adminDeleteUser = async function(uid, name) {
    if (!confirm(`Sei sicuro di voler eliminare definitivamente l'utente "${name}"? \n\nVerranno cancellati tutti i suoi dati e i suoi progressi dalla Palestra.`)) return;
    
    try {
        // Elimina profilo
        await window.fbDb.collection('users').doc(uid).delete();
        // Elimina progressi (se esistono)
        await window.fbDb.collection('progress').doc(uid).delete();
        
        alert(`Utente "${name}" eliminato con successo.`);
        renderAdminPage(); // Ricarica la lista
    } catch (e) {
        console.error("Errore eliminazione utente:", e);
        alert("Impossibile eliminare l'utente: " + e.message);
    }
};

// --- TEACHER FUNCTIONS ---
window.filterTeacherClasses = function(val) {
    const q = val.toLowerCase();
    document.querySelectorAll('.teacher-class-item').forEach(item => {
        const teachers = item.dataset.teachers || '';
        const name = item.dataset.classname || '';
        if (teachers.includes(q) || name.includes(q)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
};

window.addTeacherClass = async function() {
    const input = document.getElementById('new-class-name');
    const name = input.value.trim().toUpperCase();
    if (!name) return;
    
    const school = (document.getElementById('new-class-school')?.value || '').trim();
    const city = (document.getElementById('new-class-city')?.value || '').trim();
    
    const user = Auth.getUser();
    if (user.isGuest || !window.fbDb) {
        alert("Devi essere loggato con un account per creare classi cloud.");
        return;
    }

    try {
        const code = "PG-" + Math.random().toString(36).substring(2, 6).toUpperCase();
        const classData = {
            name: name,
            code: code,
            teacherIds: [user.uid], // Nuovo formato array per multi-docente
            school: school || null,
            city: city || null,
            createdAt: new Date().toISOString()
        };

        const docRef = await window.fbDb.collection('classes').add(classData);
        
        // Aggiorna locale
        let classes = JSON.parse(localStorage.getItem('palestra_classes') || '[]');
        classes.push({ id: docRef.id, ...classData });
        localStorage.setItem('palestra_classes', JSON.stringify(classes));
        
        input.value = '';
        renderProfiloPage();
        alert(`✅ Classe ${name} creata con codice: ${code}`);
    } catch (e) {
        console.error("Errore creazione classe:", e);
        alert("Errore durante la creazione della classe: " + e.message);
    }
};

window.recoverTeacherClass = async function() {
    const input = document.getElementById('recover-class-code');
    const code = input.value.trim().toUpperCase();
    if (!code) return;

    const user = Auth.getUser();
    if (user.isGuest || !window.fbDb) {
        alert("Devi essere loggato per recuperare una classe.");
        return;
    }

    try {
        console.log("🔍 Ricerca classe con codice:", code);
        // Leggiamo la classe (la lettura è sempre permessa)
        const q = await window.fbDb.collection('classes').where('code', '==', code).get();
        
        if (q.empty) {
            alert("❌ Nessuna classe trovata con questo codice: " + code);
            return;
        }

        const classDoc = q.docs[0];
        const classData = classDoc.data();
        console.log("✅ Classe trovata:", classData);

        // Se l'utente è un docente, lo aggiungiamo formalmente alla classe su Firestore
        if (user.role === 'docente' && !user.isGuest) {
            const updateData = {};
            
            // Gestione array dei docenti
            if (classData.teacherIds) {
                updateData.teacherIds = firebase.firestore.FieldValue.arrayUnion(user.uid);
            } else if (classData.teacherId) {
                // Migrazione da vecchio formato stringa a nuovo formato array
                const currentTeachers = [classData.teacherId];
                if (!currentTeachers.includes(user.uid)) currentTeachers.push(user.uid);
                updateData.teacherIds = currentTeachers;
            } else {
                updateData.teacherIds = [user.uid];
            }
            
            await window.fbDb.collection('classes').doc(classDoc.id).update(updateData);
            console.log("✅ Docente aggiunto alla classe su Firestore");
        }

        let classes = JSON.parse(localStorage.getItem('palestra_classes') || '[]');
        const alreadyExists = classes.find(c => c.code === code || c.id === classDoc.id);
        
        if (!alreadyExists) {
            classes.push({ id: classDoc.id, ...classData });
            localStorage.setItem('palestra_classes', JSON.stringify(classes));
        } else {
            console.log("ℹ️ Classe già presente nel profilo locale");
        }
        
        alert(`✅ Classe "${classData.name}" (${code}) aggiunta al tuo profilo!`);
        input.value = '';
        renderProfiloPage();
    } catch (e) {
        console.error("ERRORE DETTAGLIATO RECUPERO:", e);
        alert("Errore durante il recupero: " + e.message);
    }
};

window.removeTeacherClass = async function(index) {
    let classes = JSON.parse(localStorage.getItem('palestra_classes') || '[]');
    const classObj = classes[index];
    const classCode = classObj.code;
    
    if (confirm(`Sei sicuro di voler eliminare la classe ${classObj.name}? Verranno rimossi anche tutti i compiti assegnati.`)) {
        try {
            // 1. Rimuovi da Firestore (se l'ID è presente)
            if (classObj.id && window.fbDb) {
                await window.fbDb.collection('classes').doc(classObj.id).delete();
            } else if (window.fbDb) {
                // Se non abbiamo l'ID, cerchiamo per codice
                const q = await window.fbDb.collection('classes').where('code', '==', classCode).get();
                q.forEach(doc => doc.ref.delete());
            }

            // 2. Rimuovi locale
            classes.splice(index, 1);
            localStorage.setItem('palestra_classes', JSON.stringify(classes));
            
            // 3. Rimuovi compiti associati
            let assignments = JSON.parse(localStorage.getItem('palestra_assignments') || '[]');
            assignments = assignments.filter(a => a.classCode !== classCode);
            localStorage.setItem('palestra_assignments', JSON.stringify(assignments));
            
            renderProfiloPage();
        } catch (e) {
            console.error("Errore eliminazione classe:", e);
            alert("Errore durante l'eliminazione della classe: " + e.message);
        }
    }
};

window.viewClassStudents = async function(code, name, classId = null) {
    const content = document.getElementById('class-register-content');
    if (!content) return;

    content.innerHTML = `
        <div style="text-align: center; padding: 2rem;">
            <div class="spinner"></div>
            <p>Caricamento studenti in corso...</p>
        </div>
    `;

    try {
        let classDoc;
        // 1. Cerchiamo la classe prioritariamente per ID, poi per Codice
        if (classId) {
            classDoc = await window.fbDb.collection('classes').doc(classId).get();
            if (!classDoc.exists) {
                // Fallback: se l'ID non trova nulla, proviamo il codice
                const classQ = await window.fbDb.collection('classes').where('code', '==', code).get();
                if (!classQ.empty) classDoc = classQ.docs[0];
            }
        } else {
            const classQ = await window.fbDb.collection('classes').where('code', '==', code).get();
            if (!classQ.empty) classDoc = classQ.docs[0];
        }

        if (!classDoc || (classDoc.exists === false && !classDoc.id)) throw new Error("Classe non trovata");
        const realClassId = classDoc.id;
        const realClassName = classDoc.data()?.name || name;
        const realClassCode = classDoc.data()?.code || code;

        // 2. Trova SOLO gli studenti di questa specifica classe (esclude docenti e admin)
        const usersSnapshot = await window.fbDb.collection('users')
            .where('classId', '==', realClassId)
            .get();
        
        const classStudents = [];
        usersSnapshot.forEach(doc => {
            const u = doc.data();
            // Filtro manuale per ruolo (più flessibile)
            if (u.role === 'studente' || (!u.role && u.classId === realClassId)) {
                classStudents.push({ id: doc.id, ...u });
            }
        });

        if (classStudents.length === 0) {
            content.innerHTML = `
                <div style="text-align: center; padding: 2rem; background: #f8f9fa; border-radius: 20px;">
                    <p style="color: #888;">Nessun utente si è ancora unito alla classe <b>${name}</b>.</p>
                    <p style="font-size: 0.8rem;">Condividi il codice <b>${code}</b> con i tuoi studenti.</p>
                </div>
            `;
            return;
        }

        // 3. Recupera i progressi solo per questi studenti
        const progressMap = {};
        // Per ogni studente, recuperiamo il suo documento di progresso specifico
        // Questo è più sicuro per le regole di sicurezza (lettura per ID)
        const progressPromises = classStudents.map(async (s) => {
            try {
                const pDoc = await window.fbDb.collection('progress').doc(s.id).get();
                if (pDoc.exists) {
                    progressMap[s.id] = pDoc.data();
                }
            } catch (err) {
                console.warn(`Impossibile caricare progresso per ${s.name}:`, err);
            }
        });

        await Promise.all(progressPromises);

        let tableRows = classStudents.map(s => {
            const p = progressMap[s.id] || { points: 0, completed: [] };
            const lastActivity = p.lastUpdated ? new Date(p.lastUpdated).toLocaleDateString() : 'N/D';
            const completedCount = p.completed ? p.completed.length : 0;
            
            return `
                <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 12px; text-align: center;">
                        <input type="checkbox" class="student-checkbox" data-uid="${s.id}" data-name="${s.name}">
                    </td>
                    <td style="padding: 12px; display: flex; align-items: center; gap: 0.5rem;">
                        <span style="font-size: 1.2rem;">${s.avatar || '👤'}</span>
                        <span style="font-weight: 700;">${s.name}</span>
                    </td>
                    <td style="padding: 12px; font-weight: 800; color: var(--primary-color);">${p.points || 0} XP</td>
                    <td style="padding: 12px;">${completedCount} attività</td>
                    <td style="padding: 12px; color: #95a5a6;">${lastActivity}</td>
                </tr>
            `;
        }).join('');

        const teacherClasses = JSON.parse(localStorage.getItem('palestra_classes') || '[]');
        const otherClasses = teacherClasses.filter(c => c.code !== code);

        content.innerHTML = `
            <div style="font-family: inherit; animation: fadeIn 0.5s ease-out;">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; background: #f0f7ff; padding: 1rem; border-radius: 15px;">
                    <h3 style="color: var(--primary-color); margin: 0; font-size: 1.1rem;">Registro Progressi: Classe ${name}</h3>
                    <span style="color: #3498db; font-size: 0.8rem; font-weight: 800;">CODICE: ${code}</span>
                </div>

                <!-- Gestione Multipla -->
                <div id="student-management-bar" style="background: #fff9f0; padding: 1rem; border-radius: 15px; margin-bottom: 1rem; border: 1px solid #ffeaa7; display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap;">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <span style="font-weight: 700; font-size: 0.85rem; color: #d35400;">GESTIONE SELEZIONATI:</span>
                        <select id="move-destination-class" style="padding: 0.5rem; border-radius: 10px; border: 1px solid #ddd; font-size: 0.8rem;">
                            <option value="">Sposta in classe...</option>
                            ${otherClasses.map(c => `<option value="${c.id}">${c.name} (${c.code})</option>`).join('')}
                        </select>
                        <button onclick="window.moveSelectedStudents('${realClassCode}', '${realClassName.replace(/'/g, "\\'")}', '${realClassId}')" style="background: #e67e22; color: white; border: none; padding: 0.5rem 1rem; border-radius: 10px; font-weight: 700; cursor: pointer; font-size: 0.8rem;">SPOSTA</button>
                        <button onclick="window.deleteSelectedStudents('${realClassCode}', '${realClassName.replace(/'/g, "\\'")}', '${realClassId}')" style="background: #e74c3c; color: white; border: none; padding: 0.5rem 1rem; border-radius: 10px; font-weight: 700; cursor: pointer; font-size: 0.8rem;">ELIMINA</button>
                    </div>
                    <div style="font-size: 0.75rem; color: #888;">
                        Seleziona gli studenti per spostarli in un'altra classe o rimuoverli da questa.
                    </div>
                </div>

                <div style="overflow-x: auto;">
                    <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem;">
                        <thead>
                            <tr style="text-align: left; color: #95a5a6; border-bottom: 2px solid #eee;">
                                <th style="padding: 12px; text-align: center; width: 40px;">
                                    <input type="checkbox" id="select-all-students" onclick="window.toggleSelectAllStudents(this)">
                                </th>
                                <th style="padding: 12px;">STUDENTE</th>
                                <th style="padding: 12px;">PUNTI</th>
                                <th style="padding: 12px;">ATTIVITÀ</th>
                                <th style="padding: 12px;">ULTIMO ACCESSO</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${tableRows}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        content.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch (e) {
        console.error("Errore recupero studenti:", e);
        content.innerHTML = `<p style="color: #e74c3c; padding: 1rem;">Errore nel caricamento dei dati: ${e.message}</p>`;
    }
};

window.viewClassTeachers = async function(classId, className, classCode) {
    const content = document.getElementById('class-register-content');
    if (!content) return;

    content.innerHTML = `
        <div style="text-align: center; padding: 2rem;">
            <div class="spinner"></div>
            <p>Recupero elenco docenti...</p>
        </div>
    `;
    
    // Scroll immediato per feedback
    content.scrollIntoView({ behavior: 'smooth', block: 'start' });

    try {
        let classData;
        const doc = await window.fbDb.collection('classes').doc(classId).get();
        if (doc.exists) {
            classData = doc.data();
        } else {
            // Fallback per codice
            const q = await window.fbDb.collection('classes').where('code', '==', classCode).get();
            if (!q.empty) classData = q.docs[0].data();
        }

        if (!classData) throw new Error("Dati classe non trovati.");

        const teacherIds = classData.teacherIds || (classData.teacherId ? [classData.teacherId] : []);
        
        const teachers = [];
        for (const tid of teacherIds) {
            const tDoc = await window.fbDb.collection('users').doc(tid).get();
            if (tDoc.exists) {
                teachers.push({ id: tDoc.id, ...tDoc.data() });
            }
        }

        content.innerHTML = `
            <div style="background: white; padding: 2rem; border-radius: 30px; border: 1px solid #e0e0e0; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                    <h4 style="color: #2980b9; margin: 0; font-size: 1.4rem; font-weight: 800;">👨‍🏫 Docenti della Classe ${className}</h4>
                    <span style="background: #3498db; color: white; padding: 0.3rem 1rem; border-radius: 20px; font-size: 0.8rem; font-weight: 700;">${teachers.length} Docenti</span>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1rem;">
                    ${teachers.map(t => `
                        <div style="display: flex; align-items: center; gap: 1rem; padding: 1rem; background: #f8f9fa; border-radius: 20px; border: 1px solid #eee; transition: all 0.2s;">
                            <div style="font-size: 2rem; background: white; width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; border-radius: 50%; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                                ${t.avatar?.includes('/') ? `<img src="${t.avatar}" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">` : (t.avatar || '👤')}
                            </div>
                            <div>
                                <div style="font-weight: 800; color: #2c3e50;">${t.name}</div>
                                <div style="font-size: 0.75rem; color: #7f8c8d; word-break: break-all;">${t.email || 'Email non pubblica'}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <button onclick="window.renderProfiloPage()" style="margin-top: 2rem; width: 100%; padding: 1rem; background: #f1f2f6; border: none; border-radius: 15px; color: #57606f; font-weight: 700; cursor: pointer;">Chiudi Elenco</button>
            </div>
        `;
    } catch (e) {
        console.error("Errore viewClassTeachers:", e);
        content.innerHTML = `<p style="color: red; text-align: center; padding: 2rem;">Errore durante il caricamento docenti: ${e.message}</p>`;
    }
};

window.updateShareSubtypes = function() {
    const materia = document.getElementById('share-materia').value;
    const subSelector = document.getElementById('share-subtype');
    subSelector.innerHTML = '<option value="">Scegli argomento...</option>';
    
    if (materia && MATERIE_HIERARCHY[materia]) {
        const items = MATERIE_HIERARCHY[materia].items || [];
        items.forEach(item => {
            subSelector.innerHTML += `<option value="${item.id}">${item.title}</option>`;
        });
    }
};

window.generateShareLink = function() {
    const materia = document.getElementById('share-materia').value;
    const subtype = document.getElementById('share-subtype').value;
    const resultDiv = document.getElementById('share-link-result');
    
    if (!materia || !subtype) {
        alert("Seleziona sia la materia che l'argomento.");
        return;
    }
    
    const baseUrl = window.location.href.split('#')[0];
    const fullLink = `${baseUrl}#${materia}/${subtype}`;
    
    navigator.clipboard.writeText(fullLink).then(() => {
        resultDiv.innerText = "✅ Link copiato negli appunti!";
        setTimeout(() => { resultDiv.innerText = ""; }, 3000);
    }).catch(err => {
        resultDiv.innerText = "Errore copia: " + fullLink;
    });
};

window.copyCurrentLink = function() {
    const fullLink = window.location.href;
    navigator.clipboard.writeText(fullLink).then(() => {
        alert("✅ Link dell'esercizio copiato! Ora puoi incollarlo su Classroom o inviarlo agli studenti.");
    });
};

window.toggleSelectAllStudents = function(master) {
    const checkboxes = document.querySelectorAll('.student-checkbox');
    checkboxes.forEach(cb => cb.checked = master.checked);
};

window.moveSelectedStudents = async function(currentCode, currentName, currentId) {
    const selectedCbs = document.querySelectorAll('.student-checkbox:checked');
    const destClassId = document.getElementById('move-destination-class').value;
    
    if (selectedCbs.length === 0) {
        alert("Seleziona almeno uno studente da spostare.");
        return;
    }
    
    if (!destClassId) {
        alert("Seleziona una classe di destinazione.");
        return;
    }

    // Trova i dati della classe di destinazione
    const teacherClasses = JSON.parse(localStorage.getItem('palestra_classes') || '[]');
    const destClass = teacherClasses.find(c => c.id === destClassId);
    if (!destClass) return;

    if (!confirm(`Vuoi spostare ${selectedCbs.length} studenti nella classe ${destClass.name}?`)) return;

    try {
        const db = window.fbDb;
        const batch = db.batch();
        
        selectedCbs.forEach(cb => {
            const uid = cb.dataset.uid;
            const userRef = db.collection('users').doc(uid);
            batch.update(userRef, {
                classId: destClassId,
                className: destClass.name
            });
        });

        await batch.commit();
        alert(`✅ Successo! ${selectedCbs.length} studenti spostati in classe ${destClass.name}.`);
        
        // Ricarichiamo il registro corrente
        window.viewClassStudents(currentCode, currentName, currentId);
        
    } catch (e) {
        console.error("Errore spostamento:", e);
        alert("Errore durante lo spostamento: " + e.message);
    }
};

window.deleteSelectedStudents = async function(currentCode, currentName, currentId) {
    const selectedCbs = document.querySelectorAll('.student-checkbox:checked');
    
    if (selectedCbs.length === 0) {
        alert("Seleziona almeno uno studente da rimuovere.");
        return;
    }

    if (!confirm(`Vuoi rimuovere ${selectedCbs.length} studenti dalla classe ${currentName}? \n\nI loro dati non verranno cancellati, ma non faranno più parte di questa classe.`)) return;

    try {
        const db = window.fbDb;
        const batch = db.batch();
        
        selectedCbs.forEach(cb => {
            const uid = cb.dataset.uid;
            const userRef = db.collection('users').doc(uid);
            batch.update(userRef, {
                classId: window.firebase.firestore.FieldValue.delete(),
                className: window.firebase.firestore.FieldValue.delete(),
                teacherId: window.firebase.firestore.FieldValue.delete()
            });
        });

        await batch.commit();
        alert(`✅ Successo! ${selectedCbs.length} studenti rimossi dalla classe.`);
        
        // Ricarichiamo il registro corrente
        window.viewClassStudents(currentCode, currentName, currentId);
        
    } catch (e) {
        console.error("Errore rimozione studenti:", e);
        alert("Errore durante la rimozione: " + e.message);
    }
};

window.toggleShareMenu = function() {
    const dropdown = document.getElementById('share-dropdown');
    if (dropdown) dropdown.classList.toggle('hidden');
};

window.assignToInternalClass = function(classCode) {
    const fullLink = window.location.href;
    const assignments = JSON.parse(localStorage.getItem('palestra_assignments') || '[]');
    assignments.push({
        classCode: classCode,
        link: fullLink,
        date: new Date().toISOString(),
        topic: window.location.hash.substring(1)
    });
    localStorage.setItem('palestra_assignments', JSON.stringify(assignments));
    alert(`✅ Esercizio assegnato alla classe con codice ${classCode}!`);
    window.toggleShareMenu();
};



window.joinClass = async function() {
    const input = document.getElementById('join-class-code');
    const code = (input.value || '').trim().toUpperCase();
    if (!code) return;
    
    const user = Auth.getUser();
    if (user.isGuest || !window.fbDb) {
        localStorage.setItem('palestra_student_class_code', code);
        renderProfiloPage();
        return;
    }

    try {
        const q = await window.fbDb.collection('classes').where('code', '==', code).get();
        if (q.empty) {
            alert("❌ Codice classe non valido.");
            return;
        }

        const classDoc = q.docs[0];
        const classData = classDoc.data();
        
        user.classId = classDoc.id;
        user.className = classData.name;
        user.teacherId = classData.teacherId;
        
        await window.fbDb.collection('users').doc(user.uid).set(user, { merge: true });
        localStorage.setItem('palestra_user', JSON.stringify(user));
        localStorage.setItem('palestra_student_class_code', code);
        
        renderProfiloPage();
        alert(`✅ Ti sei unito alla classe ${classData.name}!`);
    } catch (e) {
        console.error("Errore join classe:", e);
        alert("Errore durante l'accesso alla classe: " + e.message);
    }
};

window.leaveClass = async function() {
    if (!confirm("Sei sicuro di voler uscire dalla classe?")) return;
    
    const user = Auth.getUser();
    localStorage.removeItem('palestra_student_class_code');
    
    if (!user.isGuest && window.fbDb) {
        // Rimuoviamo i campi relativi alla classe dal profilo Firestore
        const updateData = {
            classId: window.firebase.firestore.FieldValue.delete(),
            className: window.firebase.firestore.FieldValue.delete(),
            teacherId: window.firebase.firestore.FieldValue.delete()
        };
        
        await window.fbDb.collection('users').doc(user.uid).update(updateData);
        
        delete user.classId;
        delete user.className;
        delete user.teacherId;
        localStorage.setItem('palestra_user', JSON.stringify(user));
    }
    
    renderProfiloPage();
};


window.shareToClassroom = function() {
    const fullLink = window.location.href;
    const classroomUrl = `https://classroom.google.com/share?url=${encodeURIComponent(fullLink)}`;
    window.open(classroomUrl, '_blank');
    window.toggleShareMenu();
};

function getTeacherShareButton() {
    const user = Auth.getUser();
    if (user.role !== 'docente') return '';
    
    const classes = JSON.parse(localStorage.getItem('palestra_classes') || '[]');
    
    return `
        <div class="teacher-share-container" style="margin-bottom: 1.5rem; display: flex; justify-content: flex-end;">
            <button class="btn btn-secondary" onclick="window.toggleShareMenu()" style="font-size: 0.8rem; border-radius: 50px; background: #f0f7ff; border: 1px solid #3498db; color: #2980b9; font-weight: 700; padding: 0.6rem 1.2rem; display: flex; align-items: center; gap: 0.5rem; box-shadow: 0 4px 10px rgba(52, 152, 219, 0.1);">
                📤 CONDIVIDI
            </button>
            
            <div id="share-dropdown" class="share-dropdown hidden">
                <div class="share-section-title">Assegna alle tue classi</div>
                <div class="share-btn-list">
                    ${classes.length > 0 ? classes.map(c => `
                        <button class="share-action-btn" onclick="window.assignToInternalClass('${c.code}')">
                            📁 Classe ${c.name} (${c.code})
                        </button>
                    `).join('') : '<p style="font-size: 0.7rem; color: #888;">Nessuna classe creata.</p>'}
                </div>
                
                <div class="share-section-title">Condivisione esterna</div>
                <div class="share-btn-list">
                    <button class="share-action-btn" onclick="window.copyCurrentLink()">
                        🔗 Copia Link
                    </button>
                    <button class="share-action-btn classroom" onclick="window.shareToClassroom()">
                        🏫 Google Classroom
                    </button>
                </div>
            </div>
        </div>
    `;
}

function renderVocabularyPage(sortType = 'az') {
    const appContainer = document.getElementById('app');
    let vocabulary = JSON.parse(localStorage.getItem('palestra_vocab') || '[]');

    if (sortType === 'az') vocabulary.sort((a, b) => a.word.localeCompare(b.word));
    else if (sortType === 'za') vocabulary.sort((a, b) => b.word.localeCompare(a.word));

    appContainer.innerHTML = `
        <div class="exercise-container">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                <h2 class="exercise-title" style="margin: 0;">📖 IL MIO VOCABOLARIO</h2>
                <button class="btn btn-secondary" onclick="renderProfiloPage()" style="padding: 0.8rem 1.5rem; font-size: 0.9rem; border-radius: 50px;">TORNA AL PROFILO</button>
            </div>

            <div class="profile-card">
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #f0f0f0; padding-bottom: 1rem; margin-bottom: 1.5rem;">
                    <p style="color: #666; font-weight: 600;">Gestisci le parole che hai scoperto durante le letture.</p>
                    <div style="display: flex; gap: 0.5rem;">
                        <button class="filter-btn ${sortType === 'az' ? 'active' : ''}" onclick="renderVocabularyPage('az')">A-Z</button>
                        <button class="filter-btn ${sortType === 'za' ? 'active' : ''}" onclick="renderVocabularyPage('za')">Z-A</button>
                    </div>
                </div>

                ${vocabulary.length === 0 ? `
                    <div style="text-align: center; padding: 4rem 2rem; color: #888;">
                        <span style="font-size: 4rem; display: block; margin-bottom: 1.5rem;">🔍</span>
                        <p>Il tuo vocabolario è ancora vuoto.<br>Esplora le letture e clicca sulle parole che non conosci!</p>
                    </div>
                ` : `
                    <div class="vocab-list" style="display: flex; flex-direction: column; gap: 1rem;">
                        ${vocabulary.map((v, idx) => `
                            <div style="background: #f8f9fa; border-radius: 15px; overflow: hidden; border: 1px solid #eee;">
                                <div style="padding: 1.2rem; display: flex; justify-content: space-between; align-items: center;">
                                    <div onclick="UI.toggleWordDefinition('${v.word.replace(/'/g, "\\'")}', 'def-page-${idx}')" style="cursor: pointer; display: flex; align-items: center; gap: 1rem; flex: 1;">
                                        <span style="font-size: 1.3rem; font-weight: 800; color: var(--primary-color);">${v.word}</span>
                                        <span style="font-size: 0.8rem; background: #fff; padding: 2px 8px; border-radius: 10px; color: #888;">Clicca per il significato</span>
                                    </div>
                                    <button onclick="UI.removeFromVocabulary('${v.word.replace(/'/g, "\\'")}', true)" style="background: none; border: none; color: #ff7f7f; font-size: 1.5rem; cursor: pointer; padding: 0.5rem;">&times;</button>
                                </div>
                                <div id="def-page-${idx}" class="hidden" style="border-top: 1px solid #eee; background: white;"></div>
                            </div>
                        `).join('')}
                    </div>
                `}
            </div>
        </div>
    `;
}

function renderSessionsPage(type = 'open') {
    const appContainer = document.getElementById('app');
    const title = type === 'open' ? '🚀 SESSIONI APERTE' : '🏁 SESSIONI CONCLUSE';
    const color = type === 'open' ? '#e67e22' : '#27ae60';

    let sessionsHtml = '';
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('progress_')) {
            const val = localStorage.getItem(key);
            const parts = key.split('_');
            if (parts.length < 5) continue;

            const pathKey = key.replace('progress_', '');
            const isConcluded = localStorage.getItem('concluded_' + pathKey) === 'true';

            if ((type === 'open' && isConcluded) || (type === 'concluded' && !isConcluded)) continue;

            const section = parts[1];
            const subType = parts[2];
            const level = parts[3];
            const extra = parts[4];

            let label = `${section.toUpperCase()} - ${subType.toUpperCase()}`;
            if (level && level !== 'undefined' && level !== 'null' && level !== '') label += ` (${level})`;
            if (extra && extra !== 'undefined' && extra !== 'null' && extra !== '') label += ` [${extra}]`;

            const hash = `${section}/${subType}/${level && level !== 'undefined' ? level : ''}/${extra && extra !== 'undefined' ? extra : ''}`;

            sessionsHtml += `
                <div style="background: white; padding: 1.5rem; border-radius: 20px; margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center; border: 1px solid #eee; box-shadow: 0 4px 10px rgba(0,0,0,0.02);">
                    <div>
                        <strong style="color: ${color}; font-size: 1.1rem;">${label}</strong>
                        <div style="font-size: 0.9rem; color: #666; margin-top: 0.3rem;">
                            ${isConcluded ? '✅ Percorso completato con successo' : `Progresso attuale: Esercizio ${parseInt(val)} completato`}
                        </div>
                    </div>
                    <button class="btn btn-primary" onclick="window.location.hash = '${hash}'" style="padding: 0.8rem 1.5rem; font-size: 0.9rem; border-radius: 50px; background: ${color};">
                        ${isConcluded ? 'RIVEDI' : 'RIPRENDI'} ➜
                    </button>
                </div>
            `;
        }
    }

    appContainer.innerHTML = `
        <div class="exercise-container">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                <h2 class="exercise-title" style="margin: 0; color: ${color};">${title}</h2>
                <button class="btn btn-secondary" onclick="renderProfiloPage()" style="padding: 0.8rem 1.5rem; font-size: 0.9rem; border-radius: 50px;">TORNA AL PROFILO</button>
            </div>

            <div style="margin-top: 2rem;">
                ${sessionsHtml || `<div style="text-align: center; padding: 4rem; color: #888; background: #f8f9fa; border-radius: 30px;">Nessuna sessione trovata in questa categoria.</div>`}
            </div>
        </div>
    `;
}

function renderRipassaPage() {
    const appContainer = document.getElementById('app');
    appContainer.innerHTML = `
        <div class="exercise-container">
            <h2 class="exercise-title">🔁 RIPASSA ERRORI</h2>
            <div style="background: #f8f9fa; padding: 3rem; border-radius: 30px; margin-bottom: 2rem;">
                <p style="font-size: 1.2rem;">Qui troverai gli argomenti che hai sbagliato più spesso durante le Unità di Apprendimento, pronti per essere ripassati con la ripetizione spaziata.</p>
                <button class="btn btn-primary" style="margin-top: 1.5rem;">INIZIA RIPASSO ➜</button>
            </div>
        </div>
    `;
    currentSection = 'ripassa';
}

window.MATERIE_HIERARCHY = {
    'materie': {
        title: 'Scegli il tuo percorso', parent: null, type: 'submenu', items: [
            { id: 'riflessione', title: 'Grammatica', icon: '🧠', type: 'submenu' },
            { id: 'lettura', title: 'Lettura e Comprensione', icon: '📚', type: 'submenu' },
            { id: 'lessico', title: 'Lessico', icon: '📖', type: 'submenu' },
            { id: 'produzione', title: 'Produzione Scritta', icon: '✍️', type: 'submenu' }
        ]
    },
    'riflessione': {
        title: 'Grammatica', parent: 'materie', type: 'submenu', items: [
            { id: 'grammaticale', title: 'Analisi Grammaticale', icon: '📝', type: 'submenu' },
            { id: 'analisiLogica', title: 'Analisi Logica', icon: '🧩', type: 'submenu' },
            { id: 'analisiPeriodo', title: 'Analisi del Periodo', icon: '⏳', type: 'submenu' }
        ]
    },
    'grammaticale': {
        title: 'Analisi Grammaticale (Unità di Apprendimento)', parent: 'riflessione', type: 'submenu', items: [
            { id: 'uda1', title: "Cos'è la grammatica", icon: '📘', type: 'uda' },
            { id: 'uda2', title: 'La fonologia', icon: '🔤', type: 'uda' },
            { id: 'uda3', title: "L'ortografia", icon: '✍️', type: 'uda' },
            { id: 'uda4', title: "L'articolo", icon: '📌', type: 'uda' },
            { id: 'uda5', title: 'Il nome', icon: '🏷️', type: 'uda' },
            { id: 'uda_gram_guidata1', title: 'Allenamento Combinato 1', icon: '🏋️', type: 'uda', color: 'verde' },
            { id: 'uda6', title: "L'aggettivo", icon: '🎨', type: 'uda' },
            { id: 'uda7', title: "Aggettivi qualificativi: la concordanza", icon: '⚖️', type: 'uda' },
            { id: 'uda7b', title: "Aggettivi qualificativi: funzioni e posizione", icon: '🧭', type: 'uda' },
            { id: 'uda8', title: 'Il pronome', icon: '🔁', type: 'uda' },
            { id: 'uda9', title: 'Introduzione al verbo', icon: '⚙️', type: 'uda' },
            { id: 'uda10', title: 'I modi finiti e indefiniti del verbo', icon: '🎭', type: 'uda' },
            { id: 'uda_gram_guidata2', title: 'Allenamento Combinato 2', icon: '🏋️', type: 'uda', color: 'verde' },
            { id: 'uda_copulativi', title: 'La forma del verbo', icon: '🔗', type: 'uda' },
            { id: 'uda12', title: "L'avverbio", icon: '🚀', type: 'uda' },
            { id: 'uda13', title: 'La preposizione', icon: '🔗', type: 'uda' },
            { id: 'uda14', title: 'La congiunzione', icon: '🤝', type: 'uda' },
            { id: 'uda15', title: "L'interiezione", icon: '🗣️', type: 'uda' },
            { id: 'uda16', title: 'Allenamento Finale', icon: '🏆', type: 'uda', color: 'verde' }
        ]
    },


    'analisiLogica': {
        title: 'Analisi Logica', parent: 'riflessione', type: 'submenu', items: [
            { id: 'udaLogica1', title: 'La frase minima', icon: '🧩', type: 'uda' },
            { id: 'udaLogica2', title: 'Il soggetto', icon: '👤', type: 'uda' },
            { id: 'udaLogica3', title: "L'attributo e l'apposizione", icon: '🏷️', type: 'uda' },
            { id: 'udaLogica4', title: 'Il predicato', icon: '⚙️', type: 'uda' },
            { id: 'udaLogica_approfondimento', title: 'Ripasso: la forma del verbo', icon: '🔗', type: 'uda' },
            { id: 'udaLogica5', title: 'Il complemento oggetto', icon: '🎯', type: 'uda' },
            { id: 'uda_log_guidata1', title: 'Allenamento Combinato 1', icon: '🏋️', type: 'uda', color: 'verde' },
            { id: 'udaLogica6', title: 'Il complemento di luogo', icon: '📍', type: 'uda' },
            { id: 'udaLogica7', title: 'Il complemento di tempo', icon: '🕒', type: 'uda' },
            { id: 'udaLogica8', title: 'Il complemento di specificazione', icon: '🔍', type: 'uda' },
            { id: 'udaLogica9', title: 'Il complemento di termine', icon: '📩', type: 'uda' },
            { id: 'udaLogica10', title: "Il complemento d'agente e di causa efficiente", icon: '💨', type: 'uda' },
            { id: 'uda_log_guidata2', title: 'Allenamento Combinato 2', icon: '🏋️', type: 'uda', color: 'verde' },
            { id: 'udaLogica11', title: 'Il complemento di modo', icon: '🛠️', type: 'uda' },
            { id: 'udaLogica14', title: 'Il complemento di mezzo', icon: '🛠️', type: 'uda' },
            { id: 'udaLogica12', title: 'Il complemento di causa', icon: '🎯', type: 'uda' },
            { id: 'udaLogica15', title: 'Il complemento di fine', icon: '🎯', type: 'uda' },
            { id: 'udaLogica13', title: 'Il complemento di unione o di compagnia', icon: '👥', type: 'uda' },
            { id: 'uda_log_guidata3', title: 'Allenamento Combinato 3', icon: '🏋️', type: 'uda', color: 'verde' },
            { id: 'udaLogica17', title: 'Il complemento di argomento', icon: '🗣️', type: 'uda' },
            { id: 'udaLogica18', title: 'Il complemento di materia', icon: '🧱', type: 'uda' },
            { id: 'udaLogica19', title: 'Il complemento di qualità', icon: '💎', type: 'uda' },
            { id: 'udaLogica20', title: 'Il complemento di peso e di estensione', icon: '⚖️', type: 'uda' },
            { id: 'udaLogica21', title: 'Il complemento di prezzo', icon: '💰', type: 'uda' },
            { id: 'udaLogica16', title: 'Allenamento Finale', icon: '🏆', type: 'uda', color: 'verde' }
        ]
    },
    'analisiPeriodo': {
        title: 'Analisi del Periodo', parent: 'riflessione', type: 'submenu', items: [
            { id: 'udaPeriodo1', title: 'Il periodo', icon: '⏳', type: 'uda' },
            { id: 'udaPeriodo2', title: 'La proposizione principale', icon: '🏠', type: 'uda' },
            { id: 'udaPeriodo3', title: 'La proposizione interrogativa', icon: '❓', type: 'uda' },
            { id: 'udaPeriodo4', title: 'La proposizione incidentale', icon: '💬', type: 'uda' },
            { id: 'udaPeriodo5', title: 'I rapporti di coordinazione e subordinazione', icon: '🤝', type: 'uda' },
            { id: 'udaPeriodoGuidata1', title: 'Allenamento Combinato 1', icon: '🏋️', type: 'uda', color: 'verde' },
            { id: 'udaPeriodo6', title: 'La proposizione coordinata', icon: '🔗', type: 'uda' },
            { id: 'udaPeriodo7', title: 'La proposizione subordinata', icon: '🪜', type: 'uda' },
            { id: 'udaPeriodo8', title: 'La proposizione soggettiva', icon: '👤', type: 'uda' },
            { id: 'udaPeriodo9', title: 'La proposizione oggettiva', icon: '🎯', type: 'uda' },
            { id: 'udaPeriodo10', title: 'La proposizione dichiarativa', icon: '📣', type: 'uda' },
            { id: 'udaPeriodoGuidata2', title: 'Allenamento Combinato 2', icon: '🏋️', type: 'uda', color: 'verde' },
            { id: 'udaPeriodo11', title: 'La proposizione relativa', icon: '📎', type: 'uda' },
            { id: 'udaPeriodo12', title: 'La proposizione causale', icon: '💡', type: 'uda' },
            { id: 'udaPeriodo13', title: 'La proposizione finale', icon: '🏁', type: 'uda' },
            { id: 'udaPeriodo14', title: 'La proposizione temporale', icon: '🕒', type: 'uda' },
            { id: 'udaPeriodoGuidataFinale', title: 'Allenamento Finale', icon: '🏆', type: 'uda', color: 'verde' }
        ]
    },
    'lettura': {
        title: 'Lettura e Comprensione', parent: 'materie', type: 'submenu', items: [
            { id: 'antologiche', title: 'Letture antologiche', icon: '📖', type: 'exercises' },
            { id: 'generi', title: 'Letture per generi letterari', icon: '🎭', type: 'submenu' }
        ]
    },
    'generi': {
        title: 'Letture per generi letterari', parent: 'lettura', type: 'submenu', items: [
            { id: 'favola', title: 'Favola', icon: '🦊', type: 'exercises' },
            { id: 'fiaba', title: 'Fiaba', icon: '🏰', type: 'exercises' },
            { id: 'fantasy', title: 'Fantasy', icon: '🧙‍♂️', type: 'exercises' },
            { id: 'avventura', title: 'Avventura', icon: '🗺️', type: 'exercises' },
            { id: 'regolativo', title: 'Testo regolativo', icon: '📋', type: 'exercises' },
            { id: 'espositivo', title: 'Testo espositivo', icon: '📊', type: 'exercises' },
            { id: 'descrizione_gen', title: 'Descrizione', icon: '🖼️', type: 'exercises' },
            { id: 'poesia', title: 'Poesia', icon: '🖋️', type: 'exercises' },
            { id: 'mistero', title: 'Racconti del mistero e dei fantasmi', icon: '👻', type: 'exercises' },
            { id: 'horror', title: 'Racconto horror', icon: '🧟', type: 'exercises' },
            { id: 'giallo', title: 'Racconto giallo', icon: '🔍', type: 'exercises' },
            { id: 'comico', title: 'Racconto comico-umoristico', icon: '😂', type: 'exercises' },
            { id: 'diario', title: 'Diario', icon: '📔', type: 'exercises' },
            { id: 'lettera', title: 'Lettera', icon: '✉️', type: 'exercises' },
            { id: 'argomentativo', title: 'Testo argomentativo', icon: '🧠', type: 'exercises' },
            { id: 'formazione', title: 'Romanzo di formazione', icon: '🌱', type: 'exercises' },
            { id: 'psicologico', title: 'Romanzo psicologico', icon: '🧠', type: 'exercises' },
            { id: 'sociale', title: 'Romanzo sociale', icon: '👥', type: 'exercises' },
            { id: 'storico', title: 'Romanzo storico', icon: '🏛️', type: 'exercises' },
            { id: 'fantascienza', title: 'Romanzo di fantascienza', icon: '🚀', type: 'exercises' },
            { id: 'surreale', title: 'Romanzo fantastico e surreale', icon: '🦄', type: 'exercises' },
            { id: 'autobiografia', title: 'Autobiografia', icon: '👤', type: 'exercises' },
            { id: 'biografia', title: 'Biografia', icon: '📚', type: 'exercises' },
            { id: 'cronaca', title: 'Cronaca', icon: '📰', type: 'exercises' }
        ]
    },
    'produzione': {
        title: 'Produzione', parent: 'materie', type: 'submenu', items: [
            { id: 'descrizione', title: 'Descrizione', icon: '🖼️', type: 'submenu' },
            { id: 'riassunto', title: 'Il Riassunto', icon: '📝', type: 'submenu' },
            { id: 'riformulazione', title: 'Riformulazione', icon: '🔄', type: 'exercises' },
            { id: 'esposizione', title: 'Esposizione Orale', icon: '🗣️', type: 'exercises' },
            { id: 'dizionario', title: 'Il Dizionario', icon: '📖', type: 'exercises' }
        ]
    },
    'riassunto': {
        title: 'Il Riassunto', parent: 'produzione', type: 'submenu', items: [
            { id: 'tecnica0', title: 'COS\'È IL RIASSUNTO?', icon: '🤔', type: 'uda' },
            { id: 'tecnica1', title: 'LE 5 W', icon: '🖐️', type: 'uda' },
            { id: 'tecnica2', title: 'IL RIASSUNTO IN 4 PARTI', icon: '🔗', type: 'uda' },
            { id: 'tecnica3', title: 'LE SEQUENZE', icon: '🎞️', type: 'uda' }
        ]
    },
    'descrizione': {
        title: 'Descrizione', parent: 'produzione', type: 'submenu', items: [
            { id: 'persona', title: 'Persona', icon: '👤', type: 'exercises' },
            { id: 'animale', title: 'Animale', icon: '🐾', type: 'exercises' },
            { id: 'oggetto', title: 'Oggetto', icon: '📦', type: 'exercises' },
            { id: 'luogo', title: 'Luogo', icon: '🏞️', type: 'exercises' }
        ]
    },
    'lessico': {
        title: 'Lessico e Parole', parent: 'materie', type: 'submenu', items: [
            { id: 'campi_semantici', title: 'Campi Semantici', icon: '🌐', type: 'exercises' },
            { id: 'significati', title: 'Significati e Sfumature', icon: '🧠', type: 'exercises' },
            { id: 'relazioni', title: 'Relazioni tra Parole', icon: '🔗', type: 'exercises' }
        ]
    },

    // Leaf mapping per Unità di Apprendimento
    'uda1': { type: 'uda', parent: 'grammaticale' },
    'uda2': { type: 'uda', parent: 'grammaticale' },
    'uda3': { type: 'uda', parent: 'grammaticale' },
    'uda3_1': { type: 'uda', parent: 'grammaticale' },
    'uda3_2': { type: 'uda', parent: 'grammaticale' },
    'uda3_3': { type: 'uda', parent: 'grammaticale' },
    'uda3_4': { type: 'uda', parent: 'grammaticale' },
    'uda3_5': { type: 'uda', parent: 'grammaticale' },
    'uda3_6': { type: 'uda', parent: 'grammaticale' },
    'uda3_7': { type: 'uda', parent: 'grammaticale' },
    'uda_h': { type: 'uda', parent: 'grammaticale' },
    'uda_punteggiatura': { type: 'uda', parent: 'grammaticale' },
    'uda4': { type: 'uda', parent: 'grammaticale' },
    'uda5': { type: 'uda', parent: 'grammaticale' },
    'uda_gram_guidata1': { type: 'uda', parent: 'grammaticale' },
    'uda6': { type: 'uda', parent: 'grammaticale' },
    'uda7': { type: 'uda', parent: 'grammaticale' },
    'uda7b': { type: 'uda', parent: 'grammaticale' },
    'uda8': { type: 'uda', parent: 'grammaticale' },
    'uda9': { type: 'uda', parent: 'grammaticale' },
    'uda10': { type: 'uda', parent: 'grammaticale' },
    'uda_gram_guidata2': { type: 'uda', parent: 'grammaticale' },
    'uda_copulativi': { type: 'uda', parent: 'grammaticale' },
    'uda12': { type: 'uda', parent: 'grammaticale' },
    'uda13': { type: 'uda', parent: 'grammaticale' },
    'uda14': { type: 'uda', parent: 'grammaticale' },
    'uda15': { type: 'uda', parent: 'grammaticale' },
    'uda16': { type: 'uda', parent: 'grammaticale' },
    'udaLogica1': { type: 'uda', parent: 'analisiLogica' },
    'udaLogica2': { type: 'uda', parent: 'analisiLogica' },
    'udaLogica3': { type: 'uda', parent: 'analisiLogica' },
    'udaLogica4': { type: 'uda', parent: 'analisiLogica' },
    'udaLogica_approfondimento': { type: 'uda', parent: 'analisiLogica' },
    'udaLogica5': { type: 'uda', parent: 'analisiLogica' },
    'uda_log_guidata1': { type: 'uda', parent: 'analisiLogica' },
    'udaLogica6': { type: 'uda', parent: 'analisiLogica' },
    'udaLogica7': { type: 'uda', parent: 'analisiLogica' },
    'udaLogica8': { type: 'uda', parent: 'analisiLogica' },
    'udaLogica9': { type: 'uda', parent: 'analisiLogica' },
    'udaLogica10': { type: 'uda', parent: 'analisiLogica' },
    'uda_log_guidata2': { type: 'uda', parent: 'analisiLogica' },
    'udaLogica11': { type: 'uda', parent: 'analisiLogica' },
    'udaLogica12': { type: 'uda', parent: 'analisiLogica' },
    'udaLogica13': { type: 'uda', parent: 'analisiLogica' },
    'udaLogica14': { type: 'uda', parent: 'analisiLogica' },
    'udaLogica15': { type: 'uda', parent: 'analisiLogica' },
    'udaLogica16': { type: 'uda', parent: 'analisiLogica' },
    'uda_log_guidata3': { type: 'uda', parent: 'analisiLogica' },
    'udaLogica17': { type: 'uda', parent: 'analisiLogica' },
    'udaLogica18': { type: 'uda', parent: 'analisiLogica' },
    'udaLogica19': { type: 'uda', parent: 'analisiLogica' },
    'udaLogica20': { type: 'uda', parent: 'analisiLogica' },
    'udaLogica21': { type: 'uda', parent: 'analisiLogica' },
    'udaPeriodo1': { type: 'uda', parent: 'analisiPeriodo' },
    'udaPeriodo2': { type: 'uda', parent: 'analisiPeriodo' },
    'udaPeriodo3': { type: 'uda', parent: 'analisiPeriodo' },
    'udaPeriodo4': { type: 'uda', parent: 'analisiPeriodo' },
    'udaPeriodo5': { type: 'uda', parent: 'analisiPeriodo' },
    'udaPeriodo6': { type: 'uda', parent: 'analisiPeriodo' },
    'udaPeriodo7': { type: 'uda', parent: 'analisiPeriodo' },
    'udaPeriodo8': { type: 'uda', parent: 'analisiPeriodo' },
    'udaPeriodo9': { type: 'uda', parent: 'analisiPeriodo' },
    'udaPeriodo10': { type: 'uda', parent: 'analisiPeriodo' },
    'udaPeriodo11': { type: 'uda', parent: 'analisiPeriodo' },
    'udaPeriodo12': { type: 'uda', parent: 'analisiPeriodo' },
    'udaPeriodo13': { type: 'uda', parent: 'analisiPeriodo' },
    'udaPeriodo14': { type: 'uda', parent: 'analisiPeriodo' },
    'udaPeriodoGuidata1': { type: 'uda', parent: 'analisiPeriodo' },
    'udaPeriodoGuidata2': { type: 'uda', parent: 'analisiPeriodo' },
    'udaPeriodoGuidataFinale': { type: 'uda', parent: 'analisiPeriodo' },

    'antologiche': { type: 'exercises', parent: 'lettura' },
    'favola': { type: 'exercises', parent: 'generi' },
    'fiaba': { type: 'exercises', parent: 'generi' },
    'fantasy': { type: 'exercises', parent: 'generi' },
    'avventura': { type: 'exercises', parent: 'generi' },
    'regolativo': { type: 'exercises', parent: 'generi' },
    'espositivo': { type: 'exercises', parent: 'generi' },
    'descrizione_gen': { type: 'exercises', parent: 'generi' },
    'poesia': { type: 'exercises', parent: 'generi' },
    'mistero': { type: 'exercises', parent: 'generi' },
    'horror': { type: 'exercises', parent: 'generi' },
    'giallo': { type: 'exercises', parent: 'generi' },
    'comico': { type: 'exercises', parent: 'generi' },
    'diario': { type: 'exercises', parent: 'generi' },
    'lettera': { type: 'exercises', parent: 'generi' },
    'argomentativo': { type: 'exercises', parent: 'generi' },
    'formazione': { type: 'exercises', parent: 'generi' },
    'psicologico': { type: 'exercises', parent: 'generi' },
    'sociale': { type: 'exercises', parent: 'generi' },
    'storico': { type: 'exercises', parent: 'generi' },
    'fantascienza': { type: 'exercises', parent: 'generi' },
    'surreale': { type: 'exercises', parent: 'generi' },
    'autobiografia': { type: 'exercises', parent: 'generi' },
    'biografia': { type: 'exercises', parent: 'generi' },
    'cronaca': { type: 'exercises', parent: 'generi' },
    'persona': { type: 'exercises', parent: 'descrizione' },
    'animale': { type: 'exercises', parent: 'descrizione' },
    'oggetto': { type: 'exercises', parent: 'descrizione' },
    'luogo': { type: 'exercises', parent: 'descrizione' },
    'esposizione': { type: 'exercises', parent: 'produzione' },
    'dizionario': { type: 'exercises', parent: 'produzione' },
    'campi_semantici': { type: 'exercises', parent: 'lessico' },
    'significati': { type: 'exercises', parent: 'lessico' },
    'relazioni': { type: 'exercises', parent: 'lessico' },

    'tecnica0': { type: 'uda', parent: 'riassunto' },
    'tecnica1': { type: 'uda', parent: 'riassunto' },
    'tecnica2': { type: 'uda', parent: 'riassunto' },
    'tecnica3': { type: 'uda', parent: 'riassunto' },
    'riformulazione': { type: 'exercises', parent: 'produzione' },
    // Leaf mapping per Analisi Logica
};

function initNavigation() {
    const openBtn = document.getElementById('sidebar-open-btn');
    const closeBtn = document.getElementById('sidebar-close-btn');
    const sidebar = document.querySelector('.navbar');

    function toggleSidebar(show) {
        if (show) {
            sidebar.classList.remove('hidden');
            if (openBtn) {
                openBtn.classList.add('hidden');
                openBtn.classList.remove('visible');
            }
            document.querySelector('main').classList.remove('full-width');
            document.querySelector('.footer').classList.remove('full-width');
        } else {
            sidebar.classList.add('hidden');
            if (openBtn) {
                openBtn.classList.remove('hidden');
                openBtn.classList.add('visible');
            }
            document.querySelector('main').classList.add('full-width');
            document.querySelector('.footer').classList.add('full-width');
        }
    }

    openBtn?.addEventListener('click', () => toggleSidebar(true));
    closeBtn?.addEventListener('click', () => toggleSidebar(false));

    // Use event delegation for all navigation items (even dynamic ones)
    document.addEventListener('click', (e) => {
        const navItem = e.target.closest('.nav-item');
        if (navItem) {
            e.preventDefault();
            const section = navItem.getAttribute('data-section');
            if (section) navigateTo(section);
            return;
        }

        if (window.innerWidth <= 1024) {
            const isClickInsideSidebar = sidebar.contains(e.target);
            const isClickOnOpenBtn = openBtn?.contains(e.target);
            if (!isClickInsideSidebar && !isClickOnOpenBtn && !sidebar.classList.contains('hidden')) {
                toggleSidebar(false);
            }
        }
    });

    if (window.innerWidth > 1024) toggleSidebar(true);
}

function navigateTo(section, subType = null, level = null, updateHash = true, extra = null) {
    if (!window.collapsedSections) window.collapsedSections = [];

    if (updateHash) {
        if (section !== window.currentSection) {
            window.collapsedSections = [];
        }
        const targetId = subType || section;

        let cursor = window.currentSection;
        if (window.currentExtra && window.MATERIE_HIERARCHY && window.MATERIE_HIERARCHY[window.currentExtra]) cursor = window.currentExtra;
        else if (window.currentLevel && window.MATERIE_HIERARCHY && window.MATERIE_HIERARCHY[window.currentLevel]) cursor = window.currentLevel;
        else if (window.currentSubType && window.MATERIE_HIERARCHY && window.MATERIE_HIERARCHY[window.currentSubType]) cursor = window.currentSubType;

        const currentPath = [];
        while (cursor && cursor !== 'materie') {
            currentPath.unshift(cursor);
            let parent = null;
            if (window.MATERIE_HIERARCHY && window.MATERIE_HIERARCHY[cursor]) {
                parent = window.MATERIE_HIERARCHY[cursor].parent;
            } else if (window.MATERIE_HIERARCHY) {
                for (const k in window.MATERIE_HIERARCHY) {
                    if (window.MATERIE_HIERARCHY[k].items && window.MATERIE_HIERARCHY[k].items.some(item => item.id === cursor)) {
                        parent = k;
                        break;
                    }
                }
            }
            cursor = parent;
        }

        let hash = `#${section}`;
        if (subType) hash += `/${subType}`;
        if (level) hash += `/${level}`;
        if (extra) hash += `/${extra}`;

        if (currentPath.includes(targetId)) {
            const isDifferentView = (section !== window.currentSection) ||
                (subType !== window.currentSubType) ||
                (level !== window.currentLevel) ||
                (extra !== window.currentExtra);

            if (!isDifferentView) {
                const idx = window.collapsedSections.indexOf(targetId);
                if (idx > -1) window.collapsedSections.splice(idx, 1);
                else window.collapsedSections.push(targetId);
                if (typeof updateSidebarMenu === 'function') updateSidebarMenu();
                return;
            }
        } else {
            const idx = window.collapsedSections.indexOf(targetId);
            if (idx > -1) window.collapsedSections.splice(idx, 1);
        }

        window.location.hash = hash;
        return;
    }

    const appContainer = document.getElementById('app');
    try {
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

        if (section === 'home' || section === '') {
            window.currentSection = 'home';
            window.currentSubType = null;
            window.currentLevel = null;
            window.currentExtra = null;
            window.collapsedSections = [];
            renderHomePage();
            document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
            document.querySelector('.nav-item[data-section="home"]')?.classList.add('active');
            if (typeof updateSidebarMenu === 'function') updateSidebarMenu();
            return;
        }

        if (section === 'contatti') {
            renderContattiPage();
            document.querySelector('.nav-item[data-section="contatti"]')?.classList.add('active');
            if (typeof updateSidebarMenu === 'function') updateSidebarMenu();
            return;
        }
        if (section === 'profilo') {
            renderProfiloPage();
            document.querySelector('.nav-item[data-section="profilo"]')?.classList.add('active');
            if (typeof updateSidebarMenu === 'function') updateSidebarMenu();
            return;
        }
        if (section === 'admin') {
            const user = Auth.getUser();
            if (user.role === 'admin') {
                renderAdminPage();
            } else {
                window.location.hash = 'home';
            }
            if (typeof updateSidebarMenu === 'function') updateSidebarMenu();
            return;
        }
        if (section === 'ripassa') {
            renderRipassaPage();
            document.querySelector('.nav-item[data-section="ripassa"]')?.classList.add('active');
            if (typeof updateSidebarMenu === 'function') updateSidebarMenu();
            return;
        }

        document.querySelector(`.nav-item[data-section="${section}"]`)?.classList.add('active');
        appContainer.innerHTML = '<div id="exercise-mount"></div>';

        currentSection = section; currentSubType = subType; currentLevel = level; currentExtra = extra;
        window.currentSubQuestionIndex = 0;

        const pathKey = `progress_${section}_${subType}_${level}_${extra}`;
        if (window.currentPathKey !== pathKey) {
            window.currentExerciseIndex = (extra === 'scopri' || level === 'scopri' || subType === 'scopri') ? 0 : parseInt(localStorage.getItem(pathKey) || '0');
            window.currentPathKey = pathKey;
        }

        const isActualLevel = ['facile', 'intermedio', 'avanzato', 'sfida', 'difficile', 'a1', 'a2', 'b1', 'b2'].includes(extra || level || subType);
        const isUdaPhase = ['scopri', 'allenati', 'verifica', 'recupera'].includes(extra) ||
            ['scopri', 'allenati', 'verifica', 'recupera'].includes(level) ||
            ['scopri', 'allenati', 'verifica', 'recupera'].includes(subType);

        const currentId = extra || level || subType || section;

        // Reconstruct the full hierarchical path for robust data resolution
        const resolvedPath = [];
        let resolveCursor = currentId;
        const phases = ['scopri', 'allenati', 'verifica', 'recupera'];
        const levels = ['facile', 'intermedio', 'avanzato', 'sfida', 'difficile', 'a1', 'a2', 'b1', 'b2'];

        if (phases.includes(resolveCursor) || levels.includes(resolveCursor)) {
            resolvedPath.unshift(resolveCursor);
            resolveCursor = (currentId === extra) ? (level || subType || section) : (currentId === level ? (subType || section) : section);
        }

        while (resolveCursor && resolveCursor !== 'materie') {
            resolvedPath.unshift(resolveCursor);
            let parent = null;
            if (MATERIE_HIERARCHY[resolveCursor]) {
                parent = MATERIE_HIERARCHY[resolveCursor].parent;
            } else {
                for (const k in MATERIE_HIERARCHY) {
                    if (MATERIE_HIERARCHY[k].items && MATERIE_HIERARCHY[k].items.some(i => i.id === resolveCursor)) {
                        parent = k;
                        break;
                    }
                }
            }
            resolveCursor = parent;
        }
        const fullPath = resolvedPath;

        if (isActualLevel) {
            const actualLevel = extra || level || subType;
            loadExercise(fullPath);
        } else if (isUdaPhase) {
            loadUdaPhase(fullPath);
        } else {
            let target = MATERIE_HIERARCHY[currentId];
            if (!target) {
                for (const k in MATERIE_HIERARCHY) {
                    if (MATERIE_HIERARCHY[k].items) {
                        const item = MATERIE_HIERARCHY[k].items.find(i => i.id === currentId);
                        if (item) { target = item; break; }
                    }
                }
            }
            if (target?.type === 'submenu') renderSubMateriePage(currentId);
            else if (target?.type === 'exercises') renderLevelSelector(currentId, fullPath);
            else if (target?.type === 'uda') {
                if (['tecnica0', 'tecnica1', 'tecnica2', 'tecnica3'].includes(currentId)) {
                    navigateTo(currentId, 'scopri');
                } else {
                    renderUdaMenu(currentId, fullPath);
                }
            }
            else mountError("Tipo di contenuto non riconosciuto: " + (target?.type || 'sconosciuto') + " per " + currentId);
        }
        if (typeof updateSidebarMenu === 'function') updateSidebarMenu();
    } catch (err) {
        console.error("Routing error:", err);
        appContainer.innerHTML = `
            <div class="exercise-container" style="text-align: center; padding: 3rem;">
                <h2>⚠️ Errore di Caricamento</h2>
                <p style="margin-top: 1rem; color: #666;">Si è verificato un errore durante la navigazione.</p>
                <p style="font-family: monospace; background: #fff0f0; color: #d32f2f; padding: 1rem; border-radius: 10px; margin: 1.5rem 0; font-size: 0.9rem;">${err.message}</p>
                <button class="btn btn-primary" onclick="navigateTo('home')">TORNA ALLA HOME</button>
            </div>
        `;
    }
}

function getExerciseData(path) {
    if (!window.exercisesData) {
        console.error("getExerciseData: window.exercisesData is undefined");
        return { error: "Dati non caricati. Riprova tra un istante." };
    }

    console.log("Resolving path:", path.join(" > "));

    let d = window.exercisesData;
    for (let i = 0; i < path.length; i++) {
        let k = path[i];
        if (!k || k === 'null' || k === '') continue;

        if (!d[k]) {
            console.error(`Key mismatch: '${k}' not found in`, d);
            const availableKeys = Object.keys(d).join(", ");
            return {
                error: `Percorso non trovato: <b>${path.join("/")}</b>.<br>Chiave mancante: '<b>${k}</b>' (livello ${i}).<br>Chiavi disponibili qui: ${availableKeys}`
            };
        }
        d = d[k];
    }
    return d;
}

function mountError(message) {
    document.getElementById('exercise-mount').innerHTML = `
        <div class="exercise-container">
            <h2>OPS! QUALCOSA È ANDATO STORTO</h2>
            <div class="error-card">
                <p>${message || 'Non siamo riusciti a caricare questo contenuto.'}</p>
                <button class="btn btn-primary" onclick="window.location.hash = 'home'">TORNA ALLA HOME</button>
            </div>
        </div>
    `;
    console.error("Mount error:", message);
}


function loadExercise(path) {
    window.currentPath = path;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Update history
    const sectionTitle = (typeof MATERIE_HIERARCHY !== 'undefined' && MATERIE_HIERARCHY[path[0]]) ? MATERIE_HIERARCHY[path[0]].title : path[0];
    const subTitle = (typeof MATERIE_HIERARCHY !== 'undefined' && MATERIE_HIERARCHY[path[1]]) ? MATERIE_HIERARCHY[path[1]].title : (path[1] || '');
    if (typeof updateHistory === 'function') updateHistory(`${sectionTitle}${subTitle ? ' > ' + subTitle : ''}`, (typeof MATERIE_HIERARCHY !== 'undefined' && MATERIE_HIERARCHY[path[0]]?.icon) || '🏋️', window.location.hash);

    const mount = document.getElementById('exercise-mount');
    const data = getExerciseData(path);
    if (!data || data.error) {
        mountError(data?.error || 'Dati non trovati per: ' + path.join('/'));
        return;
    }

    const exercises = typeof groupExercises === 'function' ? groupExercises(Array.isArray(data) ? data : (data.facile || [])) : (Array.isArray(data) ? data : (data.facile || []));
    
    mount.innerHTML = getTeacherShareButton();

    if (window.currentExerciseIndex === 0 && window.Progress && window.Progress.startLesson) {
        window.Progress.startLesson(exercises.length);
    }

    const exercise = exercises[window.currentExerciseIndex];
    if (!exercise) {
        let statsHtml = '';
        if (window.Progress && window.Progress.currentLessonCorrectCount !== undefined) {
            statsHtml = `
                <div style="display: flex; justify-content: center; gap: 2rem; margin-top: 1.5rem; margin-bottom: 2rem; background: #fff; padding: 1.5rem; border-radius: 20px; border: 1px solid #eee;">
                    <div>
                        <div style="font-size: 2rem; font-weight: 800; color: #27ae60;">${window.Progress.currentLessonCorrectCount}</div>
                        <div style="font-size: 0.85rem; color: #666; font-weight: 700;">🎯 TRAGUARDI RAGGIUNTI</div>
                    </div>
                    <div style="border-left: 2px solid #eee;"></div>
                    <div>
                        <div style="font-size: 2rem; font-weight: 800; color: #e74c3c;">${window.Progress.currentLessonMistakeCount || 0}</div>
                        <div style="font-size: 0.85rem; color: #666; font-weight: 700;">💡 RIPRISTINI NECESSARI</div>
                    </div>
                </div>
            `;
        }
        mount.innerHTML = `
            <div class="exercise-container" style="text-align: center;">
                <h2 style="font-size: 2.5rem; color: var(--primary-color);">COMPLIMENTI!</h2>
                <div style="font-size: 4rem; margin: 1rem 0;">🏆</div>
                <p style="font-size: 1.2rem; margin-bottom: 2rem;">Hai terminato tutti gli esercizi per questo livello. Sei pronto per una nuova sfida?</p>
                ${statsHtml}
                <button class="btn btn-primary" onclick="window.history.back()" style="margin-top: 2rem; width: 100%; max-width: 300px;">VAI INDIETRO</button>
            </div>
        `;
        return;
    }

    if (exercise.type && exercise.type !== 'multiple-choice') mount.innerHTML = window.UI.renderInteractive(exercise, false, path, exercises.length);
    else if (exercise.target) mount.innerHTML = path.includes('analisiLogica') ? window.UI.renderLogica(exercise, false, path, exercises.length) : window.UI.renderPeriodo(exercise, false, path, exercises.length);
    else if (path.includes('punteggiatura')) mount.innerHTML = window.UI.renderPunteggiatura(exercise, false, path, exercises.length);
    else if (path.includes('lettura')) mount.innerHTML = window.UI.renderLettura(exercise, false, path, exercises.length);
    else if (path.includes('descrizione') || path.includes('produzione')) mount.innerHTML = window.UI.renderProduzione(exercise, false, path, exercises.length);
    else if (path.includes('lessico')) mount.innerHTML = window.UI.renderLessico(exercise, false, path, exercises.length);
    else mount.innerHTML = window.UI.renderGrammatica(exercise, false, path, exercises.length);

    // Prepend teacher share button if role is docente
    const user = Auth.getUser();
    if (user.role === 'docente') {
        const shareDiv = document.createElement('div');
        shareDiv.innerHTML = getTeacherShareButton();
        mount.prepend(shareDiv);
    }
}

function loadUdaPhase(path) {
    window.currentPath = path;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Update history
    const sectionTitle = (typeof MATERIE_HIERARCHY !== 'undefined' && MATERIE_HIERARCHY[path[0]]) ? MATERIE_HIERARCHY[path[0]].title : path[0];
    const subTitle = (typeof MATERIE_HIERARCHY !== 'undefined' && MATERIE_HIERARCHY[path[1]]) ? MATERIE_HIERARCHY[path[1]].title : (path[1] || '');
    if (typeof updateHistory === 'function') updateHistory(`${sectionTitle}${subTitle ? ' > ' + subTitle : ''}`, (typeof MATERIE_HIERARCHY !== 'undefined' && MATERIE_HIERARCHY[path[0]]?.icon) || '🏋️', window.location.hash);

    const mount = document.getElementById('exercise-mount');
    const data = getExerciseData(path);
    if (!data || data.error) {
        mountError(data?.error || 'Nessun dato trovato per il percorso: ' + path.join('/'));
        return;
    }

    const phase = path[path.length - 1]; // scopri, allenati, verifica, recupera
    const exercises = typeof groupExercises === 'function' ? groupExercises(Array.isArray(data) ? data : []) : (Array.isArray(data) ? data : []);

    if (window.currentExerciseIndex === 0 && window.Progress && window.Progress.startLesson) {
        window.Progress.startLesson(exercises.length);
    }

    const exercise = exercises[window.currentExerciseIndex];

    if (!exercise && phase !== 'recupera') {
        // Se la fase è 'verifica', calcoliamo il punteggio
        if (phase === 'verifica') {
            const score = window.Progress.getUdaScore();
            if (score < 70) {
                mount.innerHTML = window.UI.renderUdaPhaseEnd(phase, score, true, path);
            } else {
                mount.innerHTML = window.UI.renderUdaPhaseEnd(phase, score, false, path);
            }
        } else {
            mount.innerHTML = window.UI.renderUdaPhaseEnd(phase, 100, false, path);
        }
        return;
    }

    if (phase === 'scopri') {
        mount.innerHTML = window.UI.renderScopri(exercise, path, exercises.length);
    } else if (phase === 'recupera') {
        mount.innerHTML = window.UI.renderRecupera(data, path);
    } else {
        // Se l'esercizio ha un tipo interattivo specifico (es. completion, highlight, drag-drop, classification-grid)
        if (exercise.type && exercise.type !== 'multiple-choice') {
            mount.innerHTML = window.UI.renderInteractive(exercise, true, path, exercises.length);
        } else if (path.includes('analisiLogica')) {
            mount.innerHTML = window.UI.renderLogica(exercise, true, path, exercises.length);
        } else if (path.includes('analisiPeriodo')) {
            mount.innerHTML = window.UI.renderPeriodo(exercise, true, path, exercises.length);
        } else {
            if (phase === 'allenati') {
                mount.innerHTML = window.UI.renderAllenati(exercise, path, exercises.length);
            } else if (phase === 'verifica') {
                mount.innerHTML = window.UI.renderVerifica(exercise, path, exercises.length);
            }
        }
    }

    // Prepend teacher share button if role is docente
    const user = Auth.getUser();
    if (user.role === 'docente') {
        const shareDiv = document.createElement('div');
        shareDiv.innerHTML = getTeacherShareButton();
        mount.prepend(shareDiv);
    }
}

function checkSubAnswer(selected, correct, id) {
    const hash = window.location.hash.substring(1);
    const parts = hash.split('/').filter(p => p && p !== 'null');
    const section = parts[0];
    const subType = parts[1];
    const level = parts[2];
    const extra = parts[3];

    const path = [];
    let cursor = section;
    while (cursor && cursor !== 'materie') {
        path.unshift(cursor);
        cursor = MATERIE_HIERARCHY[cursor] ? MATERIE_HIERARCHY[cursor].parent : null;
    }
    if (subType) path.push(subType);
    if (level) path.push(level);
    if (extra) path.push(extra);

    const data = getExerciseData(path);
    const phase = path[path.length - 1];
    const exercises = Array.isArray(data) ? data : (data?.facile || []);
    const exercise = exercises.find(ex => ex.id === id);

    if (selected === correct) {
        window.Progress.addPoints(10);
        if (window.Progress.currentLessonCorrectCount !== undefined) window.Progress.currentLessonCorrectCount++;

        window.UI.showFeedback(true, {
            map: "Corretto! Ottimo lavoro.",
            reasoning: "Hai dimostrato di padroneggiare questo concetto.",
            example: "Continua così!"
        }, () => {
            window.currentSubQuestionIndex++;
            if (window.currentSubQuestionIndex >= exercise.questions.length) {
                window.currentSubQuestionIndex = 0;
                window.currentExerciseIndex++;
                const pathKey = `progress_${currentSection}_${currentSubType}_${currentLevel}_${currentExtra}`;
                localStorage.setItem(pathKey, window.currentExerciseIndex.toString());

                if (window.currentExerciseIndex >= exercises.length) {
                    let statsHtml = '';
                    if (window.Progress && window.Progress.currentLessonCorrectCount !== undefined) {
                        statsHtml = `
                            <div style="display: flex; justify-content: center; gap: 2rem; margin-top: 1.5rem; margin-bottom: 2rem; background: #fff; padding: 1.5rem; border-radius: 20px; border: 1px solid #eee;">
                                <div>
                                    <div style="font-size: 2rem; font-weight: 800; color: #27ae60;">${window.Progress.currentLessonCorrectCount}</div>
                                    <div style="font-size: 0.85rem; color: #666; font-weight: 700;">🎯 TRAGUARDI RAGGIUNTI</div>
                                </div>
                                <div style="border-left: 2px solid #eee;"></div>
                                <div>
                                    <div style="font-size: 2rem; font-weight: 800; color: #e74c3c;">${window.Progress.currentLessonMistakeCount || 0}</div>
                                    <div style="font-size: 0.85rem; color: #666; font-weight: 700;">💡 RIPRISTINI NECESSARI</div>
                                </div>
                            </div>
                        `;
                    }
                    localStorage.setItem('concluded_' + pathKey, 'true');
                    const score = window.Progress.getUdaScore();
                    document.getElementById('exercise-mount').innerHTML = window.UI.renderUdaPhaseEnd(phase, score, score < 70, path);
                } else {
                    if (['scopri', 'allenati', 'verifica', 'recupera'].includes(phase)) loadUdaPhase(path);
                    else loadExercise(path);
                }
            } else {
                if (['scopri', 'allenati', 'verifica', 'recupera'].includes(phase)) loadUdaPhase(path);
                else loadExercise(path);
            }
        }, path);
    } else {
        if (window.Progress.currentLessonMistakeCount !== undefined) window.Progress.currentLessonMistakeCount++;
        window.UI.showFeedback(false, {
            map: "Riprova!",
            reasoning: "Rileggi il testo con attenzione.",
            example: "Fai un altro tentativo."
        }, null, path);
    }
}

function checkAnswer(selected, correct, type, id, feedbackOverride = null) {
    const path = window.currentPath || [];
    
    // Fallback path reconstruction if global is missing
    if (path.length === 0) {
        const hash = window.location.hash.substring(1);
        const parts = hash.split('/').filter(p => p && p !== 'null');
        const section = parts[0];
        const subType = parts[1];
        let cursor = section;
        while (cursor && cursor !== 'materie') {
            path.unshift(cursor);
            cursor = (typeof MATERIE_HIERARCHY !== 'undefined' && MATERIE_HIERARCHY[cursor]) ? MATERIE_HIERARCHY[cursor].parent : null;
        }
        if (subType) path.push(subType);
    }

    const data = getExerciseData(path);
    const phase = path[path.length - 1];
    const exercises = Array.isArray(data) ? data : (data?.facile || []);
    const exercise = exercises.find(ex => ex.id === id);
    const feedback = feedbackOverride || exercise?.feedback || { map: "Riprova!", reasoning: "Pensa con calma.", success: "Ottimo lavoro!", example: "Hai applicato correttamente la regola." };

    const onConfirm = () => {
        window.currentExerciseIndex++;
        const pathKey = `progress_${currentSection}_${currentSubType}_${currentLevel}_${currentExtra}`;
        localStorage.setItem(pathKey, window.currentExerciseIndex.toString());

        if (window.currentExerciseIndex >= exercises.length) {
            // Fine della fase
            localStorage.setItem('concluded_' + pathKey, 'true');
            const score = window.Progress.getUdaScore();
            document.getElementById('exercise-mount').innerHTML = window.UI.renderUdaPhaseEnd(phase, score, score < 70, path);
        } else {
            if (['scopri', 'allenati', 'verifica', 'recupera'].includes(phase)) loadUdaPhase(path);
            else loadExercise(path);
        }
    };

    if (selected === correct) {
        window.Progress.addPoints(10);
        window.Progress.completeExercise(id);
        if (window.Progress.currentLessonCorrectCount !== undefined) window.Progress.currentLessonCorrectCount++;

        const successFeedback = {
            map: feedback.success || "Corretto! Ottimo lavoro.",
            reasoning: feedback.reasoning || "Hai dimostrato di padroneggiare questo concetto.",
            example: feedback.example || "Continua così per completare la sfida!"
        };

        if (phase === 'scopri') {
            onConfirm();
        } else {
            window.UI.showFeedback(true, successFeedback, onConfirm, path);
        }
    } else {
        if (window.Progress.addMistake) window.Progress.addMistake(id);

        let errorsHtml = '';
        if (selected.includes('|') || correct.includes('|')) {
            const selParts = selected.split('|');
            const corrParts = correct.split('|');
            errorsHtml = '<ul style="font-size: 1.15rem; line-height: 1.8; padding-left: 1.5rem; margin: 0; color: #742a2a;">';
            for (let i = 0; i < corrParts.length; i++) {
                const isItemCorrect = (selParts[i] || '').toLowerCase() === corrParts[i].toLowerCase();
                const statusIcon = isItemCorrect ? '<span style="color: #27ae60;">✅</span>' : '<span style="color: #e74c3c;">❌</span>';
                const correction = isItemCorrect ? '' : ` <span style="color: #27ae60; font-weight: bold;">(Corretto: ${corrParts[i]})</span>`;
                
                errorsHtml += `<li style="margin-bottom: 0.5rem; list-style: none;">${statusIcon} Voce ${i + 1}: "<strong>${selParts[i] || 'nulla'}</strong>"${correction}</li>`;
            }
            errorsHtml += '</ul>';
        }

        const advancedFeedback = {
            map: feedback.map || feedback.error || `La risposta non è corretta. <br><span style="color: #27ae60; font-weight: bold;">La risposta corretta era: ${correct}</span>`,
            errorsHtml: errorsHtml
        };

        window.UI.showFeedback(false, advancedFeedback, onConfirm, path);
    }
}

// --- LOGICA INTERATTIVA ---

window.checkCompletionAnswer = (id, correct) => {
    const inputs = document.querySelectorAll('.completion-input');
    const selected = Array.from(inputs).map(i => i.value.trim().toLowerCase()).join('|');
    checkAnswer(selected, correct.toLowerCase(), 'completion', id);
};

window.cycleWordState = (el, idx) => {
    if (el.classList.contains('dittongo')) {
        el.classList.remove('dittongo');
        el.classList.add('trittongo');
    } else if (el.classList.contains('trittongo')) {
        el.classList.remove('trittongo');
    } else {
        el.classList.add('dittongo');
    }
};

window.checkHighlightResults = (id, correctDittonghiStr, correctTrittonghiStr) => {
    const tags = document.querySelectorAll('.word-tag');
    const correctDittonghi = (correctDittonghiStr || "").toLowerCase().split(/\s+/).filter(Boolean);
    const correctTrittonghi = (correctTrittonghiStr || "").toLowerCase().split(/\s+/).filter(Boolean);
    
    let errors = 0;
    let foundD = 0;
    let foundT = 0;
    
    tags.forEach(tag => {
        const word = tag.innerText.replace(/[.,\/#!$%\^&\*;:{}=\-_~()]/g,"").trim().toLowerCase();
        const isD = tag.classList.contains('dittongo');
        const isT = tag.classList.contains('trittongo');
        
        const shouldBeD = correctDittonghi.includes(word);
        const shouldBeT = correctTrittonghi.includes(word);
        
        if (isD && !shouldBeD) errors++;
        if (isT && !shouldBeT) errors++;
        if (!isD && shouldBeD) errors++;
        if (!isT && shouldBeT) errors++;
        
        if (isD && shouldBeD) foundD++;
        if (isT && shouldBeT) foundT++;
    });
    
    if (errors === 0) {
        checkAnswer('ok', 'ok', 'highlight', id);
    } else {
        // Mock feedback call to trigger the 'HO CAPITO, VAI AVANTI' modal via checkAnswer
        // or call showFeedback with the specialized info but passing onConfirm equivalent
        checkAnswer('error', 'ok', 'highlight', id, {
            map: "Ci sono ancora degli errori o delle parole mancanti.",
            reasoning: "Hai trovato " + foundD + " dittonghi e " + foundT + " trittonghi su quelli totali.",
            example: "Ricorda: il dittongo è l'unione di due vocali, il trittongo di tre. Rileggi bene le parole che non hai segnato!"
        });
    }
};


window.checkHighlightAnswer = (id, correct) => {
    const selected = Array.from(document.querySelectorAll('.word-tag.selected')).map(s => s.innerText).join(' ');
    checkAnswer(selected, correct, 'highlight', id);
};

window.checkHighlightDoubleAnswer = (id, correctDittongo, correctTrittongo) => {
    const selDittongo = Array.from(document.querySelectorAll('.word-tag.selected-dittongo'))
        .map(s => s.innerText.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").trim())
        .join(' ');
    const selTrittongo = Array.from(document.querySelectorAll('.word-tag.selected-trittongo'))
        .map(s => s.innerText.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").trim())
        .join(' ');

    const dOk = selDittongo === correctDittongo;
    const tOk = selTrittongo === correctTrittongo;

    if (dOk && tOk) {
        checkAnswer("ok", "ok", 'highlight-double', id);
    } else {
        checkAnswer("error", "ok", 'highlight-double', id);
    }
};

window.dragDropState = {};
window.onDropItem = (e, targetIdx) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('text');
    e.target.innerText = data;
    e.target.style.background = "#e0f7fa";
    e.target.style.borderColor = "var(--primary-color)";
    window.dragDropState[targetIdx] = data;
};

window.checkDragDropAnswer = (id, correct) => {
    // Trasforma l'oggetto state in stringa ordinata: "Valore1|Valore2|..."
    const selected = Object.keys(window.dragDropState)
        .sort((a, b) => a - b)
        .map(k => window.dragDropState[k])
        .join('|');

    checkAnswer(selected, correct, 'drag-drop', id);
    window.dragDropState = {}; // Reset per il prossimo
};

window.toggleWordSelection = (el) => {
    el.classList.toggle('selected');
};

window.checkWordSelectorAnswer = (id, correct) => {
    const selected = Array.from(document.querySelectorAll('.word-selector-span.selected'))
        .map(s => s.innerText.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").trim().toLowerCase());
    
    const correctParts = correct.toLowerCase().split('|').map(p => p.trim());
    
    // Controlliamo se tutte le parole corrette sono state selezionate e nient'altro
    const isCorrect = selected.length === correctParts.length && 
                      correctParts.every(cp => selected.includes(cp));
                      
    if (isCorrect) {
        checkAnswer('ok', 'ok', 'word-selector', id);
    } else {
        checkAnswer('error', 'ok', 'word-selector', id, {
            map: "La selezione non è corretta.",
            reasoning: `Hai selezionato ${selected.length} elementi, ma la risposta corretta ne prevede ${correctParts.length}.`,
            success: "Ottimo lavoro!",
            example: "Rileggi con attenzione la frase e clicca solo sugli elementi richiesti."
        });
    }
};

function navigateExercise(direction, pathStr, skipVerify = false) {
    const path = pathStr.split(',');
    
    // Se andiamo avanti e non abbiamo skippato la verifica, controlliamo se l'esercizio è completato
    if (direction === 1 && !skipVerify) {
        const verifyBtn = document.querySelector('.btn-verify');
        if (verifyBtn) {
            let isCompleted = false;
            
            // Logica per determinare se è completato in base al tipo
            const inputs = document.querySelectorAll('.exercise-container input[type="text"]');
            if (inputs.length > 0) {
                isCompleted = Array.from(inputs).every(i => i.value.trim() !== '');
            }
            
            const selectedWords = document.querySelectorAll('.word-selector-span.selected');
            if (selectedWords.length > 0) isCompleted = true;
            
            const radioGroups = new Set(Array.from(document.querySelectorAll('input[type="radio"]')).map(r => r.name));
            if (radioGroups.size > 0) {
                isCompleted = Array.from(radioGroups).every(name => document.querySelector(`input[name="${name}"]:checked`));
            }
            
            const dragZones = document.querySelectorAll('.drop-zone');
            if (dragZones.length > 0) {
                isCompleted = Array.from(dragZones).every(z => z.children.length > 0);
            }

            if (isCompleted) {
                verifyBtn.click();
                return; // Fermiamo la navigazione, il feedback gestirà il "prosegui"
            }
        }
    }

    window.currentExerciseIndex += direction;
    if (window.currentExerciseIndex < 0) {
        window.currentExerciseIndex = 0;
        window.history.back();
        return;
    }

    // Save progress
    const pathKey = `progress_${path[0] || ''}_${path[1] || ''}_${path[2] || ''}_${path[3] || ''}`;
    localStorage.setItem(pathKey, window.currentExerciseIndex.toString());

    const mount = document.getElementById('exercise-mount');
    const phase = path[path.length - 1];
    if (['scopri', 'allenati', 'verifica'].includes(phase)) loadUdaPhase(path);
    else loadExercise(path);
}

window.checkMultiGridAnswer = (id, correctAnswers) => {
    // Gestione di emergenza se correctAnswers non è un array (es. stringa singola da legacy data)
    const answersArray = Array.isArray(correctAnswers) ? correctAnswers : [correctAnswers];
    
    const selected = [];
    for (let i = 0; i < answersArray.length; i++) {
        const sel = document.querySelector(`input[name="classif-${id}-${i}"]:checked`)?.value;
        selected.push(sel || "");
    }

    // Lo trasformiamo in stringa separata da | per compatibilità con checkAnswer
    const selectedStr = selected.join('|');
    const correctStr = answersArray.join('|');

    checkAnswer(selectedStr, correctStr, 'classification-grid', id);
};

// --- GESTIONE NAVIGAZIONE ---
// --- GESTIONE PROGRESSI ---
window.Progress = {
    currentUdaCorrect: 0,
    currentUdaTotal: 0,
    currentLessonCorrectCount: 0,
    currentLessonMistakeCount: 0,

    load: async () => {
        if (!window.fbAuth || !window.fbAuth.currentUser || Auth.getUser().isGuest) return;
        const uid = window.fbAuth.currentUser.uid;
        try {
            const doc = await window.fbDb.collection('progress').doc(uid).get();
            if (doc.exists) {
                const data = doc.data();
                if (data.points !== undefined) localStorage.setItem('user_points', data.points.toString());
                if (data.completed) localStorage.setItem('user_completed_exercises', JSON.stringify(data.completed));
                if (data.mistakes) localStorage.setItem('user_mistakes', JSON.stringify(data.mistakes));
                if (data.vocab) localStorage.setItem('palestra_vocab', JSON.stringify(data.vocab));
                console.log("☁️ Progressi caricati dal cloud con successo");
                
                // Aggiorna UI se siamo nel profilo
                if (window.currentSection === 'profilo') renderProfiloPage();
            }
        } catch (e) { console.error("Load error:", e); }
    },

    sync: async () => {
        if (!window.fbAuth || !window.fbAuth.currentUser || Auth.getUser().isGuest) return;
        const uid = window.fbAuth.currentUser.uid;
        const data = {
            points: parseInt(localStorage.getItem('user_points') || '0'),
            completed: JSON.parse(localStorage.getItem('user_completed_exercises') || '[]'),
            mistakes: JSON.parse(localStorage.getItem('user_mistakes') || '[]'),
            vocab: JSON.parse(localStorage.getItem('palestra_vocab') || '[]'),
            lastUpdated: new Date().toISOString()
        };
        try {
            await window.fbDb.collection('progress').doc(uid).set(data, { merge: true });
        } catch (e) { console.error("Sync error:", e); }
    },

    addPoints: (p) => {
        let pts = parseInt(localStorage.getItem('user_points') || '0');
        pts += p;
        localStorage.setItem('user_points', pts.toString());
        window.Progress.sync();
    },
    getPoints: () => parseInt(localStorage.getItem('user_points') || '0'),

    startLesson: (total) => {
        window.Progress.currentLessonCorrectCount = 0;
        window.Progress.currentLessonMistakeCount = 0;
        window.Progress.currentUdaTotal = total;
    },
    addUdaScore: (points) => {
        window.Progress.currentUdaCorrect += points;
    },
    getUdaScore: () => {
        if (window.Progress.currentUdaTotal === 0) return 0;
        return Math.round((window.Progress.currentUdaCorrect / window.Progress.currentUdaTotal) * 100);
    },
    addMistake: (id) => {
        window.Progress.currentLessonMistakeCount++;
        let mistakes = JSON.parse(localStorage.getItem('user_mistakes') || '[]');
        if (!mistakes.includes(id)) {
            mistakes.push(id);
            localStorage.setItem('user_mistakes', JSON.stringify(mistakes));
            window.Progress.sync();
        }
    },
    completeExercise: (id) => {
        let completed = JSON.parse(localStorage.getItem('user_completed_exercises') || '[]');
        if (!completed.includes(id)) {
            completed.push(id);
            localStorage.setItem('user_completed_exercises', JSON.stringify(completed));
            window.Progress.sync();
        }
    },
    getCompletedCount: () => {
        let completed = JSON.parse(localStorage.getItem('user_completed_exercises') || '[]');
        return completed.length;
    },
    isExerciseCompleted: (path) => {
        let completed = JSON.parse(localStorage.getItem('user_completed_exercises') || '[]');
        return completed.some(id => id.includes(path) || path.includes(id));
    }
};

function renderSubMateriePage(id) { document.getElementById('exercise-mount').innerHTML = window.UI.renderSubMenu(id, MATERIE_HIERARCHY); }
function renderLevelSelector(id, dataPath) {
    const data = getExerciseData(dataPath);
    if (Array.isArray(data)) {
        loadExercise(dataPath);
    } else {
        document.getElementById('exercise-mount').innerHTML = window.UI.renderSectionMenu(id, MATERIE_HIERARCHY, data);
    }
}
function renderUdaMenu(id, fullPath) {
    const mount = document.getElementById('exercise-mount');
    mount.innerHTML = window.UI.renderUdaMenu(id, fullPath);
    
    // Prepend teacher share button if role is docente
    const user = Auth.getUser();
    if (user.role === 'docente') {
        const shareDiv = document.createElement('div');
        shareDiv.innerHTML = getTeacherShareButton();
        mount.prepend(shareDiv);
    }
}

function groupExercises(rawExercises) {
    if (!Array.isArray(rawExercises) || rawExercises.length === 0) return rawExercises;

    const phase = window.location.hash.split('/').pop();
    if (phase === 'scopri' || phase === 'recupera') return rawExercises;

    const hasStructured = rawExercises.some(ex => ex.text && (ex.text.includes('<ol>') || ex.text.includes('<li>')));
    if (hasStructured) return rawExercises;

    const grouped = [];
    let currentGroup = null;

    for (const ex of rawExercises) {
        // Can group completion OR multiple-choice OR basic grammar exercises
        const canGroup = ex.type === 'completion' || ex.type === 'multiple-choice' || !ex.type;

        if (!canGroup) {
            if (currentGroup) {
                grouped.push(finalizeGroup(currentGroup));
                currentGroup = null;
            }
            grouped.push(ex);
            continue;
        }

        // Check if instructions are the same to keep grouping logical
        const sameInstruction = !currentGroup || currentGroup.instruction === (ex.instruction || "Esercizio di consolidamento");

        if (currentGroup && sameInstruction) {
            currentGroup.items.push(ex);
        } else {
            if (currentGroup) grouped.push(finalizeGroup(currentGroup));
            currentGroup = {
                id: ex.id,
                type: ex.type || 'grammaticale',
                title: ex.title || "Esercizio di consolidamento",
                instruction: ex.instruction || "Scegli la risposta corretta.",
                items: [ex]
            };
        }
    }

    if (currentGroup) {
        grouped.push(finalizeGroup(currentGroup));
    }

    return grouped;
}

function finalizeGroup(group) {
    if (group.items.length === 1) {
        return group.items[0];
    }

    // If it's completion, we use the list-based approach
    if (group.type === 'completion') {
        let textHtml = `<div style='text-align: left; padding-left: 2rem;'><ol>`;
        const answers = [];

        for (const item of group.items) {
            let itemText = item.text || "";
            textHtml += `<li>${itemText}</li>`;
            answers.push(item.answer);
        }
        textHtml += `</ol></div>`;

        return {
            id: group.id,
            type: group.type,
            title: group.title,
            instruction: group.instruction,
            text: textHtml,
            answer: answers.join('|')
        };
    } else {
        // For other types, we create a questions array
        const questions = group.items.map(item => ({
            question: item.question || item.text || item.word,
            options: item.options,
            answer: item.answer
        }));

        return {
            id: group.id,
            type: group.type,
            title: group.title,
            instruction: group.instruction,
            questions: questions
        };
    }
}

function updateSidebarMenu() {
    const navLinks = document.querySelector('.nav-links');
    if (!navLinks) return;

    const user = Auth.getUser();
    
    // Forza la chiusura della sidebar in onboarding
    if (window.location.hash.includes('onboarding')) {
        const sidebar = document.querySelector('.navbar');
        if (sidebar) sidebar.classList.add('hidden');
        const mainContent = document.querySelector('main');
        if (mainContent) mainContent.style.marginLeft = '0';
        return;
    } else {
        // Ripristina sidebar se non siamo in mobile
        const isMobile = window.innerWidth <= 1024;
        if (!isMobile) {
            const sidebar = document.querySelector('.navbar');
            if (sidebar) sidebar.classList.remove('hidden');
            const mainContent = document.querySelector('main');
            if (mainContent) mainContent.style.marginLeft = 'var(--sidebar-width)';
        }
    }

    const mainSections = [
        { id: 'home', title: 'Home', icon: '🏠' },
        { id: 'intro', title: 'Scopri il Progetto', icon: '👋' },
        { id: 'riflessione', title: 'Grammatica', icon: '🧠' },
        { id: 'lettura', title: 'Lettura', icon: '📚' },
        { id: 'lessico', title: 'Lessico', icon: '📖' },
        { id: 'produzione', title: 'Produzione', icon: '✍️' },
        { id: 'contatti', title: 'Contatti', icon: '📧' }
    ];

    if (user.role === 'admin') {
        mainSections.push({ id: 'admin', title: 'Dashboard Admin', icon: '🛡️' });
    }

    let activeMainSection = window.currentSection;
    let activeSubSection = null;
    let activeLeafSection = null;

    let cursor = window.currentSection;
    if (window.currentExtra && window.MATERIE_HIERARCHY && window.MATERIE_HIERARCHY[window.currentExtra]) cursor = window.currentExtra;
    else if (window.currentLevel && window.MATERIE_HIERARCHY && window.MATERIE_HIERARCHY[window.currentLevel]) cursor = window.currentLevel;
    else if (window.currentSubType && window.MATERIE_HIERARCHY && window.MATERIE_HIERARCHY[window.currentSubType]) cursor = window.currentSubType;

    const path = [];
    while (cursor && cursor !== 'materie') {
        path.unshift(cursor);
        cursor = window.MATERIE_HIERARCHY && window.MATERIE_HIERARCHY[cursor] ? window.MATERIE_HIERARCHY[cursor].parent : null;
    }

    if (path.length > 0) activeMainSection = path[0];
    if (path.length > 1) activeSubSection = path[1];
    if (path.length > 2) activeLeafSection = path[2];

    const isImage = user.avatar.includes('/') || user.avatar.includes('.');
    const avatarHtml = isImage 
        ? `<img src="${user.avatar}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">` 
        : `<span>${user.avatar}</span>`;

    let html = `
        <style>
            .sidebar-user-block:hover {
                background: #eef2f7 !important;
                transform: scale(1.02);
            }
        </style>
        <div class="sidebar-user-block" onclick="navigateTo('profilo')" style="padding: 1.5rem; margin-bottom: 1rem; background: #f8f9fa; border-radius: 20px; display: flex; align-items: center; gap: 1rem; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); border: 1px solid transparent;">
            <div style="width: 45px; height: 45px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; border: 2px solid var(--primary-color); overflow: hidden;">
                ${avatarHtml}
            </div>
            <div style="overflow: hidden;">
                <p style="font-weight: 800; font-size: 0.95rem; margin: 0; white-space: nowrap; text-overflow: ellipsis;">${user.name}</p>
                <p style="font-size: 0.75rem; color: var(--primary-color); font-weight: 700; margin: 0;">${window.Progress.getPoints()} XP</p>
            </div>
        </div>
    `;

    for (const sec of mainSections) {
        const isActive = activeMainSection === sec.id;
        const activeClass = isActive ? 'active' : '';

        html += `<li><a href="#${sec.id}" class="nav-item ${activeClass}" data-section="${sec.id}"><span class="icon">${sec.icon}</span> <span>${sec.title}</span></a>`;

        if (isActive && sec.id === 'lettura' && (!window.collapsedSections || !window.collapsedSections.includes(sec.id))) {
            html += `<ul class="sub-nav-links" style="padding-left: 1.5rem; margin-top: 0.5rem; margin-bottom: 0.5rem; font-size: 0.95rem; list-style: none;">`;

            const subItems = window.MATERIE_HIERARCHY[sec.id].items || [];
            for (const sub of subItems) {
                const isSubActive = activeSubSection === sub.id;
                const subStyle = isSubActive ? 'font-weight: 800; color: var(--primary-color);' : 'opacity: 0.8;';

                html += `<li style="margin-bottom: 0.5rem;"><a href="#${sec.id}/${sub.id}" style="text-decoration: none; display: flex; align-items: center; gap: 0.5rem; ${subStyle}" onclick="navigateTo('${sec.id}', '${sub.id}')"><span>${sub.icon}</span> <span>${sub.title}</span></a>`;

                if (isSubActive) {
                    html += `<ul class="uda-nav-links" style="padding-left: 1rem; margin-top: 0.3rem; font-size: 0.85rem; list-style: none;">`;

                    if (sub.id === 'generi') {
                        const filter = window.currentLetturaFilter || 'tutti-i-generi';
                        if (filter === 'tutti-i-generi') {
                            const udas = window.MATERIE_HIERARCHY[sub.id].items || [];
                            for (const uda of udas) {
                                const isUdaActive = window.currentSection === uda.id || window.currentSubType === uda.id;
                                const udaStyle = isUdaActive ? 'font-weight: 800; color: var(--accent-color);' : 'opacity: 0.7;';
                                html += `<li style="margin-bottom: 0.3rem;"><a href="#${sec.id}/${sub.id}/${uda.id}" style="text-decoration: none; display: flex; align-items: center; gap: 0.3rem; ${udaStyle}" onclick="navigateTo('${sec.id}', '${sub.id}', '${uda.id}')"><span>${uda.icon}</span> <span>${uda.title}</span></a></li>`;
                            }
                        } else if (filter === 'tutti-i-livelli') {
                            const levels = ['a1', 'a2', 'b1', 'b2'];
                            const levelNames = { a1: 'A1', a2: 'A2', b1: 'B1', b2: 'B2' };
                            const levelIcons = { a1: '🟢', a2: '🟡', b1: '🔵', b2: '🟣' };
                            for (const lvl of levels) {
                                html += `<li style="margin-bottom: 0.3rem;"><a href="javascript:void(0)" style="text-decoration: none; display: flex; align-items: center; gap: 0.3rem; opacity: 0.7;" onclick="UI.setLetturaFilter('${lvl}')"><span>${levelIcons[lvl]}</span> <span>${levelNames[lvl]}</span></a></li>`;
                            }
                        } else {
                            const levels = ['a1', 'a2', 'b1', 'b2'];
                            const levelNames = { a1: 'A1', a2: 'A2', b1: 'B1', b2: 'B2' };
                            const levelIcons = { a1: '🟢', a2: '🟡', b1: '🔵', b2: '🟣' };

                            for (const lvl of levels) {
                                const isLvlActive = filter === lvl;
                                const lvlStyle = isLvlActive ? 'font-weight: 800; color: var(--accent-color);' : 'opacity: 0.7;';
                                html += `<li style="margin-bottom: 0.3rem;">
                                    <a href="javascript:void(0)" style="text-decoration: none; display: flex; align-items: center; gap: 0.3rem; ${lvlStyle}" onclick="UI.setLetturaFilter('${lvl}')"><span>${levelIcons[lvl]}</span> <span>${levelNames[lvl]}</span></a>`;

                                if (isLvlActive) {
                                    html += `<ul style="padding-left: 1rem; margin-top: 0.2rem; list-style: none; font-size: 0.8rem;">`;
                                    const gData = window.exercisesData.lettura.generi;
                                    let texts = [];
                                    const genreItems = window.MATERIE_HIERARCHY['generi']?.items || [];
                                    for (const item of genreItems) {
                                        const gKey = item.id;
                                        if (gData[gKey] && gData[gKey][lvl]) {
                                            gData[gKey][lvl].forEach((ex, index) => {
                                                texts.push({
                                                    genreId: gKey,
                                                    title: ex.title,
                                                    index: index
                                                });
                                            });
                                        }
                                    }
                                    if (window.currentLetturaSort === 'a-z') {
                                        texts.sort((a, b) => a.title.localeCompare(b.title));
                                    } else if (window.currentLetturaSort === 'z-a') {
                                        texts.sort((a, b) => b.title.localeCompare(a.title));
                                    } // default and per-livello keep original genre order

                                    for (const txt of texts) {
                                        html += `<li style="margin-bottom: 0.2rem;"><a href="javascript:void(0)" style="text-decoration: none; color: #666;" onclick="localStorage.setItem('progress_${txt.genreId}_${lvl}_null_null', '${txt.index}'); navigateTo('${txt.genreId}', '${lvl}')">📄 ${txt.title}</a></li>`;
                                    }
                                    html += `</ul>`;
                                }

                                html += `</li>`;
                            }
                        }
                    } else if (sub.id === 'antologiche') {
                        const filter = window.currentAntologicheFilter || 'all';
                        const levels = ['a1', 'a2', 'b1', 'b2'];
                        const levelNames = { a1: 'A1', a2: 'A2', b1: 'B1', b2: 'B2' };
                        const levelIcons = { a1: '🟢', a2: '🟡', b1: '🔵', b2: '🟣' };

                        if (filter === 'all') {
                            for (const lvl of levels) {
                                html += `<li style="margin-bottom: 0.3rem;"><a href="javascript:void(0)" style="text-decoration: none; display: flex; align-items: center; gap: 0.3rem; opacity: 0.7;" onclick="UI.setAntologicheFilter('${lvl}')"><span>${levelIcons[lvl]}</span> <span>${levelNames[lvl]}</span></a></li>`;
                            }
                        } else {
                            for (const lvl of levels) {
                                const isLvlActive = filter === lvl;
                                const lvlStyle = isLvlActive ? 'font-weight: 800; color: var(--accent-color);' : 'opacity: 0.7;';
                                html += `<li style="margin-bottom: 0.3rem;">
                                    <a href="javascript:void(0)" style="text-decoration: none; display: flex; align-items: center; gap: 0.3rem; ${lvlStyle}" onclick="UI.setAntologicheFilter('${lvl}')"><span>${levelIcons[lvl]}</span> <span>${levelNames[lvl]}</span></a>`;

                                if (isLvlActive) {
                                    html += `<ul style="padding-left: 1rem; margin-top: 0.2rem; list-style: none; font-size: 0.8rem;">`;
                                    const antData = window.exercisesData.lettura.antologiche[lvl] || [];
                                    let sortedAnt = [...antData];
                                    if (window.currentAntologicheSort === 'a-z') {
                                        sortedAnt.sort((a, b) => a.title.localeCompare(b.title));
                                    } else {
                                        sortedAnt.sort((a, b) => b.title.localeCompare(a.title));
                                    }

                                    sortedAnt.forEach((ex, index) => {
                                        html += `<li style="margin-bottom: 0.2rem;"><a href="javascript:void(0)" style="text-decoration: none; color: #666;" onclick="localStorage.setItem('progress_antologiche_${lvl}_null_null', '${index}'); navigateTo('antologiche', '${lvl}')">📄 ${ex.title}</a></li>`;
                                    });
                                    html += `</ul>`;
                                }

                                html += `</li>`;
                            }
                        }
                    }

                    html += `</ul>`;
                }

                html += `</li>`;
            }

            html += `</ul>`;
        } else if (isActive && window.MATERIE_HIERARCHY && window.MATERIE_HIERARCHY[sec.id] && (!window.collapsedSections || !window.collapsedSections.includes(sec.id))) {
            html += `<ul class="sub-nav-links" style="padding-left: 1.5rem; margin-top: 0.5rem; margin-bottom: 0.5rem; font-size: 0.95rem; list-style: none;">`;

            const subItems = window.MATERIE_HIERARCHY[sec.id].items || [];
            for (const sub of subItems) {
                const isSubActive = activeSubSection === sub.id;
                const subStyle = isSubActive ? 'font-weight: 800; color: var(--primary-color);' : 'opacity: 0.8;';

                html += `<li style="margin-bottom: 0.5rem;"><a href="#${sec.id}/${sub.id}" style="text-decoration: none; display: flex; align-items: center; gap: 0.5rem; ${subStyle}" onclick="navigateTo('${sec.id}', '${sub.id}')"><span>${sub.icon}</span> <span>${sub.title}</span></a>`;

                if (isSubActive && window.MATERIE_HIERARCHY[sub.id] && (!window.collapsedSections || !window.collapsedSections.includes(sub.id))) {
                    html += `<ul class="uda-nav-links" style="padding-left: 1rem; margin-top: 0.3rem; font-size: 0.85rem; list-style: none;">`;
                    const udas = window.MATERIE_HIERARCHY[sub.id].items || [];
                    for (const uda of udas) {
                        const isUdaActive = activeLeafSection === uda.id || window.currentSection === uda.id;
                        const udaPathKey = `${uda.id}/allenati//`; // Percorso base per check
                        const isUdaDone = localStorage.getItem('concluded_' + udaPathKey) === 'true';

                        const udaStyle = isUdaActive ? 'font-weight: 800; color: var(--accent-color);' : 'opacity: 0.7;';
                        html += `<li style="margin-bottom: 0.3rem;"><a href="#${uda.id}" style="text-decoration: none; display: flex; align-items: center; gap: 0.3rem; ${udaStyle}" onclick="navigateTo('${uda.id}')"><span>${uda.icon}</span> <span>${uda.title} ${isUdaDone ? '<span style="color:#27ae60; margin-left:5px;">✔️</span>' : ''}</span></a></li>`;
                    }
                    html += `</ul>`;
                }

                html += `</li>`;
            }

            html += `</ul>`;
        }

        html += `</li>`;
    }

    html += `<li class="nav-logout-separator" style="margin-top: 1rem; border-top: 1px solid #f0f0f0; padding-top: 1rem;"></li>`;
    html += `<li><a href="javascript:void(0)" class="nav-item logout" onclick="Auth.logout()"><span class="icon">🚪</span> <span>Esci</span></a></li>`;

    navLinks.innerHTML = html;
}

window.navigateTo = navigateTo;
window.checkAnswer = checkAnswer;
window.navigateExercise = navigateExercise;
window.checkCompletionAnswer = checkCompletionAnswer;
window.checkHighlightAnswer = checkHighlightAnswer;
window.checkDragDropAnswer = checkDragDropAnswer;
window.onDropItem = onDropItem;

// ─── sentence-analysis helpers ────────────────────────────────────
window.toggleSaGap = (el) => {
    el.classList.toggle('active');
    window.buildSaLabels();
};

window.buildSaLabels = () => {
    const container = document.getElementById('sa-sentence');
    if (!container) return;
    const words = [...container.querySelectorAll('.sa-word')].map(s => s.textContent);
    const gaps = [...container.querySelectorAll('.sa-gap')];
    // Build segments by splitting at active gaps
    let segments = [];
    let current = [words[0]];
    gaps.forEach((g, i) => {
        if (g.classList.contains('active')) {
            segments.push(current.join(' '));
            current = [words[i + 1]];
        } else {
            current.push(words[i + 1]);
        }
    });
    segments.push(current.join(' '));

    const labelsDiv = document.getElementById('sa-labels');
    if (!labelsDiv) return;
    // Preserve existing input values
    const existing = {};
    labelsDiv.querySelectorAll('.sa-label-input').forEach(inp => {
        existing[inp.dataset.seg] = inp.value;
    });
    labelsDiv.innerHTML = segments.map((seg, i) => `
        <div class="sa-label-row">
            <span class="sa-label-num">${i + 1}.</span>
            <span class="sa-label-segment">${seg}</span>
            <input class="sa-label-input" data-seg="${seg}" placeholder="Funzione / parte del discorso..." value="${existing[seg] || ''}">
        </div>
    `).join('');
};

window.checkSentenceAnalysis = (id) => {
    const container = document.getElementById('sa-sentence');
    if (!container) return;
    const gaps = [...container.querySelectorAll('.sa-gap')];
    const words = [...container.querySelectorAll('.sa-word')].map(s => s.textContent);
    let current = [words[0]];
    let userSegments = [];
    gaps.forEach((g, i) => {
        if (g.classList.contains('active')) { userSegments.push(current.join(' ')); current = [words[i + 1]]; }
        else { current.push(words[i + 1]); }
    });
    userSegments.push(current.join(' '));
    const userLabels = [...document.querySelectorAll('.sa-label-input')].map(i => i.value.trim());

    // Show result as feedback (non-blocking)
    const feedbackDiv = document.getElementById('sa-feedback') || (() => {
        const d = document.createElement('div');
        d.id = 'sa-feedback';
        d.style = 'margin-top:1.2rem;padding:1rem;border-radius:12px;font-weight:700;font-size:1rem;';
        document.querySelector('.sa-labels').after(d);
        return d;
    })();
    feedbackDiv.innerHTML = `
        <div style="background:#e8f5e9;border:2px solid #27ae60;border-radius:12px;padding:1rem;margin-top:1rem;">
            <b style="color:#27ae60;">✅ La tua analisi:</b><br>
            ${userSegments.map((s, i) => `<span style="display:block;margin-top:4px;"><b>${s}</b> → ${userLabels[i] || '<em>non etichettato</em>'}</span>`).join('')}
        </div>`;
    checkAnswer('done', 'done', 'sentence-analysis', id);
};
window.showEditProfileModal = () => {
    const user = Auth.getUser();
    const modal = document.createElement('div');
    modal.id = 'edit-profile-modal';
    modal.className = 'login-overlay';
    modal.style.opacity = '1';
    modal.style.visibility = 'visible';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';

    modal.innerHTML = `
        <div class="login-card" style="transform: translateY(0);">
            <h2 style="margin-bottom: 1.5rem;">MODIFICA PROFILO</h2>
            <div class="login-form">
                <input type="text" id="edit-name-input" value="${user.name}" placeholder="Il tuo nome..." maxlength="20" style="margin-bottom: 1.5rem;">
                
                <div class="avatar-selector">
                    <p>Cambia il tuo avatar:</p>
                    <div class="avatar-options" id="edit-avatar-options">
                        <span class="avatar-opt ${user.avatar === 'assets/avatar.png' ? 'active' : ''}" data-avatar="assets/avatar.png">👤</span>
                        <span class="avatar-opt ${user.avatar === '🚀' ? 'active' : ''}" data-avatar="🚀">🚀</span>
                        <span class="avatar-opt ${user.avatar === '🦖' ? 'active' : ''}" data-avatar="🦖">🦖</span>
                        <span class="avatar-opt ${user.avatar === '🦊' ? 'active' : ''}" data-avatar="🦊">🦊</span>
                        <span class="avatar-opt ${user.avatar === '🧙' ? 'active' : ''}" data-avatar="🧙">🧙</span>
                        <span class="avatar-opt ${user.avatar === '🦾' ? 'active' : ''}" data-avatar="🦾">🦾</span>
                    </div>
                </div>

                <div style="display: flex; gap: 1rem; margin-top: 2rem;">
                    <button class="btn btn-primary" style="flex: 1;" onclick="saveProfileEdit()">SALVA MODIFICHE</button>
                    <button class="btn btn-secondary" style="flex: 1;" onclick="document.getElementById('edit-profile-modal').remove()">ANNULLA</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    // Gestione selezione avatar nel modal
    modal.querySelectorAll('.avatar-opt').forEach(opt => {
        opt.addEventListener('click', () => {
            modal.querySelectorAll('.avatar-opt').forEach(o => o.classList.remove('active'));
            opt.classList.add('active');
        });
    });
};

window.saveProfileEdit = async () => {
    const newName = document.getElementById('edit-name-input').value.trim();
    const activeAvatar = document.querySelector('#edit-avatar-options .avatar-opt.active');
    const newAvatar = activeAvatar ? activeAvatar.dataset.avatar : 'assets/avatar.png';

    if (newName) {
        await Auth.updateProfile(newName, newAvatar);
        document.getElementById('edit-profile-modal').remove();
        renderProfiloPage();
    }
};

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    setTimeout(updateSidebarMenu, 500);
});

window.renderOnboardingPage = function() {
    const appContainer = document.getElementById('app');
    const user = Auth.getUser();
    
    appContainer.innerHTML = `
        <div id="onboarding-root" class="onboarding-container" style="max-width: 1000px; margin: 0 auto; padding: 4rem 2rem;">
            <!-- STEP 1: ROLE SELECTION -->
            <div id="onboarding-step-1">
                <div class="onboarding-header" style="text-align: center; margin-bottom: 4rem;">
                    <h1 style="font-size: 3rem; font-weight: 800; color: var(--primary-color); letter-spacing: -1px; text-transform: uppercase;">Benvenuto nella Palestra! 🚀</h1>
                    <p style="font-size: 1.3rem; opacity: 0.7; margin-top: 1rem;">Scegli il tuo profilo per iniziare un'esperienza personalizzata.</p>
                </div>

                <div class="onboarding-card-grid" style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 2rem; margin-bottom: 4rem;">
                    <!-- Percorso Studente -->
                    <div class="role-opt-large" id="role-studente" onclick="selectOnboardingRole('studente')">
                        <div style="font-size: 5rem; margin-bottom: 1.5rem;">🎓</div>
                        <h3>STUDENTE</h3>
                        <p>Hai un codice classe? Entra qui per collegarti al tuo docente.</p>
                    </div>

                    <!-- Percorso Docente -->
                    <div class="role-opt-large" id="role-docente" onclick="selectOnboardingRole('docente')">
                        <div style="font-size: 5rem; margin-bottom: 1.5rem;">👨‍🏫</div>
                        <h3>DOCENTE</h3>
                        <p>Crea classi, gestisci studenti e monitora i loro progressi.</p>
                    </div>

                    <!-- Percorso Amico -->
                    <div class="role-opt-large" id="role-amico" onclick="selectOnboardingRole('amico')">
                        <div style="font-size: 5rem; margin-bottom: 1.5rem;">🤝</div>
                        <h3>AMICO DELLA PALESTRA</h3>
                        <p>Esplora liberamente i contenuti senza vincoli di classe.</p>
                    </div>
                </div>

                <!-- Back to Login / Change Email -->
                <div style="text-align: center; margin-top: 2rem; border-top: 1px solid #f0f0f0; padding-top: 3rem;">
                    <p style="font-size: 0.9rem; opacity: 0.6; margin-bottom: 1rem;">Hai sbagliato account o vuoi cambiare email?</p>
                    <button class="btn btn-secondary" onclick="Auth.logout()" style="padding: 1rem 2.5rem; border-radius: 50px; font-weight: 800; font-size: 0.85rem; letter-spacing: 0.5px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); background: white; color: #555; border: 2px solid #eee;">
                        ⬅️ TORNA AL LOGIN / CAMBIA EMAIL
                    </button>
                </div>
            </div>

            <!-- STEP 2: SETUP (Hidden by default) -->
            <div id="onboarding-step-2" class="hidden">
                <div id="onboarding-setup-header" style="text-align: center; margin-bottom: 3rem;">
                    <h2 id="setup-title" style="font-size: 2.5rem; font-weight: 900; color: var(--primary-color);">CONFIGURAZIONE PROFILO</h2>
                    <p id="setup-subtitle" style="opacity: 0.6; font-size: 1.1rem;">Ci siamo quasi! Personalizza il tuo ingresso.</p>
                </div>

                <div class="onboarding-card" style="background: white; padding: 3rem; border-radius: 40px; box-shadow: 0 30px 60px rgba(0,0,0,0.08);">
                    
                    <!-- Common Profile Content -->
                    <div class="profile-setup-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; margin-bottom: 3rem;">
                        <div>
                            <h4 style="margin-bottom: 1.5rem; font-size: 1.1rem; color: #555;">Il tuo Nome</h4>
                            <input type="text" id="onboarding-name" value="${user.name || ''}" placeholder="Come vuoi essere chiamato?" style="width: 100%; padding: 1.3rem; border-radius: 20px; border: 2px solid #f0f0f0; font-size: 1.1rem; outline: none; transition: border-color 0.3s;">
                        </div>
                        <div>
                            <h4 style="margin-bottom: 1.5rem; font-size: 1.1rem; color: #555;">Scegli il tuo Avatar</h4>
                            <div class="avatar-options" id="onboarding-avatar-options" style="display: flex; gap: 1rem; flex-wrap: wrap;">
                                <span class="avatar-opt active" data-avatar="assets/avatar.png">👤</span>
                                <span class="avatar-opt" data-avatar="🚀">🚀</span>
                                <span class="avatar-opt" data-avatar="🦖">🦖</span>
                                <span class="avatar-opt" data-avatar="🦊">🦊</span>
                                <span class="avatar-opt" data-avatar="🧙">🧙</span>
                                <span class="avatar-opt" data-avatar="🦾">🦾</span>
                            </div>
                        </div>
                    </div>

                    <!-- Role Specific Content -->
                    <div id="setup-role-specific" style="padding-top: 3rem; border-top: 1px solid #eee;">
                        <!-- Injected dynamically -->
                    </div>

                    <div style="margin-top: 4rem; display: flex; flex-direction: column; gap: 1.5rem;">
                        <div style="display: flex; gap: 1rem;">
                            <button class="btn btn-secondary" style="flex: 1; border-radius: 50px;" onclick="goBackToStep1()">⬅ INDIETRO</button>
                            <button class="btn btn-primary" id="save-onboarding-btn" style="flex: 2; border-radius: 50px; font-size: 1.2rem; padding: 1.2rem;" onclick="saveOnboardingData()">COMPLETA CONFIGURAZIONE ➜</button>
                        </div>
                        <div style="text-align: center;">
                            <a href="javascript:void(0)" onclick="Auth.logout()" style="font-size: 0.85rem; color: #888; text-decoration: none; font-weight: 600;">Hai sbagliato email? Clicca qui per cambiare account</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Avatar selection logic
    appContainer.querySelectorAll('.avatar-opt').forEach(opt => {
        opt.addEventListener('click', () => {
            appContainer.querySelectorAll('.avatar-opt').forEach(o => o.classList.remove('active'));
            opt.classList.add('active');
        });
    });
};

window.goBackToStep1 = function() {
    const step1 = document.getElementById('onboarding-step-1');
    const step2 = document.getElementById('onboarding-step-2');
    if (step1 && step2) {
        step2.classList.add('hidden');
        step1.classList.remove('hidden');
        window.scrollTo(0, 0);
    } else {
        window.location.reload();
    }
};

window.selectOnboardingRole = function(role) {
    window.currentOnboardingRole = role;
    const step1 = document.getElementById('onboarding-step-1');
    const step2 = document.getElementById('onboarding-step-2');
    const roleContent = document.getElementById('setup-role-specific');
    const setupTitle = document.getElementById('setup-title');
    
    if (!step1 || !step2) return;

    step1.classList.add('hidden');
    step2.classList.remove('hidden');
    window.scrollTo(0, 0);

    if (role === 'studente') {
        setupTitle.innerText = "CONFIGURAZIONE STUDENTE";
        roleContent.innerHTML = `
            <div style="text-align: center; padding: 2rem; background: #f0f7ff; border-radius: 30px; border: 2px solid var(--primary-color);">
                <h4 style="margin-bottom: 1rem; color: var(--primary-color); font-size: 1.2rem; font-weight: 800;">🔑 INSERISCI IL CODICE CLASSE</h4>
                <p style="font-size: 0.9rem; opacity: 0.6; margin-bottom: 1.5rem;">Chiedi al tuo insegnante il codice per unirti alla classe.</p>
                <input type="text" id="onboarding-class-code" placeholder="PG-XXXX" style="width: 100%; max-width: 300px; padding: 1.2rem; text-align: center; font-size: 2rem; font-weight: 900; border-radius: 20px; border: 3px solid #eee; outline: none; transition: all 0.3s; text-transform: uppercase; color: var(--primary-color);">
            </div>
        `;
    } else if (role === 'docente') {
        setupTitle.innerText = "CONFIGURAZIONE DOCENTE";
        roleContent.innerHTML = `
            <div style="text-align: center; padding: 2rem; background: #fff9f0; border-radius: 30px; border: 2px solid #ffa502;">
                <h4 style="margin-bottom: 1rem; color: #ffa502; font-size: 1.2rem; font-weight: 800;">📂 CREA LA TUA PRIMA CLASSE (OPZIONALE)</h4>
                <p style="font-size: 0.9rem; opacity: 0.6; margin-bottom: 1.5rem;">Puoi iniziare creando subito una classe per i tuoi studenti.</p>
                <input type="text" id="onboarding-new-class" placeholder="Es: Classe 1A" style="width: 100%; max-width: 400px; padding: 1.2rem; text-align: center; font-size: 1.3rem; font-weight: 700; border-radius: 20px; border: 3px solid #eee; outline: none; transition: all 0.3s; color: #ffa502;">
            </div>
        `;
    } else {
        setupTitle.innerText = "CONFIGURAZIONE AMICO";
        roleContent.innerHTML = `
            <div style="text-align: center; padding: 2rem; background: #f4f7f6; border-radius: 30px; border: 2px solid #999;">
                <h4 style="margin-bottom: 0.5rem; color: #555; font-size: 1.2rem; font-weight: 800;">🤝 BENVENUTO AMICO</h4>
                <p style="font-size: 0.9rem; opacity: 0.6;">Divertiti ad esplorare la Palestra di Grammatica in totale libertà.</p>
            </div>
        `;
    }
};

window.saveOnboardingData = async function() {
    const role = window.currentOnboardingRole;
    const name = document.getElementById('onboarding-name').value.trim();
    const activeAvatar = document.querySelector('.avatar-opt.active');
    const avatar = activeAvatar ? activeAvatar.dataset.avatar : 'assets/avatar.png';
    const btn = document.getElementById('save-onboarding-btn');

    if (!name) { alert("Per favore, inserisci il tuo nome."); return; }

    btn.disabled = true;
    btn.innerText = "SALVATAGGIO IN CORSO...";

    let roleLabel = (role === 'amico') ? 'Amico della Palestra' : (role === 'studente' ? 'Studente' : 'Docente');
    let techRole = (role === 'amico') ? 'studente' : role;

    try {
        let classId = null;
        let className = null;
        let teacherId = null;

        // Logica Studente
        if (role === 'studente') {
            const code = document.getElementById('onboarding-class-code').value.trim().toUpperCase();
            if (!code) {
                alert("Per favore, inserisci il codice classe.");
                btn.disabled = false; btn.innerText = "COMPLETA CONFIGURAZIONE ➜";
                return;
            }

            const q = await window.fbDb.collection('classes').where('code', '==', code).get();
            if (q.empty) {
                alert("Codice classe non valido.");
                btn.disabled = false; btn.innerText = "COMPLETA CONFIGURAZIONE ➜";
                return;
            }

            const classDoc = q.docs[0];
            const classData = classDoc.data();
            classId = classDoc.id;
            className = classData.name;
            teacherId = classData.teacherId;
            localStorage.setItem('palestra_student_class_code', code);
        }

        // Logica Docente
        if (role === 'docente') {
            const newClassName = document.getElementById('onboarding-new-class').value.trim();
            if (newClassName) {
                const user = Auth.getUser();
                const code = "PG-" + Math.random().toString(36).substring(2, 6).toUpperCase();
                const classData = {
                    name: newClassName,
                    code: code,
                    teacherId: user.uid,
                    createdAt: new Date().toISOString()
                };
                const docRef = await window.fbDb.collection('classes').add(classData);
                classId = docRef.id;
                className = newClassName;

                const localClasses = JSON.parse(localStorage.getItem('palestra_classes') || '[]');
                localClasses.push({ id: docRef.id, ...classData });
                localStorage.setItem('palestra_classes', JSON.stringify(localClasses));
            }
        }

        // Aggiorna profilo locale e remoto
        const finalUser = Auth.getUser();
        finalUser.name = name;
        finalUser.avatar = avatar;
        finalUser.role = techRole;
        finalUser.roleLabel = roleLabel;
        finalUser.setupComplete = true;
        if (classId) finalUser.classId = classId;
        if (className) finalUser.className = className;
        if (teacherId) finalUser.teacherId = teacherId;
        if (!finalUser.createdAt) finalUser.createdAt = new Date().toISOString();

        localStorage.setItem('palestra_user', JSON.stringify(finalUser));
        
        if (!finalUser.isGuest && window.fbDb) {
            await window.fbDb.collection('users').doc(finalUser.uid).set(finalUser, { merge: true });
        }

        window.location.hash = 'home';
        handleRoute();
    } catch (e) {
        console.error("Errore salvataggio onboarding:", e);
        let msg = "Errore durante il salvataggio: " + e.message;
        if (e.code === 'permission-denied') {
            msg = "Permessi insufficienti sul database (Firestore). \n\nAssicurati che le 'Security Rules' su Firebase permettano la scrittura per gli utenti autenticati.";
        }
        alert(msg);
        btn.disabled = false; btn.innerText = "COMPLETA CONFIGURAZIONE ➜";
    }
};

window.editTeacherClass = function(id, name, school, city) {
    const modal = document.getElementById('feedback-modal');
    const body = document.getElementById('feedback-body');
    if (!modal || !body) return;

    body.innerHTML = `
        <h3 style="color: var(--primary-color); margin-bottom: 1.5rem; font-weight: 900;">✏️ MODIFICA CLASSE</h3>
        <div style="display: flex; flex-direction: column; gap: 1rem; text-align: left;">
            <div>
                <label style="font-size: 0.8rem; font-weight: 700; color: #666; margin-left: 0.5rem;">NOME CLASSE (es: 3D)</label>
                <input type="text" id="edit-class-name" value="${name}" style="width: 100%; padding: 0.9rem; border-radius: 15px; border: 1px solid #ddd; margin-top: 0.3rem; font-weight: 700;">
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div>
                    <label style="font-size: 0.8rem; font-weight: 700; color: #666; margin-left: 0.5rem;">SCUOLA / ISTITUTO</label>
                    <input type="text" id="edit-class-school" value="${school}" style="width: 100%; padding: 0.9rem; border-radius: 15px; border: 1px solid #ddd; margin-top: 0.3rem;">
                </div>
                <div>
                    <label style="font-size: 0.8rem; font-weight: 700; color: #666; margin-left: 0.5rem;">CITTÀ</label>
                    <input type="text" id="edit-class-city" value="${city}" style="width: 100%; padding: 0.9rem; border-radius: 15px; border: 1px solid #ddd; margin-top: 0.3rem;">
                </div>
            </div>
            <div style="margin-top: 1.5rem; display: flex; gap: 1rem;">
                <button onclick="window.saveTeacherClass('${id}')" class="btn btn-primary" style="flex: 2; padding: 1rem; font-weight: 800;">SALVA MODIFICHE</button>
                <button onclick="window.UI.hideModal()" class="btn btn-secondary" style="flex: 1; padding: 1rem;">ANNULLA</button>
            </div>
        </div>
    `;
    modal.classList.remove('hidden');
};

window.saveTeacherClass = async function(id) {
    const name = document.getElementById('edit-class-name').value.trim().toUpperCase();
    const school = document.getElementById('edit-class-school').value.trim();
    const city = document.getElementById('edit-class-city').value.trim();

    if (!name) { alert("Inserisci il nome della classe."); return; }

    try {
        if (window.fbDb) {
            await window.fbDb.collection('classes').doc(id).update({
                name, school, city
            });
        }
        
        // Aggiorna locale
        let classes = JSON.parse(localStorage.getItem('palestra_classes') || '[]');
        const idx = classes.findIndex(c => c.id === id);
        if (idx !== -1) {
            classes[idx].name = name;
            classes[idx].school = school;
            classes[idx].city = city;
            localStorage.setItem('palestra_classes', JSON.stringify(classes));
        }

        window.UI.hideModal();
        renderProfiloPage();
        alert("✅ Classe aggiornata con successo!");
    } catch (e) {
        console.error("Errore aggiornamento classe:", e);
        let msg = "Errore durante il salvataggio: " + e.message;
        if (e.code === 'permission-denied') {
            msg = "Permessi insufficienti. Assicurati di essere il proprietario di questa classe e che le regole di Firebase siano aggiornate.";
        }
        alert(msg);
    }
};

window.showTeacherGuide = function() {
    const modal = document.getElementById('feedback-modal');
    const body = document.getElementById('feedback-body');
    if (!modal || !body) return;

    body.innerHTML = `
        <div style="text-align: left; animation: fadeIn 0.3s ease-out;">
            <h3 style="color: var(--primary-color); margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.8rem; font-weight: 900;">
                📘 GUIDA DOCENTE
            </h3>
            <div style="display: flex; flex-direction: column; gap: 1.2rem; font-size: 0.95rem; line-height: 1.5; color: #444;">
                <div style="background: #f0f7ff; padding: 1rem; border-radius: 15px; border-left: 5px solid #3498db;">
                    <strong style="color: #2980b9; display: block; margin-bottom: 0.3rem;">📂 CREAZIONE E RECUPERO CLASSI</strong>
                    Crea una classe digitale cliccando su <b>"CREA"</b>. Verrà generato un codice unico (es. PG-XXXX) da condividere con i tuoi studenti. Se cambi dispositivo, usa <b>"Recupera con Codice"</b> per ricollegare le tue classi.
                </div>
                
                <div style="background: #f0fff4; padding: 1rem; border-radius: 15px; border-left: 5px solid #27ae60;">
                    <strong style="color: #219150; display: block; margin-bottom: 0.3rem;">📊 MONITORAGGIO E REGISTRO</strong>
                    Clicca su <b>"👥 STUDENTI"</b> per aprire il registro della classe. Qui vedrai in tempo reale i punti XP e il numero di attività completate da ogni studente.
                </div>

                <div style="background: #fff9f0; padding: 1rem; border-radius: 15px; border-left: 5px solid #e67e22;">
                    <strong style="color: #d35400; display: block; margin-bottom: 0.3rem;">⚙️ GESTIONE STUDENTI</strong>
                    Nel registro, seleziona gli studenti tramite le caselle per <b>spostarli</b> tra le tue classi o <b>rimuoverli</b> definitivamente dalla classe attuale.
                </div>

                <div style="background: #f5f6fa; padding: 1rem; border-radius: 15px; border-left: 5px solid #7f8c8d;">
                    <strong style="color: #2c3e50; display: block; margin-bottom: 0.3rem;">📤 ASSEGNAZIONE ESERCIZI</strong>
                    Mentre svolgi un esercizio, clicca sul tasto <b>"CONDIVIDI"</b> in alto a destra per assegnarlo a una classe specifica o generare un link per <b>Google Classroom</b>.
                </div>
            </div>
            <div style="margin-top: 2rem; text-align: center;">
                <button onclick="window.UI.hideModal()" class="btn btn-primary" style="padding: 0.8rem 2.5rem; border-radius: 50px; font-weight: 800;">HO CAPITO, GRAZIE!</button>
            </div>
        </div>
    `;
    modal.classList.remove('hidden');
};

window.addEventListener('authChange', () => {
    if (typeof updateSidebarMenu === 'function') updateSidebarMenu();
    if (typeof handleRoute === 'function' && window.Auth && window.Auth._isReady) {
        handleRoute();
    }
});

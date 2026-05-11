const Auth = {
    _user: null,
    _fbUser: null,
    _isReady: false,
    _readyPromise: null,
    _resolveReady: null,
    _handledByRedirect: false, // Flag: redirect ha già gestito l'auth, salta onAuthStateChanged

    init: () => {
        // Inizializza la promise di ready
        Auth._readyPromise = new Promise((resolve) => {
            Auth._resolveReady = () => {
                if (!Auth._isReady) {
                    Auth._isReady = true;
                    resolve();
                }
            };
        });

        // Fallback locale per utenti già esistenti (caricamento sincrono iniziale)
        const savedUser = localStorage.getItem('palestra_user');
        if (savedUser) {
            try {
                Auth._user = JSON.parse(savedUser);
            } catch(e) {
                Auth._user = null;
                localStorage.removeItem('palestra_user');
            }
        }

        // Inizializza listener Firebase
        if (window.fbAuth) {
            // Gestisci il risultato del redirect (per mobile)
            // Fondamentale: su mobile getRedirectResult DEVE essere risolto prima di onAuthStateChanged
            const redirectPromise = window.fbAuth.getRedirectResult().then(async (result) => {
                if (result && result.user) {
                    Auth._handledByRedirect = true;
                    await Auth._handleFirebaseUser(result.user);
                }
            }).catch(e => {
                console.error("Errore redirect:", e);
                Auth._resolveReady();
            });

            window.fbAuth.onAuthStateChanged(async (user) => {
                if (user) {
                    Auth._fbUser = user;
                    // Se il redirect ha già processato questo stesso utente, evitiamo la doppia chiamata
                    if (!Auth._handledByRedirect) {
                        await Auth._handleFirebaseUser(user);
                    }
                    Auth._resolveReady();
                } else {
                    // Aspettiamo che il redirect sia processato prima di dire che l'utente è nullo
                    // (potrebbe essere in corso un login via redirect)
                    await redirectPromise;
                    if (!Auth._handledByRedirect) {
                        Auth._fbUser = null;
                        Auth._user = null;
                        localStorage.removeItem('palestra_user');
                        Auth._resolveReady();
                    }
                }
            });
        } else {
            Auth._resolveReady();
        }
    },

    whenReady: () => {
        return Auth._readyPromise;
    },

    _handleFirebaseUser: async (fbUser) => {
        try {
            const doc = await window.fbDb.collection('users').doc(fbUser.uid).get();
            const pendingRole = localStorage.getItem('pending_role');

            if (doc.exists) {
                Auth._user = doc.data();
                // Se l'utente ha selezionato un ruolo diverso (e non è admin), aggiorniamo il profilo esistente
                if (pendingRole && Auth._user.role !== pendingRole && Auth._user.role !== 'admin') {
                    Auth._user.role = pendingRole;
                    await window.fbDb.collection('users').doc(fbUser.uid).update({ role: pendingRole });
                }
            } else {
                // Se l'utente non esiste nel database (es. primo accesso Google), creiamo un profilo base
                Auth._user = {
                    uid: fbUser.uid,
                    name: fbUser.displayName || '',
                    avatar: fbUser.photoURL || 'assets/avatar.png',
                    role: pendingRole || 'studente',
                    points: 0,
                    isGuest: false,
                    email: fbUser.email,
                    setupComplete: false, // Richiede onboarding
                    createdAt: new Date().toISOString()
                };
                // Salvataggio iniziale nel DB per persistere il profilo
                await window.fbDb.collection('users').doc(fbUser.uid).set(Auth._user);
            }
            localStorage.removeItem('pending_role'); // Pulisci dopo l'uso
            
            // Controllo privilegi Admin per email specifiche
            const ADMIN_EMAILS = ['prof.memmo@gmail.com'];
            if (fbUser.email && ADMIN_EMAILS.includes(fbUser.email)) {
                Auth._user.role = 'admin';
                Auth._user.setupComplete = true; // Gli admin saltano l'onboarding se necessario o lo fanno una volta
                await window.fbDb.collection('users').doc(fbUser.uid).set({ role: 'admin', setupComplete: true }, { merge: true });
            }

            localStorage.setItem('palestra_user', JSON.stringify(Auth._user));
            
            // 1. Risolviamo la promise di ready PRIMA di dispatchare l'evento
            Auth._resolveReady();
            
            // 2. Nascondi l'overlay
            if (typeof hideLoginOverlay === 'function') hideLoginOverlay();
            
            // 3. Carica progressi
            if (window.Progress && typeof window.Progress.load === 'function') {
                await window.Progress.load();
            }

            // 4. Notifica il cambio di stato
            window.dispatchEvent(new CustomEvent('authChange'));
        } catch (e) {
            console.error("Errore recupero/creazione dati cloud:", e);
            Auth._resolveReady(); // Risolviamo comunque per non bloccare l'app
            if (e.code === 'permission-denied') {
                alert("Errore di sincronizzazione: Permessi insufficienti sul database Firebase. Contatta l'amministratore per verificare le Security Rules.");
            }
        }
    },

    isLoggedIn: () => {
        return !!Auth._user;
    },

    getUser: () => {
        return Auth._user || { name: 'Atleta Anonimo', avatar: '👤', role: 'studente', isGuest: true };
    },

    login: async (name, avatar = 'assets/avatar.png', role = 'studente') => {
        // Questo metodo ora richiede l'autenticazione email/Google
        // Non creiamo più profili anonimi
        console.warn("Metodo login() deprecato. Usa loginWithEmail() o loginWithGoogle().");
    },

    loginWithEmail: async (name, email, password) => {
        if (!window.fbAuth) return;
        if (!email || !password) {
            alert("Inserisci email e password per continuare.");
            return;
        }
        if (!name) {
            alert("Inserisci il tuo nome.");
            return;
        }

        try {
            let fbUser;
            try {
                // Prova prima ad accedere (utente esistente)
                const result = await window.fbAuth.signInWithEmailAndPassword(email, password);
                fbUser = result.user;
            } catch (signInError) {
                if (signInError.code === 'auth/user-not-found' || signInError.code === 'auth/invalid-credential') {
                    // Utente non trovato: registrazione
                    const result = await window.fbAuth.createUserWithEmailAndPassword(email, password);
                    fbUser = result.user;
                    await fbUser.updateProfile({ displayName: name });
                } else {
                    throw signInError;
                }
            }

            // Salva il nome scelto come pending per _handleFirebaseUser
            localStorage.setItem('pending_display_name', name);
            Auth._handleFirebaseUser(fbUser);
            hideLoginOverlay();
        } catch (e) {
            console.error("Errore Email Login:", e);
            if (e.code === 'auth/wrong-password') alert("Password errata. Riprova.");
            else if (e.code === 'auth/invalid-email') alert("Email non valida.");
            else if (e.code === 'auth/weak-password') alert("Password troppo corta (minimo 6 caratteri).");
            else alert("Errore di accesso: " + e.message);
        }
    },

    loginWithClassCode: async (code, studentName) => {
        if (!window.fbDb) return false;
        
        try {
            const q = await window.fbDb.collection('classes').where('code', '==', code.toUpperCase()).get();
            if (q.empty) {
                alert("Codice classe non valido. Chiedi al tuo docente!");
                return false;
            }
            
            const classData = q.docs[0].data();
            const classId = q.docs[0].id;

            Auth._user = {
                uid: 'std_' + Math.random().toString(36).substr(2, 9),
                name: studentName || 'Studente',
                avatar: 'assets/avatar.png',
                role: 'studente',
                classId: classId,
                teacherId: classData.teacherId,
                className: classData.name,
                points: 0,
                isGuest: false,
                setupComplete: false
            };

            localStorage.setItem('palestra_user', JSON.stringify(Auth._user));
            window.dispatchEvent(new CustomEvent('authChange'));
            return true;
        } catch (e) {
            console.error("Errore login con codice:", e);
            alert("Si è verificato un errore durante l'accesso.");
            return false;
        }
    },

    loginWithGoogle: async () => {
        if (!window.fbAuth) return;
        const provider = new firebase.auth.GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });
        
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        
        try {
            if (isMobile) {
                await window.fbAuth.signInWithRedirect(provider);
            } else {
                const result = await window.fbAuth.signInWithPopup(provider);
                if (result && result.user) {
                    await Auth._handleFirebaseUser(result.user);
                    if (typeof hideLoginOverlay === 'function') hideLoginOverlay();
                }
            }
        } catch (e) {
            console.error("Errore Google Login:", e);
            try { await window.fbAuth.signInWithRedirect(provider); } catch(e2) {}
        }
    },

    continueAsGuest: () => {
        Auth._user = {
            name: 'Atleta Anonimo',
            avatar: '👤',
            role: 'studente',
            isGuest: true,
            setupComplete: false,
            joinedAt: new Date().toISOString()
        };
        window.dispatchEvent(new CustomEvent('authChange'));
        hideLoginOverlay(); // Assicura che l'overlay scompaia
    },

    logout: async () => {
        try {
            if (window.fbAuth) await window.fbAuth.signOut();
        } catch(e) {}
        
        Auth._user = null;
        localStorage.removeItem('palestra_user');
        window.dispatchEvent(new CustomEvent('authChange'));
        
        // Invece di reload() che può causare loop, resettiamo lo stato e mostriamo l'overlay
        window.location.hash = 'home';
        window.hasShownInitialLogin = false;
        setTimeout(() => {
            window.location.reload();
        }, 100);
    },

    updateProfile: async (name, avatar) => {
        if (!Auth._user) return;
        
        Auth._user.name = name;
        Auth._user.avatar = avatar;
        
        localStorage.setItem('palestra_user', JSON.stringify(Auth._user));
        
        if (window.fbAuth && window.fbAuth.currentUser) {
            try {
                await window.fbDb.collection('users').doc(window.fbAuth.currentUser.uid).set(Auth._user, { merge: true });
            } catch (e) {
                console.error("Errore aggiornamento cloud profilo:", e);
            }
        }
        
        window.dispatchEvent(new CustomEvent('authChange'));
    }
};

Auth.init();
window.Auth = Auth;

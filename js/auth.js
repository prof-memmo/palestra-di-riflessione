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
                    console.log("🔓 Auth is Ready");
                    Auth._isReady = true;
                    resolve();
                }
            };
        });

        // 1. Fallback locale immediato
        const savedUser = localStorage.getItem('palestra_user');
        if (savedUser) {
            try { Auth._user = JSON.parse(savedUser); } catch(e) { Auth._user = null; }
        }

        if (window.fbAuth) {
            // 2. Forza persistenza locale
            window.fbAuth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).catch(e => console.error("Persistence error:", e));

            let redirectChecked = false;
            let authStateChecked = false;

            const checkFinished = () => {
                if (redirectChecked && authStateChecked) {
                    Auth._resolveReady();
                }
            };

            // 3. Gestione Redirect (fondamentale per mobile)
            window.fbAuth.getRedirectResult().then(async (result) => {
                redirectChecked = true;
                if (result && result.user) {
                    console.log("🔄 Risultato redirect catturato");
                    Auth._handledByRedirect = true;
                    await Auth._handleFirebaseUser(result.user);
                }
                checkFinished();
            }).catch(e => {
                console.error("Errore redirect:", e);
                redirectChecked = true;
                checkFinished();
            });

            // 4. Listener stato (per sessioni esistenti o login completati)
            window.fbAuth.onAuthStateChanged(async (user) => {
                authStateChecked = true;
                if (user) {
                    console.log("👤 Utente trovato in sessione");
                    Auth._fbUser = user;
                    if (!Auth._handledByRedirect) {
                        await Auth._handleFirebaseUser(user);
                    }
                } else {
                    console.log("🚫 Nessun utente in sessione");
                    if (!Auth._handledByRedirect) {
                        Auth._fbUser = null;
                        Auth._user = null;
                        localStorage.removeItem('palestra_user');
                    }
                }
                checkFinished();
            });
        } else {
            Auth._resolveReady();
        }
    },

    whenReady: () => {
        return Auth._readyPromise;
    },

    _handleFirebaseUser: async (fbUser) => {
        if (!fbUser) return;
        
        // FAST-PASS: Impostiamo subito un utente base per sbloccare la UI su mobile
        if (!Auth._user) {
            Auth._user = {
                uid: fbUser.uid,
                name: fbUser.displayName || 'Utente Google',
                avatar: fbUser.photoURL || 'assets/avatar.png',
                role: 'studente', // Default temporaneo
                email: fbUser.email,
                setupComplete: true, // Evitiamo loop di onboarding se possibile
                isGuest: false
            };
            localStorage.setItem('palestra_user', JSON.stringify(Auth._user));
        }

        // Forza la chiusura del login IMMEDIATAMENTE
        if (typeof hideLoginOverlay === 'function') {
            console.log("🚀 Aggressive Hide Login");
            hideLoginOverlay();
        }

        try {
            const doc = await window.fbDb.collection('users').doc(fbUser.uid).get();
            const pendingRole = localStorage.getItem('pending_role');

            if (doc.exists) {
                Auth._user = doc.data();
                if (pendingRole && Auth._user.role !== pendingRole && Auth._user.role !== 'admin') {
                    Auth._user.role = pendingRole;
                    await window.fbDb.collection('users').doc(fbUser.uid).update({ role: pendingRole });
                }
            } else {
                Auth._user = {
                    uid: fbUser.uid,
                    name: fbUser.displayName || '',
                    avatar: fbUser.photoURL || 'assets/avatar.png',
                    role: pendingRole || 'studente',
                    points: 0,
                    isGuest: false,
                    email: fbUser.email,
                    setupComplete: false,
                    createdAt: new Date().toISOString()
                };
                await window.fbDb.collection('users').doc(fbUser.uid).set(Auth._user);
            }
            
            localStorage.removeItem('pending_role');
            
            const ADMIN_EMAILS = ['prof.memmo@gmail.com'];
            if (fbUser.email && ADMIN_EMAILS.includes(fbUser.email)) {
                Auth._user.role = 'admin';
                Auth._user.setupComplete = true;
                await window.fbDb.collection('users').doc(fbUser.uid).set({ role: 'admin', setupComplete: true }, { merge: true });
            }

            localStorage.setItem('palestra_user', JSON.stringify(Auth._user));
            Auth._resolveReady();
            
            // Seconda passata di hiding per sicurezza
            if (typeof hideLoginOverlay === 'function') hideLoginOverlay();
            
            if (window.Progress && typeof window.Progress.load === 'function') {
                await window.Progress.load();
            }
            window.dispatchEvent(new CustomEvent('authChange'));
        } catch (e) {
            console.error("Errore recupero cloud:", e);
            Auth._resolveReady();
            if (typeof hideLoginOverlay === 'function') hideLoginOverlay();
            window.dispatchEvent(new CustomEvent('authChange'));
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
        
        // Su mobile usiamo il redirect, su desktop il popup
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        
        try {
            if (isMobile) {
                await window.fbAuth.signInWithRedirect(provider);
            } else {
                const result = await window.fbAuth.signInWithPopup(provider);
                Auth._handleFirebaseUser(result.user);
                hideLoginOverlay();
            }
        } catch (e) {
            console.error("Errore Google Login:", e);
            // Se il popup fallisce (es. bloccato), prova il redirect
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

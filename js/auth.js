const Auth = {
    _user: null,
    _fbUser: null,

    init: () => {
        // Fallback locale per utenti già esistenti
        const savedUser = localStorage.getItem('palestra_user');
        if (savedUser) {
            Auth._user = JSON.parse(savedUser);
        }

        // Inizializza listener Firebase
        if (window.fbAuth) {
            // Gestisci il risultato del redirect (per mobile)
            window.fbAuth.getRedirectResult().then((result) => {
                if (result && result.user) {
                    Auth._handleFirebaseUser(result.user);
                }
            }).catch(e => console.error("Errore redirect:", e));

            window.fbAuth.onAuthStateChanged(async (user) => {
                if (user) {
                    Auth._fbUser = user;
                    Auth._handleFirebaseUser(user);
                }
            });
        }
    },

    _handleFirebaseUser: async (fbUser) => {
        try {
            const doc = await window.fbDb.collection('users').doc(fbUser.uid).get();
            if (doc.exists) {
                Auth._user = doc.data();
            } else {
                // Se l'utente non esiste nel database (es. primo accesso Google), creiamo un profilo base
                Auth._user = {
                    uid: fbUser.uid,
                    name: fbUser.displayName || 'Atleta Google',
                    avatar: fbUser.photoURL || 'assets/avatar.png',
                    role: 'studente',
                    points: 0,
                    isGuest: false,
                    email: fbUser.email
                };
                // Salvataggio iniziale nel DB per persistere il profilo
                await window.fbDb.collection('users').doc(fbUser.uid).set(Auth._user);
            }
            localStorage.setItem('palestra_user', JSON.stringify(Auth._user));
            window.dispatchEvent(new CustomEvent('authChange'));
        } catch (e) {
            console.error("Errore recupero/creazione dati cloud:", e);
        }
    },

    isLoggedIn: () => {
        return !!Auth._user;
    },

    getUser: () => {
        return Auth._user || { name: 'Atleta Anonimo', avatar: '👤', role: 'studente', isGuest: true };
    },

    login: async (name, avatar = 'assets/avatar.png', role = 'studente') => {
        Auth._user = {
            name: name,
            avatar: avatar,
            role: role,
            isGuest: false,
            joinedAt: new Date().toISOString()
        };

        localStorage.setItem('palestra_user', JSON.stringify(Auth._user));

        if (window.fbAuth) {
            try {
                // Se non è già loggato in Firebase, entra come anonimo per salvare i dati
                if (!window.fbAuth.currentUser) {
                    const cred = await window.fbAuth.signInAnonymously();
                    await window.fbDb.collection('users').doc(cred.user.uid).set(Auth._user);
                } else {
                    await window.fbDb.collection('users').doc(window.fbAuth.currentUser.uid).set(Auth._user, { merge: true });
                }
            } catch (e) {
                console.error("Errore salvataggio cloud login:", e);
            }
        }

        window.dispatchEvent(new CustomEvent('authChange'));
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

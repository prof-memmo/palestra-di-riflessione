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
            window.fbAuth.onAuthStateChanged(async (user) => {
                if (user) {
                    Auth._fbUser = user;
                    // Prova a recuperare i dati dal Cloud
                    try {
                        const doc = await window.fbDb.collection('users').doc(user.uid).get();
                        if (doc.exists) {
                            Auth._user = doc.data();
                            localStorage.setItem('palestra_user', JSON.stringify(Auth._user));
                            window.dispatchEvent(new CustomEvent('authChange'));
                        }
                    } catch (e) {
                        console.error("Errore recupero dati cloud:", e);
                    }
                }
            });
        }
    },

    isLoggedIn: () => {
        return !!Auth._user;
    },

    getUser: () => {
        return Auth._user || { name: 'Atleta Anonimo', avatar: '👤', isGuest: true };
    },

    login: async (name, avatar = 'assets/avatar.png', role = 'studente') => {
        Auth._user = {
            name: name,
            avatar: avatar,
            role: role,
            isGuest: false,
            joinedAt: new Date().toISOString()
        };

        // Salva in locale
        localStorage.setItem('palestra_user', JSON.stringify(Auth._user));

        // Salva nel Cloud se Firebase è attivo
        if (window.fbAuth) {
            try {
                const cred = await window.fbAuth.signInAnonymously();
                await window.fbDb.collection('users').doc(cred.user.uid).set(Auth._user);
            } catch (e) {
                console.error("Errore salvataggio cloud login:", e);
            }
        }

        window.dispatchEvent(new CustomEvent('authChange'));
    },

    loginWithGoogle: async () => {
        if (!window.fbAuth) return;
        const provider = new firebase.auth.GoogleAuthProvider();
        try {
            const result = await window.fbAuth.signInWithPopup(provider);
            const user = result.user;
            
            Auth._user = {
                name: user.displayName,
                email: user.email,
                avatar: user.photoURL,
                role: user.email === 'prof.memmo@gmail.com' ? 'admin' : 'studente',
                isGuest: false,
                joinedAt: new Date().toISOString()
            };

            localStorage.setItem('palestra_user', JSON.stringify(Auth._user));
            await window.fbDb.collection('users').doc(user.uid).set(Auth._user, { merge: true });
            
            window.dispatchEvent(new CustomEvent('authChange'));
            hideLoginOverlay();
        } catch (e) {
            console.error("Errore Google Login:", e);
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
    },

    logout: async () => {
        if (window.fbAuth) await window.fbAuth.signOut();
        Auth._user = null;
        localStorage.removeItem('palestra_user');
        window.dispatchEvent(new CustomEvent('authChange'));
        window.location.hash = 'home';
        window.location.reload();
    }
};

Auth.init();
window.Auth = Auth;

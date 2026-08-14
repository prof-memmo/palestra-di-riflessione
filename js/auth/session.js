Object.assign(window.Auth = window.Auth || {}, {
    _user: null,
    _fbUser: null,
    _isReady: false,
    _readyPromise: null,
    _resolveReady: null,
    init: () => {
        window.Auth._readyPromise = new Promise((resolve) => {
            window.Auth._resolveReady = () => {
                if (!window.Auth._isReady) {
                    window.Auth._isReady = true;
                    resolve();
                }
            };
        });

        const savedUser = localStorage.getItem('palestra_user');
        if (savedUser) {
            try {
                window.Auth._user = JSON.parse(savedUser);
            } catch(e) {
                window.Auth._user = null;
                localStorage.removeItem('palestra_user');
            }
        }

        if (window.fbAuth) {
            window.fbAuth.onAuthStateChanged(async (user) => {
                if (user) {
                    window.Auth._fbUser = user;
                    await window.Auth._handleFirebaseUser(user);
                } else {
                    window.Auth._fbUser = null;
                    window.Auth._user = null;
                    localStorage.removeItem('palestra_user');
                    window.Auth._resolveReady();
                }
            });
        } else {
            window.Auth._resolveReady();
        }
    },

    whenReady: () => {
        return window.Auth._readyPromise;
    },

    _handleFirebaseUser: async (fbUser) => {
        try {
            const email = fbUser.email ? fbUser.email.toLowerCase() : '';
            let isSuperAdmin = (email === 'prof.memmo@gmail.com');
            let userPiano = 'base';
            let hubRole = 'studente';
            let hubName = fbUser.displayName || 'Utente Palestra';

            // 1. Verifica sull'Hub Centrale (Single Sign-On Auth)
            try {
                const hubDoc = await window.fbDb.collection('hub_users').doc(fbUser.uid).get();
                if (hubDoc.exists) {
                    const hubData = hubDoc.data();
                    if (hubData.role === 'admin' || isSuperAdmin) {
                        isSuperAdmin = true;
                        hubRole = 'admin';
                    } else if (hubData.role === 'docente') {
                        hubRole = 'docente';
                    } else if (hubData.role === 'viandante' || hubData.role === 'amico_del_prof' || hubData.role === 'forestiero') {
                        hubRole = 'amico';
                    } else {
                        hubRole = 'studente';
                    }
                    if (hubData.anagrafica && hubData.anagrafica.nome) {
                        hubName = hubData.anagrafica.nome;
                    }
                    userPiano = hubData.subscription || hubData.abbonamento || (isSuperAdmin ? 'docente_ecosistema' : 'base');
                    if (!isSuperAdmin && hubData.statusAccount && (hubData.statusAccount === 'rejected' || hubData.statusAccount === 'suspended')) {
                        alert("Accesso negato: L'account è stato sospeso nell'Hub.");
                        window.location.href = 'https://prof-memmo.github.io/prof-memmo-gestione-siti/portal.html';
                        return;
                    }
                } else {
                    hubRole = isSuperAdmin ? 'admin' : 'studente';
                }
            } catch (err) {
                console.warn("Verifica Hub (fallback locale):", err);
                hubRole = isSuperAdmin ? 'admin' : 'studente';
            }

            if (isSuperAdmin) userPiano = 'docente_ecosistema';
            localStorage.setItem('palestra_user_plan', userPiano);

            const doc = await window.fbDb.collection('users').doc(fbUser.uid).get();

            if (doc.exists) {
                window.Auth._user = doc.data();
                window.Auth._user.piano = userPiano;
                if (isSuperAdmin) {
                    window.Auth._user.role = 'admin';
                } else if (hubRole) {
                    window.Auth._user.role = hubRole;
                }
                if (!window.Auth._user.name && hubName) {
                    window.Auth._user.name = hubName;
                }
                window.Auth._user.setupComplete = true;
                
                if (!window.Auth._user.email && fbUser.email) {
                    window.Auth._user.email = fbUser.email;
                    await window.fbDb.collection('users').doc(fbUser.uid).update({ email: fbUser.email });
                }
            } else {
                window.Auth._user = {
                    uid: fbUser.uid,
                    name: hubName,
                    avatar: fbUser.photoURL || 'assets/logo.png',
                    role: isSuperAdmin ? 'admin' : hubRole,
                    piano: userPiano,
                    points: 0,
                    isGuest: false,
                    email: fbUser.email,
                    setupComplete: true,
                    createdAt: new Date().toISOString()
                };

                await window.fbDb.collection('users').doc(fbUser.uid).set(window.Auth._user);
            }
            localStorage.removeItem('pending_role');
            
            const ADMIN_EMAILS = ['prof.memmo@gmail.com'];
            if (fbUser.email && ADMIN_EMAILS.includes(fbUser.email)) {
                window.Auth._user.role = 'admin';
                window.Auth._user.setupComplete = true;
                await window.fbDb.collection('users').doc(fbUser.uid).set({ role: 'admin', setupComplete: true }, { merge: true });
            }

            const TEACHER_EMAILS = ['guglielmo.piersanti@padregemelli.net'];
            if (fbUser.email && TEACHER_EMAILS.includes(fbUser.email) && window.Auth._user.role !== 'docente') {
                window.Auth._user.role = 'docente';
                await window.fbDb.collection('users').doc(fbUser.uid).set({ role: 'docente' }, { merge: true });
            }

            localStorage.setItem('palestra_user', JSON.stringify(window.Auth._user));
            
            window.Auth._resolveReady();
            
            if (typeof hideLoginOverlay === 'function') hideLoginOverlay();
            
            if (window.Progress && typeof window.Progress.load === 'function') {
                await window.Progress.load();
            }

            window.dispatchEvent(new CustomEvent('authChange'));
        } catch (e) {
            console.error("Errore recupero/creazione dati cloud:", e);
            window.Auth._resolveReady();
            if (e.code === 'permission-denied') {
                alert("Errore di sincronizzazione: Permessi insufficienti sul database Firebase. Contatta l'amministratore per verificare le Security Rules.");
            }
        }
    }
});
setTimeout(() => { if (window.Auth.init) window.Auth.init(); }, 0);

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
            const isSuperAdmin = (email === 'prof.memmo@gmail.com');

            // 1. Verifica sull'Hub Centrale (Single Sign-On Auth)
            let userPiano = 'base';
            if (!isSuperAdmin) {
                try {
                    const hubDoc = await window.fbDb.collection('hub_users').doc(fbUser.uid).get();
                    if (!hubDoc.exists) {
                        alert("Profilo Hub non trovato. Completa l'onboarding nell'Hub.");
                        window.location.href = 'https://prof-memmo.github.io/prof-memmo-gestione-siti/portal.html?redirect=palestra_riflessione';
                        return;
                    }
                    const hubData = hubDoc.data();
                    if (hubData.statusAccount !== 'active') {
                        alert("Accesso negato: L'account non è attivo nell'Hub (potrebbe essere sospeso o in attesa di approvazione).");
                        window.location.href = 'https://prof-memmo.github.io/prof-memmo-gestione-siti/portal.html';
                        return;
                    }
                    if (!hubData.platforms || !hubData.platforms.palestra_riflessione || !hubData.platforms.palestra_riflessione.enabled) {
                        alert("Accesso negato: Piattaforma Palestra di Riflessione non abilitata per il tuo profilo.");
                        window.location.href = 'https://prof-memmo.github.io/prof-memmo-gestione-siti/portal.html';
                        return;
                    }
                    userPiano = hubData.subscription || hubData.abbonamento || 'base';
                } catch (err) {
                    console.error("Errore verifica Hub:", err);
                    alert("Errore di sicurezza Hub. Riprova.");
                    window.location.href = 'https://prof-memmo.github.io/prof-memmo-gestione-siti/portal.html';
                    return;
                }
            } else {
                userPiano = 'docente_ecosistema';
            }

            localStorage.setItem('palestra_user_plan', userPiano);

            const doc = await window.fbDb.collection('users').doc(fbUser.uid).get();
            const pendingRole = localStorage.getItem('pending_role');

            if (doc.exists) {
                window.Auth._user = doc.data();
                window.Auth._user.piano = userPiano;
                
                if (!window.Auth._user.email && fbUser.email) {
                    window.Auth._user.email = fbUser.email;
                    await window.fbDb.collection('users').doc(fbUser.uid).update({ email: fbUser.email });
                }

                if (window.Auth._user.status === 'archived' && window.Auth._user.role === 'studente') {
                    const newClassCode = prompt("Il tuo account è archiviato. Inserisci il nuovo Codice Classe per riattivarti:");
                    if (newClassCode) {
                        const q = await window.fbDb.collection('classes').where('code', '==', newClassCode.toUpperCase()).get();
                        if (!q.empty) {
                            const classData = q.docs[0].data();
                            const classId = q.docs[0].id;
                            window.Auth._user.status = 'active';
                            window.Auth._user.classId = classId;
                            window.Auth._user.className = classData.name;
                            window.Auth._user.teacherId = classData.teacherId;
                            await window.fbDb.collection('users').doc(fbUser.uid).update({
                                status: 'active',
                                classId: classId,
                                className: classData.name,
                                teacherId: classData.teacherId
                            });
                            alert("Bentornato! Sei stato riattivato nella classe " + classData.name);
                        } else {
                            alert("Codice classe non valido.");
                            window.Auth.logout();
                            return;
                        }
                    } else {
                        alert("Codice necessario per riattivare l'account.");
                        window.Auth.logout();
                        return;
                    }
                }
                
                if (pendingRole && window.Auth._user.role !== pendingRole && window.Auth._user.role !== 'admin') {
                    window.Auth._user.role = pendingRole;
                    await window.fbDb.collection('users').doc(fbUser.uid).update({ role: pendingRole });
                }
            } else {
                window.Auth._user = {
                    uid: fbUser.uid,
                    name: fbUser.displayName || '',
                    avatar: fbUser.photoURL || 'assets/avatar.png',
                    role: isSuperAdmin ? 'admin' : (pendingRole || 'studente'),
                    piano: userPiano,
                    points: 0,
                    isGuest: false,
                    email: fbUser.email,
                    setupComplete: isSuperAdmin ? true : false,
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

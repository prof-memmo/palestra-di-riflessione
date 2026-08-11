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
            const doc = await window.fbDb.collection('users').doc(fbUser.uid).get();
            const pendingRole = localStorage.getItem('pending_role');

            if (doc.exists) {
                window.Auth._user = doc.data();
                
                // --- FETCH PIANO UTENTE DAL HUB ---
                try {
                    let hubApp = firebase.apps.find(a => a.name === "HubGuardApp");
                    if (hubApp) {
                        const hubDoc = await hubApp.firestore().collection('hub_users').doc(fbUser.uid).get();
                        if (hubDoc.exists) {
                            const piano = hubDoc.data().abbonamento;
                            localStorage.setItem('palestra_user_plan', piano || 'base');
                            window.Auth._user.piano = piano || 'base';
                        } else {
                            localStorage.setItem('palestra_user_plan', 'base');
                        }
                    }
                } catch(err) {
                    console.error("Errore fetch piano hub:", err);
                    localStorage.setItem('palestra_user_plan', 'base');
                }
                
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
                    role: pendingRole || 'studente',
                    points: 0,
                    isGuest: false,
                    email: fbUser.email,
                    setupComplete: false,
                    createdAt: new Date().toISOString()
                };
                
                // --- FETCH PIANO UTENTE DAL HUB ---
                try {
                    let hubApp = firebase.apps.find(a => a.name === "HubGuardApp");
                    if (hubApp) {
                        const hubDoc = await hubApp.firestore().collection('hub_users').doc(fbUser.uid).get();
                        if (hubDoc.exists) {
                            const piano = hubDoc.data().abbonamento;
                            localStorage.setItem('palestra_user_plan', piano || 'base');
                            window.Auth._user.piano = piano || 'base';
                        } else {
                            localStorage.setItem('palestra_user_plan', 'base');
                        }
                    }
                } catch(err) {
                    console.error("Errore fetch piano hub (nuovo utente):", err);
                    localStorage.setItem('palestra_user_plan', 'base');
                }

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

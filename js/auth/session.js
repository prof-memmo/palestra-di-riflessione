window.Auth = window.Auth || {};
    _user: null,
    _fbUser: null,
    _isReady: false,
    _readyPromise: null,
    _resolveReady: null,
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
            window.fbAuth.onAuthStateChanged(async (user) => {
                if (user) {
                    Auth._fbUser = user;
                    await Auth._handleFirebaseUser(user);
                } else {
                    Auth._fbUser = null;
                    Auth._user = null;
                    localStorage.removeItem('palestra_user');
                    Auth._resolveReady();
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
                // Ensure email is always present and updated from Firebase Auth
                if (!Auth._user.email && fbUser.email) {
                    Auth._user.email = fbUser.email;
                    await window.fbDb.collection('users').doc(fbUser.uid).update({ email: fbUser.email });
                }

                if (Auth._user.status === 'archived' && Auth._user.role === 'studente') {
                    const newClassCode = prompt("Il tuo account è archiviato. Inserisci il nuovo Codice Classe per riattivarti:");
                    if (newClassCode) {
                        const q = await window.fbDb.collection('classes').where('code', '==', newClassCode.toUpperCase()).get();
                        if (!q.empty) {
                            const classData = q.docs[0].data();
                            const classId = q.docs[0].id;
                            Auth._user.status = 'active';
                            Auth._user.classId = classId;
                            Auth._user.className = classData.name;
                            Auth._user.teacherId = classData.teacherId;
                            await window.fbDb.collection('users').doc(fbUser.uid).update({
                                status: 'active',
                                classId: classId,
                                className: classData.name,
                                teacherId: classData.teacherId
                            });
                            alert("Bentornato! Sei stato riattivato nella classe " + classData.name);
                        } else {
                            alert("Codice classe non valido.");
                            Auth.logout();
                            return;
                        }
                    } else {
                        alert("Codice necessario per riattivare l'account.");
                        Auth.logout();
                        return;
                    }
                }
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

            // Controllo docenti forzati (es. email specifiche che devono essere docenti e non admin)
            const TEACHER_EMAILS = ['guglielmo.piersanti@padregemelli.net'];
            if (fbUser.email && TEACHER_EMAILS.includes(fbUser.email) && Auth._user.role !== 'docente') {
                Auth._user.role = 'docente';
                await window.fbDb.collection('users').doc(fbUser.uid).set({ role: 'docente' }, { merge: true });
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

Auth.init();

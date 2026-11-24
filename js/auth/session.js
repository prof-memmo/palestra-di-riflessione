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

            // Parametri da URL (es: ?class=... o ?code=...)
            const urlParams = new URLSearchParams(window.location.search);
            const urlClass = (urlParams.get('class') || urlParams.get('classCode') || urlParams.get('code') || '').trim().toUpperCase();

            // Parametri da LocalStorage (ereditati dall'Hub o da sessioni precedenti)
            const localClass = (localStorage.getItem('palestra_student_class_code') || localStorage.getItem('pm_student_class') || localStorage.getItem('hub_user_class') || '').trim().toUpperCase();
            const localName = (localStorage.getItem('pm_student_name') || localStorage.getItem('hub_user_name') || '').trim();
            const localAvatar = (localStorage.getItem('hub_user_avatar') || '').trim();
            const localRole = (localStorage.getItem('hub_user_role') || (typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('pm_entry_role') : '') || '').trim();

            // Identificazione studente virtuale (creato da claimStudentSlot / studentLogin)
            const isStudentVirtual = (fbUser.uid && fbUser.uid.startsWith('stud_')) || (email && email.includes('@studente.profmemmo.it'));

            // Verifica Custom Claims del token Firebase
            let claimClassId = '';
            let claimStudentId = '';
            let claimTeacherId = '';
            let claimRole = '';
            try {
                const tokRes = await fbUser.getIdTokenResult();
                if (tokRes && tokRes.claims) {
                    claimClassId = tokRes.claims.classId || '';
                    claimStudentId = tokRes.claims.studentId || '';
                    claimTeacherId = tokRes.claims.teacherId || '';
                    claimRole = tokRes.claims.role || '';
                }
            } catch (eTok) {}

            let hubDocExists = false;
            let hubClassCode = urlClass || localClass || '';
            let hubClassId = claimClassId || '';
            let hubClassName = '';
            let hubTeacherId = claimTeacherId || '';
            let hubStudentId = claimStudentId || '';

            // 1. Verifica sull'Hub Centrale (Single Sign-On Auth)
            try {
                const hubDoc = await window.fbDb.collection('hub_users').doc(fbUser.uid).get();
                if (hubDoc.exists) {
                    hubDocExists = true;
                    const hubData = hubDoc.data() || {};
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

                    const candidateName = (hubData.anagrafica && hubData.anagrafica.nome) || hubData.nome || hubData.name || hubData.displayName || hubData.nickname;
                    if (candidateName) hubName = candidateName;

                    const candidateAvatar = hubData.avatar || (hubData.anagrafica && hubData.anagrafica.avatar);
                    if (candidateAvatar) this._tempHubAvatar = candidateAvatar;

                    const candidateClass = hubData.classCode || hubData.code || hubData.classe || hubData.className || (hubData.anagrafica && (hubData.anagrafica.codiceClasse || hubData.anagrafica.classCode || hubData.anagrafica.classe));
                    if (candidateClass && !hubClassCode) hubClassCode = String(candidateClass).trim().toUpperCase();
                    if (hubData.classId && !hubClassId) hubClassId = hubData.classId;
                    if (hubData.className && !hubClassName) hubClassName = hubData.className;
                    if (hubData.teacherId && !hubTeacherId) hubTeacherId = hubData.teacherId;
                    if (hubData.studentId && !hubStudentId) hubStudentId = hubData.studentId;

                    userPiano = hubData.subscription || hubData.abbonamento || (isSuperAdmin ? 'docente_ecosistema' : (hubRole === 'studente' ? 'studente' : 'base'));

                    if (!isSuperAdmin && hubData.statusAccount && (hubData.statusAccount === 'rejected' || hubData.statusAccount === 'suspended')) {
                        alert("Accesso negato: L'account è stato sospeso nell'Hub.");
                        window.location.href = 'https://prof-memmo.github.io/prof-memmo-gestione-siti/portal.html';
                        return;
                    }
                } else if (isStudentVirtual) {
                    hubDocExists = true;
                    hubRole = 'studente';
                    if (localName) hubName = localName;
                    if (localAvatar) this._tempHubAvatar = localAvatar;
                    userPiano = 'studente';

                    // Se virtualUid è del tipo stud_{classDocId}_{studentId}
                    const parts = fbUser.uid.split('_');
                    if (parts.length >= 3) {
                        if (!hubClassId) hubClassId = parts[1];
                        if (!hubStudentId) hubStudentId = parts.slice(2).join('_');
                    }
                } else {
                    hubRole = isSuperAdmin ? 'admin' : (claimRole || (localRole === 'docente' ? 'docente' : (localRole === 'viandante' || localRole === 'amico_del_prof' || localRole === 'amico' ? 'amico' : 'studente')));
                    if (localName) hubName = localName;
                    if (localAvatar) this._tempHubAvatar = localAvatar;
                    if (claimRole || localRole || fbUser.email) {
                        hubDocExists = true;
                    }
                }
            } catch (err) {
                console.warn("Verifica Hub (fallback locale):", err);
                hubRole = isSuperAdmin ? 'admin' : (claimRole || 'studente');
            }

            // Risoluzione dettagli classe se noti id o codice
            if (hubClassId && (!hubClassCode || !hubClassName)) {
                try {
                    const cSnap = await window.fbDb.collection('hub_classes').doc(hubClassId).get();
                    if (cSnap.exists) {
                        const cData = cSnap.data() || {};
                        if (!hubClassCode) hubClassCode = (cData.code || '').trim().toUpperCase();
                        if (!hubClassName) hubClassName = cData.name || '';
                        if (!hubTeacherId) hubTeacherId = cData.teacherId || (cData.teacherIds && cData.teacherIds[0]) || '';
                    }
                } catch(eClass) {}
            }
            if (hubClassCode && (!hubClassId || !hubClassName)) {
                try {
                    let qC = await window.fbDb.collection('hub_classes').where('code', '==', hubClassCode).limit(1).get().catch(() => ({ empty: true }));
                    if (qC && !qC.empty) {
                        const cDoc = qC.docs[0];
                        const cData = cDoc.data() || {};
                        if (!hubClassId) hubClassId = cDoc.id;
                        if (!hubClassName) hubClassName = cData.name || '';
                        if (!hubTeacherId) hubTeacherId = cData.teacherId || (cData.teacherIds && cData.teacherIds[0]) || '';
                    } else {
                        let qC2 = await window.fbDb.collection('classes').where('code', '==', hubClassCode).limit(1).get().catch(() => ({ empty: true }));
                        if (qC2 && !qC2.empty) {
                            const cDoc = qC2.docs[0];
                            const cData = cDoc.data() || {};
                            if (!hubClassId) hubClassId = cDoc.id;
                            if (!hubClassName) hubClassName = cData.name || '';
                            if (!hubTeacherId) hubTeacherId = cData.teacherId || (cData.teacherIds && cData.teacherIds[0]) || '';
                        }
                    }
                } catch(eClass2) {}
            }

            if (isSuperAdmin) userPiano = 'docente_ecosistema';
            localStorage.setItem('palestra_user_plan', userPiano);

            const isSetupComplete = (hubDocExists || isSuperAdmin || isStudentVirtual || !!fbUser.email);
            const roleLabel = (hubRole === 'amico') ? 'Amico della Palestra' : (hubRole === 'studente' ? 'Studente' : (hubRole === 'docente' ? 'Docente' : 'Admin'));
            const techRole = (hubRole === 'amico') ? 'studente' : hubRole;

            const doc = await window.fbDb.collection('users').doc(fbUser.uid).get();

            if (doc.exists) {
                const cloudData = doc.data() || {};
                window.Auth._user = { ...cloudData };
                window.Auth._user.piano = userPiano;
                if (this._tempHubAvatar) {
                    window.Auth._user.avatar = this._tempHubAvatar;
                } else if (!window.Auth._user.avatar && fbUser.photoURL) {
                    window.Auth._user.avatar = fbUser.photoURL;
                }
                if (isSuperAdmin) {
                    window.Auth._user.role = 'admin';
                    window.Auth._user.roleLabel = 'Docente';
                    window.Auth._user.setupComplete = true;
                } else if (hubRole) {
                    window.Auth._user.role = techRole;
                    window.Auth._user.roleLabel = roleLabel;
                }
                if (!window.Auth._user.name && hubName) {
                    window.Auth._user.name = hubName;
                }
                if (isSetupComplete) {
                    window.Auth._user.setupComplete = true;
                }
                if (hubClassCode) window.Auth._user.classCode = hubClassCode;
                if (hubClassId) window.Auth._user.classId = hubClassId;
                if (hubClassName) window.Auth._user.className = hubClassName;
                if (hubTeacherId) window.Auth._user.teacherId = hubTeacherId;
                if (hubStudentId) window.Auth._user.studentId = hubStudentId;

                if (!window.Auth._user.email && fbUser.email) {
                    window.Auth._user.email = fbUser.email;
                }
            } else {
                // Nuovo utente dall'Hub: profilo inizializzato e configurato, NESSUN ONBOARDING RIDONDANTE
                window.Auth._user = {
                    uid: fbUser.uid,
                    name: hubName || fbUser.displayName || 'Nuovo Utente',
                    avatar: this._tempHubAvatar || fbUser.photoURL || 'assets/avatars/6.png',
                    role: isSuperAdmin ? 'admin' : techRole,
                    roleLabel: roleLabel,
                    piano: userPiano,
                    points: 0,
                    isGuest: false,
                    email: fbUser.email,
                    setupComplete: isSetupComplete,
                    createdAt: new Date().toISOString()
                };
                if (hubClassCode) window.Auth._user.classCode = hubClassCode;
                if (hubClassId) window.Auth._user.classId = hubClassId;
                if (hubClassName) window.Auth._user.className = hubClassName;
                if (hubTeacherId) window.Auth._user.teacherId = hubTeacherId;
                if (hubStudentId) window.Auth._user.studentId = hubStudentId;
            }
            localStorage.removeItem('pending_role');
            
            const ADMIN_EMAILS = ['prof.memmo@gmail.com'];
            if (fbUser.email && ADMIN_EMAILS.includes(fbUser.email)) {
                window.Auth._user.role = 'admin';
                window.Auth._user.roleLabel = 'Docente';
                window.Auth._user.setupComplete = true;
            }

            const TEACHER_EMAILS = ['guglielmo.piersanti@padregemelli.net'];
            if (fbUser.email && TEACHER_EMAILS.includes(fbUser.email) && window.Auth._user.role !== 'docente') {
                window.Auth._user.role = 'docente';
                window.Auth._user.roleLabel = 'Docente';
            }

            if (hubClassCode) {
                localStorage.setItem('palestra_student_class_code', hubClassCode);
            }
            localStorage.setItem('palestra_user', JSON.stringify(window.Auth._user));

            try {
                await window.fbDb.collection('users').doc(fbUser.uid).set(window.Auth._user, { merge: true });
            } catch (saveErr) {
                console.warn("Aggiornamento profilo users:", saveErr);
            }
            
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

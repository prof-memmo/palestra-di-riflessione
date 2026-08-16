Object.assign(window.Auth = window.Auth || {}, {
    login: async (name, avatar = 'assets/avatar.png', role = 'studente') => {
        console.warn("Metodo login() deprecato. Usa loginWithEmail() o loginWithGoogle().");
    },
    loginWithEmail: async (name, email, password) => {
        if (!window.fbAuth) return;
        if (!email || !password) {
            alert("Inserisci email e password per continuare.");
            return;
        }
        try {
            let fbUser;
            try {
                const result = await window.fbAuth.signInWithEmailAndPassword(email, password);
                fbUser = result.user;
            } catch (signInError) {
                if (signInError.code === 'auth/user-not-found' || signInError.code === 'auth/invalid-credential') {
                    const result = await window.fbAuth.createUserWithEmailAndPassword(email, password);
                    fbUser = result.user;
                    const finalName = name || email.split('@')[0];
                    await fbUser.updateProfile({ displayName: finalName });
                } else {
                    throw signInError;
                }
            }
            localStorage.setItem('pending_display_name', name || email.split('@')[0]);
            window.Auth._handleFirebaseUser(fbUser);
            if (typeof hideLoginOverlay === 'function') hideLoginOverlay();
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
            const cleanCode = (code || '').trim().toUpperCase();
            let q = await window.fbDb.collection('classes').where('code', '==', cleanCode).get();
            if (q.empty) {
                q = await window.fbDb.collection('palestra_classes').where('code', '==', cleanCode).get();
            }
            if (q.empty) {
                alert("Codice classe non valido. Chiedi al tuo docente!");
                return false;
            }
            const classDoc = q.docs[0];
            const classData = classDoc.data();
            const classId = classDoc.id;
            const studentUid = 'std_' + Math.random().toString(36).substr(2, 9);
            
            const studentObj = {
                uid: studentUid,
                id: studentUid,
                name: studentName || 'Studente',
                avatar: '👤',
                role: 'studente',
                classId: classId,
                classCode: cleanCode,
                className: classData.name || '',
                teacherId: classData.teacherId || '',
                points: 0,
                isGuest: false,
                setupComplete: true,
                createdAt: new Date().toISOString(),
                lastUpdated: new Date().toISOString()
            };

            // Salva su Firestore per renderlo visibile al docente nel Registro
            try {
                await window.fbDb.collection('palestra_users').doc(studentUid).set(studentObj, { merge: true });
                if (classDoc.ref && typeof classDoc.ref.update === 'function') {
                    await classDoc.ref.update({
                        studentIds: firebase.firestore.FieldValue.arrayUnion(studentUid),
                        studentsCount: firebase.firestore.FieldValue.increment(1)
                    }).catch(() => {});
                }
            } catch(err) {
                console.warn("Impossibile salvare studente su Firestore:", err);
            }

            window.Auth._user = studentObj;
            localStorage.setItem('palestra_user', JSON.stringify(studentObj));
            localStorage.setItem('palestra_student_class_code', cleanCode);
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
        try {
            const result = await window.fbAuth.signInWithPopup(provider);
            if (result && result.user) {
                await window.Auth._handleFirebaseUser(result.user);
                if (typeof hideLoginOverlay === 'function') hideLoginOverlay();
            }
        } catch (e) {
            console.error("Errore Google Login:", e);
            alert("Si è verificato un errore durante l'accesso con Google. Se stai usando un browser in-app (es. Instagram/Facebook), prova ad aprire il sito nel browser di sistema (Safari/Chrome).");
        }
    },
    continueAsGuest: () => {
        window.Auth._user = {
            name: 'Atleta Anonimo',
            avatar: '👤',
            role: 'studente',
            isGuest: true,
            setupComplete: false,
            joinedAt: new Date().toISOString()
        };
        window.dispatchEvent(new CustomEvent('authChange'));
        if (typeof hideLoginOverlay === 'function') hideLoginOverlay();
    }
});

window.adminDeleteUser = async function(uid, name) {
    if (!confirm(`Sei sicuro di voler eliminare definitivamente l'utente "${name}"? \n\nVerranno cancellati tutti i suoi dati e i suoi progressi dall'ecosistema.`)) return;
    
    try {
        // Elimina da palestra_users e palestra_progress
        await window.fbDb.collection('users').doc(uid).delete().catch(() => {});
        await window.fbDb.collection('progress').doc(uid).delete().catch(() => {});
        
        // Elimina dalla root legacy 'users' e da 'hub_users'
        if (window.fbDb.rawCollection) {
            await window.fbDb.rawCollection('users').doc(uid).delete().catch(() => {});
        }
        await window.fbDb.collection('hub_users').doc(uid).delete().catch(() => {});
        
        alert(`Utente "${name}" eliminato con successo dall'ecosistema.`);
        if (typeof renderAdminPage === 'function') renderAdminPage();
        if (typeof loadAdminUsersInProfile === 'function') loadAdminUsersInProfile();
    } catch (e) {
        console.error("Errore eliminazione utente:", e);
        alert("Impossibile eliminare l'utente: " + e.message);
    }
};

window.adminDeleteUserInProfile = async function(uid, name) {
    return window.adminDeleteUser(uid, name);
};


window.adminEditAttribute = async function(type, oldValue) {
    const newValue = prompt(`Inserisci il nuovo nome per ${type === 'school' ? 'la scuola' : 'la città'} "${oldValue}":`, oldValue);
    if (!newValue || newValue === oldValue) return;

    try {
        const batch = window.fbDb.batch();
        const collection = type === 'school' ? 'classes' : 'users'; // Semplificazione per esempio
        
        // Cerca in classi
        const classQ = await window.fbDb.collection('classes').where(type, '==', oldValue).get();
        classQ.forEach(doc => batch.update(doc.ref, { [type]: newValue }));
        
        // Cerca in utenti
        const userQ = await window.fbDb.collection('users').where(type, '==', oldValue).get();
        userQ.forEach(doc => batch.update(doc.ref, { [type]: newValue }));

        await batch.commit();
        alert("Aggiornamento completato su tutti i record.");
        loadAdminUsersInProfile();
    } catch (e) { alert("Errore durante l'aggiornamento massivo: " + e.message); }
};


window.adminActionOnSelected = async function(action) {
    const selectedCbs = document.querySelectorAll('.admin-student-checkbox:checked');
    if (selectedCbs.length === 0) return;

    if (action === 'move') {
        const destClassId = document.getElementById('admin-move-destination').value;
        if (!destClassId) { alert("Seleziona una classe di destinazione."); return; }
        
        const destClass = window.allClassesForAdmin.find(c => c.id === destClassId);
        if (!destClass) return;

        if (!confirm(`Vuoi spostare ${selectedCbs.length} utenti nella classe ${destClass.name}?`)) return;

        try {
            const batch = window.fbDb.batch();
            selectedCbs.forEach(cb => {
                const uid = cb.dataset.uid;
                batch.update(window.fbDb.collection('users').doc(uid), {
                    classId: destClassId,
                    className: destClass.name,
                    teacherId: destClass.teacherId
                });
            });
            await batch.commit();
            alert("✅ Utenti spostati con successo!");
            loadAdminUsersInProfile();
        } catch (e) { alert("Errore: " + e.message); }
    } else if (action === 'delete') {
        if (!confirm(`Vuoi rimuovere ${selectedCbs.length} utenti dalle loro classi attuali?`)) return;

        try {
            const batch = window.fbDb.batch();
            selectedCbs.forEach(cb => {
                const uid = cb.dataset.uid;
                batch.update(window.fbDb.collection('users').doc(uid), {
                    classId: window.firebase.firestore.FieldValue.delete(),
                    className: window.firebase.firestore.FieldValue.delete(),
                    teacherId: window.firebase.firestore.FieldValue.delete()
                });
            });
            await batch.commit();
            alert("✅ Utenti rimossi dalle classi!");
            loadAdminUsersInProfile();
        } catch (e) { alert("Errore: " + e.message); }
    }
};


window.moveSelectedStudents = async function(currentCode, currentName, currentId) {
    const selectedCbs = document.querySelectorAll('.student-checkbox:checked');
    const destClassId = document.getElementById('move-destination-class').value;
    
    if (selectedCbs.length === 0) {
        alert("Seleziona almeno uno studente da spostare.");
        return;
    }
    
    if (!destClassId) {
        alert("Seleziona una classe di destinazione.");
        return;
    }

    // Trova i dati della classe di destinazione
    const teacherClasses = JSON.parse(localStorage.getItem('palestra_classes') || '[]');
    const destClass = teacherClasses.find(c => c.id === destClassId);
    if (!destClass) return;

    if (!confirm(`Vuoi spostare ${selectedCbs.length} studenti nella classe ${destClass.name}?`)) return;

    try {
        const db = window.fbDb;
        const batch = db.batch();
        
        selectedCbs.forEach(cb => {
            const uid = cb.dataset.uid;
            const userRef = db.collection('users').doc(uid);
            
            // Ripristiniamo il payload al minimo indispensabile che funzionava in precedenza
            const updatePayload = {
                classId: destClassId,
                className: destClass.name
            };
            
            // Se la classe di destinazione ha un teacherId (singolo), aggiorniamolo per coerenza
            if (destClass.teacherId) {
                updatePayload.teacherId = destClass.teacherId;
            }
            
            console.log(`📦 Spostamento studente ${uid} verso ${destClassId}`, updatePayload);
            batch.update(userRef, updatePayload);
        });

        await batch.commit();
        alert(`✅ Successo! ${selectedCbs.length} studenti spostati in classe ${destClass.name}.`);
        
        // Ricarichiamo il registro corrente
        window.viewClassStudents(currentCode, currentName, currentId);
        
    } catch (e) {
        console.error("Errore spostamento:", e);
        alert("Errore durante lo spostamento: " + e.message);
    }
};


window.deleteSelectedStudents = async function(currentCode, currentName, currentId) {
    const selectedCbs = document.querySelectorAll('.student-checkbox:checked');
    
    if (selectedCbs.length === 0) {
        alert("Seleziona almeno uno studente da rimuovere.");
        return;
    }

    if (!confirm(`Vuoi rimuovere ${selectedCbs.length} studenti dalla classe ${currentName}? \n\nI loro dati non verranno cancellati, ma non faranno più parte di questa classe.`)) return;

    try {
        const db = window.fbDb;
        const batch = db.batch();
        
        selectedCbs.forEach(cb => {
            const uid = cb.dataset.uid;
            const userRef = db.collection('users').doc(uid);
            batch.update(userRef, {
                classId: window.firebase.firestore.FieldValue.delete(),
                className: window.firebase.firestore.FieldValue.delete(),
                teacherId: window.firebase.firestore.FieldValue.delete()
            });
        });

        await batch.commit();
        alert(`✅ Successo! ${selectedCbs.length} studenti rimossi dalla classe.`);
        
        // Ricarichiamo il registro corrente
        window.viewClassStudents(currentCode, currentName, currentId);
        
    } catch (e) {
        console.error("Errore rimozione studenti:", e);
        alert("Errore durante la rimozione: " + e.message);
    }
};


window.saveProfileData = async function() {
    if (!window.Auth || !window.Auth.isLoggedIn()) return;
    const user = window.Auth.getUser();
    
    const nameInput = document.getElementById('edit-profile-name').value.trim();
    const schoolInput = document.getElementById('edit-profile-school').value.trim();
    
    if (!nameInput) {
        alert('Il nome non può essere vuoto.');
        return;
    }
    
    try {
        const docRef = window.fbDb.collection('users').doc(user.uid);
        const doc = await docRef.get();
        const userData = doc.exists ? doc.data() : {};
        
        const isTeacher = (userData.role === 'docente' || userData.role === 'teacher' || userData.role === 'admin' || user.email === 'prof.memmo@gmail.com');
        const updateData = { name: nameInput };
        if (isTeacher) {
            updateData.school = schoolInput;
        }
        
        await docRef.update(updateData);
        alert('Profilo aggiornato con successo!');
        document.getElementById('edit-profile-modal').classList.add('hidden');
        
        // Update local user data
        if (window.Auth && window.Auth.currentUser) {
            window.Auth.currentUser.name = nameInput;
            localStorage.setItem('palestra_user', JSON.stringify(window.Auth.currentUser));
        }
        
        // Refresh profile page
        if (window.currentSection === 'profilo') {
            renderProfiloPage();
        }
        
    } catch (err) {
        console.error(err);
        alert('Errore durante il salvataggio.');
    }
};


window.openEditProfileModal = async function() {
    if (!window.Auth || !window.Auth.isLoggedIn()) return;
    const user = window.Auth.getUser();
    
    const modal = document.getElementById('edit-profile-modal');
    const nameInput = document.getElementById('edit-profile-name');
    const schoolGroup = document.getElementById('edit-profile-school-group');
    const schoolInput = document.getElementById('edit-profile-school');
    
    try {
        const doc = await window.fbDb.collection('users').doc(user.uid).get();
        if (!doc.exists) return;
        
        const userData = doc.data();
        const isTeacher = (userData.role === 'docente' || userData.role === 'teacher' || userData.role === 'admin' || user.email === 'prof.memmo@gmail.com');
        
        if (isTeacher) {
            schoolGroup.classList.remove('hidden');
            schoolInput.value = userData.school || '';
        } else {
            schoolGroup.classList.add('hidden');
        }
        
        nameInput.value = userData.name || user.name || '';
        modal.classList.remove('hidden');
    } catch (err) {
        console.error(err);
    }
};


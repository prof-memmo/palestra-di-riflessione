window.adminDeleteEntity = async function(collection, id, name) {
    if (!confirm(`Sei sicuro di voler eliminare definitivamente ${name}?`)) return;
    try {
        await window.fbDb.collection(collection).doc(id).delete();
        alert("Eliminato con successo.");
        loadAdminUsersInProfile();
    } catch (e) { alert("Errore: " + e.message); }
};


window.archiviaAnnoCorrente = async function() {
    const conferma = confirm("ATTENZIONE! L'archiviazione sposterà tutti gli utenti e i punteggi dell'anno in corso in un archivio storico permanente, resettando la piattaforma per il nuovo anno. Procedere?");
    if (!conferma) return;
    
    try {
        const year = prompt("Inserisci l'anno scolastico da archiviare (es. 2025-2026):", "2025-2026");
        if (!year) return;
        
        const usersSnapshot = await window.fbDb.collection('users').get();
        const progressSnapshot = await window.fbDb.collection('progress').get();
        
        let batch = window.fbDb.batch();
        let operationCount = 0;
        
        const progressMap = {};
        progressSnapshot.forEach(doc => { progressMap[doc.id] = doc.data(); });
        
        // Crea record storico
        const archiveRef = window.fbDb.collection('history').doc(year);
        const historyData = { 
            timestamp: new Date().toISOString(),
            users: [] 
        };
        
        usersSnapshot.forEach(doc => {
            const userData = doc.data();
            const userProgress = progressMap[doc.id] || {};
            // Non eliminare i docenti/admin
            if (userData.role !== 'admin' && userData.role !== 'docente') {
                historyData.users.push({
                    name: userData.name || 'Anonimo',
                    email: userData.email || '',
                    role: userData.role || 'studente',
                    points: userProgress.points || 0,
                    joinedAt: userData.joinedAt || null
                });
                
                // Archivia l'utente invece di eliminarlo, ma salva i dati per il ripristino
                batch.update(doc.ref, { 
                    status: 'archived', 
                    archivedYear: year, 
                    archivedClassId: userData.classId || null, 
                    archivedClassName: userData.className || null, 
                    archivedTeacherId: userData.teacherId || null,
                    archivedProgress: progressMap[doc.id] || null,
                    classId: null, 
                    className: null, 
                    teacherId: null 
                });
                if (progressMap[doc.id]) {
                    // Resetta i progressi ma mantieni il documento
                    batch.update(window.fbDb.collection('progress').doc(doc.id), {
                        points: 0,
                        completedModules: [],
                        completedLessons: []
                    });
                }
                operationCount += 2;
            }
        });
        
        batch.set(archiveRef, historyData);
        operationCount++;
        
        // Se si superano le 500 operazioni, andrebbe diviso in più batch, 
        // per ora consideriamo che funzioni per numeri standard.
        if (operationCount > 0) {
            await batch.commit();
            alert(`Anno ${year} archiviato con successo. Gli account degli studenti sono stati resettati.`);
            renderAdminPage();
        } else {
            alert("Nessun dato da archiviare.");
        }
    } catch (e) {
        console.error("Errore archiviazione:", e);
        alert("Impossibile archiviare: " + e.message);
    }
};


window.ripristinaAnnoArchiviato = async function(backupName) {
    if (!isAdminUser()) return;
    if(!confirm(`Sei ASSOLUTAMENTE sicuro di voler RIPRISTINARE l'anno archiviato "${backupName}"?\nQuesta operazione ripristinerà gli account degli studenti e tutti i loro progressi (punti, moduli).`)) return;
    try {
        const usersSnapshot = await window.fbDb.collection('users').where('archivedYear', '==', backupName).get();
        const historySnapshot = await window.fbDb.collection('history').doc(backupName).get();
        
        let batch = window.fbDb.batch();
        
        usersSnapshot.docs.forEach(doc => {
            const data = doc.data();
            batch.update(doc.ref, { 
                status: 'active', 
                classId: data.archivedClassId || null, 
                className: data.archivedClassName || null, 
                teacherId: data.archivedTeacherId || null,
                archivedYear: firebase.firestore.FieldValue.delete(),
                archivedClassId: firebase.firestore.FieldValue.delete(),
                archivedClassName: firebase.firestore.FieldValue.delete(),
                archivedTeacherId: firebase.firestore.FieldValue.delete(),
                archivedProgress: firebase.firestore.FieldValue.delete()
            });
            
            if (data.archivedProgress) {
                batch.update(window.fbDb.collection('progress').doc(doc.id), {
                    points: data.archivedProgress.points || 0,
                    completedModules: data.archivedProgress.completedModules || [],
                    completedLessons: data.archivedProgress.completedLessons || []
                });
            }
        });

        if(historySnapshot.exists) {
            batch.delete(historySnapshot.ref);
        }

        await batch.commit();
        alert(`Ripristino dell'anno "${backupName}" completato con successo!`);
        renderAdminPage();
    } catch(e) {
        console.error(e);
        alert("Errore durante il ripristino: " + e.message);
    }
};


window.loadHistoricalArchives = async function() {
    if (!isAdminUser()) return;
    try {
        const snapshot = await window.fbDb.collection('history').orderBy('timestamp', 'desc').get();
        const container = document.getElementById('admin-historical-archives-list');
        if(!container) return;
        
        if(snapshot.empty) {
            container.innerHTML = '<p style="color:#666; font-size: 0.9rem;">Nessun anno archiviato trovato.</p>';
            return;
        }
        
        let html = '<div style="display: flex; flex-direction: column; gap: 15px;">';
        snapshot.docs.forEach(doc => {
            const data = doc.data();
            const yearName = doc.id;
            const d = data.timestamp ? new Date(data.timestamp).toLocaleDateString() : 'Data Sconosciuta';
            
            let lbHtml = '<div style="margin-top:10px; display:none; background:#f9fafb; padding:10px; border-radius:6px; border:1px solid #e5e7eb;" id="archive-lb-'+doc.id+'">';
            lbHtml += '<h4 style="margin-bottom:10px; color:#2d3748; border-bottom:1px solid #e2e8f0; padding-bottom:5px;">Storico Studenti</h4>';
            
            if(data.users && data.users.length > 0) {
                // Sort by points
                const sortedUsers = [...data.users].sort((a,b) => b.points - a.points);
                sortedUsers.forEach((u, i) => {
                    let badge = '';
                    if(i===0) badge = '🥇';
                    else if(i===1) badge = '🥈';
                    else if(i===2) badge = '🥉';
                    else badge = (i+1)+'°';
                    
                    lbHtml += `<div style="display:flex; justify-content:space-between; align-items:center; padding:6px 0; border-bottom:1px dashed #e2e8f0; font-size:0.9rem;">
                        <span>${badge} <strong>${u.name}</strong></span>
                        <span style="color:#3182ce; font-weight:bold;">${u.points} pt</span>
                    </div>`;
                });
            } else {
                lbHtml += '<p style="font-size:0.85rem; color:#718096;">Nessuno studente in questo archivio.</p>';
            }
            lbHtml += '</div>';

            html += `
            <div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
                    <div>
                        <h4 style="margin: 0; color: #2d3748; font-size: 1.1rem;">📅 ${yearName}</h4>
                        <div style="font-size: 0.8rem; color: #718096; margin-top: 4px;">Archiviato il: ${d}</div>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <button class="btn" style="background:#e2e8f0; color:#2d3748; padding: 6px 12px; font-size: 0.8rem; border:none; border-radius:4px; cursor:pointer;" onclick="const el = document.getElementById('archive-lb-${doc.id}'); el.style.display = el.style.display === 'none' ? 'block' : 'none';">Mostra Studenti</button>
                        <button class="btn" style="background: #fed7d7; color: #c53030; padding: 6px 12px; font-size: 0.8rem; border:none; border-radius:4px; cursor:pointer;" onclick="window.ripristinaAnnoArchiviato('${yearName}')">Ripristina Anno</button>
                    </div>
                </div>
                ${lbHtml}
            </div>`;
        });
        html += '</div>';
        container.innerHTML = html;
    } catch(e) {
        console.error("Errore caricamento archivio storico:", e);
    }
};


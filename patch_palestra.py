import re

app_path = "/Users/guglielmopiersanti/.gemini/antigravity-ide/scratch/palestra-di-riflessione/js/main.js"

with open(app_path, "r", encoding="utf-8") as f:
    app_js = f.read()

old_archivia = r"""                // Archivia l'utente invece di eliminarlo
                batch.update(doc.ref, { status: 'archived', archivedYear: year, classId: null, className: null, teacherId: null });
                if (progressMap[doc.id]) {
                    // Resetta i progressi ma mantieni il documento
                    batch.update(window.fbDb.collection('progress').doc(doc.id), {
                        points: 0,
                        completedModules: [],
                        completedLessons: []
                    });
                }"""

new_archivia = """                // Archivia l'utente invece di eliminarlo, ma salva i dati per il ripristino
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
                }"""

if old_archivia in app_js:
    app_js = app_js.replace(old_archivia, new_archivia)

new_functions = """window.ripristinaAnnoArchiviato = async function(backupName) {
    if (!isAdminUser()) return;
    if(!confirm(`Sei ASSOLUTAMENTE sicuro di voler RIPRISTINARE l'anno archiviato "${backupName}"?\\nQuesta operazione ripristinerà gli account degli studenti e tutti i loro progressi (punti, moduli).`)) return;
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
"""

if "window.ripristinaAnnoArchiviato =" not in app_js:
    app_js = app_js + "\n" + new_functions

# Need to render historical archives when admin page is loaded
hook = r"document.getElementById('admin-utenti').innerHTML = usersHtml;"
new_hook = r"""document.getElementById('admin-utenti').innerHTML = usersHtml;
                if(window.loadHistoricalArchives) window.loadHistoricalArchives();"""
app_js = app_js.replace(hook, new_hook)

with open(app_path, "w", encoding="utf-8") as f:
    f.write(app_js)

# We need to inject the UI in Palestra main.js inside renderAdminPage!
# Let's check where the Danger Zone is rendered in renderAdminPage.


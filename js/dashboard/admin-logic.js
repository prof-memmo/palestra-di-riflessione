async function renderAdminPage() {
    const appContainer = document.getElementById('app');
    appContainer.innerHTML = `
        <div class="exercise-container">
            <h2 class="exercise-title">🛡️ DASHBOARD AMMINISTRATORE</h2>
            <div style="background: white; padding: 2rem; border-radius: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
                <p style="margin-bottom: 2rem; color: #666;">Benvenuto, <b>prof.memmo</b>. Qui puoi monitorare tutti gli iscritti alla Palestra.</p>
                
                <div id="admin-users-list" style="display: flex; flex-direction: column; gap: 1rem;">
                    <div style="text-align: center; padding: 2rem;">
                        <div class="spinner"></div>
                        <p>Caricamento utenti in corso...</p>
                    </div>
                </div>
                
                <div style="margin-top: 3rem; padding-top: 2rem; border-top: 2px dashed #eee; background: rgba(231, 76, 60, 0.05); padding: 1.5rem; border-radius: 20px;">
                    <h3 style="color: #c53030; margin-bottom: 1rem; font-size: 1.3rem;">⚠️ Danger Zone: Archiviazione Annuale</h3>
                    <p style="color: #666; margin-bottom: 1.5rem; font-size: 0.9rem;">Questa opzione archivia tutti gli studenti dell'anno in corso, salvandone una "fotografia". Se necessario, l'operazione potrà essere annullata dall'Archivio Storico.</p>
                    <button class="btn" style="background: transparent; color: #c53030; border: 2px solid #c53030; padding: 1rem 2rem; border-radius: 15px; font-weight: 800; display: flex; align-items: center; gap: 0.5rem; cursor: pointer;" onclick="window.archiviaAnnoCorrente()">
                        📦 Esegui Archiviazione Anno
                    </button>
                </div>
                
                <div id="admin-historical-archives-area" style="margin-top: 2rem; padding: 1.5rem; background: #f8f9fa; border: 1px solid #eee; border-radius: 20px;">
                    <h3 style="color: #f39c12; margin-top:0; font-size: 1.3rem;">🕒 Archivio Storico</h3>
                    <p style="font-size: 0.85rem; margin-bottom: 15px; color: #666;">Consulta lo storico degli studenti degli anni passati o ripristina un anno archiviato.</p>
                    <div id="admin-historical-archives-list">
                        <p style="font-size: 0.85rem; color: #999;">Caricamento archivio in corso...</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    window.currentSection = 'admin';
    if(window.loadHistoricalArchives) window.loadHistoricalArchives();

    // Recupera utenti da Firestore
    if (window.fbDb) {
        try {
            const usersSnapshot = await window.fbDb.collection('users').get();
            const progressSnapshot = await window.fbDb.collection('progress').get();
            
            const progressMap = {};
            progressSnapshot.forEach(doc => { progressMap[doc.id] = doc.data(); });

            let html = '';
            if (usersSnapshot.empty) {
                html = '<p style="text-align: center; color: #999;">Nessun utente registrato ancora.</p>';
            } else {
                usersSnapshot.forEach(doc => {
                    const userData = doc.data();
                    const userProgress = progressMap[doc.id] || {};
                    const isImage = userData.avatar && (userData.avatar.includes('/') || userData.avatar.includes('.'));
                    const avatarHtml = isImage ? `<img src="${userData.avatar}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;">` : `<span style="font-size: 1.5rem;">${userData.avatar || '👤'}</span>`;

                    html += `
                        <div class="admin-user-row" style="display: flex; flex-wrap: wrap; align-items: center; gap: 1rem; padding: 1.2rem; background: #f8f9fa; border-radius: 20px; border: 1px solid #eee; transition: all 0.2s;">
                            <div style="width: 50px; height: 50px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #eee; overflow: hidden; flex-shrink: 0;">
                                ${avatarHtml}
                            </div>
                            <div style="flex: 1; min-width: 200px;">
                                <h4 style="margin: 0; font-weight: 800; font-size: 1.1rem;">${userData.name || 'Anonimo'}</h4>
                                <p style="margin: 0; font-size: 0.85rem; color: #666;">
                                    ${userData.email || 'No email'} • 
                                    <span style="color: #27ae60; font-weight: 700;">${userData.roleLabel || userData.role || 'Studente'}</span>
                                </p>
                                <p style="margin: 0; font-size: 0.75rem; color: #999;">Iscritto il: ${userData.joinedAt ? new Date(userData.joinedAt).toLocaleDateString() : 'N/D'}</p>
                            </div>
                            <div style="text-align: right; margin-right: 1rem; flex-shrink: 0;">
                                <div style="font-weight: 800; color: var(--primary-color); font-size: 1.1rem;">${userProgress.points || 0} XP</div>
                                <div style="font-size: 0.8rem; color: #999;">${userProgress.vocab ? userProgress.vocab.length : 0} parole</div>
                            </div>
                            <button onclick="adminDeleteUser('${doc.id}', '${(userData.name || 'Anonimo').replace(/'/g, "\\'")}')" style="background: #fff0f0; border: none; padding: 0.8rem; border-radius: 15px; cursor: pointer; color: #e74c3c; font-size: 1.2rem; transition: all 0.2s; margin-left: auto;" title="Elimina Utente">
                                🗑️
                            </button>
                        </div>
                    `;
                });
            }
            document.getElementById('admin-users-list').innerHTML = html;
        } catch (e) {
            console.error("Errore recupero utenti admin:", e);
            document.getElementById('admin-users-list').innerHTML = `<p style="color: #e74c3c;">Errore nel caricamento dei dati: ${e.message}</p>`;
        }
    }
}


async function loadAdminUsersInProfile() {
    if (!window.fbDb) return;
    const container = document.getElementById('admin-users-list');
    if (!container) return;

    try {
        const [usersSnapshot, progressSnapshot, classesSnapshot] = await Promise.all([
            window.fbDb.collection('users').get(),
            window.fbDb.collection('progress').get(),
            window.fbDb.collection('classes').get()
        ]);
        
        const progressMap = {};
        progressSnapshot.forEach(doc => { progressMap[doc.id] = doc.data(); });

        const schoolsMap = {}; 
        const citiesMap = {};  
        const allClasses = [];
        
        // 1. Mappiamo le classi e iniziamo a riempire scuole/città dalle classi
        classesSnapshot.forEach(doc => { 
            const d = doc.data();
            allClasses.push({ id: doc.id, ...d });
            if (d.school) {
                if (!schoolsMap[d.school]) schoolsMap[d.school] = { classCount: 0, studentCount: 0 };
                schoolsMap[d.school].classCount++;
            }
            if (d.city) {
                if (!citiesMap[d.city]) citiesMap[d.city] = { userCount: 0 };
                citiesMap[d.city].userCount++;
            }
        });
        window.allClassesForAdmin = allClasses;

        // 2. Processiamo gli utenti e integriamo i conteggi (con ereditarietà)
        const allUsers = [];
        usersSnapshot.forEach(doc => {
            const u = doc.data();
            if (u.status === 'archived') return; // Skip archived users
            const userData = { id: doc.id, ...u, _progress: progressMap[doc.id] || {} };
            allUsers.push(userData);

            let uSchool = u.school;
            let uCity = u.city;

            // Inheritance: se manca nel profilo, prendi dalla classe
            if (!uSchool && u.classId) {
                const c = allClasses.find(cls => cls.id === u.classId);
                if (c) { uSchool = c.school; uCity = uCity || c.city; }
            }

            if (uSchool) {
                if (!schoolsMap[uSchool]) schoolsMap[uSchool] = { classCount: 0, studentCount: 0 };
                schoolsMap[uSchool].studentCount++;
            }
            if (uCity) {
                if (!citiesMap[uCity]) citiesMap[uCity] = { userCount: 0 };
                citiesMap[uCity].userCount++;
            }
        });

        const counts = { 
            tutti: allUsers.length, 
            docente: allUsers.filter(u => u.role === 'docente' || u.role === 'admin').length, 
            studente: allUsers.filter(u => u.role === 'studente' && u.roleLabel !== 'Amico della Palestra').length, 
            amico: allUsers.filter(u => u.role === 'amico' || u.role === 'guest' || u.roleLabel === 'Amico della Palestra').length
        };

        window.adminData = {
            users: allUsers,
            classes: allClasses,
            schools: Object.keys(schoolsMap).map(name => ({ name, ...schoolsMap[name] })),
            cities: Object.keys(citiesMap).map(name => ({ name, ...citiesMap[name] }))
        };

        container.innerHTML = `
            <!-- Clickable Stats Bar -->
            <div id="admin-stats-filters" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(110px, 1fr)); gap: 1rem; margin-bottom: 2.5rem;">
                <div class="admin-stat-card active" onclick="window.setActiveAdminFilter('tutti')" data-filter="tutti" style="background: white; padding: 1.2rem; border-radius: 20px; text-align: center; border: 2px solid var(--primary-color); cursor: pointer; transition: all 0.2s; box-shadow: 0 10px 20px rgba(0,0,0,0.02);">
                    <div style="font-size: 1.6rem; font-weight: 900; color: var(--primary-color);">${counts.tutti}</div>
                    <div style="font-size: 0.75rem; color: #888; font-weight: 800; text-transform: uppercase;">Tutti</div>
                </div>
                <div class="admin-stat-card" onclick="window.setActiveAdminFilter('docente')" data-filter="docente" style="background: white; padding: 1.2rem; border-radius: 20px; text-align: center; border: 2px solid transparent; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 10px rgba(0,0,0,0.02);">
                    <div style="font-size: 1.6rem; font-weight: 900; color: #2980b9;">${counts.docente}</div>
                    <div style="font-size: 0.75rem; color: #888; font-weight: 800; text-transform: uppercase;">Docenti</div>
                </div>
                <div class="admin-stat-card" onclick="window.setActiveAdminFilter('studente')" data-filter="studente" style="background: white; padding: 1.2rem; border-radius: 20px; text-align: center; border: 2px solid transparent; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 10px rgba(0,0,0,0.02);">
                    <div style="font-size: 1.6rem; font-weight: 900; color: #27ae60;">${counts.studente}</div>
                    <div style="font-size: 0.75rem; color: #888; font-weight: 800; text-transform: uppercase;">Studenti</div>
                </div>
                <div class="admin-stat-card" onclick="window.setActiveAdminFilter('amico')" data-filter="amico" style="background: white; padding: 1.2rem; border-radius: 20px; text-align: center; border: 2px solid transparent; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 10px rgba(0,0,0,0.02);">
                    <div style="font-size: 1.6rem; font-weight: 900; color: #8e44ad;">${counts.amico}</div>
                    <div style="font-size: 0.75rem; color: #888; font-weight: 800; text-transform: uppercase;">Amici della palestra</div>
                </div>
            </div>

            <!-- Search Bar -->
            <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 25px; margin-bottom: 2rem;">
                <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                    <input type="text" id="admin-search-input" oninput="window.filterAdminEntities()" placeholder="Cerca in questo elenco..." style="flex: 1; min-width: 250px; padding: 1.1rem 1.5rem; border-radius: 50px; border: 2px solid #eee; outline: none; font-size: 1rem; transition: all 0.3s;">
                </div>

                <!-- Admin Management Bar -->
                <div id="admin-management-bar" style="margin-top: 1rem; background: #fff9f0; padding: 1rem; border-radius: 20px; border: 1px solid #ffeaa7; display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; display: none;">
                    <span style="font-weight: 800; font-size: 0.8rem; color: #d35400;">GESTIONE SELEZIONATI:</span>
                    <select id="admin-move-destination" style="padding: 0.6rem; border-radius: 12px; border: 1px solid #ddd; font-size: 0.9rem; outline: none;">
                        <option value="">Sposta in classe...</option>
                        ${allClasses.sort((a,b) => a.name.localeCompare(b.name)).map(c => `<option value="${c.id}">${c.name} (${c.code})</option>`).join('')}
                    </select>
                    <button onclick="window.adminActionOnSelected('move')" style="background: #e67e22; color: white; border: none; padding: 0.6rem 1.5rem; border-radius: 12px; font-weight: 800; cursor: pointer; transition: all 0.2s;">SPOSTA</button>
                    <button onclick="window.adminActionOnSelected('delete')" style="background: #e74c3c; color: white; border: none; padding: 0.6rem 1.5rem; border-radius: 12px; font-weight: 800; cursor: pointer; transition: all 0.2s;">ELIMINA DALLA CLASSE</button>
                </div>
            </div>

            <div id="admin-entities-list" style="display: flex; flex-direction: column; gap: 1rem;">
                <!-- Content injected by filterAdminEntities -->
            </div>
        `;
        
        window.currentAdminFilter = 'tutti';
        window.filterAdminEntities();

    } catch (e) {
        console.error("Errore recupero utenti admin in profilo:", e);
        container.innerHTML = `<p style="color: #e74c3c;">Errore nel caricamento dei dati: ${e.message}</p>`;
    }
}


function renderAdminUserRow(userData) {
    const allClasses = window.adminData.classes || [];
    const userProgress = userData._progress || {};
    const isImage = userData.avatar && (userData.avatar.includes('/') || userData.avatar.includes('.'));
    const avatarHtml = isImage ? `<img src="${userData.avatar}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;">` : `<span style="font-size: 1.5rem;">${userData.avatar || '👤'}</span>`;
    const role = (userData.role || 'studente').toLowerCase();
    const isAmico = role === 'amico' || role === 'guest' || userData.roleLabel === 'Amico della Palestra';
    const roleColors = { docente: '#2980b9', amico: '#8e44ad', guest: '#8e44ad', studente: '#27ae60', admin: '#e74c3c' };
    const roleColor = isAmico ? '#8e44ad' : (roleColors[role] || '#27ae60');

    let classLabel = '';
    if (userData.classId) {
        const c = allClasses.find(cl => cl.id === userData.classId);
        classLabel = c ? `${c.name} (${c.code})` : userData.className || 'Classe N/D';
    }

    return `<div class="admin-user-row" style="display: flex; flex-wrap: wrap; align-items: center; gap: 1rem; padding: 1.2rem; background: white; border-radius: 20px; border: 1px solid #eee;">
        <div style="width: 40px; text-align: center;">
            ${(role !== 'admin') ? `<input type="checkbox" class="admin-student-checkbox" data-uid="${userData.id}" data-name="${userData.name}">` : ''}
        </div>
        <div style="width: 50px; height: 50px; background: #f8f9fa; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #eee; overflow: hidden; flex-shrink: 0;">
            ${avatarHtml}
        </div>
        <div style="flex: 1; min-width: 200px;">
            <h4 style="margin: 0; font-weight: 800;">${userData.name || 'Anonimo'}</h4>
            <p style="margin: 0; font-size: 0.85rem; color: #666;">${userData.email || 'No email'} • <span style="color: ${roleColor}; font-weight: 700;">${userData.roleLabel || userData.role || 'Studente'}</span></p>
            <p style="margin: 0; font-size: 0.75rem; color: #999;">${userData.school ? `🏫 ${userData.school} • ` : ''} ${classLabel ? `📁 ${classLabel} • ` : ''} Iscritto il: ${userData.joinedAt ? new Date(userData.joinedAt).toLocaleDateString() : 'N/D'}</p>
        </div>
        <div style="display: flex; align-items: center; gap: 15px; margin-right: 1rem;">
            <div style="font-weight: 800; color: var(--primary-color);">${userProgress.points || 0} XP</div>
            <a href="mailto:${userData.email}" title="Scrivi a ${userData.name || 'Anonimo'}" style="color:var(--primary-color); font-size:1.1rem; text-decoration:none;"><i class="fa-solid fa-envelope"></i></a>
        </div>
        <button onclick="adminDeleteUserInProfile('${userData.id}', '${(userData.name || 'Anonimo').replace(/'/g, "\\'")}')" style="background: #fff0f0; border: none; padding: 0.8rem; border-radius: 15px; cursor: pointer; color: #e74c3c;">🗑️</button>
    </div>`;
}


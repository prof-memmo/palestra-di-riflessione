async function renderAdminPage() {
    const appContainer = document.getElementById('app');
    appContainer.innerHTML = `
        <div class="exercise-container">
            <h2 class="exercise-title">🛡️ DASHBOARD AMMINISTRATORE</h2>
            <div style="background: white; padding: 2rem; border-radius: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px; margin-bottom: 2rem; border-bottom: 2px dashed #eee; padding-bottom: 1.5rem;">
                    <div>
                        <p style="margin: 0; font-weight: 800; font-size: 1.2rem; color: #2c3e50;">Pannello di Controllo &amp; Gestione Utenti</p>
                        <p style="margin: 5px 0 0 0; color: #666; font-size: 0.9rem;">Gestisci tutti gli iscritti, le classi, i ruoli e gli archivi storici della Palestra.</p>
                    </div>
                    <a href="https://prof-memmo.github.io/prof-memmo-gestione-siti/" target="_blank" class="btn" style="background: linear-gradient(135deg, #6366f1, #4f46e5); color: white; padding: 0.8rem 1.5rem; border-radius: 15px; font-weight: 800; text-decoration: none; display: inline-flex; align-items: center; gap: 8px;">
                        ⚙️ Vai all'Hub Centrale
                    </a>
                </div>

                <!-- Elenco Utenti, Statistiche e Gestione Selezionati -->
                <div id="admin-users-list">
                    <p style="color: #666; font-size: 0.9rem; text-align: center; padding: 2rem;">Caricamento utenti e statistiche in corso...</p>
                </div>
                
                <div style="margin-top: 2.5rem; padding-top: 2rem; border-top: 2px dashed #eee; background: rgba(231, 76, 60, 0.05); padding: 1.5rem; border-radius: 20px;">
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
    await loadAdminUsersInProfile();
    if(window.loadHistoricalArchives) window.loadHistoricalArchives();
}


async function loadAdminUsersInProfile() {
    if (!window.fbDb) return;
    const container = document.getElementById('admin-users-list');
    if (!container) return;

    try {
        const rawUsersPromise = window.fbDb.rawCollection ? window.fbDb.rawCollection('users').get().catch(() => ({ forEach: () => {} })) : Promise.resolve({ forEach: () => {} });
        const rawClassesPromise = window.fbDb.rawCollection ? window.fbDb.rawCollection('classes').get().catch(() => ({ forEach: () => {} })) : Promise.resolve({ forEach: () => {} });
        const legacyUsersPromise = window.legacyDb ? window.legacyDb.collection('users').get().catch(() => ({ forEach: () => {} })) : Promise.resolve({ forEach: () => {} });
        const legacyClassesPromise = window.legacyDb ? window.legacyDb.collection('classes').get().catch(() => ({ forEach: () => {} })) : Promise.resolve({ forEach: () => {} });
        const legacyProgressPromise = window.legacyDb ? window.legacyDb.collection('progress').get().catch(() => ({ forEach: () => {} })) : Promise.resolve({ forEach: () => {} });

        const [usersSnapshot, pUsersSnapshot, rawUsersSnapshot, legacyUsersSnapshot, progressSnapshot, legacyProgressSnapshot, classesSnapshot, pClassesSnapshot, rawClassesSnapshot, legacyClassesSnapshot] = await Promise.all([
            window.fbDb.collection('users').get().catch(() => ({ forEach: () => {} })),
            window.fbDb.collection('palestra_users').get().catch(() => ({ forEach: () => {} })),
            rawUsersPromise,
            legacyUsersPromise,
            window.fbDb.collection('progress').get().catch(() => ({ forEach: () => {} })),
            legacyProgressPromise,
            window.fbDb.collection('classes').get().catch(() => ({ forEach: () => {} })),
            window.fbDb.collection('palestra_classes').get().catch(() => ({ forEach: () => {} })),
            rawClassesPromise,
            legacyClassesPromise
        ]);
        
        const progressMap = {};
        legacyProgressSnapshot.forEach(doc => { progressMap[doc.id] = doc.data(); });
        progressSnapshot.forEach(doc => { progressMap[doc.id] = doc.data(); });

        const schoolsMap = {}; 
        const citiesMap = {};  
        const allClasses = [];
        
        // 1. Mappiamo le classi da tutte le collezioni
        const addClassToAdmin = (doc) => {
            if (!doc || !doc.id) return;
            const d = typeof doc.data === 'function' ? doc.data() : (doc.data || {});
            if (!allClasses.find(c => c.id === doc.id || (d.code && c.code === d.code))) {
                allClasses.push({ id: doc.id, ...d });
                if (d.school) {
                    if (!schoolsMap[d.school]) schoolsMap[d.school] = { classCount: 0, studentCount: 0 };
                    schoolsMap[d.school].classCount++;
                }
                if (d.city) {
                    if (!citiesMap[d.city]) citiesMap[d.city] = { userCount: 0 };
                    citiesMap[d.city].userCount++;
                }
            }
        };

        classesSnapshot.forEach(addClassToAdmin);
        pClassesSnapshot.forEach(addClassToAdmin);
        rawClassesSnapshot.forEach(addClassToAdmin);
        legacyClassesSnapshot.forEach(addClassToAdmin);
        window.allClassesForAdmin = allClasses;

        // 2. Processiamo gli utenti da tutte le collezioni
        const allUsers = [];
        const seenUserIds = new Set();

        const processUserDoc = (doc) => {
            if (!doc || !doc.id || seenUserIds.has(doc.id)) return;
            seenUserIds.add(doc.id);
            const u = typeof doc.data === 'function' ? doc.data() : (doc.data || {});
            if (u.status === 'archived') return;
            const userData = { id: doc.id, ...u, _progress: progressMap[doc.id] || {} };
            allUsers.push(userData);

            let uSchool = u.school || (u.anagrafica && u.anagrafica.scuola);
            let uCity = u.city || (u.anagrafica && u.anagrafica.citta);

            if (!uSchool && u.classId) {
                const c = allClasses.find(cls => cls.id === u.classId || cls.code === u.classId);
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
        };

        usersSnapshot.forEach(processUserDoc);
        pUsersSnapshot.forEach(processUserDoc);
        rawUsersSnapshot.forEach(processUserDoc);
        legacyUsersSnapshot.forEach(processUserDoc);

        // 2b. Integrazione da Hub Centrale (hub_users) per studenti/utenti globali
        try {
            const hubUsersSnap = await window.fbDb.collection('hub_users').get();
            hubUsersSnap.forEach(hdoc => {
                const hd = hdoc.data() || {};
                const hEmail = (hd.anagrafica && hd.anagrafica.email) || hd.email || '';
                const alreadyPresent = allUsers.find(u => u.id === hdoc.id || (hEmail && u.email && u.email.toLowerCase() === hEmail.toLowerCase()));
                if (!alreadyPresent) {
                    const uRole = (hd.role === 'admin' || hEmail === 'prof.memmo@gmail.com') ? 'admin' : (hd.role === 'docente' ? 'docente' : (hd.role === 'viandante' ? 'amico' : 'studente'));
                    const uName = (hd.anagrafica && hd.anagrafica.nome) ? `${hd.anagrafica.nome} ${hd.anagrafica.cognome || ''}`.trim() : (hd.displayName || 'Utente Hub');
                    const uSchool = (hd.anagrafica && hd.anagrafica.scuola) || hd.school || '';
                    const uCity = (hd.anagrafica && hd.anagrafica.citta) || hd.city || '';
                    const userData = {
                        id: hdoc.id,
                        name: uName,
                        email: hEmail,
                        role: uRole,
                        school: uSchool,
                        city: uCity,
                        classId: hd.classId || null,
                        className: hd.className || '',
                        joinedAt: hd.createdAt || '',
                        avatar: hd.avatar || '👤',
                        _progress: progressMap[hdoc.id] || {}
                    };
                    allUsers.push(userData);

                    if (uSchool) {
                        if (!schoolsMap[uSchool]) schoolsMap[uSchool] = { classCount: 0, studentCount: 0 };
                        schoolsMap[uSchool].studentCount++;
                    }
                    if (uCity) {
                        if (!citiesMap[uCity]) citiesMap[uCity] = { userCount: 0 };
                        citiesMap[uCity].userCount++;
                    }
                }
            });
        } catch (hubErr) {
            console.warn("Recupero hub_users per dashboard admin:", hubErr);
        }

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


async function renderAdminPage() {
    const appContainer = document.getElementById('app');
    const defaultTab = window.activeAdminTab || 'live-editor';

    appContainer.innerHTML = `
        <div class="exercise-container" style="max-width: 1050px; margin: 0 auto; padding: 20px;">
            <div style="display: flex; gap: 10px; margin-bottom: 25px; justify-content: center; flex-wrap: wrap;">
                <button onclick="navigateTo('profilo')" class="btn" style="background: #f1f5f9; color: #334155; border: 1.5px solid #cbd5e1; border-radius: 50px; padding: 10px 22px; font-weight: 800; font-size: 0.9rem; cursor: pointer; display: inline-flex; align-items: center; gap: 8px;">
                    <i class="fa-solid fa-chalkboard-user"></i> 👨‍🏫 Pannello Docente
                </button>
                <button onclick="navigateTo('admin')" class="btn" style="background: var(--primary-color); color: white; border-radius: 50px; padding: 10px 22px; font-weight: 800; font-size: 0.9rem; border: none; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 4px 10px rgba(93, 95, 239, 0.2);">
                    <i class="fa-solid fa-shield-halved"></i> 🛡️ Dashboard Admin &amp; Impostazioni
                </button>
            </div>
            <h2 class="exercise-title" style="margin-bottom: 25px;">🛡️ DASHBOARD AMMINISTRATORE</h2>
            <div style="background: white; padding: 2rem; border-radius: 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
                <div style="margin-bottom: 1.5rem; border-bottom: 2px dashed #eee; padding-bottom: 1.2rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px;">
                    <div>
                        <p style="margin: 0; font-weight: 800; font-size: 1.2rem; color: #2c3e50;">Pannello di Controllo &amp; Impostazioni</p>
                        <p style="margin: 5px 0 0 0; color: #666; font-size: 0.9rem;">Gestisci le impostazioni, gli override didattici, il regolamento, le classi e gli archivi della Palestra.</p>
                    </div>
                    <div style="background: #f8fafc; padding: 6px 14px; border-radius: 12px; border: 1px solid #e2e8f0; font-size: 0.82rem; color: #475569; font-weight: 600; display: inline-flex; align-items: center; gap: 6px;">
                        <i class="fa-solid fa-user-shield" style="color: var(--primary-color);"></i> prof.memmo@gmail.com
                    </div>
                </div>

                <!-- Navigation Tabs Bar -->
                <div class="admin-tabs-nav" style="display: flex; gap: 8px; margin-bottom: 24px; border-bottom: 2px solid #f1f5f9; padding-bottom: 12px; overflow-x: auto;">
                    <button type="button" class="admin-tab-btn" data-tab="live-editor" onclick="window.switchAdminTab('live-editor')" style="padding: 10px 18px; border-radius: 12px; font-size: 0.88rem; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; border: 1.5px solid transparent; transition: all 0.2s;">
                        <i class="fa-solid fa-pen-to-square"></i> Live Editor
                    </button>
                    <button type="button" class="admin-tab-btn" data-tab="rules-editor" onclick="window.switchAdminTab('rules-editor')" style="padding: 10px 18px; border-radius: 12px; font-size: 0.88rem; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; border: 1.5px solid transparent; transition: all 0.2s;">
                        <i class="fa-solid fa-scale-balanced"></i> Regolamento
                    </button>
                    <button type="button" class="admin-tab-btn" data-tab="miniguida-editor" onclick="window.switchAdminTab('miniguida-editor')" style="padding: 10px 18px; border-radius: 12px; font-size: 0.88rem; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; border: 1.5px solid transparent; transition: all 0.2s;">
                        <i class="fa-solid fa-circle-question"></i> Miniguida
                    </button>
                    <button type="button" class="admin-tab-btn" data-tab="system-maintenance" onclick="window.switchAdminTab('system-maintenance')" style="padding: 10px 18px; border-radius: 12px; font-size: 0.88rem; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; border: 1.5px solid transparent; transition: all 0.2s;">
                        <i class="fa-solid fa-gear"></i> Impostazioni
                    </button>
                </div>

                <!-- 1. Tab Live Editor Didattico -->
                <div id="tab-live-editor" class="admin-tab-content">
                    <div id="admin-live-editor-container"></div>
                </div>

                <!-- 2. Tab Regolamento Ufficiale Cloud -->
                <div id="tab-rules-editor" class="admin-tab-content" style="display: none;">
                    <div id="admin-rules-editor-container"></div>
                </div>

                <!-- Tab Miniguida / Tutorial -->
                <div id="tab-miniguida-editor" class="admin-tab-content" style="display: none;">
                    <div id="admin-miniguida-editor-container"></div>
                </div>

                <!-- Tab Impostazioni & Manutenzione -->
                <div id="tab-system-maintenance" class="admin-tab-content" style="display: none;">
                    <!-- Reset Punteggi Stagionali -->
                    <div style="margin-bottom: 25px; padding: 18px; border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 16px; background: rgba(239, 68, 68, 0.04);">
                        <h3 style="color: #dc2626; margin-top:0; font-size: 1.05rem; display: flex; align-items: center; gap: 8px;"><i class="fa-solid fa-rotate-left"></i> Reset Validazioni Stagione</h3>
                        <p style="font-size: 0.85rem; color: #64748b; margin-bottom: 15px;">Azzera contemporaneamente tutti i progressi e le lezioni completate per la nuova stagione mantenendo inalterati studenti, docenti e classi.</p>
                        <button type="button" class="btn" style="background: #dc2626; color: white; border: none; padding: 8px 18px; border-radius: 8px; font-size: 0.85rem; font-weight: 700; cursor: pointer;" onclick="window.azzeraValidazioniStagione()"><i class="fa-solid fa-rotate-left"></i> Azzera Tutti i Progressi Esercizi</button>
                    </div>

                    <!-- Archiviazione Annuale -->
                    <div style="margin-bottom: 25px; padding: 18px; border: 1px solid #dc2626; border-radius: 16px; background: rgba(239, 68, 68, 0.08);">
                        <h3 style="color: #dc2626; margin-top:0; font-size: 1.05rem; display: flex; align-items: center; gap: 8px;"><i class="fa-solid fa-box-archive"></i> Archiviazione Annuale Palestra di Riflessione</h3>
                        <p style="font-size: 0.85rem; margin-bottom: 15px; color: #475569;">Salva una "fotografia" della classifica finale e archivia gli studenti dell'anno scolastico in corso. Potrà essere ripristinata dall'Archivio Storico in caso di necessità.</p>
                        <button type="button" class="btn" style="background: transparent; color: #dc2626; border: 1.5px solid #dc2626; padding: 8px 18px; border-radius: 8px; font-weight: 700; font-size: 0.85rem; cursor: pointer;" onclick="window.archiviaAnnoCorrente()"><i class="fa-solid fa-box-archive"></i> Esegui Archiviazione Anno</button>
                    </div>

                    <!-- Archivio Storico -->
                    <div id="admin-historical-archives-area" style="padding: 20px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px;">
                        <h3 style="color: #d97706; margin-top:0; font-size: 1.15rem; display: flex; align-items: center; gap: 8px;"><i class="fa-solid fa-clock-rotate-left"></i> Archivio Storico</h3>
                        <p style="font-size: 0.85rem; margin-bottom: 15px; color: #64748b;">Consulta lo storico degli studenti degli anni passati o ripristina un anno archiviato.</p>
                        <div id="admin-historical-archives-list">
                            <p style="font-size: 0.85rem; color: #94a3b8;">Caricamento archivio in corso...</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    window.currentSection = 'admin';
    window.switchAdminTab(defaultTab);

    if (window.LiveEditor && typeof window.LiveEditor.renderAdminPanel === 'function') {
        window.LiveEditor.renderAdminPanel('admin-live-editor-container');
    }
    if (window.PalestraRulesService && typeof window.PalestraRulesService.renderAdminEditor === 'function') {
        window.PalestraRulesService.renderAdminEditor('admin-rules-editor-container');
    }
    if (window.PalestraMiniguidaService && typeof window.PalestraMiniguidaService.renderAdminEditor === 'function') {
        window.PalestraMiniguidaService.renderAdminEditor('admin-miniguida-editor-container');
    }
    if(window.loadHistoricalArchives) window.loadHistoricalArchives();
}

window.switchAdminTab = function(tabName) {
    window.activeAdminTab = tabName;
    document.querySelectorAll('.admin-tab-btn').forEach(btn => {
        if (btn.dataset.tab === tabName) {
            btn.classList.add('active');
            btn.style.background = 'var(--primary-color, #5c67f2)';
            btn.style.color = '#ffffff';
            btn.style.fontWeight = '800';
            btn.style.borderColor = 'transparent';
            btn.style.boxShadow = '0 4px 12px rgba(92, 103, 242, 0.25)';
        } else {
            btn.classList.remove('active');
            btn.style.background = '#f8fafc';
            btn.style.color = '#475569';
            btn.style.fontWeight = '600';
            btn.style.borderColor = '#e2e8f0';
            btn.style.boxShadow = 'none';
        }
    });

    document.querySelectorAll('.admin-tab-content').forEach(content => {
        if (content.id === `tab-${tabName}`) {
            content.style.display = 'block';
        } else {
            content.style.display = 'none';
        }
    });
};


window.azzeraValidazioniStagione = async function() {
    if (!confirm("Sei sicuro di voler AZZERARE TUTTI I PROGRESSI DEGLI ESERCIZI per la nuova stagione?\nStudenti, docenti e classi rimarranno inalterati.")) return;
    try {
        if (!window.fbDb) throw new Error("Database non connesso");
        const snap = await window.fbDb.collection('progress').get();
        let batch = window.fbDb.batch();
        snap.docs.forEach(doc => {
            batch.delete(doc.ref);
        });
        await batch.commit();
        alert("✅ Tutti i progressi e le validazioni sono stati azzerati con successo!");
        window.location.reload();
    } catch (e) {
        console.error("Errore azzeramento progressi:", e);
        alert("Errore: " + e.message);
    }
};

async function loadAdminUsersInProfile() {
    // La gestione utenti e classi è stata centralizzata nell'Hub di Gestione Generale
    return;
}
window.loadAdminUsersInProfile = loadAdminUsersInProfile;



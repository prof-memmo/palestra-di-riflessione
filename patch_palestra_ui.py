import re
app_path = "/Users/guglielmopiersanti/.gemini/antigravity-ide/scratch/palestra-di-riflessione/js/main.js"

with open(app_path, "r", encoding="utf-8") as f:
    app_js = f.read()

admin_ui_old = r"""                <!-- Archiviazione -->
                <div style="margin-top: 3rem; padding: 2rem; background: #fff5f5; border: 2px solid #fc8181; border-radius: 15px;">
                    <h3 style="color: #c53030; margin-bottom: 1rem;">⚠️ Archiviazione Anno Scolastico</h3>
                    <p style="margin-bottom: 1.5rem; color: #4a5568;">Questa operazione sposterà tutti gli utenti attuali (esclusi docenti) in un archivio storico, azzerando i punteggi per iniziare un nuovo anno.</p>
                    <button class="btn" style="background: #c53030; color: white; border: none; padding: 1rem 2rem; border-radius: 15px; font-weight: 800; display: flex; align-items: center; gap: 0.5rem; cursor: pointer;" onclick="window.archiviaAnnoCorrente()">
                        📦 Procedi con l'Archiviazione
                    </button>
                </div>"""

admin_ui_new = r"""                <!-- Archiviazione e Storico -->
                <div style="margin-top: 3rem; padding: 2rem; background: #fff5f5; border: 2px solid #fc8181; border-radius: 15px;">
                    <h3 style="color: #c53030; margin-bottom: 1rem;">⚠️ Archiviazione Anno Scolastico</h3>
                    <p style="margin-bottom: 1.5rem; color: #4a5568;">Questa operazione sposterà tutti gli utenti attuali (esclusi docenti) in un archivio storico, azzerando i punteggi per iniziare un nuovo anno. Potrai ripristinarli dalla sezione Archivio Storico sottostante in caso di errore.</p>
                    <button class="btn" style="background: #c53030; color: white; border: none; padding: 1rem 2rem; border-radius: 15px; font-weight: 800; display: flex; align-items: center; gap: 0.5rem; cursor: pointer;" onclick="window.archiviaAnnoCorrente()">
                        📦 Procedi con l'Archiviazione
                    </button>
                </div>

                <div style="margin-top: 2rem; padding: 2rem; background: #f7fafc; border: 2px solid #e2e8f0; border-radius: 15px;">
                    <h3 style="color: #2d3748; margin-bottom: 1rem;">🕰 Archivio Storico</h3>
                    <p style="margin-bottom: 1.5rem; color: #718096;">Consulta le classifiche degli anni passati o ripristina un anno archiviato per errore.</p>
                    <div id="admin-historical-archives-list">
                        <p style="font-size: 0.85rem; color: #718096;">Caricamento archivio in corso...</p>
                    </div>
                </div>"""

if admin_ui_old in app_js:
    app_js = app_js.replace(admin_ui_old, admin_ui_new)

with open(app_path, "w", encoding="utf-8") as f:
    f.write(app_js)

print("UI Patch applied to Palestra di Riflessione.")

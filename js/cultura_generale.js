window.CulturaGenerale = (() => {
    // Rende un ID univoco
    const generateId = () => Math.random().toString(36).substr(2, 9);

    // Default motivation text
    const defaultMotivation = "Leggi con attenzione ogni domanda e prenditi il tempo necessario per riflettere.\nNon avere fretta: ragionare bene è più importante della velocità.\nOgni domanda ha 4 possibili risposte, ma solo una è corretta.\nConcentrati, usa ciò che sai e affronta il test con calma e attenzione.";

    // Render Student View (Test assegnati)
    async function renderStudentDashboard(container) {
        const user = Auth.getUser();
        let classId = user.classId || localStorage.getItem('lastClassId');
        
        container.innerHTML = `<div class="cg-container">
            <h2 class="cg-title">I Miei Test di Cultura Generale</h2>
            <p>Qui trovi i test assegnati dal tuo docente.</p>
            <div id="cg-student-tests" class="cg-test-grid">
                <div class="cg-loading">Caricamento test in corso...</div>
            </div>
        </div>`;

        try {
            // Find assignments for this class
            const assignmentsRef = window.fbDb.collection('test_assignments');
            const q = classId ? assignmentsRef.where('classId', '==', classId) : assignmentsRef;
            const snapshot = await q.get();
            
            const grid = document.getElementById('cg-student-tests');
            
            if (snapshot.empty) {
                grid.innerHTML = `<div class="empty-state">Non ci sono test assegnati alla tua classe in questo momento.</div>`;
                return;
            }

            // Get user's results to see which tests are already completed
            const resultsSnap = await window.fbDb.collection('test_results')
                .where('userId', '==', window.fbAuth.currentUser.uid)
                .get();
            const completedAssignments = resultsSnap.docs.map(d => d.data().assignmentId);
            const resultsMap = {};
            resultsSnap.docs.forEach(d => resultsMap[d.data().assignmentId] = d.data());

            let html = '';
            snapshot.forEach(doc => {
                const a = doc.data();
                const isCompleted = completedAssignments.includes(doc.id);
                
                html += `
                    <div class="cg-card ${isCompleted ? 'cg-card-completed' : ''}">
                        <div class="cg-card-header">
                            <span class="cg-level-badge level-${a.testLevel}">${a.testLevel.toUpperCase()}</span>
                            <h3>${a.testTitle}</h3>
                        </div>
                        <div class="cg-card-body">
                            <p><strong>Assegnato da:</strong> ${a.teacherName}</p>
                            <p><strong>Data:</strong> ${a.date}</p>
                            ${isCompleted 
                                ? `<div class="cg-score-badge">Punteggio: ${resultsMap[doc.id].score}/10</div>
                                   <button class="btn btn-secondary cg-btn" disabled>Test Completato ✅</button>`
                                : `<button class="btn btn-primary cg-btn" onclick="CulturaGenerale.startTest('${doc.id}')">Inizia Test 🚀</button>`
                            }
                        </div>
                    </div>
                `;
            });
            grid.innerHTML = html;
        } catch (e) {
            console.error(e);
            document.getElementById('cg-student-tests').innerHTML = `<div class="error-state">Errore nel caricamento dei test. Riprova più tardi.</div>`;
        }
    }

    // Render Teacher View (Assegna e Risultati)
    async function renderTeacherDashboard(container) {
        const user = Auth.getUser();
        container.innerHTML = `<div class="cg-container">
            <h2 class="cg-title">Gestione Test di Cultura Generale</h2>
            
            <div class="cg-tabs">
                <button class="cg-tab active" onclick="CulturaGenerale.switchTeacherTab('assign')">Nuova Assegnazione</button>
                <button class="cg-tab" onclick="CulturaGenerale.switchTeacherTab('results')">Risultati Test Assegnati</button>
            </div>

            <div id="cg-teacher-assign-tab" class="cg-tab-content active">
                <p>Seleziona un test dalla libreria per personalizzarlo e assegnarlo a una classe.</p>
                <div class="cg-library-grid">
                    ${Object.keys(window.CulturaGeneraleData).map(level => `
                        <div class="cg-level-section">
                            <h3 class="level-title level-${level}">${level.toUpperCase()}</h3>
                            ${window.CulturaGeneraleData[level].map(test => `
                                <div class="cg-card">
                                    <h4>${test.title}</h4>
                                    <p>10 domande a risposta multipla.</p>
                                    <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
                                        <button class="btn btn-secondary btn-sm cg-btn" onclick="CulturaGenerale.previewTest('${level}', '${test.id}')" style="flex:1;">Anteprima</button>
                                        <button class="btn btn-primary btn-sm cg-btn" onclick="CulturaGenerale.openCustomizer('${level}', '${test.id}')" style="flex:1;">Assegna</button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    `).join('')}
                </div>
            </div>

            <div id="cg-teacher-results-tab" class="cg-tab-content" style="display:none;">
                <div id="cg-teacher-assignments-list">Caricamento in corso...</div>
            </div>
        </div>`;
    }

    function switchTeacherTab(tabId) {
        document.querySelectorAll('.cg-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.cg-tab-content').forEach(c => c.style.display = 'none');
        
        event.target.classList.add('active');
        document.getElementById(`cg-teacher-${tabId}-tab`).style.display = 'block';

        if (tabId === 'results') {
            loadTeacherAssignments();
        }
    }

    async function loadTeacherAssignments() {
        const listDiv = document.getElementById('cg-teacher-assignments-list');
        listDiv.innerHTML = 'Caricamento...';
        try {
            const uid = window.fbAuth.currentUser.uid;
            const snap = await window.fbDb.collection('test_assignments').where('teacherUid', '==', uid).get();
            if (snap.empty) {
                listDiv.innerHTML = '<div class="empty-state">Non hai ancora assegnato nessun test.</div>';
                return;
            }
            let html = '<table class="cg-table"><thead><tr><th>Data</th><th>Test</th><th>Classe</th><th>Azioni</th></tr></thead><tbody>';
            snap.forEach(doc => {
                const a = doc.data();
                html += `<tr>
                    <td>${a.date}</td>
                    <td>${a.testTitle}</td>
                    <td>Classe ${a.classId}</td>
                    <td>
                        <button class="btn btn-primary btn-sm" onclick="CulturaGenerale.viewResults('${doc.id}')">Vedi Risultati</button>
                    </td>
                </tr>`;
            });
            html += '</tbody></table>';
            listDiv.innerHTML = html;
        } catch (e) {
            console.error(e);
            listDiv.innerHTML = 'Errore nel caricamento dei dati.';
        }
    }

    function previewTest(level, testId) {
        const test = window.CulturaGeneraleData[level].find(t => t.id === testId);
        
        const modal = document.createElement('div');
        modal.className = 'cg-modal-overlay';
        modal.id = 'cg-preview-modal';
        
        let questionsHtml = test.questions.map((q, index) => `
            <div style="margin-bottom: 1.5rem; padding: 1rem; background: #f8f9fa; border-radius: 10px;">
                <p style="font-weight: 600; margin-bottom: 0.5rem;">${index + 1}. ${q.question}</p>
                <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                    ${q.options.map(opt => `
                        <div style="padding: 0.5rem; border-radius: 5px; ${opt === q.correct ? 'background: #d4edda; border: 1px solid #c3e6cb; font-weight: bold;' : 'background: white; border: 1px solid #dee2e6;'}">
                            ${opt} ${opt === q.correct ? '✅' : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');

        modal.innerHTML = `
            <div class="cg-modal" style="max-width: 800px; width: 90%; max-height: 90vh; display: flex; flex-direction: column;">
                <div class="cg-modal-header" style="flex-shrink: 0;">
                    <h3>Anteprima: ${test.title}</h3>
                    <button class="cg-modal-close" onclick="document.getElementById('cg-preview-modal').remove()">&times;</button>
                </div>
                <div class="cg-modal-body" style="overflow-y: auto; padding-right: 1rem;">
                    ${questionsHtml}
                </div>
                <div class="cg-modal-footer" style="flex-shrink: 0;">
                    <button class="btn btn-secondary" onclick="document.getElementById('cg-preview-modal').remove()">Chiudi</button>
                    <button class="btn btn-primary" onclick="document.getElementById('cg-preview-modal').remove(); CulturaGenerale.openCustomizer('${level}', '${testId}')">Assegna Questo Test</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    function openCustomizer(level, testId) {
        const test = window.CulturaGeneraleData[level].find(t => t.id === testId);
        const user = Auth.getUser();
        const today = new Date().toLocaleDateString('it-IT');

        const modal = document.createElement('div');
        modal.className = 'cg-modal-overlay';
        modal.id = 'cg-customizer-modal';
        modal.innerHTML = `
            <div class="cg-modal">
                <div class="cg-modal-header">
                    <h3>Personalizza Assegnazione: ${test.title}</h3>
                    <button class="cg-modal-close" onclick="document.getElementById('cg-customizer-modal').remove()">&times;</button>
                </div>
                <div class="cg-modal-body">
                    <div class="cg-form-group">
                        <label>Nome Scuola (Intestazione)</label>
                        <input type="text" id="cg-form-school" value="Istituto Comprensivo / Scuola Secondaria" />
                    </div>
                    <div class="cg-form-group">
                        <label>Nome Docente</label>
                        <input type="text" id="cg-form-teacher" value="${user.name}" />
                    </div>
                    <div class="cg-form-row">
                        <div class="cg-form-group">
                            <label>ID Classe (es. 1A, 3B, ALFA)</label>
                            <input type="text" id="cg-form-class" placeholder="ID Classe" />
                        </div>
                        <div class="cg-form-group">
                            <label>Data</label>
                            <input type="text" id="cg-form-date" value="${today}" />
                        </div>
                    </div>
                    <div class="cg-form-group">
                        <label>Messaggio Motivazionale (Intro)</label>
                        <textarea id="cg-form-intro" rows="5">${defaultMotivation}</textarea>
                    </div>
                </div>
                <div class="cg-modal-footer">
                    <button class="btn btn-secondary" onclick="document.getElementById('cg-customizer-modal').remove()">Annulla</button>
                    <button class="btn btn-primary" onclick="CulturaGenerale.assignTest('${level}', '${testId}')">Conferma e Assegna</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    async function assignTest(level, testId) {
        const test = window.CulturaGeneraleData[level].find(t => t.id === testId);
        const school = document.getElementById('cg-form-school').value;
        const teacher = document.getElementById('cg-form-teacher').value;
        const classId = document.getElementById('cg-form-class').value;
        const date = document.getElementById('cg-form-date').value;
        const intro = document.getElementById('cg-form-intro').value;

        if (!classId) {
            alert("Inserisci l'ID della classe a cui assegnare il test.");
            return;
        }

        const btn = event.target;
        btn.innerText = "Assegnazione in corso...";
        btn.disabled = true;

        try {
            const assignmentRef = await window.fbDb.collection('test_assignments').add({
                testId: testId,
                testLevel: level,
                testTitle: test.title,
                teacherUid: window.fbAuth.currentUser.uid,
                teacherName: teacher,
                schoolName: school,
                classId: classId,
                date: date,
                introText: intro,
                createdAt: new Date().toISOString()
            });
            document.getElementById('cg-customizer-modal').remove();
            alert("Test assegnato con successo alla classe " + classId);
            switchTeacherTab('results');
        } catch (e) {
            console.error(e);
            alert("Errore durante l'assegnazione: " + e.message);
            btn.innerText = "Conferma e Assegna";
            btn.disabled = false;
        }
    }

    async function startTest(assignmentId) {
        document.getElementById('exercise-mount').innerHTML = '<div style="padding:4rem;text-align:center;">Preparazione test in corso...</div>';
        
        try {
            const doc = await window.fbDb.collection('test_assignments').doc(assignmentId).get();
            if (!doc.exists) {
                alert("Assegnazione non trovata.");
                return;
            }
            const a = doc.data();
            const test = window.CulturaGeneraleData[a.testLevel].find(t => t.id === a.testId);

            // Show motivational intro modal
            const introModal = document.createElement('div');
            introModal.className = 'cg-modal-overlay cg-intro-overlay';
            introModal.innerHTML = `
                <div class="cg-modal cg-intro-modal">
                    <h2>Preparati al Test</h2>
                    <div class="cg-intro-text">${a.introText.replace(/\\n/g, '<br>')}</div>
                    <button class="btn btn-primary cg-btn-large" onclick="this.parentElement.parentElement.remove(); CulturaGenerale.renderTestUI('${assignmentId}', ${JSON.stringify(test).replace(/"/g, '&quot;')}, ${JSON.stringify(a).replace(/"/g, '&quot;')})">HO CAPITO, INIZIA IL TEST</button>
                </div>
            `;
            document.body.appendChild(introModal);

        } catch (e) {
            console.error(e);
            alert("Errore nel caricamento del test.");
        }
    }

    function renderTestUI(assignmentId, test, assignmentData) {
        let html = `
            <div class="cg-test-page" id="cg-test-page">
                <div class="cg-protocollo">
                    <div class="cg-prot-header">
                        <div class="cg-prot-school">${assignmentData.schoolName}</div>
                        <div class="cg-prot-details">
                            <span><strong>Docente:</strong> ${assignmentData.teacherName}</span>
                            <span><strong>Classe:</strong> ${assignmentData.classId}</span>
                            <span><strong>Data:</strong> ${assignmentData.date}</span>
                        </div>
                        <div class="cg-prot-student">
                            <strong>Alunno/a:</strong> ${Auth.getUser().name}
                        </div>
                    </div>
                    <div class="cg-prot-title">
                        <h2>${test.title}</h2>
                    </div>
                    
                    <div class="cg-questions-list">
        `;

        test.questions.forEach((q, index) => {
            html += `
                <div class="cg-question-block" id="qb_${index}">
                    <div class="cg-q-text"><strong>${index + 1}.</strong> ${q.question}</div>
                    <div class="cg-q-options">
                        ${q.options.map((opt, oIndex) => `
                            <label class="cg-q-option">
                                <input type="radio" name="q_${index}" value="${opt.replace(/"/g, '&quot;')}" />
                                <span class="cg-opt-text">${opt}</span>
                            </label>
                        `).join('')}
                    </div>
                </div>
            `;
        });

        html += `
                    </div>
                    
                    <div class="cg-submit-area">
                        <button class="btn btn-primary btn-large cg-btn-submit" onclick="CulturaGenerale.submitTest('${assignmentId}', ${JSON.stringify(test).replace(/"/g, '&quot;')})">Consegna Verifica</button>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('exercise-mount').innerHTML = html;
        window.scrollTo(0, 0);
    }

    async function submitTest(assignmentId, test) {
        // Collect answers
        let score = 0;
        const answers = [];
        let allAnswered = true;

        test.questions.forEach((q, index) => {
            const selected = document.querySelector(`input[name="q_${index}"]:checked`);
            if (!selected) {
                allAnswered = false;
                document.getElementById(`qb_${index}`).classList.add('cg-unanswered');
            } else {
                document.getElementById(`qb_${index}`).classList.remove('cg-unanswered');
                const isCorrect = selected.value === q.correct;
                if (isCorrect) score++;
                answers.push({
                    questionId: q.id,
                    selected: selected.value,
                    isCorrect: isCorrect
                });
            }
        });

        if (!allAnswered) {
            alert("Attenzione: rispondi a tutte le domande prima di consegnare la verifica!");
            return;
        }

        if (!confirm("Sei sicuro di voler consegnare la verifica? Non potrai più modificarla.")) return;

        const submitBtn = document.querySelector('.cg-btn-submit');
        submitBtn.innerText = "Consegna in corso...";
        submitBtn.disabled = true;

        try {
            await window.fbDb.collection('test_results').add({
                assignmentId: assignmentId,
                userId: window.fbAuth.currentUser.uid,
                userName: Auth.getUser().name,
                score: score,
                total: test.questions.length,
                answers: answers,
                submittedAt: new Date().toISOString()
            });

            // Show results to student
            document.getElementById('cg-test-page').innerHTML = `
                <div class="cg-result-screen">
                    <h2>Verifica Consegnata!</h2>
                    <div class="cg-final-score">${score} / ${test.questions.length}</div>
                    <p>Ottimo lavoro, il tuo test è stato inviato al docente.</p>
                    <button class="btn btn-primary" onclick="navigateTo('culturagenerale')">Torna ai Test</button>
                </div>
            `;
            window.scrollTo(0, 0);
        } catch (e) {
            console.error(e);
            alert("Errore durante la consegna: " + e.message);
            submitBtn.innerText = "Consegna Verifica";
            submitBtn.disabled = false;
        }
    }

    async function viewResults(assignmentId) {
        document.getElementById('exercise-mount').innerHTML = '<div style="padding:4rem;text-align:center;">Caricamento risultati...</div>';
        try {
            // Ottieni info test
            const assignDoc = await window.fbDb.collection('test_assignments').doc(assignmentId).get();
            const a = assignDoc.data();

            // Ottieni risultati
            const resultsSnap = await window.fbDb.collection('test_results').where('assignmentId', '==', assignmentId).get();
            const results = resultsSnap.docs.map(d => d.data());

            let html = `
                <div class="cg-container" id="cg-printable-area">
                    <div class="cg-results-header">
                        <h2>Risultati: ${a.testTitle}</h2>
                        <p>Classe: ${a.classId} | Data: ${a.date}</p>
                    </div>
                    
                    <div class="cg-actions no-print">
                        <button class="btn btn-secondary" onclick="CulturaGenerale.exportCSV('${assignmentId}')">📥 Esporta CSV</button>
                        <button class="btn btn-secondary" onclick="window.print()">🖨️ Stampa Report (PDF)</button>
                        <button class="btn btn-primary" onclick="navigateTo('culturagenerale')">⬅ Torna Indietro</button>
                    </div>
            `;

            if (results.length === 0) {
                html += `<div class="empty-state">Nessuno studente ha ancora consegnato questo test.</div>`;
            } else {
                const totalScore = results.reduce((acc, r) => acc + r.score, 0);
                const avgScore = (totalScore / results.length).toFixed(1);

                html += `
                    <div class="cg-stats">
                        <div class="cg-stat-box"><span>Consegne</span><strong>${results.length}</strong></div>
                        <div class="cg-stat-box"><span>Media Punteggio</span><strong>${avgScore} / 10</strong></div>
                    </div>
                    
                    <table class="cg-table">
                        <thead>
                            <tr>
                                <th>Studente</th>
                                <th>Punteggio</th>
                                <th>Data Consegna</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${results.map(r => `
                                <tr>
                                    <td><strong>${r.userName}</strong></td>
                                    <td>${r.score} / ${r.total}</td>
                                    <td>${new Date(r.submittedAt).toLocaleString('it-IT')}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                `;
            }
            html += `</div>`;
            document.getElementById('exercise-mount').innerHTML = html;
            
            // Salva globalmente per l'export CSV
            window.currentViewResults = results;
            window.currentViewAssignment = a;
        } catch(e) {
            console.error(e);
            alert("Errore nel caricamento dei risultati");
        }
    }

    function exportCSV() {
        if (!window.currentViewResults || !window.currentViewAssignment) return;
        
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Studente,Punteggio,Totale,Data Consegna\n";
        
        window.currentViewResults.forEach(r => {
            const dateStr = new Date(r.submittedAt).toLocaleString('it-IT');
            csvContent += `"${r.userName}",${r.score},${r.total},"${dateStr}"\n`;
        });
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Risultati_${window.currentViewAssignment.classId}_${window.currentViewAssignment.testTitle}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return {
        renderStudentDashboard,
        renderTeacherDashboard,
        switchTeacherTab,
        previewTest,
        openCustomizer,
        assignTest,
        startTest,
        renderTestUI,
        submitTest,
        viewResults,
        exportCSV
    };
})();

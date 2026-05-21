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
            // Find assignments for this class from the class document
            let assignments = [];
            if (classId) {
                const classDoc = await window.fbDb.collection('classes').doc(classId).get();
                if (classDoc.exists) {
                    assignments = classDoc.data().cg_assignments || [];
                }
            }

            // Get user's results from their progress document
            let completedTestIds = [];
            const progressDoc = await window.fbDb.collection('progress').doc(window.fbAuth.currentUser.uid).get();
            if (progressDoc.exists) {
                const cgResults = progressDoc.data().cg_results || [];
                completedTestIds = cgResults.map(r => r.assignmentId);
            }

            const grid = document.getElementById('cg-student-tests');
            
            if (assignments.length === 0) {
                grid.innerHTML = `<div class="empty-state">Non ci sono test assegnati alla tua classe in questo momento.</div>`;
                return;
            }

            let html = '<div style="display:flex; flex-direction:column; gap:1rem;">';
            assignments.forEach(a => {
                const isCompleted = completedTestIds.includes(a.id);
                html += `
                    <div class="cg-card" style="display:flex; justify-content:space-between; align-items:center;">
                        <div>
                            <h4 style="margin:0 0 0.5rem 0;">${a.testTitle}</h4>
                            <span class="cg-badge" style="background:#e9ecef; color:#495057;">Assegnato il: ${a.date}</span>
                        </div>
                        <div>
                            ${isCompleted 
                                ? '<span class="cg-badge" style="background:#d4edda; color:#155724; padding:0.5rem 1rem;">Completato ✅</span>' 
                                : `<button class="btn btn-primary" onclick="CulturaGenerale.startTest('${a.id}', '${classId}')">Svolgi Test</button>`
                            }
                        </div>
                    </div>
                `;
            });
            html += '</div>';
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
                                    <p>20 domande a risposta multipla.</p>
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
            let allAssignments = [];
            
            // Get classes using new and old format
            const classesSnapshot = await window.fbDb.collection('classes').where('teacherIds', 'array-contains', uid).get();
            classesSnapshot.forEach(doc => {
                const c = doc.data();
                const assigns = c.cg_assignments || [];
                assigns.forEach(a => allAssignments.push({...a, classId: doc.id, className: c.name || doc.id}));
            });

            const legacySnapshot = await window.fbDb.collection('classes').where('teacherId', '==', uid).get();
            legacySnapshot.forEach(doc => {
                if (!allAssignments.find(a => a.classId === doc.id)) {
                    const c = doc.data();
                    const assigns = c.cg_assignments || [];
                    assigns.forEach(a => allAssignments.push({...a, classId: doc.id, className: c.name || doc.id}));
                }
            });

            if (allAssignments.length === 0) {
                listDiv.innerHTML = '<div class="empty-state">Non hai ancora assegnato nessun test.</div>';
                return;
            }
            
            // Sort by date descending (rough approximation using ID which is timestamp)
            allAssignments.sort((a, b) => b.id - a.id);

            let html = '<table class="cg-table"><thead><tr><th>Data</th><th>Test</th><th>Classe</th><th>Azioni</th></tr></thead><tbody>';
            allAssignments.forEach(a => {
                html += `<tr>
                    <td>${a.date}</td>
                    <td>${a.testTitle}</td>
                    <td>${a.className}</td>
                    <td>
                        <button class="btn btn-primary btn-sm" onclick="CulturaGenerale.viewResults('${a.id}', '${a.classId}')">Vedi Risultati</button>
                    </td>
                </tr>`;
            });
            html += '</tbody></table>';
            listDiv.innerHTML = html;
        } catch (e) {
            console.error(e);
            listDiv.innerHTML = '<div style="color:red;">Errore nel caricamento.</div>';
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
        
        const classes = JSON.parse(localStorage.getItem('palestra_classes') || '[]');
        let classOptionsHtml = '<option value="">-- Seleziona una classe --</option>';
        if (classes.length > 0) {
            classOptionsHtml += classes.map(c => `<option value="${c.id}">${c.name} ${c.code ? '(' + c.code + ')' : ''}</option>`).join('');
        } else {
            classOptionsHtml = '<option value="">Nessuna classe trovata</option>';
        }

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
                            <label>Classe Destinataria</label>
                            <select id="cg-form-class" style="width:100%; padding: 0.8rem; border-radius: 8px; border: 1px solid #ddd; font-family: inherit; font-size: 1rem;">
                                ${classOptionsHtml}
                            </select>
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
            alert("Seleziona una classe a cui assegnare il test.");
            return;
        }

        const btn = event.target;
        btn.innerText = "Assegnazione in corso...";
        btn.disabled = true;

        try {
            const assignmentId = Date.now().toString();
            const newAssignment = {
                id: assignmentId,
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
            };

            await window.fbDb.collection('classes').doc(classId).update({
                cg_assignments: window.firebase.firestore.FieldValue.arrayUnion(newAssignment)
            });

            document.getElementById('cg-customizer-modal').remove();
            alert("Test assegnato con successo alla classe!");
            switchTeacherTab('results');
        } catch (e) {
            console.error(e);
            alert("Errore durante l'assegnazione: " + e.message);
            btn.innerText = "Conferma e Assegna";
            btn.disabled = false;
        }
    }

    async function startTest(assignmentId, classId) {
        document.getElementById('exercise-mount').innerHTML = '<div style="padding:4rem;text-align:center;">Preparazione test in corso...</div>';
        
        try {
            const classDoc = await window.fbDb.collection('classes').doc(classId).get();
            if (!classDoc.exists) {
                alert("Classe non trovata.");
                return;
            }
            
            const assignments = classDoc.data().cg_assignments || [];
            const assignmentData = assignments.find(a => a.id === assignmentId);
            
            if (!assignmentData) {
                alert("Assegnazione non trovata.");
                return;
            }
            const test = window.CulturaGeneraleData[assignmentData.testLevel].find(t => t.id === assignmentData.testId);

            // Show motivational intro modal
            const introModal = document.createElement('div');
            introModal.className = 'cg-modal-overlay cg-intro-overlay';
            introModal.innerHTML = `
                <div class="cg-modal cg-intro-modal">
                    <h2>Preparati al Test</h2>
                    <div class="cg-intro-text">${assignmentData.introText.replace(/\\n/g, '<br>')}</div>
                    <button class="btn btn-primary cg-btn-large" onclick="this.parentElement.parentElement.remove(); CulturaGenerale.renderTestUI('${assignmentId}', ${JSON.stringify(test).replace(/"/g, '&quot;')}, ${JSON.stringify(assignmentData).replace(/"/g, '&quot;')})">HO CAPITO, INIZIA IL TEST</button>
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
                        <button id="cg-submit-btn" class="btn btn-primary btn-large cg-btn-submit" onclick="CulturaGenerale.submitTest('${assignmentId}', ${JSON.stringify(test).replace(/"/g, '&quot;')}, ${JSON.stringify(assignmentData).replace(/"/g, '&quot;')})">Consegna Verifica</button>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('exercise-mount').innerHTML = html;
        window.scrollTo(0, 0);
    }

    async function submitTest(assignmentId, test, assignmentData) {
        // Collect answers
        let score = 0;
        let correctCount = 0;
        let allAnswered = true;

        test.questions.forEach((q, index) => {
            const selected = document.querySelector(`input[name="q_${index}"]:checked`);
            if (!selected) {
                allAnswered = false;
                document.getElementById(`qb_${index}`).classList.add('cg-unanswered');
            } else {
                document.getElementById(`qb_${index}`).classList.remove('cg-unanswered');
                if (selected.value === q.correct) {
                    correctCount++;
                }
            }
        });

        if (!allAnswered) {
            alert("Attenzione: rispondi a tutte le domande prima di consegnare la verifica!");
            return;
        }

        if (!confirm("Sei sicuro di voler consegnare la verifica? Non potrai più modificarla.")) return;

        score = Math.round((correctCount / test.questions.length) * 100);

        const btn = document.getElementById('cg-submit-btn');
        btn.innerText = "Invio in corso...";
        btn.disabled = true;

        try {
            await window.fbDb.collection('progress').doc(window.fbAuth.currentUser.uid).set({
                cg_results: window.firebase.firestore.FieldValue.arrayUnion({
                    assignmentId: assignmentId,
                    userId: window.fbAuth.currentUser.uid,
                    userName: Auth.getUser().name,
                    testId: assignmentData.testId,
                    testLevel: assignmentData.testLevel,
                    testTitle: assignmentData.testTitle,
                    score: score,
                    correctCount: correctCount,
                    totalQuestions: test.questions.length,
                    completedAt: new Date().toISOString(),
                    classId: assignmentData.classId
                })
            }, { merge: true });

            let feedbackHtml = `
                <div style="text-align:center; padding: 2rem;">
                    <h2>Test Completato!</h2>
                    <p style="font-size:1.2rem;">Il tuo punteggio: <strong>${score}/100</strong> (${correctCount}/${test.questions.length} corrette)</p>
                    <button class="btn btn-primary" onclick="CulturaGenerale.renderStudentDashboard(document.getElementById('exercise-mount'))" style="margin-top:2rem;">Torna alla Dashboard</button>
                </div>
            `;
            document.getElementById('exercise-mount').innerHTML = feedbackHtml;
        } catch (e) {
            console.error(e);
            alert("Errore durante la consegna: " + e.message);
            btn.innerText = "Consegna Verifica";
            btn.disabled = false;
        }
    }

    async function viewResults(assignmentId, classId) {
        document.getElementById('cg-teacher-results-tab').innerHTML = '<div style="padding:2rem;">Caricamento risultati...</div>';
        
        try {
            // Ottieni info test dalla classe
            const classDoc = await window.fbDb.collection('classes').doc(classId).get();
            const classData = classDoc.data();
            const assignments = classData.cg_assignments || [];
            const a = assignments.find(ass => ass.id === assignmentId);
            
            if (!a) throw new Error("Assegnazione non trovata");

            // Ottieni risultati iterando su tutti i progressi degli studenti della classe
            const usersSnap = await window.fbDb.collection('users').where('classId', '==', classId).get();
            const studentUids = usersSnap.docs.map(d => d.id);
            
            let results = [];
            for (const uid of studentUids) {
                const pDoc = await window.fbDb.collection('progress').doc(uid).get();
                if (pDoc.exists) {
                    const cgResults = pDoc.data().cg_results || [];
                    const res = cgResults.find(r => r.assignmentId === assignmentId);
                    if (res) {
                        results.push(res);
                    }
                }
            }

            window.currentViewAssignment = a;
            window.currentViewResults = results;

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

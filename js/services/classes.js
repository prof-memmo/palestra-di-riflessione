window.addTeacherClass = async function() {
    const input = document.getElementById('new-class-name');
    const name = input.value.trim().toUpperCase();
    if (!name) return;
    
    const school = (document.getElementById('new-class-school')?.value || '').trim();
    const city = (document.getElementById('new-class-city')?.value || '').trim();
    
    const user = Auth.getUser();
    if (user.isGuest || !window.fbDb) {
        alert("Devi essere loggato con un account per creare classi cloud.");
        return;
    }

    try {
        const code = "PG-" + Math.random().toString(36).substring(2, 6).toUpperCase();
        const classData = {
            name: name,
            code: code,
            teacherId: user.uid, // Mantieni per compatibilità con Security Rules
            teacherIds: [user.uid], // Nuovo formato array per multi-docente
            school: school || null,
            city: city || null,
            createdAt: new Date().toISOString()
        };

        const docRef = await window.fbDb.collection('classes').add(classData);
        
        // Aggiorna locale
        let classes = JSON.parse(localStorage.getItem('palestra_classes') || '[]');
        classes.push({ id: docRef.id, ...classData });
        localStorage.setItem('palestra_classes', JSON.stringify(classes));
        
        input.value = '';
        renderProfiloPage();
        alert(`✅ Classe ${name} creata con codice: ${code}`);
    } catch (e) {
        console.error("Errore creazione classe:", e);
        alert("Errore durante la creazione della classe: " + e.message);
    }
};


window.recoverTeacherClass = async function() {
    const input = document.getElementById('recover-class-code');
    const code = input.value.trim().toUpperCase();
    if (!code) return;

    const user = Auth.getUser();
    if (user.isGuest || !window.fbDb) {
        alert("Devi essere loggato per recuperare una classe.");
        return;
    }

    try {
        console.log("🔍 Ricerca classe con codice:", code);
        // Leggiamo la classe (la lettura è sempre permessa)
        const q = await window.fbDb.collection('classes').where('code', '==', code).get();
        
        if (q.empty) {
            alert("❌ Nessuna classe trovata con questo codice: " + code);
            return;
        }

        const classDoc = q.docs[0];
        const classData = classDoc.data();
        console.log("✅ Classe trovata:", classData);

        // Se l'utente è un docente, lo aggiungiamo formalmente alla classe su Firestore
        if (user.role === 'docente' && !user.isGuest) {
            const updateData = {};
            
            // Gestione array dei docenti
            if (classData.teacherIds) {
                updateData.teacherIds = firebase.firestore.FieldValue.arrayUnion(user.uid);
            } else if (classData.teacherId) {
                // Migrazione da vecchio formato stringa a nuovo formato array
                const currentTeachers = [classData.teacherId];
                if (!currentTeachers.includes(user.uid)) currentTeachers.push(user.uid);
                updateData.teacherIds = currentTeachers;
            } else {
                updateData.teacherIds = [user.uid];
            }
            
            await window.fbDb.collection('classes').doc(classDoc.id).update(updateData);
            console.log("✅ Docente aggiunto alla classe su Firestore");
        }

        let classes = JSON.parse(localStorage.getItem('palestra_classes') || '[]');
        const alreadyExists = classes.find(c => c.code === code || c.id === classDoc.id);
        
        if (!alreadyExists) {
            classes.push({ id: classDoc.id, ...classData });
            localStorage.setItem('palestra_classes', JSON.stringify(classes));
        } else {
            console.log("ℹ️ Classe già presente nel profilo locale");
        }
        
        alert(`✅ Classe "${classData.name}" (${code}) aggiunta al tuo profilo!`);
        input.value = '';
        renderProfiloPage();
    } catch (e) {
        console.error("ERRORE DETTAGLIATO RECUPERO:", e);
        alert("Errore durante il recupero: " + e.message);
    }
};


window.removeTeacherClass = async function(index) {
    let classes = JSON.parse(localStorage.getItem('palestra_classes') || '[]');
    const classObj = classes[index];
    const classCode = classObj.code;
    
    if (confirm(`Sei sicuro di voler eliminare la classe ${classObj.name}? Verranno rimossi anche tutti i compiti assegnati.`)) {
        try {
            // 1. Rimuovi da Firestore (se l'ID è presente)
            if (classObj.id && window.fbDb) {
                await window.fbDb.collection('classes').doc(classObj.id).delete();
            } else if (window.fbDb) {
                // Se non abbiamo l'ID, cerchiamo per codice
                const q = await window.fbDb.collection('classes').where('code', '==', classCode).get();
                q.forEach(doc => doc.ref.delete());
            }

            // 2. Rimuovi locale
            classes.splice(index, 1);
            localStorage.setItem('palestra_classes', JSON.stringify(classes));
            
            // 3. Rimuovi compiti associati
            let assignments = JSON.parse(localStorage.getItem('palestra_assignments') || '[]');
            assignments = assignments.filter(a => a.classCode !== classCode);
            localStorage.setItem('palestra_assignments', JSON.stringify(assignments));
            
            renderProfiloPage();
        } catch (e) {
            console.error("Errore eliminazione classe:", e);
            alert("Errore durante l'eliminazione della classe: " + e.message);
        }
    }
};


window.viewClassStudents = async function(code, name, classId = null) {
    const content = document.getElementById('class-register-content');
    if (!content) return;

    content.innerHTML = `
        <div style="text-align: center; padding: 2rem;">
            <div class="spinner"></div>
            <p>Caricamento studenti in corso...</p>
        </div>
    `;

    try {
        let classDoc;
        // 1. Cerchiamo la classe prioritariamente per ID, poi per Codice
        if (classId) {
            classDoc = await window.fbDb.collection('classes').doc(classId).get();
            if (!classDoc.exists) {
                // Fallback: se l'ID non trova nulla, proviamo il codice
                const classQ = await window.fbDb.collection('classes').where('code', '==', code).get();
                if (!classQ.empty) classDoc = classQ.docs[0];
            }
        } else {
            const classQ = await window.fbDb.collection('classes').where('code', '==', code).get();
            if (!classQ.empty) classDoc = classQ.docs[0];
        }

        if (!classDoc || (classDoc.exists === false && !classDoc.id)) throw new Error("Classe non trovata");
        const realClassId = classDoc.id;
        const classData = classDoc.data() || {};
        const realClassName = classData.name || name;
        const realClassCode = classData.code || code;

        // 2. Trova gli utenti di questa specifica classe (supportando ID, Codice, Nome Classe e fallback globale)
        const studentsMap = new Map();
        const queries = [
            window.fbDb.collection('users').where('classId', '==', realClassId).get()
        ];
        if (realClassCode && realClassCode !== realClassId) {
            queries.push(window.fbDb.collection('users').where('classId', '==', realClassCode).get());
            queries.push(window.fbDb.collection('users').where('classCode', '==', realClassCode).get());
            queries.push(window.fbDb.collection('users').where('code', '==', realClassCode).get());
        }
        if (realClassName) {
            queries.push(window.fbDb.collection('users').where('className', '==', realClassName).get());
            queries.push(window.fbDb.collection('users').where('className', '==', realClassName.toUpperCase()).get());
            queries.push(window.fbDb.collection('users').where('className', '==', realClassName.toLowerCase()).get());
            queries.push(window.fbDb.collection('users').where('classe', '==', realClassName).get());
        }

        const snapshots = await Promise.all(queries);
        snapshots.forEach(snap => {
            snap.forEach(doc => {
                const u = doc.data();
                if (u.role !== 'docente' && u.role !== 'admin' && u.status !== 'archived') {
                    studentsMap.set(doc.id, { id: doc.id, ...u });
                }
            });
        });

        // Fallback globale su tutta la collezione users se i filtri specifici non hanno prodotto risultati
        if (studentsMap.size === 0) {
            try {
                const allUsersSnap = await window.fbDb.collection('users').get();
                allUsersSnap.forEach(doc => {
                    const u = doc.data();
                    if (u.role !== 'docente' && u.role !== 'admin' && u.status !== 'archived') {
                        const matchId = u.classId === realClassId || u.classId === realClassCode;
                        const matchCode = (u.classCode && u.classCode.toUpperCase() === realClassCode.toUpperCase()) || 
                                          (u.code && u.code.toUpperCase() === realClassCode.toUpperCase());
                        const matchName = (u.className && u.className.trim().toUpperCase() === realClassName.trim().toUpperCase()) ||
                                          (u.classe && u.classe.trim().toUpperCase() === realClassName.trim().toUpperCase()) ||
                                          (u.schoolClass && u.schoolClass.trim().toUpperCase() === realClassName.trim().toUpperCase());
                        if (matchId || matchCode || matchName) {
                            studentsMap.set(doc.id, { id: doc.id, ...u });
                        }
                    }
                });
            } catch (fallbackErr) {
                console.warn("Fallback all users search error:", fallbackErr);
            }
        }

        const classStudents = Array.from(studentsMap.values());

        if (classStudents.length === 0) {
            content.innerHTML = `
                <div style="text-align: center; padding: 2.5rem; background: #f8f9fa; border-radius: 20px; border: 1px dashed #ddd;">
                    <div style="font-size: 2rem; margin-bottom: 0.5rem;">👨‍🎓</div>
                    <p style="color: #2c3e50; font-weight: 700; font-size: 1.05rem; margin-bottom: 0.3rem;">Nessun utente associato alla classe <b>${name}</b>.</p>
                    <p style="font-size: 0.85rem; color: #666; margin-bottom: 1.2rem;">Fai inserire agli studenti il codice classe: <b style="background: #eef2f7; padding: 4px 10px; border-radius: 6px; color: var(--primary-color); font-family: monospace; font-size: 1rem;">${code}</b></p>
                    ${window.Auth && window.Auth.getUser && (window.Auth.getUser().role === 'admin' || window.Auth.getUser().role === 'docente') ? `
                        <button onclick="if(window.renderAdminPage) { window.renderAdminPage(); } else { alert('Accedi al pannello admin per gestire e spostare gli studenti.'); }" class="btn btn-secondary" style="font-size: 0.8rem; padding: 8px 16px; border-radius: 12px;">
                            📋 Gestisci o Sposta Studenti nella Dashboard
                        </button>
                    ` : ''}
                </div>
            `;
            return;
        }

        // 3. Recupera i progressi solo per gli studenti
        const progressMap = {};
        const progressPromises = classStudents.map(async (s) => {
            try {
                const pDoc = await window.fbDb.collection('progress').doc(s.id).get();
                if (pDoc.exists) {
                    progressMap[s.id] = pDoc.data();
                }
            } catch (err) {
                console.warn(`Impossibile caricare progresso per ${s.name}:`, err);
            }
        });

        await Promise.all(progressPromises);

        let tableRows = classStudents.map(s => {
            const p = progressMap[s.id] || { points: 0, completed: [] };
            const lastActivity = p.lastUpdated ? new Date(p.lastUpdated).toLocaleDateString() : 'N/D';
            const completedCount = p.completed ? p.completed.length : 0;
            
            return `
                <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 12px; text-align: center;">
                        <input type="checkbox" class="student-checkbox" data-uid="${s.id}" data-name="${s.name}">
                    </td>
                    <td style="padding: 12px; display: flex; align-items: center; gap: 0.5rem;">
                        <span style="font-size: 1.2rem;">${s.avatar || '👤'}</span>
                        <span style="font-weight: 700;">${s.name}</span>
                    </td>
                    <td style="padding: 12px; font-weight: 800; color: var(--primary-color);">${p.points || 0} XP</td>
                    <td style="padding: 12px;">${completedCount} attività</td>
                    <td style="padding: 12px; color: #95a5a6;">${lastActivity}</td>
                </tr>
            `;
        }).join('');

        const teacherClasses = JSON.parse(localStorage.getItem('palestra_classes') || '[]');
        const otherClasses = teacherClasses.filter(c => c.code !== code);

        content.innerHTML = `
            <div style="font-family: inherit; animation: fadeIn 0.5s ease-out;">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; background: #f0f7ff; padding: 1rem; border-radius: 15px;">
                    <h3 style="color: var(--primary-color); margin: 0; font-size: 1.1rem;">Registro Progressi: Classe ${name}</h3>
                    <span style="color: #3498db; font-size: 0.8rem; font-weight: 800;">CODICE: ${code}</span>
                </div>

                <!-- Gestione Multipla -->
                <div id="student-management-bar" style="background: #fff9f0; padding: 1rem; border-radius: 15px; margin-bottom: 1rem; border: 1px solid #ffeaa7; display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap;">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <span style="font-weight: 700; font-size: 0.85rem; color: #d35400;">GESTIONE SELEZIONATI:</span>
                        <select id="move-destination-class" style="padding: 0.5rem; border-radius: 10px; border: 1px solid #ddd; font-size: 0.8rem;">
                            <option value="">Sposta in classe...</option>
                            ${otherClasses.map(c => `<option value="${c.id}">${c.name} (${c.code})</option>`).join('')}
                        </select>
                        <button onclick="window.moveSelectedStudents('${realClassCode}', '${realClassName.replace(/'/g, "\\'")}', '${realClassId}')" style="background: #e67e22; color: white; border: none; padding: 0.5rem 1rem; border-radius: 10px; font-weight: 700; cursor: pointer; font-size: 0.8rem;">SPOSTA</button>
                        <button onclick="window.deleteSelectedStudents('${realClassCode}', '${realClassName.replace(/'/g, "\\'")}', '${realClassId}')" style="background: #e74c3c; color: white; border: none; padding: 0.5rem 1rem; border-radius: 10px; font-weight: 700; cursor: pointer; font-size: 0.8rem;">ELIMINA</button>
                    </div>
                    <div style="font-size: 0.75rem; color: #888;">
                        Seleziona gli studenti per spostarli in un'altra classe o rimuoverli da questa.
                    </div>
                </div>

                <div style="overflow-x: auto;">
                    <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem;">
                        <thead>
                            <tr style="text-align: left; color: #95a5a6; border-bottom: 2px solid #eee;">
                                <th style="padding: 12px; text-align: center; width: 40px;">
                                    <input type="checkbox" id="select-all-students" onclick="window.toggleSelectAllStudents(this)">
                                </th>
                                <th style="padding: 12px;">STUDENTE</th>
                                <th style="padding: 12px;">PUNTI</th>
                                <th style="padding: 12px;">ATTIVITÀ</th>
                                <th style="padding: 12px;">ULTIMO ACCESSO</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${tableRows || '<tr><td colspan="5" style="text-align:center; padding:2rem; color:#888;">Nessuno studente iscritto.</td></tr>'}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        content.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch (e) {
        console.error("Errore recupero studenti:", e);
        content.innerHTML = `<p style="color: #e74c3c; padding: 1rem;">Errore nel caricamento dei dati: ${e.message}</p>`;
    }


};


window.viewClassTeachers = async function(classId, className, classCode) {
    const content = document.getElementById('class-register-content');
    if (!content) return;

    content.innerHTML = `
        <div style="text-align: center; padding: 2rem;">
            <div class="spinner"></div>
            <p>Recupero elenco docenti...</p>
        </div>
    `;
    
    // Scroll immediato per feedback
    content.scrollIntoView({ behavior: 'smooth', block: 'start' });

    try {
        let classData;
        const doc = await window.fbDb.collection('classes').doc(classId).get();
        if (doc.exists) {
            classData = doc.data();
        } else {
            // Fallback per codice
            const q = await window.fbDb.collection('classes').where('code', '==', classCode).get();
            if (!q.empty) classData = q.docs[0].data();
        }

        if (!classData) throw new Error("Dati classe non trovati.");

        const teacherIdsSet = new Set(classData.teacherIds || (classData.teacherId ? [classData.teacherId] : []));
        
        // 1. Cerchiamo anche altri docenti associati via profilo utente (retroattivo)
        const missingFromDoc = [];
        try {
            // Cerchiamo sia per classId che per classCode (più robusto per vecchie versioni)
            const queries = [
                window.fbDb.collection('users').where('classId', '==', classId).get(),
                window.fbDb.collection('users').where('classId', '==', classCode).get()
            ];
            const snapshots = await Promise.all(queries);
            
            snapshots.forEach(qs => {
                qs.forEach(doc => {
                    const u = doc.data();
                    if (u.role === 'docente' || u.role === 'amico') {
                        if (!teacherIdsSet.has(doc.id)) {
                            teacherIdsSet.add(doc.id);
                            missingFromDoc.push(doc.id);
                        }
                    }
                });
            });
        } catch (err) {
            console.warn("Errore ricerca docenti extra:", err);
        }

        // 2. Guarigione Dati (opzionale/silenziosa): aggiunge i docenti mancanti al documento classe
        if ((missingFromDoc.length > 0 || !classData.teacherId) && !Auth.getUser().isGuest) {
            try {
                const updateData = {};
                if (missingFromDoc.length > 0) {
                    updateData.teacherIds = window.firebase.firestore.FieldValue.arrayUnion(...missingFromDoc);
                }
                // Se manca teacherId (necessario per Security Rules), impostiamo il primo disponibile
                if (!classData.teacherId) {
                    updateData.teacherId = Array.from(teacherIdsSet)[0];
                }
                
                await window.fbDb.collection('classes').doc(classId).update(updateData);
                console.log("🩹 Data Healing: aggiornato documento classe");
            } catch (err) { console.warn("Impossibile auto-aggiornare classe:", err); }
        }

        const teachers = [];
        for (const tid of teacherIdsSet) {
            try {
                const tDoc = await window.fbDb.collection('users').doc(tid).get();
                if (tDoc.exists) {
                    teachers.push({ id: tDoc.id, ...tDoc.data() });
                } else {
                    // Fallback se il profilo non è caricabile (magari regole di sicurezza o documento mancante)
                    teachers.push({ id: tid, name: "Docente Collaboratore", avatar: "👤", email: "Profilo privato" });
                }
            } catch (err) {
                console.warn(`Errore fetch docente ${tid}:`, err);
                teachers.push({ id: tid, name: "Docente Collaboratore", avatar: "👤", email: "Accesso limitato" });
            }
        }

        content.innerHTML = `
            <div style="background: white; padding: 2rem; border-radius: 30px; border: 1px solid #e0e0e0; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                    <h4 style="color: #2980b9; margin: 0; font-size: 1.4rem; font-weight: 800;">👨‍🏫 Docenti della Classe ${className}</h4>
                    <span style="background: #3498db; color: white; padding: 0.3rem 1rem; border-radius: 20px; font-size: 0.8rem; font-weight: 700;">${teachers.length} Docenti</span>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1rem;">
                    ${teachers.map(t => `
                        <div style="display: flex; align-items: center; gap: 1rem; padding: 1rem; background: #f8f9fa; border-radius: 20px; border: 1px solid #eee; transition: all 0.2s;">
                            <div style="font-size: 2rem; background: white; width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; border-radius: 50%; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                                ${t.avatar?.includes('/') ? `<img src="${t.avatar}" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">` : (t.avatar || '👤')}
                            </div>
                            <div>
                                <div style="font-weight: 800; color: #2c3e50;">${t.name}</div>
                                <div style="font-size: 0.75rem; color: #7f8c8d; word-break: break-all;">${t.email || 'Email non pubblica'}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <button onclick="window.renderProfiloPage()" style="margin-top: 2rem; width: 100%; padding: 1rem; background: #f1f2f6; border: none; border-radius: 15px; color: #57606f; font-weight: 700; cursor: pointer;">Chiudi Elenco</button>
            </div>
        `;
    } catch (e) {
        console.error("Errore viewClassTeachers:", e);
        content.innerHTML = `<p style="color: red; text-align: center; padding: 2rem;">Errore durante il caricamento docenti: ${e.message}</p>`;
    }
};


window.joinClass = async function() {
    const input = document.getElementById('join-class-code');
    const code = (input.value || '').trim().toUpperCase();
    if (!code) return;
    
    const user = Auth.getUser();
    if (user.isGuest || !window.fbDb) {
        localStorage.setItem('palestra_student_class_code', code);
        renderProfiloPage();
        return;
    }

    try {
        const q = await window.fbDb.collection('classes').where('code', '==', code).get();
        if (q.empty) {
            alert("❌ Codice classe non valido.");
            return;
        }

        const classDoc = q.docs[0];
        const classData = classDoc.data();
        
        user.classId = classDoc.id;
        user.className = classData.name;
        
        // Determiniamo il teacherId primario per le Security Rules (retrocompatibilità)
        const primaryTeacherId = classData.teacherId || (classData.teacherIds ? classData.teacherIds[0] : null);
        if (primaryTeacherId) {
            user.teacherId = primaryTeacherId;
        }
        
        // Se l'utente è un docente, lo aggiungiamo formalmente ai docenti della classe
        if (user.role === 'docente' && !user.isGuest) {
            try {
                await window.fbDb.collection('classes').doc(classDoc.id).update({
                    teacherIds: window.firebase.firestore.FieldValue.arrayUnion(user.uid)
                });
                console.log("✅ Docente aggiunto formalmente alla classe");
            } catch (err) {
                console.warn("Impossibile aggiornare teacherIds della classe:", err);
            }
        }

        await window.fbDb.collection('users').doc(user.uid).set(user, { merge: true });
        localStorage.setItem('palestra_user', JSON.stringify(user));
        localStorage.setItem('palestra_student_class_code', code);
        
        renderProfiloPage();
        alert(`✅ Ti sei unito alla classe ${classData.name}!`);
    } catch (e) {
        console.error("Errore join classe:", e);
        alert("Errore durante l'accesso alla classe: " + e.message);
    }
};


window.leaveClass = async function() {
    if (!confirm("Sei sicuro di voler uscire dalla classe?")) return;
    
    const user = Auth.getUser();
    localStorage.removeItem('palestra_student_class_code');
    
    if (!user.isGuest && window.fbDb) {
        // Rimuoviamo i campi relativi alla classe dal profilo Firestore
        const updateData = {
            classId: window.firebase.firestore.FieldValue.delete(),
            className: window.firebase.firestore.FieldValue.delete(),
            teacherId: window.firebase.firestore.FieldValue.delete()
        };
        
        await window.fbDb.collection('users').doc(user.uid).update(updateData);
        
        delete user.classId;
        delete user.className;
        delete user.teacherId;
        localStorage.setItem('palestra_user', JSON.stringify(user));
    }
    
    renderProfiloPage();
};


window.saveTeacherClass = async function(id) {
    const name = document.getElementById('edit-class-name').value.trim().toUpperCase();
    const school = document.getElementById('edit-class-school').value.trim();
    const city = document.getElementById('edit-class-city').value.trim();

    if (!name) { alert("Inserisci il nome della classe."); return; }

    try {
        if (window.fbDb) {
            await window.fbDb.collection('classes').doc(id).update({
                name, school, city
            });
        }
        
        // Aggiorna locale
        let classes = JSON.parse(localStorage.getItem('palestra_classes') || '[]');
        const idx = classes.findIndex(c => c.id === id);
        if (idx !== -1) {
            classes[idx].name = name;
            classes[idx].school = school;
            classes[idx].city = city;
            localStorage.setItem('palestra_classes', JSON.stringify(classes));
        }

        window.UI.hideModal();
        renderProfiloPage();
        alert("✅ Classe aggiornata con successo!");
    } catch (e) {
        console.error("Errore aggiornamento classe:", e);
        let msg = "Errore durante il salvataggio: " + e.message;
        if (e.code === 'permission-denied') {
            msg = "Permessi insufficienti. Assicurati di essere il proprietario di questa classe e che le regole di Firebase siano aggiornate.";
        }
        alert(msg);
    }
};


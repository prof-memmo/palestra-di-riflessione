const UI = {
    // Mapping common words to icons/images for pedagogical visualization
    wordIcons: {
        'GATTO': '🐱',
        'CANE': '🐶',
        'BOSCO': '🌲',
        'SOLE': '☀️',
        'MARE': '🌊',
        'CASA': '🏠',
        'LIBRO': '📖',
        'GUFO': '🦉',
        'STELLE': '✨',
        'ALBERI': '🌳',
        'FAMIGLIA': '👨‍👩‍👧‍👦',
        'SPIAGGIA': '🏖️',
        'CASTELLO': '🏰',
        'SABBIA': '🏖️',
        'COCOMERO': '🍉',
        'FRESCO': '❄️',
        'MANGIAMO': '🍴',
        'ESTATE': '🏖️'
    },

    showFeedback: (isCorrect, feedbackData, callback, explicitPath = null) => {
        const modal = document.getElementById('feedback-modal');
        const body = document.getElementById('feedback-body');
        if (!modal) return;
        
        window.currentExerciseCallback = callback;
        
        // Usa il percorso esplicito se fornito, altrimenti prova a ricostruirlo dal hash
        let path = explicitPath;
        if (!path) {
            path = window.location.hash.substring(1).split('/').filter(p => p && p !== 'null');
            // Se l'ultimo elemento è un indice numerico, lo rimuoviamo per avere il percorso della fase
            if (path.length > 0 && !isNaN(path[path.length - 1])) {
                path = path.slice(0, -1);
            }
        }
        const phase = path[path.length - 1];
        
        let icon = isCorrect ? '🌟' : '💡';
        let msg = isCorrect ? 'ECCELLENTE!' : 'SICURO/A?';
        let color = isCorrect ? 'var(--primary-color)' : '#e74c3c';
        let feedbackHtml = '';
        if (isCorrect) {
            const hasMap = feedbackData.map && feedbackData.map !== "Ottimo lavoro!" && feedbackData.map !== "Corretto! Ottimo lavoro.";
            feedbackHtml = hasMap ? `
                <div class="map-container" style="background: #f0f4ff; border-radius: 20px; padding: 1.5rem; border-left: 6px solid var(--primary-color); text-align: left; margin-bottom: 1.5rem;">
                    <p style="font-size: 1.1rem; line-height: 1.6; margin: 0; color: #2c3e50;">${feedbackData.map}</p>
                </div>
            ` : '';
        } else {
            feedbackHtml = `
                <div class="error-container" style="background: #fff5f5; border-radius: 20px; padding: 2rem; border: 2px solid #feb2b2; text-align: left; margin-bottom: 1.5rem;">
                    <h4 style="color: #c53030; margin-bottom: 1rem; font-weight: 800; display: flex; align-items: center; gap: 0.5rem; font-size: 1.3rem;">
                        <span>🛑</span> ERRORI RISCONTRATI
                    </h4>
                    ${feedbackData.errorsHtml || `<p style="font-size: 1.15rem; line-height: 1.6; margin: 0; color: #742a2a;">${feedbackData.map || "La risposta non è corretta. Rileggi con attenzione e riprova!"}</p>`}
                </div>
            `;
        }

        if (phase === 'verifica') {
            icon = isCorrect ? '✅' : '❌';
            msg = isCorrect ? 'CORRETTO' : 'ERRATO';
            feedbackHtml = `<p style="font-size: 1.2rem; margin-top: 1rem; font-weight: 700;">La risposta è stata registrata.</p>`;
        }
        
        const pathStr = path.join(',');
        const buttonsHtml = isCorrect 
            ? `<button class="btn btn-primary" style="padding: 0.8rem 2rem; font-size: 1rem; border-radius: 50px; box-shadow: 0 10px 20px rgba(255,107,107,0.3);" onclick="UI.closeModal()">VAI AVANTI ➜</button>`
            : `<button class="btn btn-primary" style="padding: 0.8rem 2rem; font-size: 1rem; border-radius: 50px; width: 100%; max-width: 350px; box-shadow: 0 10px 20px rgba(255,107,107,0.3); background: #34495e;" onclick="UI.closeModal()">HO CAPITO, VAI AVANTI ➜</button>`;

        body.innerHTML = `
            <div class="feedback-header" style="text-align: center; margin-bottom: 2rem;">
                <div style="font-size: 5rem; margin-bottom: 0.5rem;">${icon}</div>
                <h3 style="color: ${color}; font-size: 2.2rem; font-weight: 900; letter-spacing: -1px;">${msg}</h3>
            </div>
            ${feedbackHtml}
            <div style="margin-top: 3rem; text-align: center;">
                ${buttonsHtml}
            </div>
        `;
        modal.classList.remove('hidden');
    },
    
    closeModal: () => {
        const modal = document.getElementById('feedback-modal');
        modal.classList.add('hidden');
        if (window.currentExerciseCallback) {
            const cb = window.currentExerciseCallback;
            window.currentExerciseCallback = null;
            cb();
        }
    },

    skipAndNavigate: (path) => {
        window.UI.closeModal();
        if (typeof window.navigateExercise === 'function') {
            const pathStr = Array.isArray(path) ? path.join(',') : path;
            window.navigateExercise(1, pathStr, true);
        }
    },
    
    renderNav: (path, total) => {
        const pathStr = Array.isArray(path) ? path.join(',') : '';
        const prevDisabled = '';
        
        const pct = total ? Math.round(((window.currentExerciseIndex) / total) * 100) : 0;
        return `
            <div class="exercise-nav" style="display: flex; flex-direction: column; margin-bottom: 2rem;">
                <div style="width: 100%; background: #eee; height: 12px; border-radius: 6px; overflow: hidden; margin-bottom: 0.5rem; box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);">
                    <div style="width: ${pct}%; height: 100%; background: linear-gradient(90deg, var(--primary-color), var(--accent-color)); transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1); border-radius: 6px;"></div>
                </div>
                
                <button class="nav-arrow-btn left" onclick="window.navigateExercise(-1, '${pathStr}')" style="position: fixed; left: 1rem; bottom: 2rem; background: white; border: 2px solid #eee; width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; cursor: pointer; box-shadow: 0 5px 15px rgba(0,0,0,0.1); transition: all 0.3s; z-index: 5000;">⬅️</button>
                <button class="nav-arrow-btn right" onclick="window.navigateExercise(1, '${pathStr}')" style="position: fixed; right: 1rem; bottom: 2rem; background: white; border: 2px solid #eee; width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; cursor: pointer; box-shadow: 0 5px 15px rgba(0,0,0,0.1); transition: all 0.3s; z-index: 5000;">➡️</button>
                
                <style>
                    .nav-arrow-btn:hover { transform: scale(1.1); }
                    
                    @media (min-width: 1025px) {
                        .nav-arrow-btn { top: 50% !important; bottom: auto !important; transform: translateY(-50%) !important; width: 60px !important; height: 60px !important; font-size: 1.5rem !important; }
                        .nav-arrow-btn.left { left: calc(var(--sidebar-width) + 2rem) !important; }
                        .nav-arrow-btn.right { right: 2rem !important; }
                        .navbar.hidden ~ main .nav-arrow-btn.left { left: 2rem !important; }
                    }

                    @media (max-width: 1024px) {
                        .nav-arrow-btn.left { left: 1rem !important; bottom: 1.5rem !important; }
                        .nav-arrow-btn.right { right: 1rem !important; bottom: 1.5rem !important; }
                    }
                </style>
            </div>
        `;
    },

    renderGrammatica: (exercise, isUda, path, total) => {
        const isMulti = exercise.questions && exercise.questions.length > 0;
        let contentHtml = '';

        if (isMulti) {
            contentHtml = `
                <div style="background: #fdfdfd; padding: 2rem; border-radius: 20px; border: 1px solid #eee; margin-bottom: 2.5rem;">
                    <p style="font-weight: 800; color: var(--primary-color); margin-bottom: 2rem; font-size: 1.1rem; text-transform: uppercase; letter-spacing: 1px;">📋 ELENCO ESERCIZI:</p>
                    <div class="questions-stack">
                        ${exercise.questions.map((q, qIdx) => `
                            <div class="question-block" style="background: white; padding: 1.5rem; border-radius: 15px; border: 1px solid #eee; margin-bottom: 1.5rem; box-shadow: 0 4px 10px rgba(0,0,0,0.02);">
                                <div style="display: flex; gap: 1rem; align-items: flex-start; margin-bottom: 1rem;">
                                    <span style="background: var(--primary-color); color: white; min-width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border-radius: 50%; font-weight: 800; font-size: 0.9rem;">${qIdx + 1}</span>
                                    <p style="font-size: 1.2rem; font-weight: 700; margin: 0; color: var(--text-color);">${q.question || q.text}</p>
                                </div>
                                <div class="options-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                                    ${(q.options || []).map(opt => `
                                        <button class="btn btn-secondary" style="padding: 1rem; font-weight: 600; font-size: 0.95rem;" onclick="checkSubAnswer('${opt.replace(/'/g, "\\'")}', '${q.answer.replace(/'/g, "\\'")}', ${exercise.id})">${opt}</button>
                                    `).join('')}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        } else {
            contentHtml = `
                <div style="background: #fff; padding: 3rem; border-radius: 30px; border: 1px solid #eee; margin-bottom: 2.5rem; text-align: center; box-shadow: 0 10px 20px rgba(0,0,0,0.02);">
                    <span style="font-size: 3rem; font-weight: 800; color: var(--primary-color); display: block; margin-bottom: 1.5rem;">${exercise.word || exercise.text}</span>
                    <p style="font-weight: 700; color: #666; margin-bottom: 2.5rem; text-transform: uppercase; letter-spacing: 1px;">IDENTIFICA LA CATEGORIA GRAMMATICALE:</p>
                    <div class="options-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
                        ${(exercise.options || []).map(opt => `
                            <button class="btn btn-secondary" style="padding: 1.5rem; font-weight: 700; font-size: 1.1rem;" onclick="checkAnswer('${opt.replace(/'/g, "\\'")}', '${exercise.answer.replace(/'/g, "\\'")}', 'grammaticale', ${exercise.id})">${opt}</button>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        return `
            <div class="exercise-container">
                <h2 class="exercise-title" style="display: flex; align-items: center; justify-content: space-between;">
                    <span>🔍 ANALISI GRAMMATICALE</span>
                    <span style="font-size: 1.5rem; font-weight: 700; color: #888; background: #eee; padding: 0.3rem 0.8rem; border-radius: 12px;">${window.currentExerciseIndex + 1}/${total}</span>
                </h2>
                ${exercise.instruction ? `<div style="background: #f8f9fa; padding: 1rem 1.5rem; border-radius: 12px; border-left: 5px solid var(--primary-color); margin-bottom: 2rem; font-weight: 600;">${exercise.instruction}</div>` : ''}
                ${contentHtml}
                ${path ? window.UI.renderNav(path, total) : ''}
            </div>
        `;
    },

    renderProduzione: (exercise, isUda, path, total) => {
        const isMulti = exercise.questions && exercise.questions.length > 0;
        
        let questionsHtml = '';
        if (isMulti) {
            questionsHtml = exercise.questions.map((q, qIdx) => {
                return `
                    <div class="question-block" style="background: #fdfdfd; padding: 2rem; border-radius: 20px; border: 2px solid #eee; margin-bottom: 2rem;">
                        <p style="font-size: 1.2rem; font-weight: 800; margin-bottom: 1.5rem; color: var(--text-color);">🤔 ${qIdx + 1}. ${q.question}</p>
                        <div class="options-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;" id="q-container-${qIdx}">
                            ${q.options.map(opt => `
                                <button class="btn btn-secondary opt-btn-${qIdx}" style="padding: 1.2rem; font-weight: 600;" onclick="UI.selectMultiLetturaOption(this, ${qIdx}, '${opt.replace(/'/g, "\\'")}')">${opt}</button>
                            `).join('')}
                        </div>
                        <button class="btn btn-primary btn-verify-card" id="verify-btn-${qIdx}" style="width: 100%; padding: 1.2rem; font-size: 1.1rem; font-weight: 800; margin-top: 1.5rem; border-radius: 12px;" onclick="UI.verifySingleCard(this, ${exercise.id}, ${qIdx}, '${q.answer.replace(/'/g, "\\'")}', ${exercise.questions.length})">VERIFICA</button>
                    </div>
                `;
            }).join('');
        } else {
            questionsHtml = `
                <div style="background: white; padding: 2rem; border-radius: 20px; border: 2px solid #eee; text-align: center;">
                    <p style="font-size: 1.2rem; font-weight: 800; margin-bottom: 2rem;">${exercise.question || 'SCEGLI LA RISPOSTA CORRETTA:'}</p>
                    <div class="options-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;" id="single-lettura-container">
                        ${(exercise.options || []).map(opt => `
                            <button class="btn btn-secondary lettura-opt" style="padding: 1.5rem; font-weight: 700;" onclick="UI.selectLetturaOption(this, '${opt.replace(/'/g, "\\'")}')">${opt}</button>
                        `).join('')}
                    </div>
                </div>
                <button class="btn btn-primary btn-verify" style="width: 100%; padding: 1.5rem; font-size: 1.25rem; font-weight: 800; margin-top: 2rem; border-radius: 20px; box-shadow: 0 10px 20px rgba(0,0,0,0.05);" onclick="UI.verifyLetturaAnswer(${exercise.id}, '${exercise.answer.replace(/'/g, "\\'")}')">VERIFICA LA RISPOSTA</button>
            `;
        }

        return `
            <div class="exercise-container">
                <h2 class="exercise-title" style="display: flex; align-items: center; justify-content: space-between;">
                    <span>📝 LABORATORIO DI PRODUZIONE</span>
                    <span style="font-size: 1.5rem; font-weight: 700; color: #888; background: #eee; padding: 0.3rem 0.8rem; border-radius: 12px;">${window.currentExerciseIndex + 1}/${total}</span>
                </h2>
                
                ${exercise.title ? `<h3 style="color: var(--primary-color); font-weight: 800; text-align: center; margin-bottom: 1.5rem; font-size: 1.6rem;">${exercise.title}</h3>` : ''}
                
                ${exercise.instruction ? `
                    <div style="background: #f0f7ff; padding: 1.2rem; border-radius: 15px; border-left: 5px solid var(--primary-color); margin-bottom: 2rem; font-weight: 700; color: #2c3e50; text-align: justify;">
                        ${exercise.instruction}
                    </div>
                ` : ''}

                ${exercise.text || exercise.word ? `
                    <div style="background: #fff; padding: 2.5rem; border-radius: 30px; border: 1px solid #eee; margin-bottom: 2.5rem; text-align: center; box-shadow: 0 10px 20px rgba(0,0,0,0.02);">
                        <div style="font-size: 1.8rem; line-height: 1.8; font-weight: 700; text-align: justify;">
                            ${(exercise.text || exercise.word).replace(/\\n/g, '<br>')}
                        </div>
                    </div>
                ` : ''}

                <div class="questions-stack">
                    ${questionsHtml}
                </div>
                
                ${path ? window.UI.renderNav(path, total) : ''}
            </div>
        `;
    },

    
renderLessico: (exercise, isUda, path, total) => {
        const isMulti = exercise.questions && exercise.questions.length > 0;
        
        let questionsHtml = '';
        if (isMulti) {
            questionsHtml = exercise.questions.map((q, qIdx) => {
                return `
                    <div class="question-block" style="background: #fdfdfd; padding: 2rem; border-radius: 20px; border: 2px solid #eee; margin-bottom: 2rem;">
                        <p style="font-size: 1.2rem; font-weight: 800; margin-bottom: 1.5rem; color: var(--text-color);">🤔 ${qIdx + 1}. ${q.question}</p>
                        <div class="options-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                            ${q.options.map(opt => `
                                <button class="btn btn-secondary" style="padding: 1.2rem; font-weight: 600;" onclick="checkSubAnswer('${opt.replace(/'/g, "\\'")}', '${q.answer.replace(/'/g, "\\'")}', ${exercise.id})">${opt}</button>
                            `).join('')}
                        </div>
                    </div>
                `;
            }).join('');
        } else {
            questionsHtml = `
                <div style="background: white; padding: 2rem; border-radius: 20px; border: 2px solid #eee; text-align: center;">
                    <p style="font-size: 1.2rem; font-weight: 800; margin-bottom: 2rem;">${exercise.question || 'SCEGLI LA RISPOSTA CORRETTA:'}</p>
                    <div class="options-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
                        ${(exercise.options || []).map(opt => `
                            <button class="btn btn-secondary" style="padding: 1.5rem; font-weight: 700;" onclick="checkAnswer('${opt.replace(/'/g, "\\'")}', '${exercise.answer.replace(/'/g, "\\'")}', 'lessico', ${exercise.id})">${opt}</button>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        return `
            <div class="exercise-container">
                <h2 class="exercise-title" style="display: flex; align-items: center; justify-content: space-between;">
                    <span>📚 LESSICO E SIGNIFICATI</span>
                    <span style="font-size: 1.5rem; font-weight: 700; color: #888; background: #eee; padding: 0.3rem 0.8rem; border-radius: 12px;">${window.currentExerciseIndex + 1}/${total}</span>
                </h2>
                
                ${exercise.title ? `<h3 style="color: var(--primary-color); font-weight: 800; text-align: center; margin-bottom: 1.5rem; font-size: 1.6rem;">${exercise.title}</h3>` : ''}
                
                ${exercise.instruction ? `
                    <div style="background: #f0f7ff; padding: 1.2rem; border-radius: 15px; border-left: 5px solid var(--primary-color); margin-bottom: 2rem; font-weight: 700; color: #2c3e50; text-align: justify;">
                        ${exercise.instruction}
                    </div>
                ` : ''}

                ${exercise.text || exercise.word ? `
                    <div style="background: #fff; padding: 2.5rem; border-radius: 30px; border: 1px solid #eee; margin-bottom: 2.5rem; text-align: center; box-shadow: 0 10px 20px rgba(0,0,0,0.02);">
                        <div style="font-size: 1.8rem; line-height: 1.8; font-weight: 700; text-align: justify;">
                            ${(exercise.text || exercise.word).replace(/\\n/g, '<br>')}
                        </div>
                    </div>
                ` : ''}

                <div class="questions-stack">
                    ${questionsHtml}
                </div>
                
                ${path ? window.UI.renderNav(path, total) : ''}
            </div>
        `;
    },

    
    renderLogica: (exercise, isUda, path, total) => `
        <div class="exercise-container" style="position: relative;">
            <h2 class="exercise-title" style="display: flex; align-items: center; justify-content: space-between;">
                <span>🧩 ANALISI LOGICA</span>
                <span style="font-size: 1.5rem; font-weight: 700; color: #888; background: #eee; padding: 0.3rem 0.8rem; border-radius: 12px;">${window.currentExerciseIndex + 1}/${total}</span>
            </h2>
            <div style="background: white; border: 2px solid #eee; padding: 2rem; border-radius: 25px; margin-bottom: 2rem; font-size: 1.5rem; line-height: 1.8; text-align: center;">
                ${exercise.word ? `<div style="font-weight: 800; font-size: 2.2rem; margin-bottom: 1rem; color: var(--primary-color); text-align: center;">${exercise.word}</div>` : ''}
                <div style="text-align: justify;">
                    ${exercise.target && exercise.text ? exercise.text.replace(exercise.target, `<span style="color: var(--primary-color); font-weight: 800; border-bottom: 4px solid var(--accent-color);">${exercise.target}</span>`) : (exercise.text || '')}
                </div>
            </div>
            <p style="font-weight: 700; margin-bottom: 2rem; text-align: center;">CHE FUNZIONE HA LA PAROLA IN EVIDENZA?</p>
            <div class="options-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
                ${(exercise.options || []).map(opt => `
                    <button class="btn btn-secondary" style="padding: 1.5rem; text-align: center;" onclick="checkAnswer('${opt.replace(/'/g, "\\'")}', '${exercise.answer.replace(/'/g, "\\'")}', 'logica', ${exercise.id})">${opt}</button>
                `).join('')}
            </div>
            ${path ? window.UI.renderNav(path, total) : ''}
        </div>
    `,

    renderPeriodo: (exercise, isUda, path, total) => {
        const isMulti = exercise.questions && exercise.questions.length > 0;
        
        let questionsHtml = '';
        if (isMulti) {
            questionsHtml = exercise.questions.map((q, qIdx) => {
                return `
                    <div class="question-block" style="background: #fdfdfd; padding: 2rem; border-radius: 20px; border: 2px solid #eee; margin-bottom: 2rem;">
                        <p style="font-size: 1.2rem; font-weight: 800; margin-bottom: 1.5rem; color: var(--text-color);">🤔 ${qIdx + 1}. ${q.question || q.text}</p>
                        <div class="options-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                            ${(q.options || []).map(opt => `
                                <button class="btn btn-secondary" style="padding: 1.2rem; font-weight: 600;" onclick="checkSubAnswer('${opt.replace(/'/g, "\\'")}', '${q.answer.replace(/'/g, "\\'")}', ${exercise.id})">${opt}</button>
                            `).join('')}
                        </div>
                    </div>
                `;
            }).join('');
        } else {
            questionsHtml = `
                <div style="background: white; border: 2px solid #eee; padding: 2rem; border-radius: 25px; margin-bottom: 2rem; font-size: 1.5rem; line-height: 1.8; text-align: center;">
                    ${exercise.word ? `<div style="font-weight: 800; font-size: 1.8rem; margin-bottom: 1rem; color: var(--primary-color); text-align: center;">${exercise.word}</div>` : ''}
                    <div style="font-style: italic; color: #666; text-align: justify;">${exercise.text || ''}</div>
                </div>
                <div class="options-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
                    ${(exercise.options || []).map(opt => `
                        <button class="btn btn-secondary" style="padding: 1.5rem; text-align: center;" onclick="checkAnswer('${opt.replace(/'/g, "\\'")}', '${exercise.answer.replace(/'/g, "\\'")}', 'periodo', ${exercise.id})">${opt}</button>
                    `).join('')}
                </div>
            `;
        }

        return `
            <div class="exercise-container" style="position: relative;">
                <h2 class="exercise-title" style="display: flex; align-items: center; justify-content: space-between;">
                    <span>⏳ ANALISI DEL PERIODO</span>
                    <span style="font-size: 1.5rem; font-weight: 700; color: #888; background: #eee; padding: 0.3rem 0.8rem; border-radius: 12px;">${window.currentExerciseIndex + 1}/${total}</span>
                </h2>
                ${exercise.title ? `<h3 style="color: var(--primary-color); font-weight: 800; text-align: center; margin-bottom: 1.5rem; font-size: 1.6rem;">${exercise.title}</h3>` : ''}
                ${exercise.instruction ? `<div style="background: #f0f7ff; padding: 1.2rem; border-radius: 15px; border-left: 5px solid var(--primary-color); margin-bottom: 2rem; font-weight: 700; color: #2c3e50; text-align: justify;">${exercise.instruction}</div>` : ''}
                <div class="questions-stack">
                    ${questionsHtml}
                </div>
                ${path ? window.UI.renderNav(path, total) : ''}
            </div>
        `;
    },

    // --- RENDERERS INTERATTIVI ---

    renderInteractive: (exercise, isUda, path, total) => {
        let interactionHtml = '';
        const type = exercise.type || 'multiple-choice';

        if (type === 'completion') {
            const parts = exercise.text.split('___');
            interactionHtml = `
                <div class="interactive-container" style="font-size: 1.3rem; line-height: 2.2; text-align: left; background: white; padding: 2.5rem; border-radius: 30px; border: 1px solid #eee; box-shadow: 0 10px 30px rgba(0,0,0,0.02); overflow-x: auto; -webkit-overflow-scrolling: touch;">
                    ${parts.map((p, i) => {
                        if (i < parts.length - 1) {
                            const answers = exercise.answer.split('|');
                            const answerLen = answers[i] ? answers[i].length : 3;
                            return `${p} <input type="text" class="completion-input" id="input-${i}" placeholder="..." size="${Math.max(2, answerLen)}">`;
                        }
                        return p;
                    }).join('')}
                </div>
                <button class="btn btn-primary btn-verify" style="margin-top: 2rem; width: 100%;" onclick="checkCompletionAnswer(${exercise.id}, '${exercise.answer.replace(/'/g, "\\'")}')">VERIFICA RISPOSTA</button>
            `;
        } else if (type === 'highlight') {
            const words = exercise.text.split(' ');
            
            interactionHtml = `
                <style>
                    .word-tag {
                        padding: 6px 10px;
                        border-radius: 10px;
                        cursor: pointer;
                        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                        border: 2px solid transparent;
                        font-size: 1.3rem;
                        display: inline-block;
                        font-weight: 600;
                        margin: 2px;
                        background: #f8f9fa;
                    }
                    .word-tag:hover {
                        background: #edf2f7;
                        transform: translateY(-2px);
                    }
                    .word-tag.dittongo {
                        background: rgba(39, 174, 96, 0.15);
                        border-color: #27ae60;
                        color: #1e8449;
                    }
                    .word-tag.trittongo {
                        background: rgba(211, 84, 0, 0.15);
                        border-color: #d35400;
                        color: #a04000;
                    }
                </style>
                <div class="interactive-container" style="font-size: 1.5rem; line-height: 2.8; text-align: left; background: white; padding: 2.5rem; border-radius: 25px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); border: 1px solid #f0f0f0; margin-bottom: 2rem;" id="highlight-container">
                    ${words.map((w, i) => `<span class="word-tag" onclick="window.cycleWordState(this, ${i})">${w}</span>`).join(' ')}
                </div>
                
                <button class="btn btn-primary btn-verify" style="width: 100%; padding: 1.2rem; font-size: 1.2rem;" onclick="window.checkHighlightResults(${exercise.id}, '${exercise.answer_dittongo.replace(/'/g, "\\'")}', '${(exercise.answer_trittongo || '').replace(/'/g, "\\'")}')">VERIFICA SELEZIONE ➜</button>
            `;
        } else if (type === 'drag-drop') {
            interactionHtml = `
                <div class="drag-container" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem; align-items: start;">
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <p style="font-weight: 800; color: var(--primary-color); font-size: 0.9rem;">ELEMENTI</p>
                        ${exercise.draggables.map(d => `<div class="draggable-item" draggable="true" ondragstart="event.dataTransfer.setData('text', '${d.replace(/'/g, "\\'")}')" style="cursor: grab; background: #fff; border: 2px solid var(--primary-color); padding: 1rem; border-radius: 12px; font-weight: 700;">${d}</div>`).join('')}
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <p style="font-weight: 800; color: var(--primary-color); font-size: 0.9rem;">CATEGORIE</p>
                        ${exercise.targets.map((t, i) => `
                            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                                <span style="font-weight: 800; font-size: 0.9rem; color: #555;">${t}:</span>
                                <div class="drop-zone" ondragover="event.preventDefault()" ondrop="onDropItem(event, ${i})" style="min-height: 50px; border: 2px dashed #ccc; border-radius: 12px; display: flex; align-items: center; justify-content: center; background: #f9f9f9;">Trascina qui</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <button class="btn btn-primary btn-verify" style="margin-top: 2rem; width: 100%;" onclick="checkDragDropAnswer(${exercise.id}, '${exercise.answer.replace(/'/g, "\\'")}')">VERIFICA ABBINAMENTI</button>
            `;
        } else if (type === 'classification-grid') {
            const stems = exercise.words || [exercise.word];
            const answers = exercise.answers || [exercise.answer];
            
            interactionHtml = `
                <div style="background: white; padding: 1.5rem; border-radius: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); overflow: hidden;">
                    <div style="overflow-x: auto; -webkit-overflow-scrolling: touch; margin-bottom: 1rem;">
                        <table style="width: 100%; border-collapse: collapse; min-width: 600px;">
                            <thead>
                                <tr>
                                    <th style="text-align: left; padding: 1rem; color: #888; font-size: 0.8rem; letter-spacing: 1px; background: #fafafa; border-radius: 10px 0 0 10px;">PAROLA / FRASE</th>
                                    ${exercise.categories.map((c, i) => `<th style="padding: 1rem; color: #888; font-size: 0.8rem; letter-spacing: 1px; background: #fafafa; ${i === exercise.categories.length - 1 ? 'border-radius: 0 10px 10px 0;' : ''}">${c.toUpperCase()}</th>`).join('')}
                                </tr>
                            </thead>
                            <tbody>
                                ${stems.map((w, idx) => `
                                    <tr style="border-bottom: 1px solid #eee;">
                                        <td style="padding: 1.5rem 1rem; font-weight: 700; color: var(--primary-color); white-space: normal; min-width: 150px;">${w}</td>
                                        ${exercise.categories.map(c => `
                                            <td style="text-align: center; padding: 1rem;">
                                                <input type="radio" name="classif-${exercise.id}-${idx}" value="${c.replace(/'/g, "\\'")}" style="transform: scale(1.5); cursor: pointer;">
                                            </td>
                                        `).join('')}
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
                <button class="btn btn-primary btn-verify" style="margin-top: 2rem; width: 100%;" onclick="checkMultiGridAnswer(${exercise.id}, ${JSON.stringify(answers).replace(/"/g, '&quot;')})">CONFERMA E VERIFICA ➜</button>
            `;
        } else if (type === 'sentence-analysis') {
            const words = exercise.sentence.split(' ');
            const wordSpans = words.map((w, i) => {
                const gap = i < words.length - 1
                    ? `<span class="sa-gap" data-idx="${i}" onclick="window.toggleSaGap(this)"></span>`
                    : '';
                return `<span class="sa-word">${w}</span>${gap}`;
            }).join('');
            interactionHtml = `
                <style>
                    .sa-sentence{font-size:1.4rem;font-weight:700;line-height:2.8;background:#f8f9fa;padding:1.5rem 2rem;border-radius:15px;margin-bottom:1rem;}
                    .sa-word{margin:0 3px;}
                    .sa-gap{display:inline-block;width:16px;height:24px;cursor:pointer;border-radius:4px;background:#dde4ea;vertical-align:middle;transition:all 0.15s;position:relative;margin:0 2px;}
                    .sa-gap:hover{background:#b2c8dc;}
                    .sa-gap.active{background:#e74c3c;width:22px;}
                    .sa-gap.active::after{content:'/';color:white;font-weight:900;font-size:1.2rem;position:absolute;left:50%;top:50%;transform:translate(-50%,-52%);}
                    .sa-labels{display:flex;flex-direction:column;gap:0.7rem;margin-top:1rem;}
                    .sa-label-row{display:flex;align-items:center;gap:0.8rem;background:#fff;border:1px solid #ddd;border-radius:10px;padding:0.7rem 1rem;flex-wrap:wrap;}
                    .sa-label-num{font-weight:800;color:#e74c3c;min-width:24px;}
                    .sa-label-segment{font-weight:700;color:#2c3e50;min-width:160px;font-size:0.95rem;}
                    .sa-label-input{flex:1;border:1.5px solid #ccc;border-radius:8px;padding:0.4rem 0.8rem;font-size:0.95rem;font-family:inherit;}
                </style>
                <div class="sa-sentence" id="sa-sentence">${wordSpans}</div>
                <p style="text-align:center;color:#888;font-size:0.9rem;margin-bottom:1rem;">👆 Clicca tra le parole per inserire una <b>/</b>, poi clicca ETICHETTA per nominare ogni parte.</p>
                <div class="sa-labels" id="sa-labels"></div>
                <div style="display:flex;gap:1rem;margin-top:1.2rem;">
                    <button class="btn btn-secondary" style="flex:1;" onclick="window.buildSaLabels()">✏️ ETICHETTA LE PARTI</button>
                    <button class="btn btn-primary btn-verify" style="flex:1;" onclick="window.checkSentenceAnalysis(${exercise.id})">✅ VERIFICA</button>
                </div>
            `;
        } else if (type === 'word-selector') {
            const textToSplit = exercise.sentence || exercise.text || "";
            const words = textToSplit.split(/(\s+)/);
            
            interactionHtml = `
                <div class="interactive-container" style="font-size: 1.4rem; line-height: 2.2; text-align: left; background: white; padding: 2.5rem; border-radius: 30px; border: 1px solid #eee; box-shadow: 0 10px 30px rgba(0,0,0,0.02); overflow-x: auto; -webkit-overflow-scrolling: touch;" id="word-selector-container">
                    ${words.map((w, i) => {
                        if (w.trim() === "") return w;
                        if (/^[.,\/#!$%\^&\*;:{}=\-_`~()]+$/.test(w)) return w;
                        
                        return `<span class="word-selector-span" onclick="window.toggleWordSelection(this)">${w}</span>`;
                    }).join('')}
                </div>
                <button class="btn btn-primary btn-verify" style="margin-top: 2rem; width: 100%;" onclick="window.checkWordSelectorAnswer(${exercise.id}, '${exercise.answer.replace(/'/g, "\\'")}')">VERIFICA SELEZIONE</button>
            `;
        } else {
            // Default: Multiple Choice
            interactionHtml = `
                <div class="options-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
                    ${(exercise.options || []).map(opt => `
                        <button class="btn btn-secondary" style="padding: 1.5rem; font-weight: 700;" onclick="checkAnswer('${opt.replace(/'/g, "\\'")}', '${exercise.answer.replace(/'/g, "\\'")}', '${exercise.category || 'grammatica'}', ${exercise.id})">${opt}</button>
                    `).join('')}
                </div>
            `;
        }


        // Handle discovery elements (theory, schema, examples) if they exist
        const parseMarkdown = (text) => {
            if (!text) return '';
            return text.replace(/\*\*(.*?)\*\*/g, `<span style="color: var(--primary-color); font-weight: bold;">$1</span>`);
        };

        let schemaHtml = '';
        if (exercise.schema) {
            schemaHtml = `
                <div class="theory-schema" style="margin-top: 1.5rem; background: #fff; padding: 1.5rem; border-radius: 15px; border: 1px solid #eee;">
                    ${exercise.schema.map(s => `
                        <div class="schema-row" style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid #f9f9f9;">
                            <span class="schema-label" style="color: var(--primary-color); font-weight: 800;">${s.label}</span>
                            <span style="font-weight: 700;">${s.value}</span>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        let examplesHtml = '';
        if (exercise.examples) {
            examplesHtml = `
                <div style="display: grid; grid-template-columns: 1fr; gap: 1rem; margin-top: 1.5rem;">
                    ${exercise.examples.map(ex => `
                        <div style="background: #fff9f0; padding: 1rem; border-radius: 15px; border: 1px dashed #ffa502; font-size: 0.95rem;">
                            <strong style="color: #ffa502;">ESEMPIO:</strong><br>${parseMarkdown(ex)}
                        </div>
                    `).join('')}
                </div>
            `;
        }

        const theorySection = exercise.theory ? `
            <div style="background: #f8f9fa; padding: 2rem; border-radius: 25px; margin-bottom: 2rem; border: 1px solid #eee;">
                <div style="font-size: 1.1rem; line-height: 1.8; color: #444;">${parseMarkdown(exercise.theory)}</div>
                ${schemaHtml}
                ${examplesHtml}
            </div>
        ` : '';

        return `
            <div class="exercise-container" style="position: relative;">
                <h2 class="exercise-title" style="font-size: 1.8rem; border-bottom: 3px solid var(--accent-color); padding-bottom: 5px; margin-bottom: 2rem; display: flex; align-items: center; justify-content: space-between;">
                    <span>${exercise.title || 'ESERCIZIO'}</span>
                    <span style="font-size: 1.3rem; font-weight: 700; color: #888; background: #eee; padding: 0.2rem 0.6rem; border-radius: 12px;">${window.currentExerciseIndex + 1}/${total}</span>
                </h2>
                ${theorySection}
                ${exercise.text && !['highlight', 'completion', 'classification-grid', 'word-selector', 'sentence-analysis'].includes(type) ? `<p style="font-size: 1.4rem; font-weight: 700; margin-bottom: 1.5rem; text-align: left; color: var(--primary-color);">${exercise.text}</p>` : ''}
                ${exercise.instruction ? `<p style="font-weight: 700; margin-bottom: 2rem; color: #555; background: #f0f7ff; padding: 1rem; border-radius: 10px; border-left: 4px solid var(--primary-color); text-align: justify;">${exercise.instruction}</p>` : ''}
                ${interactionHtml}
                ${path ? window.UI.renderNav(path, total) : ''}
            </div>
        `;

    },

    renderPunteggiatura: (exercise, isUda, path, total) => UI.renderInteractive(exercise, isUda, path, total),

    renderLettura: (exercise) => {
        const isMulti = exercise.questions && exercise.questions.length > 0;
        const headerImg = exercise.image ? `<img src="${exercise.image}" style="width: 100%; border-radius: 30px; margin-bottom: 2rem; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">` : '';
        
        let questionsHtml = '';
        if (isMulti) {
            if (!window.multiLetturaSelections) window.multiLetturaSelections = {};
            questionsHtml = exercise.questions.map((q, qIdx) => {
                return `
                    <div class="question-block" style="background: #fdfdfd; padding: 2.5rem; border-radius: 20px; border: 2px solid #eee; margin-bottom: 2rem; transition: all 0.3s ease;">
                        <p style="font-size: 1.2rem; font-weight: 800; margin-bottom: 1.5rem; color: var(--text-color);">🤔 ${qIdx + 1}. ${q.question}</p>
                        <div class="options-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;" id="q-container-${qIdx}">
                            ${q.options.map(opt => `
                                <button class="btn btn-secondary opt-btn-${qIdx}" style="padding: 1.2rem; font-size: 1.05rem; font-weight: 600; border-radius: 12px; border: 2px solid #eee; background: white;" onclick="UI.selectMultiLetturaOption(this, ${qIdx}, '${opt.replace(/'/g, "\\'")}')">${opt}</button>
                            `).join('')}
                        </div>
                        <button class="btn btn-primary btn-verify-card" id="verify-btn-${qIdx}" style="width: 100%; padding: 1.2rem; font-size: 1.1rem; font-weight: 800; margin-top: 1.5rem; border-radius: 12px;" onclick="UI.verifySingleCard(this, ${exercise.id}, ${qIdx}, '${q.answer.replace(/'/g, "\\'")}', ${exercise.questions.length})">VERIFICA</button>
                    </div>
                `;
            }).join('');
        } else {
            // Domanda singola: selezione + tasto VERIFICA
            questionsHtml = `
                <div style="background: #fdfdfd; padding: 2.5rem; border-radius: 20px; border: 2px solid #eee; margin-bottom: 2rem;">
                    <p style="font-size: 1.2rem; font-weight: 800; margin-bottom: 1.5rem; color: var(--text-color);">🤔 ${exercise.question}</p>
                    <div class="options-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;" id="single-lettura-container">
                        ${(exercise.options || []).map(opt => `
                            <button class="btn btn-secondary lettura-opt" style="padding: 1.2rem; font-size: 1.05rem; font-weight: 600; border-radius: 12px; border: 2px solid #eee; background: white;" onclick="UI.selectLetturaOption(this, '${opt.replace(/'/g, "\\'")}')">${opt}</button>
                        `).join('')}
                    </div>
                </div>
                <button class="btn btn-primary btn-verify" style="width: 100%; padding: 1.5rem; font-size: 1.25rem; font-weight: 800; margin-top: 1rem; border-radius: 20px; box-shadow: 0 10px 20px rgba(0,0,0,0.05);" onclick="UI.verifyLetturaAnswer(${exercise.id}, '${exercise.answer.replace(/'/g, "\\'")}')">VERIFICA LA RISPOSTA</button>
            `;
        }

        return `
            <div class="exercise-container">
                <div style="background: var(--primary-color); color: white; padding: 1rem; border-radius: 15px; margin-bottom: 2rem; font-weight: 800; text-align: center; letter-spacing: 2px;">📖 COMPRENSIONE DEL TESTO</div>
                <h2 class="exercise-title" style="margin-bottom: 2rem;">${exercise.title}</h2>
                ${headerImg}
                <div class="reading-text" style="margin-bottom: 3.5rem;">
                    ${(() => {
                        let text = exercise.text || '';
                        text = text.replace(/\\n/g, '\n');
                        const lines = text.split('\n');
                        let html = '';
                        let inList = false;
                        
                        lines.forEach(line => {
                            let trimmed = line.trim();
                            if (!trimmed) {
                                if (inList) {
                                    html += '</ul>';
                                    inList = false;
                                }
                                return;
                            }
                            
                            // Parse bold/italic
                            line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                            line = line.replace(/\*(.*?)\*/g, '<em>$1</em>');
                            
                            // Parse headings
                            if (trimmed.startsWith('###')) {
                                if (inList) { html += '</ul>'; inList = false; }
                                html += `<h3 style="color: var(--primary-color); margin-top: 2rem; margin-bottom: 1rem; font-size: 1.5rem; font-weight: bold;">${trimmed.replace(/^###\s*/, '')}</h3>`;
                            }
                            // Parse list items
                            else if (trimmed.startsWith('-') || trimmed.match(/^\d+\./)) {
                                if (!inList) {
                                    html += '<ul style="font-size: 1.25rem; line-height: 1.8; color: #2c3e50; font-weight: 500; margin-bottom: 1.5rem; padding-left: 2rem; list-style-type: none;">';
                                    inList = true;
                                }
                                if (trimmed.startsWith('-')) {
                                    html += `<li style="margin-bottom: 0.5rem; position: relative; padding-left: 1.5rem;"><span style="position: absolute; left: 0; color: var(--primary-color);">•</span>${line.replace(/^\s*-\s*/, '')}</li>`;
                                } else {
                                    html += `<li style="margin-bottom: 0.5rem;">${line}</li>`;
                                }
                            }
                            // Normal paragraph
                            else {
                                if (inList) { html += '</ul>'; inList = false; }
                                const wrappedLine = UI.wrapWordsForVocabulary(line);
                                html += `<p style="text-align: justify; font-size: 1.25rem; line-height: 1.8; color: #2c3e50; font-weight: 500; margin-bottom: 1.5rem;">${wrappedLine}</p>`;
                            }
                        });
                        
                        if (inList) html += '</ul>';
                        return html;
                    })()}
                </div>
                <div class="questions-stack">
                    ${questionsHtml}
                </div>
            </div>
        `;
    },

    renderSubMenu: (menuId, hierarchy) => {
        const menu = hierarchy[menuId];
        if (!menu) return '';
        
        if (menuId === 'generi') {
            if (!window.currentLetturaFilter) window.currentLetturaFilter = 'tutti-i-generi';
            if (!window.currentLetturaSort) window.currentLetturaSort = 'default';

            const genres = menu.items || [];
            
            let filterBarHtml = `
                <div class="filter-bar leitura-filters" style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 2rem; justify-content: center;">
                    <button class="filter-btn ${window.currentLetturaFilter === 'tutti-i-generi' ? 'active' : ''}" onclick="UI.setLetturaFilter('tutti-i-generi')" style="padding: 0.5rem 1rem; border-radius: 20px; border: 2px solid var(--primary-color); background: ${window.currentLetturaFilter === 'tutti-i-generi' ? 'var(--primary-color)' : 'white'}; color: ${window.currentLetturaFilter === 'tutti-i-generi' ? 'white' : 'var(--primary-color)'}; font-weight: 700; cursor: pointer;">TUTTI I GENERI</button>
                    <button class="filter-btn ${window.currentLetturaFilter === 'tutti-i-livelli' ? 'active' : ''}" onclick="UI.setLetturaFilter('tutti-i-livelli')" style="padding: 0.5rem 1rem; border-radius: 20px; border: 2px solid var(--primary-color); background: ${window.currentLetturaFilter === 'tutti-i-livelli' ? 'var(--primary-color)' : 'white'}; color: ${window.currentLetturaFilter === 'tutti-i-livelli' ? 'white' : 'var(--primary-color)'}; font-weight: 700; cursor: pointer;">TUTTI I LIVELLI</button>
                    <button class="filter-btn ${window.currentLetturaFilter === 'a1' ? 'active' : ''}" onclick="UI.setLetturaFilter('a1')" style="padding: 0.5rem 1rem; border-radius: 20px; border: 2px solid #2e7d32; background: ${window.currentLetturaFilter === 'a1' ? '#2e7d32' : 'white'}; color: ${window.currentLetturaFilter === 'a1' ? 'white' : '#2e7d32'}; font-weight: 700; cursor: pointer;">A1</button>
                    <button class="filter-btn ${window.currentLetturaFilter === 'a2' ? 'active' : ''}" onclick="UI.setLetturaFilter('a2')" style="padding: 0.5rem 1rem; border-radius: 20px; border: 2px solid #fbc02d; background: ${window.currentLetturaFilter === 'a2' ? '#fbc02d' : 'white'}; color: ${window.currentLetturaFilter === 'a2' ? 'white' : '#fbc02d'}; font-weight: 700; cursor: pointer;">A2</button>
                    <button class="filter-btn ${window.currentLetturaFilter === 'b1' ? 'active' : ''}" onclick="UI.setLetturaFilter('b1')" style="padding: 0.5rem 1rem; border-radius: 20px; border: 2px solid #1565c0; background: ${window.currentLetturaFilter === 'b1' ? '#1565c0' : 'white'}; color: ${window.currentLetturaFilter === 'b1' ? 'white' : '#1565c0'}; font-weight: 700; cursor: pointer;">B1</button>
                    <button class="filter-btn ${window.currentLetturaFilter === 'b2' ? 'active' : ''}" onclick="UI.setLetturaFilter('b2')" style="padding: 0.5rem 1rem; border-radius: 20px; border: 2px solid #7b1fa2; background: ${window.currentLetturaFilter === 'b2' ? '#7b1fa2' : 'white'}; color: ${window.currentLetturaFilter === 'b2' ? 'white' : '#7b1fa2'}; font-weight: 700; cursor: pointer;">B2</button>
                    <span style="border-left: 2px solid #ccc; margin: 0 0.5rem;"></span>
                    <button class="filter-btn ${window.currentLetturaSort === 'per-livello' ? 'active' : ''}" onclick="UI.setLetturaSort(window.currentLetturaSort === 'per-livello' ? 'default' : 'per-livello')" style="padding: 0.5rem 1rem; border-radius: 20px; border: 2px solid #2980b9; background: ${window.currentLetturaSort === 'per-livello' ? '#2980b9' : 'white'}; color: ${window.currentLetturaSort === 'per-livello' ? 'white' : '#2980b9'}; font-weight: 700; cursor: pointer;">PER GENERE</button>
                    <button class="filter-btn ${window.currentLetturaSort === 'a-z' ? 'active' : ''}" onclick="UI.setLetturaSort(window.currentLetturaSort === 'a-z' ? 'default' : 'a-z')" style="padding: 0.5rem 1rem; border-radius: 20px; border: 2px solid #666; background: ${window.currentLetturaSort === 'a-z' ? '#666' : 'white'}; color: ${window.currentLetturaSort === 'a-z' ? 'white' : '#666'}; font-weight: 700; cursor: pointer;">A-Z</button>
                    <button class="filter-btn ${window.currentLetturaSort === 'z-a' ? 'active' : ''}" onclick="UI.setLetturaSort(window.currentLetturaSort === 'z-a' ? 'default' : 'z-a')" style="padding: 0.5rem 1rem; border-radius: 20px; border: 2px solid #666; background: ${window.currentLetturaSort === 'z-a' ? '#666' : 'white'}; color: ${window.currentLetturaSort === 'z-a' ? 'white' : '#666'}; font-weight: 700; cursor: pointer;">Z-A</button>
                </div>
            `;

            let contentHtml = '';

            if (window.currentLetturaFilter === 'tutti-i-generi') {
                let sortedGenres = [...genres];
                if (window.currentLetturaSort === 'a-z') {
                    sortedGenres.sort((a, b) => a.title.localeCompare(b.title));
                } else if (window.currentLetturaSort === 'z-a') {
                    sortedGenres.sort((a, b) => b.title.localeCompare(a.title));
                } // default and per-livello keep original order

                contentHtml = `
                    <div class="list-menu">
                        ${sortedGenres.map(item => `
                            <div class="list-item" onclick="navigateTo('generi', '${item.id}')">
                                <div style="display: flex; align-items: center;">
                                    <span style="font-size: 1.8rem; margin-right: 1.5rem;">${item.icon || '🎯'}</span>
                                    <span style="font-weight: 700; color: var(--text-color); font-size: 1.1rem;">${item.title}</span>
                                </div>
                                <span style="color: var(--primary-color); font-weight: 800;">➜</span>
                            </div>
                        `).join('')}
                    </div>
                `;
            } else if (window.currentLetturaFilter === 'tutti-i-livelli') {
                const levels = ['a1', 'a2', 'b1', 'b2'];
                const levelNames = { a1: 'Livello A1 (Facile)', a2: 'Livello A2 (Intermedio)', b1: 'Livello B1 (Difficile)', b2: 'Livello B2 (Avanzato)' };
                const levelIcons = { a1: '🟢', a2: '🟡', b1: '🔵', b2: '🟣' };

                contentHtml = `
                    <div class="list-menu">
                        ${levels.map(lvl => `
                            <div class="list-item" onclick="UI.setLetturaFilter('${lvl}')">
                                <div style="display: flex; align-items: center;">
                                    <span style="font-size: 1.8rem; margin-right: 1.5rem;">${levelIcons[lvl]}</span>
                                    <span style="font-weight: 700; color: var(--text-color); font-size: 1.1rem;">${levelNames[lvl]}</span>
                                </div>
                                <span style="color: var(--primary-color); font-weight: 800;">➜</span>
                            </div>
                        `).join('')}
                    </div>
                `;
            } else {
                const lvl = window.currentLetturaFilter;
                let texts = [];
                const gData = window.exercisesData.lettura.generi;
                const genreItems = hierarchy['generi']?.items || [];
                for (const item of genreItems) {
                    const gKey = item.id;
                    if (gData[gKey] && gData[gKey][lvl]) {
                        gData[gKey][lvl].forEach((ex, index) => {
                            texts.push({
                                genreId: gKey,
                                genreTitle: item.title,
                                icon: item.icon || '📖',
                                title: ex.title,
                                index: index,
                                level: lvl
                            });
                        });
                    }
                }

                if (window.currentLetturaSort === 'a-z') {
                    texts.sort((a, b) => a.title.localeCompare(b.title));
                } else if (window.currentLetturaSort === 'z-a') {
                    texts.sort((a, b) => b.title.localeCompare(a.title));
                } // default and per-livello keep original genre order

                contentHtml = `
                    <div class="levels-list" style="display: flex; flex-direction: column; gap: 1rem;">
                        ${texts.map(txt => `
                            <div class="level-row" onclick="localStorage.setItem('progress_${txt.genreId}_${lvl}_null_null', '${txt.index}'); navigateTo('${txt.genreId}', '${lvl}')">
                                <span style="font-size: 1.2rem; margin-right: 1.5rem;">${txt.icon}</span>
                                <span style="font-weight: 700; flex-grow: 1;">${txt.title} <span style="font-size: 0.8rem; color: #888; margin-left: 0.5rem;">(${txt.genreTitle})</span></span>
                                <span style="color: var(--primary-color); font-weight: 800;">➜</span>
                            </div>
                        `).join('')}
                    </div>
                `;
            }

            return `
                <div class="exercise-container">
                    <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 3rem;">
                        <h2 class="exercise-title" style="margin: 0; font-size: 1.8rem;">${menu.title}</h2>
                    </div>
                    ${filterBarHtml}
                    ${contentHtml}
                </div>
            `;
        }
        
        // Mappe colori per i livelli (Verde, Giallo, Blu, Viola)
        const colorMap = {
            'verde': '#e8f5e9',
            'giallo': '#fffde7',
            'blu': '#e3f2fd',
            'viola': '#f3e5f5'
        };
        const colorAccent = {
            'verde': '#2e7d32',
            'giallo': '#fbc02d',
            'blu': '#1565c0',
            'viola': '#7b1fa2'
        };

        const isDeep = ['variabili', 'invariabili', 'descrizione', 'grammaticale', 'lessico', 'antologiche', 'fonologia', 'ortografia', 'analisiLogica', 'analisiPeriodo', 'generi'].includes(menuId);
        
        const content = isDeep ? 
            `<div class="list-menu">
                ${menu.items.map(item => {
                    const itemStyle = item.color ? `style="background-color: ${colorMap[item.color] || item.color}; border-left: 5px solid ${colorAccent[item.color] || item.color};"` : '';
                    return `
                    <div class="list-item" onclick="navigateTo('${menuId}', '${item.id}')" ${itemStyle}>
                        <div class="list-item-content">
                            <span class="list-item-icon">${item.icon || '🎯'}</span>
                            <span class="list-item-title">${item.title}</span>
                        </div>
                        <span class="list-item-arrow">➜</span>
                    </div>
                `}).join('')}
            </div>` : 
            `<div class="materie-grid">
                ${menu.items.map(item => {
                    const bgColorClass = item.color || 'default';
                    return `
                    <div class="materia-card ${bgColorClass}" onclick="navigateTo('${menuId}', '${item.id}')">
                        <span class="materia-icon">${item.icon}</span>
                        <h3 class="materia-title">${item.title}</h3>
                    </div>`;
                }).join('')}
            </div>`;

        const backTarget = menu.parent || 'home';
        return `
            <div class="exercise-container">
                <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 3rem;">
                    <h2 class="exercise-title" style="margin: 0; font-size: 1.8rem;">${menu.title}</h2>
                </div>
                ${content}
            </div>
        `;
    },

    renderSectionMenu: (sectionId, hierarchy, data) => {
        const section = hierarchy[sectionId];
        const title = (section && section.title) ? section.title.toUpperCase() : sectionId.toUpperCase();
        if (!data) return `<div class="exercise-container"><h2>OPS!</h2><p>Contenuto non disponibile.</p><button class="btn btn-primary" onclick="navigateTo('home')">TORNA ALLA HOME</button></div>`;
        
        const levels = Object.keys(data);
        const levelIcons = { a1: '🟢', a2: '🟡', b1: '🔵', b2: '🟣', facile: '🟢', intermedio: '🟡', difficile: '🔵', avanzato: '🟣' };
        
        const colorAccent = {
            'facile': '#2e7d32',
            'intermedio': '#fbc02d',
            'difficile': '#1565c0',
            'avanzato': '#7b1fa2',
            'a1': '#2e7d32',
            'a2': '#fbc02d',
            'b1': '#1565c0',
            'b2': '#7b1fa2'
        };

        if (sectionId === 'antologiche') {
            if (!window.currentAntologicheFilter) window.currentAntologicheFilter = 'all';
            if (!window.currentAntologicheSort) window.currentAntologicheSort = 'a-z';

            let filterBarHtml = `
                <div class="filter-bar antologiche-filters" style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 2rem; justify-content: center;">
                    <button class="filter-btn ${window.currentAntologicheFilter === 'all' ? 'active' : ''}" onclick="UI.setAntologicheFilter('all')" style="padding: 0.5rem 1rem; border-radius: 20px; border: 2px solid var(--primary-color); background: ${window.currentAntologicheFilter === 'all' ? 'var(--primary-color)' : 'white'}; color: ${window.currentAntologicheFilter === 'all' ? 'white' : 'var(--primary-color)'}; font-weight: 700; cursor: pointer;">TUTTI I LIVELLI</button>
                    <button class="filter-btn ${window.currentAntologicheFilter === 'a1' ? 'active' : ''}" onclick="UI.setAntologicheFilter('a1')" style="padding: 0.5rem 1rem; border-radius: 20px; border: 2px solid #2e7d32; background: ${window.currentAntologicheFilter === 'a1' ? '#2e7d32' : 'white'}; color: ${window.currentAntologicheFilter === 'a1' ? 'white' : '#2e7d32'}; font-weight: 700; cursor: pointer;">A1</button>
                    <button class="filter-btn ${window.currentAntologicheFilter === 'a2' ? 'active' : ''}" onclick="UI.setAntologicheFilter('a2')" style="padding: 0.5rem 1rem; border-radius: 20px; border: 2px solid #fbc02d; background: ${window.currentAntologicheFilter === 'a2' ? '#fbc02d' : 'white'}; color: ${window.currentAntologicheFilter === 'a2' ? 'white' : '#fbc02d'}; font-weight: 700; cursor: pointer;">A2</button>
                    <button class="filter-btn ${window.currentAntologicheFilter === 'b1' ? 'active' : ''}" onclick="UI.setAntologicheFilter('b1')" style="padding: 0.5rem 1rem; border-radius: 20px; border: 2px solid #1565c0; background: ${window.currentAntologicheFilter === 'b1' ? '#1565c0' : 'white'}; color: ${window.currentAntologicheFilter === 'b1' ? 'white' : '#1565c0'}; font-weight: 700; cursor: pointer;">B1</button>
                    <button class="filter-btn ${window.currentAntologicheFilter === 'b2' ? 'active' : ''}" onclick="UI.setAntologicheFilter('b2')" style="padding: 0.5rem 1rem; border-radius: 20px; border: 2px solid #7b1fa2; background: ${window.currentAntologicheFilter === 'b2' ? '#7b1fa2' : 'white'}; color: ${window.currentAntologicheFilter === 'b2' ? 'white' : '#7b1fa2'}; font-weight: 700; cursor: pointer;">B2</button>
                </div>
            `;

            let contentHtml = '';
            const activeLvl = window.currentAntologicheFilter;

            contentHtml = `
                <div class="all-levels-container">
                    ${levels.filter(lvl => activeLvl === 'all' || activeLvl === lvl).map(lvl => {
                        let sortedExercises = [...(data[lvl] || [])];

                        return `
                            <div class="level-group" data-level="${lvl}">
                                <h3 class="level-header" style="color: ${colorAccent[lvl] || 'var(--primary-color)'}; font-weight: 800; margin-bottom: 1rem; border-bottom: 2px solid #eee; padding-bottom: 0.5rem;">${levelIcons[lvl] || ''} LIVELLO ${lvl.toUpperCase()}</h3>
                                <div class="levels-list" style="display: flex; flex-direction: column; gap: 1rem;">
                                    ${sortedExercises.map((ex, index) => `
                                        <div class="level-row" onclick="localStorage.setItem('progress_${sectionId}_${lvl}_null_null', '${index}'); navigateTo('${sectionId}', '${lvl}')">
                                            <span style="font-size: 1.2rem; margin-right: 1.5rem;">${levelIcons[lvl]}</span>
                                            <span style="font-weight: 700; flex-grow: 1;">${ex.title}</span>
                                            <span style="color: var(--primary-color); font-weight: 800;">➜</span>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            `;

            return `
                <div class="exercise-container">
                    <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 3rem;">
                        <h2 class="exercise-title" style="margin: 0; font-size: 1.8rem;">${title}</h2>
                    </div>
                    ${filterBarHtml}
                    ${contentHtml}
                </div>
            `;
        }

        return `
            <div class="exercise-container">
                <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 3rem;">
                    <h2 class="exercise-title" style="margin: 0; font-size: 1.8rem;">${title}</h2>
                </div>

                <div class="filter-bar">
                    <button class="filter-btn active" onclick="UI.filterLevels('all')">TUTTI I LIVELLI</button>
                    ${levels.map(l => `<button class="filter-btn" onclick="UI.filterLevels('${l}')">${l.toUpperCase()}</button>`).join('')}
                </div>

                <div class="all-levels-container">
                    ${levels.map(lvl => `
                        <div class="level-group" data-level="${lvl}">
                            <h3 class="level-header" style="color: ${colorAccent[lvl] || 'var(--primary-color)'}; font-weight: 800; margin-bottom: 1rem; border-bottom: 2px solid #eee; padding-bottom: 0.5rem;">${levelIcons[lvl] || ''} LIVELLO ${lvl.toUpperCase()}</h3>
                            <div class="levels-list" style="display: flex; flex-direction: column; gap: 1rem;">
                                ${Array.isArray(data[lvl]) ? data[lvl].map((ex, index) => `
                                    <div class="level-row" onclick="localStorage.setItem('progress_${sectionId}_${lvl}_null_null', '${index}'); navigateTo('${window.currentSection}', '${sectionId}', '${lvl}')">

                                        <span style="font-size: 1.2rem; margin-right: 1.5rem;">${levelIcons[lvl]}</span>
                                        <span style="font-weight: 700; flex-grow: 1;">${ex.title}</span>
                                        <span style="color: var(--primary-color); font-weight: 800;">➜</span>
                                    </div>
                                `).join('') : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    filterLevels: (level) => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        if (event) event.target.classList.add('active');
        document.querySelectorAll('.level-group').forEach(g => {
            g.style.display = (level === 'all' || g.getAttribute('data-level') === level) ? 'block' : 'none';
        });
    },

    // --- NUOVI RENDERERS PER UNITA' DI APPRENDIMENTO ---

    renderUdaMenu: (udaId, fullPath) => {
        // Mostra le 4 tappe dell'Unità di Apprendimento
        const udaNumMatch = udaId.match(/\d+/);
        const udaNum = udaNumMatch ? udaNumMatch[0] : udaId;
        
        let topicTitle = `Unità ${udaNum}`;
        const currentUda = window.MATERIE_HIERARCHY[udaId];
        let prevSibling = null;
        let nextSibling = null;
        if (currentUda && currentUda.parent) {
            const parent = window.MATERIE_HIERARCHY[currentUda.parent];
            if (parent && parent.items) {
                const item = parent.items.find(i => i.id === udaId);
                if (item) topicTitle = item.title;
                
                const siblingIndex = parent.items.findIndex(i => i.id === udaId);
                if (siblingIndex > 0) prevSibling = parent.items[siblingIndex - 1];
                if (siblingIndex < parent.items.length - 1) nextSibling = parent.items[siblingIndex + 1];
            }
        }
        
        if (udaId === 'uda3') {
            return `
                <div class="exercise-container">
                    <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 3rem;">
                        <h2 class="exercise-title" style="margin: 0; font-size: 1.8rem;">📘 ${topicTitle}</h2>
                    </div>
                    
                    <p style="text-align: center; font-size: 1.2rem; margin-bottom: 3rem;">Scegli la fase da affrontare:</p>
                    
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem;">
                        <div class="menu-card" onclick="navigateTo('${udaId}', 'scopri')" style="background: linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%); padding: 2.5rem; grid-column: 1 / -1; position: relative;">
                            ${localStorage.getItem(`concluded_${udaId}/scopri//`) === 'true' ? '<div style="position:absolute; top:15px; right:25px; font-size:1.4rem; color:#27ae60; font-weight:800;">✔️ COMPLETATO</div>' : ''}
                            <div class="icon" style="font-size: 3rem; margin-bottom: 1.5rem;">🧭</div>
                            <h3 style="font-size: 1.6rem; margin-bottom: 0.5rem;">SCOPRI</h3>
                            <p style="font-size: 1.1rem;">Teoria guidata e schede interattive</p>
                        </div>
                        
                        <div class="menu-card" onclick="navigateTo('uda3_1', 'allenati')" style="background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%); padding: 1.5rem; position: relative;">
                            ${localStorage.getItem('concluded_uda3_1/allenati//') === 'true' ? '<div style="position:absolute; top:8px; right:12px; font-size:1.1rem; color:#27ae60;">✔️</div>' : ''}
                            <div class="icon" style="font-size: 2rem; margin-bottom: 1rem;">✍️</div>
                            <h3 style="font-size: 1.3rem; margin-bottom: 0.2rem;">ALLENATI</h3>
                            <p style="font-size: 0.95rem; font-weight: 600; color: #d35400;">Suoni e grafemi</p>
                        </div>
                        
                        <div class="menu-card" onclick="navigateTo('uda3_2', 'allenati')" style="background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%); padding: 1.5rem; position: relative;">
                            ${localStorage.getItem('concluded_uda3_2/allenati//') === 'true' ? '<div style="position:absolute; top:8px; right:12px; font-size:1.1rem; color:#27ae60;">✔️</div>' : ''}
                            <div class="icon" style="font-size: 2rem; margin-bottom: 1rem;">✍️</div>
                            <h3 style="font-size: 1.3rem; margin-bottom: 0.2rem;">ALLENATI</h3>
                            <p style="font-size: 0.95rem; font-weight: 600; color: #d35400;">La sillaba</p>
                        </div>

                        <div class="menu-card" onclick="navigateTo('uda3_3', 'allenati')" style="background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%); padding: 1.5rem; position: relative;">
                            ${localStorage.getItem('concluded_uda3_3/allenati//') === 'true' ? '<div style="position:absolute; top:8px; right:12px; font-size:1.1rem; color:#27ae60;">✔️</div>' : ''}
                            <div class="icon" style="font-size: 2rem; margin-bottom: 1rem;">✍️</div>
                            <h3 style="font-size: 1.3rem; margin-bottom: 0.2rem;">ALLENATI</h3>
                            <p style="font-size: 0.95rem; font-weight: 600; color: #d35400;">L'accento</p>
                        </div>

                        <div class="menu-card" onclick="navigateTo('uda3_4', 'allenati')" style="background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%); padding: 1.5rem; position: relative;">
                            ${localStorage.getItem('concluded_uda3_4/allenati//') === 'true' ? '<div style="position:absolute; top:8px; right:12px; font-size:1.1rem; color:#27ae60;">✔️</div>' : ''}
                            <div class="icon" style="font-size: 2rem; margin-bottom: 1rem;">✍️</div>
                            <h3 style="font-size: 1.3rem; margin-bottom: 0.2rem;">ALLENATI</h3>
                            <p style="font-size: 0.95rem; font-weight: 600; color: #d35400;">Elisione e troncamento</p>
                        </div>

                        <div class="menu-card" onclick="navigateTo('uda3_5', 'allenati')" style="background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%); padding: 1.5rem; position: relative;">
                            ${localStorage.getItem('concluded_uda3_5/allenati//') === 'true' ? '<div style="position:absolute; top:8px; right:12px; font-size:1.1rem; color:#27ae60;">✔️</div>' : ''}
                            <div class="icon" style="font-size: 2rem; margin-bottom: 1rem;">✍️</div>
                            <h3 style="font-size: 1.3rem; margin-bottom: 0.2rem;">ALLENATI</h3>
                            <p style="font-size: 0.95rem; font-weight: 600; color: #d35400;">La punteggiatura</p>
                        </div>

                        <div class="menu-card" onclick="navigateTo('uda3_6', 'allenati')" style="background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%); padding: 1.5rem; position: relative;">
                            ${localStorage.getItem('concluded_uda3_6/allenati//') === 'true' ? '<div style="position:absolute; top:8px; right:12px; font-size:1.1rem; color:#27ae60;">✔️</div>' : ''}
                            <div class="icon" style="font-size: 2rem; margin-bottom: 1rem;">✍️</div>
                            <h3 style="font-size: 1.3rem; margin-bottom: 0.2rem;">ALLENATI</h3>
                            <p style="font-size: 0.95rem; font-weight: 600; color: #d35400;">L'uso dell'H</p>
                        </div>

                        <div class="menu-card" onclick="navigateTo('uda3_7', 'allenati')" style="background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%); padding: 1.5rem; position: relative;">
                            ${localStorage.getItem('concluded_uda3_7/allenati//') === 'true' ? '<div style="position:absolute; top:8px; right:12px; font-size:1.1rem; color:#27ae60;">✔️</div>' : ''}
                            <div class="icon" style="font-size: 2rem; margin-bottom: 1rem;">✍️</div>
                            <h3 style="font-size: 1.3rem; margin-bottom: 0.2rem;">ALLENATI</h3>
                            <p style="font-size: 0.95rem; font-weight: 600; color: #d35400;">Le consonanti doppie</p>
                        </div>
                    </div>
                    <div style="text-align: center; margin-top: 3rem;">
                        <button class="btn" style="background: none; color: #888; border: 1px solid #eee; padding: 0.8rem 1.5rem; font-size: 0.9rem; border-radius: 12px; cursor: pointer; transition: all 0.3s;" onmouseover="this.style.background='#f0f0f0'; this.style.color='#555'" onmouseout="this.style.background='none'; this.style.color='#888'" onclick="navigateTo('${currentUda ? currentUda.parent : ''}')">
                            ↩️ Torna al menù delle lezioni
                        </button>
                    </div>
                </div>
            `;
        }
        
        const data = getExerciseData(fullPath);
        const phases = [
            { id: 'scopri', title: 'SCOPRI', icon: '🧭', color: '#e0f7fa', desc: 'Teoria guidata e schede interattive' },
            { id: 'allenati', title: 'ALLENATI', icon: '🏋️', color: '#fff3e0', desc: 'Esercizi e sfide di consolidamento' }
        ];

        const availablePhases = phases.filter(p => {
            const pData = data[p.id];
            return pData && (
                (Array.isArray(pData) && pData.length > 0) || 
                (pData.exercises && pData.exercises.length > 0) ||
                (pData.questions && pData.questions.length > 0)
            );
        });

        return `
            <div class="exercise-container">
                <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 3rem;">
                    <h2 class="exercise-title" style="margin: 0; font-size: 1.8rem;">📘 ${topicTitle}</h2>
                </div>
                
                <p style="text-align: center; font-size: 1.2rem; margin-bottom: 3rem;">Scegli la fase da affrontare:</p>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem;">
                    ${availablePhases.map(p => `
                        <div class="menu-card" onclick="navigateTo('${udaId}', '${p.id}')" style="background: ${p.color}; padding: 2rem; position: relative;">
                            ${localStorage.getItem(`concluded_${udaId}/${p.id}//`) === 'true' ? '<div style="position:absolute; top:15px; right:20px; font-size:1.2rem; color:#27ae60;">✔️</div>' : ''}
                            <div class="icon" style="font-size: 2.5rem; margin-bottom: 1rem;">${p.icon}</div>
                            <h3 style="font-size: 1.5rem; margin-bottom: 0.5rem;">${p.title}</h3>
                            <p style="font-size: 1rem; opacity: 0.8;">${p.desc}</p>
                        </div>
                    `).join('')}
                </div>
                <div style="text-align: center; margin-top: 3rem;">
                    <button class="btn" style="background: none; color: #888; border: 1px solid #eee; padding: 0.8rem 1.5rem; font-size: 0.9rem; border-radius: 12px; cursor: pointer; transition: all 0.3s;" onmouseover="this.style.background='#f0f0f0'; this.style.color='#555'" onmouseout="this.style.background='none'; this.style.color='#888'" onclick="navigateTo('${currentUda ? currentUda.parent : ''}')">
                        ↩️ Torna al menù delle lezioni
                    </button>
                </div>
            </div>
        `;
    },

    renderScopri: (exercise, path, total) => {
        const parseMarkdown = (text) => {
            if (!text) return '';
            // Match the site's standard: colors are handled in the JSON, 
            // but we'll support ** for quick bolding if needed, using the primary color.
            return text.replace(/\*\*(.*?)\*\*/g, `<span style="color: var(--primary-color); font-weight: bold;">$1</span>`);
        };

        let schemaHtml = '';
        if (exercise.schema) {
            schemaHtml = `
                <div class="theory-schema">
                    <h4 style="color: var(--primary-color); margin-bottom: 1.5rem; font-weight: 800;">📊 LO SCHEMA</h4>
                    ${exercise.schema.map(s => `
                        <div class="schema-row">
                            <span class="schema-label">${s.label}</span>
                            <span style="font-weight: 700;">${s.value}</span>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        let examplesHtml = '';
        if (exercise.examples) {
            examplesHtml = `
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1.5rem;">
                    ${exercise.examples.map(ex => `
                        <div style="background: #fff9f0; padding: 1rem; border-radius: 15px; border: 1px dashed #ffa502; font-size: 0.95rem;">
                            <strong style="color: #ffa502;">ESEMPIO:</strong><br>${parseMarkdown(ex)}
                        </div>
                    `).join('')}
                </div>
            `;
        }

        const isMulti = exercise.questions && exercise.questions.length > 0;
        let questionArea = '';

        if (isMulti) {
            questionArea = `
                <div style="background: #f8f9fa; padding: 2rem; border-radius: 30px; border: 1px solid #eee; margin-top: 1rem;">
                    <p style="font-weight: 800; color: var(--primary-color); margin-bottom: 2rem; font-size: 1.1rem; text-transform: uppercase;">📋 ${exercise.instruction || 'ELENCO ESERCIZI'}:</p>
                    <div class="questions-stack">
                        ${exercise.questions.map((q, qIdx) => {
                            const isAnswered = qIdx < window.currentSubQuestionIndex;
                            const isCurrent = qIdx === window.currentSubQuestionIndex;
                            const style = isAnswered ? 'opacity: 0.5;' : (isCurrent ? 'border: 2px solid var(--primary-color);' : 'opacity: 0.8;');
                            
                            return `
                                <div class="question-block" style="background: white; padding: 1.5rem; border-radius: 20px; border: 1px solid #eee; margin-bottom: 1.5rem; ${style}">
                                    <div style="display: flex; gap: 1rem; align-items: flex-start; margin-bottom: 1rem;">
                                        <span style="background: ${isAnswered ? '#27ae60' : 'var(--primary-color)'}; color: white; min-width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border-radius: 50%; font-weight: 800; font-size: 0.9rem;">${isAnswered ? '✓' : qIdx + 1}</span>
                                        <p style="font-size: 1.2rem; font-weight: 700; margin: 0; color: var(--text-color);">${parseMarkdown(q.question)}</p>
                                    </div>
                                    ${isCurrent ? `
                                        <div class="options-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                                            ${(q.options || []).map(opt => `
                                                <button class="btn btn-secondary" style="padding: 1rem; font-weight: 600;" onclick="checkSubAnswer('${opt.replace(/'/g, "\\'")}', '${q.answer.replace(/'/g, "\\'")}', ${exercise.id})">${opt}</button>
                                            `).join('')}
                                        </div>
                                    ` : ''}
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;
        } else {
            questionArea = `
                <h3 style="font-weight: 800; margin-bottom: 1.5rem; text-align: center;">${parseMarkdown(exercise.text)}</h3>
                <div class="options-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
                    ${(exercise.options || []).map(opt => `
                        <button class="btn btn-secondary" style="padding: 1.5rem;" onclick="checkAnswer('${opt.replace(/'/g, "\\'")}', '${exercise.answer.replace(/'/g, "\\'")}', 'scopri', ${exercise.id})">${opt}</button>
                    `).join('')}
                </div>
            `;
        }

        return `
            <div class="exercise-container" style="position: relative;">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 2rem;">
                    <span style="font-weight: 800; color: var(--primary-color);">🧭 SCOPRI</span>
                    <span style="font-size: 1.2rem; font-weight: 800; color: #888; background: #eee; padding: 0.3rem 0.8rem; border-radius: 12px;">${window.currentExerciseIndex + 1}/${total}</span>
                </div>
                ${exercise.theory ? `
                    <div style="background: #f8f9fa; padding: 2.5rem; border-radius: 30px; margin-bottom: 2rem; border: 1px solid #eee;">
                        <p style="font-size: 1.2rem; line-height: 1.8;">${parseMarkdown(exercise.theory)}</p>
                        ${schemaHtml}
                        ${examplesHtml}
                    </div>
                ` : ''}
                ${questionArea}
                ${window.UI.renderNav(path, total)}
            </div>
        `;
    },

    renderAllenati: (exercise, path, total) => {
        return `
            <div class="exercise-container" style="position: relative;">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 2rem;">
                    <span style="font-weight: 800; color: #f39c12;">🏋️ ALLENATI</span>
                    <span style="font-size: 1.2rem; font-weight: 800; color: #888; background: #eee; padding: 0.3rem 0.8rem; border-radius: 12px;">${window.currentExerciseIndex + 1}/${total}</span>
                </div>
                <div style="background: white; padding: 3rem; border-radius: 30px; margin-bottom: 2rem; text-align: center; border: 2px dashed #f39c12;">
                    <span style="font-size: 2rem; font-weight: 800;">${exercise.word || exercise.text}</span>
                </div>
                <div class="options-grid" style="display: grid; grid-template-columns: 1fr; gap: 1rem;">
                    ${(exercise.options || []).map(opt => `
                        <button class="btn btn-secondary" style="padding: 1rem;" onclick="checkAnswer('${opt.replace(/'/g, "\\'")}', '${exercise.answer.replace(/'/g, "\\'")}', 'allenati', ${exercise.id})">${opt}</button>
                    `).join('')}
                </div>
                ${window.UI.renderNav(path, total)}
            </div>
        `;
    },

    renderVerifica: (exercise, path, total) => {
        return `
            <div class="exercise-container" style="position: relative;">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 2rem;">
                    <span style="font-weight: 800; color: #3f51b5;">🧪 VERIFICA</span>
                    <span style="font-size: 1.2rem; font-weight: 800; color: #888; background: #eee; padding: 0.3rem 0.8rem; border-radius: 12px;">${window.currentExerciseIndex + 1}/${total}</span>
                </div>
                <h3 style="font-weight: 800; margin-bottom: 2rem; text-align: center; font-size: 1.6rem;">${exercise.text}</h3>
                <div class="options-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
                    ${(exercise.options || []).map(opt => `
                        <button class="btn btn-secondary" style="padding: 1.5rem; background: #e8eaf6; color: #3f51b5;" onclick="checkAnswer('${opt.replace(/'/g, "\\'")}', '${exercise.answer.replace(/'/g, "\\'")}', 'verifica', ${exercise.id})">${opt}</button>
                    `).join('')}
                </div>
                ${window.UI.renderNav(path, total)}
            </div>
        `;
    },

    renderRecupera: (data, path) => {
        const recupera = data.recupera || data;
        if (!recupera || (!recupera.exercises && !recupera.content)) return UI.renderUdaPhaseEnd('recupera', 100, false, path);

        // Se siamo nel recupero, mostriamo un esercizio alla volta o la teoria
        const exercise = recupera.exercises[window.currentExerciseIndex] || null;
        
        if (!exercise) {
            return `
                <div class="exercise-container" style="text-align: center;">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">🚑</div>
                    <h2 style="font-size: 2rem; margin-bottom: 1.5rem;">${recupera.title}</h2>
                    <div style="background: #fff0f0; padding: 2rem; border-radius: 20px; margin-bottom: 2rem; border-left: 5px solid #e74c3c; text-align: left;">
                        <p style="font-size: 1.2rem; line-height: 1.8;">${recupera.content}</p>
                    </div>
                    <button class="btn btn-primary" style="width: 100%;" onclick="window.currentExerciseIndex = 0; loadUdaPhase(['${path.join("','")}'])">INIZIA ESERCIZI DI RECUPERO ➜</button>
                </div>
            `;
        }

        return UI.renderInteractive(exercise, true, path, recupera.exercises.length);
    },

    renderUdaPhaseEnd: (phase, score, needsRecupero, path) => {
        let title = "ALLENAMENTO COMPLETATO!";
        let text = "Ottimo lavoro! Hai terminato tutti gli esercizi previsti.";
        let color = "var(--primary-color)";
        
        if (phase === 'scopri') {
            title = "WARM UP COMPLETATO! 🧘";
            text = "";
        } else if (phase === 'allenati') {
            title = "WORKOUT COMPLETATO! 🏋️‍♂️";
            text = "Ottima resistenza! Hai completato la sessione di allenamento.";
        } else if (phase === 'verifica') {
            title = score >= 70 ? "SERIE SUPERATA! 🏆" : "SERIE INCOMPLETA... 🛑";
            text = score >= 70 ? `Complimenti! Performance del ${score}%.` : `Precisione al ${score}%. Ti consigliamo un recupero.`;
            color = score >= 70 ? 'var(--primary-color)' : '#e74c3c';
        }

        // --- LOGICA DI NAVIGAZIONE CONTINUA ---
        let nextPhaseBtn = '';
        let nextUdaBtn = '';
        
        if (path && path.length >= 2) {
            const currentUdaId = path[path.length - 2];
            const phases = ['scopri', 'allenati'];
            const nextPhaseIndex = phases.indexOf(phase) + 1;
            let foundNextPhase = false;

            // Cerchiamo se esiste una fase successiva con contenuti
            if (nextPhaseIndex > 0 && nextPhaseIndex < phases.length) {
                for (let i = nextPhaseIndex; i < phases.length; i++) {
                    const candidatePhase = phases[i];
                    const candidatePath = [...path.slice(0, -1), candidatePhase];
                    const data = typeof getExerciseData === 'function' ? getExerciseData(candidatePath) : null;
                    
                    const hasContent = data && !data.error && (
                        (Array.isArray(data) && data.length > 0) || 
                        (data.exercises && data.exercises.length > 0) ||
                        (data.questions && data.questions.length > 0) ||
                        (typeof data === 'object' && !Array.isArray(data) && Object.keys(data).length > 0)
                    );

                    if (hasContent) {
                        nextPhaseBtn = `
                            <button class="btn" style="background: #27ae60; color: white; width: 100%; padding: 1.2rem; border-radius: 20px; font-weight: 800; margin-top: 1rem; border: none; cursor: pointer;" 
                                    onclick="window.currentExerciseIndex = 0; loadUdaPhase(['${candidatePath.join("','")}'])">
                                CONTINUA L'ALLENAMENTO ➜
                            </button>`;
                        foundNextPhase = true;
                        break;
                    }
                }
            }

            // Se non c'è una fase successiva, cerchiamo la prossima UDA
            if (!foundNextPhase) {
                const parentId = window.MATERIE_HIERARCHY && window.MATERIE_HIERARCHY[currentUdaId]?.parent;
                if (parentId && window.MATERIE_HIERARCHY[parentId]?.items) {
                    const items = window.MATERIE_HIERARCHY[parentId].items;
                    const currentIndex = items.findIndex(item => item.id === currentUdaId);
                    if (currentIndex !== -1 && currentIndex < items.length - 1) {
                        const nextId = items[currentIndex + 1].id;
                        nextUdaBtn = `
                            <button class="btn" style="background: var(--primary-color); color: white; width: 100%; padding: 1.2rem; border-radius: 20px; font-weight: 800; margin-top: 1rem; border: none; cursor: pointer;" 
                                    onclick="navigateTo('${nextId}', 'scopri')">
                                PROCEDI ALLA PROSSIMA SEZIONE ➜<br><span style="font-size: 0.85rem; font-weight: 400; opacity: 0.85; display: block; margin-top: 0.2rem;">(vai all'unità successiva)</span>
                            </button>`;
                    }
                } else {
                    // Fallback numerico
                    const match = currentUdaId.match(/(\D+)(\d+)/);
                    if (match) {
                        const prefix = match[1];
                        const nextNum = parseInt(match[2]) + 1;
                        const nextId = prefix + nextNum;
                        if (window.MATERIE_HIERARCHY && window.MATERIE_HIERARCHY[nextId]) {
                            nextUdaBtn = `
                                <button class="btn" style="background: var(--primary-color); color: white; width: 100%; padding: 1.2rem; border-radius: 20px; font-weight: 800; margin-top: 1rem; border: none; cursor: pointer;" 
                                        onclick="navigateTo('${nextId}', 'scopri')">
                                    PROCEDI ALLA PROSSIMA SEZIONE ➜<br><span style="font-size: 0.85rem; font-weight: 400; opacity: 0.85; display: block; margin-top: 0.2rem;">(vai all'unità successiva)</span>
                                </button>`;
                        }
                    }
                }
            }
        }

        let statsHtml = '';
        if (phase !== 'scopri' && window.Progress && window.Progress.currentLessonCorrectCount !== undefined) {
            statsHtml = `
                <div style="display: flex; justify-content: center; gap: 2rem; margin-bottom: 2rem; background: white; padding: 1.5rem; border-radius: 20px; border: 1px solid #eee;">
                    <div>
                        <div style="font-size: 2rem; font-weight: 800; color: #27ae60;">${window.Progress.currentLessonCorrectCount}</div>
                        <div style="font-size: 0.85rem; color: #666; font-weight: 700;">🎯 TRAGUARDI RAGGIUNTI</div>
                    </div>
                    <div style="border-left: 2px solid #eee;"></div>
                    <div>
                        <div style="font-size: 2rem; font-weight: 800; color: #e74c3c;">${window.Progress.currentLessonMistakeCount || 0}</div>
                        <div style="font-size: 0.85rem; color: #666; font-weight: 700;">💡 RIPRISTINI NECESSARI</div>
                    </div>
                </div>
            `;
        }

        const reviewOptions = [
            "VUOI RIVEDERE LA SCHEDA? 📋<br><span style='font-size: 0.85rem; font-weight: 400; opacity: 0.85; display: block; margin-top: 0.2rem;'>(torna alla spiegazione teorica)</span>",
            "RIVEDIAMO LA TECNICA? 🧠<br><span style='font-size: 0.85rem; font-weight: 400; opacity: 0.85; display: block; margin-top: 0.2rem;'>(ripassa le regole base)</span>",
            "UN ALTRO GIRO DI RISCALDAMENTO? 🔄<br><span style='font-size: 0.85rem; font-weight: 400; opacity: 0.85; display: block; margin-top: 0.2rem;'>(rileggi la teoria)</span>"
        ];
        const randomReview = reviewOptions[Math.floor(Math.random() * reviewOptions.length)];

        return `
            <div class="exercise-container" style="text-align: center; position: relative; padding-bottom: 2rem;">
                <h2 style="font-size: 2.5rem; color: ${color}; margin-bottom: 1rem;">${title}</h2>
                <div style="font-size: 4rem; margin-bottom: 1rem;">${score >= 70 || phase !== 'verifica' ? '🏆' : '😟'}</div>
                <p style="font-size: 1.2rem; margin-bottom: 2rem;">${text}</p>
                ${statsHtml}
                <div style="display: flex; flex-direction: column; gap: 1rem; max-width: 400px; margin: 0 auto;">
                    ${nextPhaseBtn}
                    ${nextUdaBtn}
                    <button class="btn" style="background: #eef2f7; color: var(--primary-color); border: 2px solid var(--primary-color); width: 100%; padding: 1.2rem; border-radius: 20px; font-weight: 800; margin-top: 2rem; cursor: pointer;" onclick="window.history.back()">${randomReview}</button>
                </div>
            </div>
        `;
    }
};
window.UI = UI;

window.UI.selectMultiLetturaOption = (btn, qIdx, selectedOpt) => {
    if (!window.multiLetturaSelections) window.multiLetturaSelections = {};
    window.multiLetturaSelections[qIdx] = selectedOpt;
    
    document.querySelectorAll(`.opt-btn-${qIdx}`).forEach(b => {
        b.style.background = 'white';
        b.style.color = 'var(--text-color)';
        b.style.borderColor = '#eee';
    });
    
    btn.style.background = 'var(--primary-color)';
    btn.style.color = 'white';
    btn.style.borderColor = 'var(--primary-color)';
};


window.UI.verifySingleCard = (btn, exerciseId, qIdx, correctAnswer, totalQuestions) => {
    const selected = window.multiLetturaSelections && window.multiLetturaSelections[qIdx];
    if (!selected) {
        alert("Seleziona prima una risposta!");
        return;
    }
    const container = document.getElementById(`q-container-${qIdx}`);
    if (!container) return;
    
    let isCorrect = selected === correctAnswer;
    
    if (isCorrect) {
        container.querySelectorAll('button').forEach(b => {
            const text = b.textContent.trim();
            if (text === correctAnswer) {
                b.style.background = '#e8f5e9';
                b.style.borderColor = '#27ae60';
                b.style.color = '#1b5e20';
            }
            b.onclick = null;
        });
        
        btn.style.display = 'none';
        window.Progress.addPoints(10);
        
        if (!window.cardsVerifiedCount) window.cardsVerifiedCount = 0;
        window.cardsVerifiedCount++;
        
        if (window.cardsVerifiedCount >= totalQuestions) {
            setTimeout(() => {
                window.UI.showFeedback(true, {
                    map: "Ottimo lavoro!",
                    reasoning: "Hai completato correttamente tutte le domande di questo esercizio.",
                    example: "Continua così!"
                }, () => {
                    window.cardsVerifiedCount = 0;
                    window.multiLetturaSelections = {};
                    window.currentExerciseIndex++;
                    
                    const hash = window.location.hash.substring(1);
                    const parts = hash.split('/').filter(p => p && p !== 'null');
                    
                    if (window.currentExerciseIndex >= totalQuestions) {
                        // this is handled in loadExercise usually, but we need to check the actual data length
                    }
                    
                    const data = getExerciseData(parts);
                    const exercises = Array.isArray(data) ? data : (data?.facile || []);
                    
                    if (window.currentExerciseIndex >= exercises.length) {
                        const phase = parts[parts.length - 1];
                        const pathKey = `progress_${parts.join('_')}`;
                        localStorage.setItem('concluded_' + pathKey, 'true');
                        const score = window.Progress.getUdaScore ? window.Progress.getUdaScore() : 100;
                        document.getElementById('exercise-mount').innerHTML = window.UI.renderUdaPhaseEnd(phase, score, score < 70, parts);
                    } else {
                        loadExercise(parts);
                    }
                });
            }, 500);
        }
    } else {
        if (window.Progress.currentLessonMistakeCount !== undefined) window.Progress.currentLessonMistakeCount++;
        window.UI.showFeedback(false, {
            map: "Riprova!",
            reasoning: "Rileggi il testo con attenzione."
        });
        
        // Reset selections for this card
        container.querySelectorAll('button').forEach(b => {
            b.style.background = 'white';
            b.style.borderColor = '#eee';
            b.style.color = 'var(--text-color)';
        });
        window.multiLetturaSelections[qIdx] = null;
    }
};

window.UI.selectLetturaOption = (btn, value) => {
    // Deseleziona tutti gli altri pulsanti
    const container = btn.closest('.options-grid');
    if (container) {
        container.querySelectorAll('.lettura-opt').forEach(b => {
            b.style.background = 'white';
            b.style.borderColor = '#eee';
            b.style.color = '';
        });
    }
    // Seleziona questo
    btn.style.background = 'var(--primary-color)';
    btn.style.borderColor = 'var(--primary-color)';
    btn.style.color = 'white';
    window._selectedLetturaOption = value;
};

window.UI.verifyLetturaAnswer = (exerciseId, correctAnswer) => {
    const selected = window._selectedLetturaOption;
    if (!selected) {
        alert('Seleziona prima una risposta!');
        return;
    }
    
    const container = document.getElementById('single-lettura-container');
    const btns = container ? container.querySelectorAll('.lettura-opt') : [];
    
    btns.forEach(btn => {
        const isCorrect = btn.textContent.trim() === correctAnswer;
        const isSelected = btn.textContent.trim() === selected;
        if (isCorrect) {
            btn.style.background = '#e8f5e9';
            btn.style.borderColor = '#27ae60';
            btn.style.color = '#1b5e20';
        } else if (isSelected && !isCorrect) {
            btn.style.background = '#ffebee';
            btn.style.borderColor = '#e74c3c';
            btn.style.color = '#b71c1c';
        }
        btn.onclick = null; // Disabilita ulteriori clic
    });

    if (selected === correctAnswer) {
        window.Progress.addPoints(10);
        if (window.Progress.currentLessonCorrectCount !== undefined) window.Progress.currentLessonCorrectCount++;
        window.Progress.sync();
        const btn = document.querySelector('.btn-verify');
        if (btn) { btn.textContent = '✅ Risposta corretta! +10 XP'; btn.style.background = '#27ae60'; }
    } else {
        if (window.Progress.currentLessonMistakeCount !== undefined) window.Progress.currentLessonMistakeCount++;
        const btn = document.querySelector('.btn-verify');
        if (btn) { btn.textContent = `❌ Risposta errata. Era: "${correctAnswer}"`; btn.style.background = '#e74c3c'; }
    }
    window._selectedLetturaOption = null;
};

window.UI.verifyMultiLetturaAnswers = (exerciseId) => {
    if (!window.multiLetturaSelections) window.multiLetturaSelections = {};
    
    const hash = window.location.hash.substring(1);
    const parts = hash.split('/').filter(p => p && p !== 'null');
    const section = parts[0];
    const subType = parts[1];
    const level = parts[2];
    const extra = parts[3];
    
    const path = [];
    let cursor = section;
    while (cursor && cursor !== 'materie') {
        path.unshift(cursor);
        cursor = MATERIE_HIERARCHY[cursor] ? MATERIE_HIERARCHY[cursor].parent : null;
    }
    if (subType) path.push(subType);
    if (level) path.push(level);
    if (extra) path.push(extra);

    const data = getExerciseData(path);
    const exercises = Array.isArray(data) ? data : (data?.facile || []);
    const exercise = exercises.find(ex => ex.id === exerciseId);

    if (!exercise) return;

    let allCorrect = true;
    let mistakes = 0;
    
    exercise.questions.forEach((q, qIdx) => {
        const selected = window.multiLetturaSelections[qIdx];
        const container = document.getElementById(`q-container-${qIdx}`);
        
        if (selected !== q.answer) {
            allCorrect = false;
            mistakes++;
            
            if (container) {
                container.parentElement.style.borderColor = '#e74c3c';
                container.parentElement.style.background = '#fff5f5';
            }
        } else {
            if (container) {
                container.parentElement.style.borderColor = '#27ae60';
                container.parentElement.style.background = '#f5fff5';
            }
        }
    });

    if (allCorrect) {
        window.Progress.addPoints(30);
        if (window.Progress.currentLessonCorrectCount !== undefined) window.Progress.currentLessonCorrectCount++;
        
        window.UI.showFeedback(true, {
            map: "Complimenti!",
            reasoning: "Hai risposto correttamente a tutte le domande.",
            example: "Ottima capacità di analisi e comprensione del testo!"
        }, () => {
            window.multiLetturaSelections = {};
            window.currentExerciseIndex++;
            const pathKey = `progress_${currentSection}_${currentSubType}_${currentLevel}_${currentExtra}`;
            localStorage.setItem(pathKey, window.currentExerciseIndex.toString());

            if (window.currentExerciseIndex >= exercises.length) {
                let statsHtml = '';
                if (window.Progress && window.Progress.currentLessonCorrectCount !== undefined) {
                    statsHtml = `
                        <div style="display: flex; justify-content: center; gap: 2rem; margin-top: 1.5rem; margin-bottom: 2rem; background: #fff; padding: 1.5rem; border-radius: 20px; border: 1px solid #eee;">
                            <div>
                                <div style="font-size: 2rem; font-weight: 800; color: #27ae60;">${window.Progress.currentLessonCorrectCount}</div>
                                <div style="font-size: 0.85rem; color: #666; font-weight: 700;">🎯 TRAGUARDI RAGGIUNTI</div>
                            </div>
                            <div style="border-left: 2px solid #eee;"></div>
                            <div>
                                <div style="font-size: 2rem; font-weight: 800; color: #e74c3c;">${window.Progress.currentLessonMistakeCount || 0}</div>
                                <div style="font-size: 0.85rem; color: #666; font-weight: 700;">💡 RIPRISTINI NECESSARI</div>
                            </div>
                        </div>
                    `;
                }
                document.getElementById('exercise-mount').innerHTML = `
                    <div class="exercise-container" style="text-align: center;">
                        <h2 style="font-size: 2.5rem; color: var(--primary-color);">COMPLIMENTI!</h2>
                        <div style="font-size: 4rem; margin: 1rem 0;">🏆</div>
                        <p style="font-size: 1.2rem; margin-bottom: 2rem;">Hai terminato tutti gli esercizi per questo livello. Sei pronto per una nuova sfida?</p>
                        ${statsHtml}
                        <button class="btn btn-primary" onclick="window.history.back()" style="margin-top: 2rem; width: 100%; max-width: 300px;">VAI INDIETRO</button>
                    </div>
                `;
            } else {
                loadExercise(path);
            }
        });
    } else {
        if (window.Progress.currentLessonMistakeCount !== undefined) window.Progress.currentLessonMistakeCount++;
        window.UI.showFeedback(false, {
            map: "Alcune risposte sono errate!",
            reasoning: `Hai fatto ${mistakes} errori.`,
            example: "Rileggi con calma il testo e correggi i punti evidenziati in rosso."
        }, null, path);
    }
};

// --- FILTRI DINAMICI LETTURE ---
window.currentLetturaFilter = 'tutti-i-generi';
window.currentLetturaSort = 'default';
window.currentAntologicheFilter = 'all';
window.currentAntologicheSort = 'a-z';

window.UI.setLetturaFilter = (filter) => {
    window.currentLetturaFilter = filter;
    if (filter === 'tutti-i-generi') window.currentLetturaSort = 'default';
    const mount = document.getElementById('exercise-mount');
    if (mount) mount.innerHTML = window.UI.renderSubMenu('generi', window.MATERIE_HIERARCHY);
    if (typeof updateSidebarMenu === 'function') updateSidebarMenu();
};

window.UI.setLetturaSort = (sort) => {
    window.currentLetturaSort = sort;
    const mount = document.getElementById('exercise-mount');
    if (mount) mount.innerHTML = window.UI.renderSubMenu('generi', window.MATERIE_HIERARCHY);
};

window.UI.setAntologicheFilter = (filter) => {
    window.currentAntologicheFilter = filter;
    const mount = document.getElementById('exercise-mount');
    const path = ['lettura', 'antologiche'];
    const data = typeof getExerciseData === 'function' ? getExerciseData(path) : null;
    if (mount && data) mount.innerHTML = window.UI.renderSectionMenu('antologiche', window.MATERIE_HIERARCHY, data);
    if (typeof updateSidebarMenu === 'function') updateSidebarMenu();
};

window.UI.setAntologicheSort = (sort) => {
    window.currentAntologicheSort = sort;
    const mount = document.getElementById('exercise-mount');
    const path = ['lettura', 'antologiche'];
    const data = typeof getExerciseData === 'function' ? getExerciseData(path) : null;
    if (mount && data) mount.innerHTML = window.UI.renderSectionMenu('antologiche', window.MATERIE_HIERARCHY, data);
};

// --- VOCABOLARIO PERSONALE ---

window.UI.addToVocabulary = (word) => {
    let vocab = JSON.parse(localStorage.getItem('palestra_vocab') || '[]');
    if (!vocab.includes(word)) {
        vocab.push(word);
        localStorage.setItem('palestra_vocab', JSON.stringify(vocab));
        if (window.Progress && window.Progress.sync) window.Progress.sync();
        
        const toast = document.createElement('div');
        toast.style.cssText = 'position:fixed; bottom:20px; right:20px; background:#27ae60; color:white; padding:1rem 2rem; border-radius:50px; z-index:3000; box-shadow:0 10px 20px rgba(0,0,0,0.1); font-weight:800; animation: slideUp 0.3s forwards;';
        toast.innerHTML = `✅ "${word}" aggiunto al vocabolario!`;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.animation = 'slideDown 0.3s forwards';
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }
};

window.UI.removeFromVocabulary = (word, isFromPage = false) => {
    let vocab = JSON.parse(localStorage.getItem('palestra_vocab') || '[]');
    vocab = vocab.filter(w => w !== word);
    localStorage.setItem('palestra_vocab', JSON.stringify(vocab));
    if (window.Progress && window.Progress.sync) window.Progress.sync();
    if (isFromPage) {
        renderVocabularyPage();
    } else if (window.currentSection === 'profilo') {
        renderProfiloPage();
    }
};

window.UI.toggleWordDefinition = async (word, elementId) => {
    const target = document.getElementById(elementId);
    if (!target) return;
    if (target.innerHTML !== '') {
        target.innerHTML = '';
        target.classList.add('hidden');
        return;
    }
    
    target.innerHTML = '<div style="padding:1.2rem; color:#888; font-style:italic; background:white;">🔍 Cerco su Wikizionario...</div>';
    target.classList.remove('hidden');
    
    try {
        const cleanWord = word.toLowerCase().trim();
        const response = await fetch(`https://it.wiktionary.org/api/rest_v1/page/definition/${cleanWord}`);
        const data = await response.json();
        
        if (data && data.it && data.it[0]) {
            const definitions = data.it[0].definitions;
            let html = '<div style="padding:1.5rem; background:white; font-size:0.95rem; border-top: 1px solid #eee; line-height:1.6; color:#444;">';
            html += `<div style="color:var(--primary-color); font-weight:800; margin-bottom:0.5rem; text-transform:uppercase; font-size:0.75rem; letter-spacing:1px;">${data.it[0].partOfSpeech || 'Definizione'}</div>`;
            html += definitions[0].definition.replace(/<a.*?>|<\/a>/g, '');
            html += '</div>';
            target.innerHTML = html;
        } else {
            target.innerHTML = `<div style="padding:1.2rem; background:white; font-size:0.9rem; color:#888; border-top: 1px solid #eee;">Definizione non trovata per "${word}".</div>`;
        }
    } catch (e) {
        target.innerHTML = `<div style="padding:1.2rem; background:white; font-size:0.9rem; color:#ff7f7f; border-top: 1px solid #eee;">Errore di connessione.</div>`;
    }
};

window.UI.showWordDefinitionPopup = async (word, element) => {
    let popup = document.getElementById('word-definition-popup');
    if (!popup) {
        popup = document.createElement('div');
        popup.id = 'word-definition-popup';
        popup.style.cssText = 'position:absolute; background:white; border-radius:20px; box-shadow:0 15px 50px rgba(0,0,0,0.15); padding:1.5rem; z-index:4000; width:300px; border:1px solid #eee; display:none;';
        document.body.appendChild(popup);
        
        document.addEventListener('click', (e) => {
            if (!popup.contains(e.target) && !e.target.classList.contains('vocabulary-word')) {
                popup.style.display = 'none';
            }
        });
    }
    
    const rect = element.getBoundingClientRect();
    popup.style.top = (rect.bottom + window.scrollY + 10) + 'px';
    popup.style.left = (rect.left + window.scrollX) + 'px';
    popup.style.display = 'block';
    
    popup.innerHTML = '<div style="color:#888; font-style:italic;">🔍 Cerco...</div>';
    
    try {
        const cleanWord = word.toLowerCase().trim();
        const response = await fetch(`https://it.wiktionary.org/api/rest_v1/page/definition/${cleanWord}`);
        const data = await response.json();
        
        let defHtml = '';
        if (data && data.it && data.it[0]) {
            const def = data.it[0].definitions[0].definition.replace(/<a.*?>|<\/a>/g, '');
            defHtml = `<div style="font-size:0.9rem; line-height:1.5; margin-bottom:1.5rem; color:#444;"><strong style="color:var(--primary-color); display:block; margin-bottom:0.3rem;">${word.toUpperCase()}</strong>${def}</div>`;
        } else {
            defHtml = `<div style="font-size:0.9rem; margin-bottom:1.5rem; color:#888;">Significato non trovato per <strong>${word}</strong>.</div>`;
        }
        
        popup.innerHTML = `
            ${defHtml}
            <div style="display:flex; flex-direction:column; gap:0.5rem;">
                <button class="btn btn-primary" style="padding:0.7rem; font-size:0.75rem; border-radius:12px;" onclick="UI.addToVocabulary('${word.replace(/'/g, "\\'")}'); document.getElementById('word-definition-popup').style.display='none';">➕ AGGIUNGI AL VOCABOLARIO</button>
                <button class="btn btn-secondary" style="padding:0.7rem; font-size:0.75rem; border-radius:12px; background:#f1f2f6; color:#555;" onclick="document.getElementById('word-definition-popup').style.display='none'">CHIUDI</button>
            </div>
        `;
        
        const popupRect = popup.getBoundingClientRect();
        if (popupRect.right > window.innerWidth) {
            popup.style.left = (window.innerWidth - popupRect.width - 20) + 'px';
        }

    } catch (e) {
        popup.innerHTML = 'Errore nella ricerca.';
    }
};

window.UI.wrapWordsForVocabulary = (text) => {
    if (!text) return '';
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = text;
    
    const walk = (node) => {
        if (node.nodeType === 3) { // Text node
            const words = node.nodeValue.split(/(\s+)/);
            const wrapped = words.map(w => {
                if (w.trim().length === 0) return w;
                const clean = w.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g,"").trim();
                if (!clean) return w;
                return `<span class="vocabulary-word" onclick="UI.showWordDefinitionPopup('${clean.replace(/'/g, "\\'")}', this)" title="Clicca per il significato">${w}</span>`;
            }).join('');
            
            const span = document.createElement('span');
            span.innerHTML = wrapped;
            node.parentNode.replaceChild(span, node);
        } else if (node.nodeType === 1) { // Element node
            for (let i = node.childNodes.length - 1; i >= 0; i--) {
                walk(node.childNodes[i]);
            }
        }
    };
    
    walk(tempDiv);
    return tempDiv.innerHTML;
};



window.UI = UI;

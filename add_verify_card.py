import re

with open('js/ui.js', 'r', encoding='utf-8') as f:
    content = f.read()

verify_fn = """
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
                    example: "Continua cos\u00ec!"
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
"""

# Insert the function before window.UI.selectLetturaOption
idx = content.find("window.UI.selectLetturaOption")
if idx != -1:
    content = content[:idx] + verify_fn + "\n" + content[idx:]

with open('js/ui.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Function added")

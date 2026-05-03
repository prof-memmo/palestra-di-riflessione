const Progress = {
    key: 'palestra_grammatica_progress',
    
    init: () => {
        if (!localStorage.getItem(Progress.key)) {
            const initialState = {
                completedIds: [],
                scores: {
                    grammaticale: 0,
                    logica: 0,
                    periodo: 0,
                    punteggiatura: 0,
                    lettura: 0
                },
                badges: []
            };
            localStorage.setItem(Progress.key, JSON.stringify(initialState));
        }
    },
    
    getData: () => {
        return JSON.parse(localStorage.getItem(Progress.key));
    },
    
    saveProgress: (exerciseId, type, isCorrect) => {
        const data = Progress.getData();
        if (isCorrect && !data.completedIds.includes(exerciseId)) {
            data.completedIds.push(exerciseId);
            data.scores[type] = (data.scores[type] || 0) + 10;
            
            // Check for badges
            if (data.completedIds.length === 5) data.badges.push('INIZIATO');
            if (data.completedIds.length === 20) data.badges.push('ESPERTO');
            
            localStorage.setItem(Progress.key, JSON.stringify(data));
        }
    },
    
    getStats: () => {
        return Progress.getData();
    },

    reset: () => {
        localStorage.removeItem(Progress.key);
        Progress.init();
        location.reload();
    }
};

window.Progress = Progress;
Progress.init();

Object.assign(window.Auth = window.Auth || {}, {
    isLoggedIn: () => {
        return !!window.Auth._user;
    },
    getUser: () => {
        return window.Auth._user || { name: 'Atleta Anonimo', avatar: '👤', role: 'studente', isGuest: true };
    },
    updateProfile: async (name, avatar) => {
        if (!window.Auth._user) return;
        window.Auth._user.name = name;
        window.Auth._user.avatar = avatar;
        localStorage.setItem('palestra_user', JSON.stringify(window.Auth._user));
        if (window.fbAuth && window.fbAuth.currentUser) {
            try {
                await window.fbDb.collection('users').doc(window.fbAuth.currentUser.uid).set(window.Auth._user, { merge: true });
            } catch (e) {
                console.error("Errore aggiornamento cloud profilo:", e);
            }
        }
        window.dispatchEvent(new CustomEvent('authChange'));
    }
});

Object.assign(window.Auth = window.Auth || {}, {
    isLoggedIn: () => {
        return !!window.Auth._user;
    },
    getUser: () => {
        return window.Auth._user || { name: 'Atleta Anonimo', avatar: '👤', role: 'studente', isGuest: true };
    },
    updateProfile: async (name, avatar) => {
        if (!window.Auth._user) return;
        const safeAvatar = avatar || window.Auth._user.avatar || 'assets/avatars/6.png';
        window.Auth._user.name = name;
        window.Auth._user.avatar = safeAvatar;
        localStorage.setItem('palestra_user', JSON.stringify(window.Auth._user));
        if (window.fbAuth && window.fbAuth.currentUser) {
            try {
                await window.fbDb.collection('users').doc(window.fbAuth.currentUser.uid).set(window.Auth._user, { merge: true });
                await window.fbDb.collection('hub_users').doc(window.fbAuth.currentUser.uid).set({
                    avatar: safeAvatar,
                    'anagrafica.avatar': safeAvatar,
                    'anagrafica.nome': name
                }, { merge: true });
                await window.fbAuth.currentUser.updateProfile({ photoURL: safeAvatar, displayName: name }).catch(e => console.warn(e));
            } catch (e) {
                console.error("Errore aggiornamento cloud profilo:", e);
            }
        }
        window.dispatchEvent(new CustomEvent('authChange'));
    }
});

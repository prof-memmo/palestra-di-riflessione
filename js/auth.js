const Auth = {
    _user: null,

    init: () => {
        const savedUser = localStorage.getItem('palestra_user');
        if (savedUser) {
            Auth._user = JSON.parse(savedUser);
        }
    },

    isLoggedIn: () => {
        return !!Auth._user;
    },

    getUser: () => {
        return Auth._user || { name: 'Atleta Anonimo', avatar: '👤', isGuest: true };
    },

    login: (name, avatar = 'assets/avatar.png', role = 'studente') => {
        Auth._user = {
            name: name,
            avatar: avatar,
            role: role,
            isGuest: false,
            joinedAt: new Date().toISOString()
        };
        localStorage.setItem('palestra_user', JSON.stringify(Auth._user));
        // Dispara un evento per notificare il cambiamento
        window.dispatchEvent(new CustomEvent('authChange'));
    },

    continueAsGuest: () => {
        Auth._user = {
            name: 'Atleta Anonimo',
            avatar: '👤',
            role: 'studente',
            isGuest: true,
            joinedAt: new Date().toISOString()
        };
        // Non lo salviamo necessariamente per permettere di loggarsi dopo
        window.dispatchEvent(new CustomEvent('authChange'));
    },

    logout: () => {
        Auth._user = null;
        localStorage.removeItem('palestra_user');
        window.dispatchEvent(new CustomEvent('authChange'));
        window.location.hash = 'home';
        window.location.reload();
    }
};

Auth.init();
window.Auth = Auth;

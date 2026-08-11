Object.assign(window.Auth = window.Auth || {}, {
    isAdmin: () => {
        return window.Auth._user && window.Auth._user.role === 'admin';
    }
});

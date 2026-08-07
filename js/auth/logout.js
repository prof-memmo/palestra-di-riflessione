window.Auth = window.Auth || {};
    logout: async () => {
        try {
            if (window.fbAuth) await window.fbAuth.signOut();
        } catch(e) {}
        
        Auth._user = null;
        localStorage.removeItem('palestra_user');
        window.dispatchEvent(new CustomEvent('authChange'));
        window.location.hash = 'home';
        setTimeout(() => {
            window.location.reload();
        }, 100);
    },

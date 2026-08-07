window.Auth = window.Auth || {};
// Gestione ruoli (attualmente gestita in _handleFirebaseUser, predisposizione per sviluppi futuri)
Auth.isAdmin = function() {
    const user = Auth.getUser();
    return user && user.role === 'admin';
};

function showLoginOverlay(redirectRoute = null) {
    const overlay = document.getElementById('login-overlay');
    if (overlay) {
        overlay.classList.remove('hidden');
        window.pendingRoute = redirectRoute;
    }
}
\n\nfunction hideLoginOverlay() {
    const overlay = document.getElementById('login-overlay');
    if (overlay) overlay.classList.add('hidden');
}
\n
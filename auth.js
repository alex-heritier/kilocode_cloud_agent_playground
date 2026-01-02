// Authentication Module
// Handles Google OAuth 2.0 flow using Google Identity Services

window.Auth = {
    clientId: 'YOUR_GOOGLE_CLIENT_ID', // Replace with actual client ID from Google Cloud Console
    currentUser: null,

    // Initialize Google OAuth
    init: function() {
        google.accounts.id.initialize({
            client_id: this.clientId,
            callback: this.handleCredentialResponse.bind(this),
            auto_select: false,
            cancel_on_tap_outside: true
        });
    },

    // Render login button
    renderLoginButton: function(elementId) {
        google.accounts.id.renderButton(
            document.getElementById(elementId),
            { theme: 'outline', size: 'large' }
        );
    },

    // Handle credential response from Google
    handleCredentialResponse: function(response) {
        const payload = this.decodeJwtResponse(response.credential);
        this.currentUser = {
            id: payload.sub,
            email: payload.email,
            name: payload.name,
            avatar: payload.picture
        };
        // Save user profile
        window.DataStorage.saveUserProfile(this.currentUser.id, this.currentUser);
        // Trigger app re-render or callback
        if (window.App && window.App.onLogin) {
            window.App.onLogin(this.currentUser);
        }
    },

    // Decode JWT response
    decodeJwtResponse: function(token) {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    },

    // Logout
    logout: function() {
        this.currentUser = null;
        google.accounts.id.disableAutoSelect();
        // Trigger app re-render or callback
        if (window.App && window.App.onLogout) {
            window.App.onLogout();
        }
    },

    // Get current user
    getCurrentUser: function() {
        return this.currentUser;
    },

    // Check if user is logged in
    isLoggedIn: function() {
        return this.currentUser !== null;
    }
};
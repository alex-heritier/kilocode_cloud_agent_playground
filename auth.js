// Authentication Module
// Handles mocked Google OAuth for testing - auto logs in as test user

window.Auth = {
    currentUser: null,

    // Initialize mocked auth - auto login as test user
    init: function() {
        // Mock test user
        const testUser = {
            id: 'test-user',
            email: 'test@example.com',
            name: 'Test User',
            avatar: 'https://via.placeholder.com/40' // Placeholder avatar
        };
        this.currentUser = testUser;
        // Save user profile
        window.DataStorage.saveUserProfile(testUser.id, testUser);
        // Trigger app re-render or callback
        if (window.App && window.App.onLogin) {
            window.App.onLogin(testUser);
        }
    },

    // Render login button - mocked, does nothing
    renderLoginButton: function(elementId) {
        // No button needed for mocked auth
    },


    // Logout
    logout: function() {
        this.currentUser = null;
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
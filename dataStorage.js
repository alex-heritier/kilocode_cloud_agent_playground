// Data Storage Module
// Abstracts data persistence, currently using localStorage with interfaces for future backend integration

window.DataStorage = {
    // Get user-specific data key
    getUserKey: function(userId, key) {
        return `${userId}_${key}`;
    },

    // Vocabulary operations
    getVocabulary: function() {
        // Mock: return static data
        return window.VocabularyData;
    },

    // Progress operations
    getProgress: function(userId) {
        const key = this.getUserKey(userId, 'progressMap');
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : {};
    },

    saveProgress: function(userId, progressMap) {
        const key = this.getUserKey(userId, 'progressMap');
        localStorage.setItem(key, JSON.stringify(progressMap));
    },

    // Lesson state operations
    getLessonState: function(userId) {
        const key = this.getUserKey(userId, 'lessonState');
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : { cardsIntroducedToday: 0, lastIntroductionDate: null };
    },

    saveLessonState: function(userId, lessonState) {
        const key = this.getUserKey(userId, 'lessonState');
        localStorage.setItem(key, JSON.stringify(lessonState));
    },

    // User profile operations
    getUserProfile: function(userId) {
        const key = this.getUserKey(userId, 'profile');
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : null;
    },

    saveUserProfile: function(userId, profile) {
        const key = this.getUserKey(userId, 'profile');
        localStorage.setItem(key, JSON.stringify(profile));
    },

    // Statistics operations
    getStatistics: function(userId) {
        const key = this.getUserKey(userId, 'statistics');
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : { totalReviews: 0, correctAnswers: 0, streak: 0 };
    },

    saveStatistics: function(userId, statistics) {
        const key = this.getUserKey(userId, 'statistics');
        localStorage.setItem(key, JSON.stringify(statistics));
    }
};
// SRS Engine Module
// Implements modified SM-2 algorithm for spaced repetition

window.SRSEngine = {
    // Update progress based on quality response (0-5)
    updateProgress: function(progress, quality) {
        let { easeFactor, interval, correctCount } = progress;
        if (quality < 3) {
            interval = 1;
            easeFactor = Math.max(1.3, easeFactor - 0.2);
            correctCount = 0;
        } else {
            if (correctCount === 0) {
                interval = 1;
            } else if (correctCount === 1) {
                interval = 6;
            } else {
                interval = Math.round(interval * easeFactor);
            }
            easeFactor = Math.min(2.5, easeFactor + 0.1 * (5 - quality));
            correctCount += 1;
        }
        const nextReview = new Date();
        nextReview.setDate(nextReview.getDate() + interval);
        return { easeFactor, interval, nextReview: nextReview.toISOString(), correctCount };
    },

    // Get cards due for review
    getReviewQueue: function(progressMap) {
        const now = new Date();
        return Object.keys(progressMap).filter(cardId => {
            const progress = progressMap[cardId];
            return new Date(progress.nextReview) <= now;
        });
    },

    // Check if new lesson is available
    isNewLessonAvailable: function(lessonState, lessonHour = 12) {
        const now = new Date();
        const today = now.toDateString();
        const currentHour = now.getHours();
        if (lessonState.lastIntroductionDate !== today && currentHour >= lessonHour) {
            return true;
        }
        return false;
    },

    // Select next card for review or introduction
    selectCard: function(reviewQueue, learnedCards, lessonState, cardsPerLesson = 5) {
        if (reviewQueue.length > 0) {
            return { cardId: reviewQueue[0], lessonState }; // Most due card first
        }
        const newCards = window.VocabularyData.filter(card => !learnedCards.has(card.id));
        if (newCards.length > 0 && lessonState.cardsIntroducedToday < cardsPerLesson) {
            const newLessonState = {
                ...lessonState,
                cardsIntroducedToday: lessonState.cardsIntroducedToday + 1,
                lastIntroductionDate: new Date().toDateString()
            };
            return { cardId: newCards[0].id, lessonState: newLessonState }; // Next in fixed order
        }
        return { cardId: null, lessonState };
    }
};
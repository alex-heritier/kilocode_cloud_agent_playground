const { useState, useEffect } = React;

// Mock card database
const cards = [
    { id: '1', english: 'hello', vietnamese: 'xin chào', type: 'word' },
    { id: '2', english: 'thank you', vietnamese: 'cảm ơn', type: 'word' },
    { id: '3', english: 'How are you?', vietnamese: 'Bạn khỏe không?', type: 'sentence' },
    { id: '4', english: 'good morning', vietnamese: 'chào buổi sáng', type: 'word' },
    { id: '5', english: 'I love you', vietnamese: 'Anh yêu em', type: 'sentence' },
    { id: '6', english: 'water', vietnamese: 'nước', type: 'word' },
    { id: '7', english: 'What is your name?', vietnamese: 'Tên bạn là gì?', type: 'sentence' },
    { id: '8', english: 'friend', vietnamese: 'bạn bè', type: 'word' },
    { id: '9', english: 'I am hungry', vietnamese: 'Tôi đói', type: 'sentence' },
    { id: '10', english: 'book', vietnamese: 'sách', type: 'word' }
];

// SRS Algorithm (Supermemo SM-2)
function updateProgress(progress, quality) {
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
    return { easeFactor, interval, nextReview, correctCount };
}

// Get review queue
function getReviewQueue(progressMap) {
    const now = new Date();
    return Object.keys(progressMap).filter(cardId => {
        const progress = progressMap[cardId];
        return progress.nextReview <= now;
    });
}

// Select card for review (simple n+1: prioritize due cards, then new)
function selectCard(reviewQueue, learnedCards) {
    if (reviewQueue.length > 0) {
        return reviewQueue[Math.floor(Math.random() * reviewQueue.length)];
    }
    const newCards = cards.filter(card => !learnedCards.has(card.id));
    if (newCards.length > 0) {
        return newCards[0].id;
    }
    return null;
}

function CardComponent({ card, side, onSubmit }) {
    const [answer, setAnswer] = useState('');
    const [showAnswer, setShowAnswer] = useState(false);

    const question = side === 'english' ? card.vietnamese : card.english;
    const correctAnswer = side === 'english' ? card.english : card.vietnamese;

    const handleSubmit = () => {
        const isCorrect = answer.trim().toLowerCase() === correctAnswer.toLowerCase();
        onSubmit(isCorrect ? 5 : 0); // 5 for correct, 0 for wrong
        setShowAnswer(true);
    };

    const handleNext = () => {
        setAnswer('');
        setShowAnswer(false);
    };

    return (
        <div className="card">
            <div className="card__question">
                <p>{question}</p>
            </div>
            {!showAnswer ? (
                <div className="card__input">
                    <input
                        type="text"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="Your answer"
                    />
                    <button onClick={handleSubmit}>Submit</button>
                </div>
            ) : (
                <div className="card__feedback">
                    <p>Your answer: {answer}</p>
                    <p>Correct: {correctAnswer}</p>
                    <button onClick={handleNext}>Next</button>
                </div>
            )}
        </div>
    );
}

function App() {
    const [progressMap, setProgressMap] = useState(() => {
        const saved = localStorage.getItem('progressMap');
        return saved ? JSON.parse(saved) : {};
    });
    const [currentCardId, setCurrentCardId] = useState(null);
    const [side, setSide] = useState('english'); // or 'vietnamese'
    const [learnedCards, setLearnedCards] = useState(new Set());

    useEffect(() => {
        localStorage.setItem('progressMap', JSON.stringify(progressMap));
    }, [progressMap]);

    useEffect(() => {
        const reviewQueue = getReviewQueue(progressMap);
        const cardId = selectCard(reviewQueue, learnedCards);
        if (cardId) {
            setCurrentCardId(cardId);
            setSide(Math.random() < 0.5 ? 'english' : 'vietnamese');
        }
    }, [progressMap, learnedCards]);

    const handleAnswer = (quality) => {
        if (!currentCardId) return;
        const newProgress = updateProgress(progressMap[currentCardId] || { easeFactor: 2.5, interval: 1, nextReview: new Date(), correctCount: 0 }, quality);
        setProgressMap(prev => ({ ...prev, [currentCardId]: newProgress }));
        if (quality >= 3) {
            setLearnedCards(prev => new Set([...prev, currentCardId]));
        }
    };

    const currentCard = cards.find(c => c.id === currentCardId);

    return (
        <div className="app">
            <header className="app__header">
                <h1 className="app__title">English to Vietnamese Learning Platform</h1>
            </header>
            <main className="app__content">
                {currentCard ? (
                    <CardComponent card={currentCard} side={side} onSubmit={handleAnswer} />
                ) : (
                    <p>No more cards to review. Great job!</p>
                )}
            </main>
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));
const { useState, useEffect } = React;

// Configurable parameters
const CARDS_PER_LESSON = 5;
const LESSON_HOUR = 12;

// Component: WordCard
function WordCard({ card, showAnswer, onShowAnswer, onNext }) {
    return (
        <div className="word-card">
            <div className="word-card__question">
                <p>{card.vietnamese}</p>
            </div>
            {showAnswer && (
                <div className="word-card__answer">
                    <p>{card.english}</p>
                    {card.examples && card.examples.length > 0 && (
                        <ul>
                            {card.examples.map((example, index) => (
                                <li key={index}>{example}</li>
                            ))}
                        </ul>
                    )}
                    <button className="word-card__next-button" onClick={onNext}>Next</button>
                </div>
            )}
            {!showAnswer && (
                <button className="word-card__show-button" onClick={onShowAnswer}>Show Answer</button>
            )}
        </div>
    );
}

// Component: InputField
function InputField({ value, onChange, onSubmit, placeholder }) {
    return (
        <div className="input-field">
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
            />
            <button onClick={onSubmit}>Submit</button>
        </div>
    );
}

// Component: StatisticsChart (simple text-based for now)
function StatisticsChart({ statistics }) {
    return (
        <div className="statistics-chart">
            <h3>Progress Statistics</h3>
            <p>Total Reviews: {statistics.totalReviews}</p>
            <p>Correct Answers: {statistics.correctAnswers}</p>
            <p>Current Streak: {statistics.streak}</p>
        </div>
    );
}

// Component: UserMenu
function UserMenu({ user, onLogout }) {
    return (
        <div className="user-menu">
            {user.avatar && <img src={user.avatar} alt="Avatar" className="user-menu__avatar" />}
            <span className="user-menu__name">{user.name}</span>
            <button onClick={onLogout}>Logout</button>
        </div>
    );
}

// Component: Header
function Header({ user, onNavigate, currentView }) {
    return (
        <header className="header">
            <h1 className="header__title">English to Vietnamese Learning Platform</h1>
            <nav className="header__nav">
                <button onClick={() => onNavigate('lesson')} className={currentView === 'lesson' ? 'active' : ''}>Lesson</button>
                <button onClick={() => onNavigate('review')} className={currentView === 'review' ? 'active' : ''}>Review</button>
                <button onClick={() => onNavigate('dashboard')} className={currentView === 'dashboard' ? 'active' : ''}>Progress</button>
            </nav>
            {user && <UserMenu user={user} onLogout={() => window.Auth.logout()} />}
        </header>
    );
}

// Component: Login
function Login() {
    useEffect(() => {
        window.Auth.init();
        window.Auth.renderLoginButton('login-button');
    }, []);

    return (
        <div className="login">
            <h2>Login with Google</h2>
            <div id="login-button"></div>
        </div>
    );
}

// Component: LessonView
function LessonView({ onComplete }) {
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);

    const newCards = window.VocabularyData.slice(0, CARDS_PER_LESSON);

    const handleShowAnswer = () => setShowAnswer(true);
    const handleNext = () => {
        if (currentCardIndex < newCards.length - 1) {
            setCurrentCardIndex(currentCardIndex + 1);
            setShowAnswer(false);
        } else {
            onComplete();
        }
    };

    const currentCard = newCards[currentCardIndex];

    return (
        <div className="lesson-view">
            <h2>New Lesson</h2>
            <WordCard
                card={currentCard}
                showAnswer={showAnswer}
                onShowAnswer={handleShowAnswer}
                onNext={handleNext}
            />
        </div>
    );
}

// Component: ReviewSession
function ReviewSession({ user, onComplete }) {
    const [progressMap, setProgressMap] = useState(window.DataStorage.getProgress(user.id));
    const [currentCardId, setCurrentCardId] = useState(null);
    const [side, setSide] = useState('vietnamese');
    const [answer, setAnswer] = useState('');
    const [showAnswer, setShowAnswer] = useState(false);

    useEffect(() => {
        const reviewQueue = window.SRSEngine.getReviewQueue(progressMap);
        if (reviewQueue.length > 0) {
            setCurrentCardId(reviewQueue[0]);
            setSide(Math.random() < 0.5 ? 'vietnamese' : 'english');
        } else {
            onComplete();
        }
    }, [progressMap]);

    const handleSubmit = () => {
        const currentCard = window.VocabularyData.find(c => c.id === currentCardId);
        const correctAnswer = side === 'vietnamese' ? currentCard.english : currentCard.vietnamese;
        const isCorrect = answer.trim().toLowerCase() === correctAnswer.toLowerCase();
        const quality = isCorrect ? 5 : 0;
        const newProgress = window.SRSEngine.updateProgress(
            progressMap[currentCardId] || { easeFactor: 2.5, interval: 1, nextReview: new Date().toISOString(), correctCount: 0 },
            quality
        );
        const newProgressMap = { ...progressMap, [currentCardId]: newProgress };
        setProgressMap(newProgressMap);
        window.DataStorage.saveProgress(user.id, newProgressMap);
        setShowAnswer(true);
    };

    const handleNext = () => {
        setAnswer('');
        setShowAnswer(false);
        const reviewQueue = window.SRSEngine.getReviewQueue(progressMap);
        if (reviewQueue.length > 1) {
            setCurrentCardId(reviewQueue[1]);
            setSide(Math.random() < 0.5 ? 'vietnamese' : 'english');
        } else {
            onComplete();
        }
    };

    const currentCard = window.VocabularyData.find(c => c.id === currentCardId);

    if (!currentCard) return <p>No reviews available.</p>;

    const question = side === 'vietnamese' ? currentCard.vietnamese : currentCard.english;
    const correctAnswer = side === 'vietnamese' ? currentCard.english : currentCard.vietnamese;

    return (
        <div className="review-session">
            <h2>Review Session</h2>
            <div className="card">
                <div className="card__question">
                    <p>{question}</p>
                </div>
                {!showAnswer ? (
                    <InputField
                        value={answer}
                        onChange={setAnswer}
                        onSubmit={handleSubmit}
                        placeholder="Your answer"
                    />
                ) : (
                    <div className="card__feedback">
                        <p>Your answer: {answer}</p>
                        <p>Correct: {correctAnswer}</p>
                        <button onClick={handleNext}>Next</button>
                    </div>
                )}
            </div>
        </div>
    );
}

// Component: ProgressDashboard
function ProgressDashboard({ user }) {
    const [statistics, setStatistics] = useState(window.DataStorage.getStatistics(user.id));

    return (
        <div className="progress-dashboard">
            <h2>Your Progress</h2>
            <StatisticsChart statistics={statistics} />
        </div>
    );
}

// Component: MainContent
function MainContent({ currentView, user, onViewComplete }) {
    switch (currentView) {
        case 'lesson':
            return <LessonView onComplete={onViewComplete} />;
        case 'review':
            return <ReviewSession user={user} onComplete={onViewComplete} />;
        case 'dashboard':
            return <ProgressDashboard user={user} />;
        default:
            return <p>Select a view</p>;
    }
}

// Main App Component
function App() {
    const [user, setUser] = useState(window.Auth.getCurrentUser());
    const [currentView, setCurrentView] = useState('lesson');

    useEffect(() => {
        window.App = {
            onLogin: (loggedInUser) => setUser(loggedInUser),
            onLogout: () => setUser(null)
        };
    }, []);

    const handleNavigate = (view) => setCurrentView(view);
    const handleViewComplete = () => setCurrentView('dashboard');

    if (!user) {
        return <Login />;
    }

    return (
        <div className="app">
            <Header user={user} onNavigate={handleNavigate} currentView={currentView} />
            <main className="main-content">
                <MainContent currentView={currentView} user={user} onViewComplete={handleViewComplete} />
            </main>
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));
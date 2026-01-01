const { useState } = React;

function App() {
    return (
        <div className="app">
            <header className="app__header">
                <h1 className="app__title">English to Vietnamese Learning Platform</h1>
            </header>
            <main className="app__content">
                <p>Welcome to your language learning journey!</p>
            </main>
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));
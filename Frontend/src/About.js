import React, { useState } from 'react';
// import './WordleGame.css';

const WORD = 'REACT'; // Target word, can be randomized or fetched from backend
const MAX_ATTEMPTS = 6;

const About = () => {
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameStatus, setGameStatus] = useState('playing');

  const handleInputChange = (e) => {
    setCurrentGuess(e.target.value.toUpperCase());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentGuess.length !== WORD.length || gameStatus !== 'playing') return;

    const newGuesses = [...guesses, currentGuess];
    setGuesses(newGuesses);
    setCurrentGuess('');

    if (currentGuess === WORD) {
      setGameStatus('won');
    } else if (newGuesses.length >= MAX_ATTEMPTS) {
      setGameStatus('lost');
    }
  };

  const getLetterStyle = (letter, index) => {
    if (WORD[index] === letter) return 'correct';
    if (WORD.includes(letter)) return 'present';
    return 'absent';
  };

  return (
    <div className="wordle-container">
      <h2>Wordle Clone</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={currentGuess}
          onChange={handleInputChange}
          maxLength={WORD.length}
          disabled={gameStatus !== 'playing'}
          className="word-input"
        />
        <button type="submit" disabled={gameStatus !== 'playing'}>
          Guess
        </button>
      </form>

      <div className="guesses">
        {guesses.map((guess, i) => (
          <div key={i} className="guess-row">
            {guess.split('').map((letter, j) => (
              <span key={j} className={`letter-box ${getLetterStyle(letter, j)}`}>
                {letter}
              </span>
            ))}
          </div>
        ))}
      </div>

      {gameStatus === 'won' && <p className="win-msg">🎉 You guessed it!</p>}
      {gameStatus === 'lost' && <p className="lose-msg">The word was {WORD}. Try again!</p>}
    </div>
  );
};

export default About;

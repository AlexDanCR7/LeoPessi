import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

function Scoreboard({ scores, onBack }) {
  return (
    <div className="scoreboard">
      <h2>Scoreboard</h2>
      <table>
        <thead>
          <tr>
            <th>Player</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((score, index) => (
            <tr key={index}>
              <td>{score.player}</td>
              <td>{score.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={onBack}>Go Back</button>
    </div>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [scores, setScores] = useState([
    { player: 'Player X', score: 0 },
    { player: 'Player O', score: 0 },
  ]);
  const [isScoreboardVisible, setIsScoreboardVisible] = useState(false);

  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);

    const winner = calculateWinner(nextSquares);
    if (winner) {
      const updatedScores = scores.map(score => {
        if (score.player === 'Player X' && winner === 'X') {
          return { ...score, score: score.score + 1 };
        }
        if (score.player === 'Player O' && winner === 'O') {
          return { ...score, score: score.score + 1 };
        }
        return score;
      });
      setScores(updatedScores);
    }
  }

  function toggleScoreboard() {
    setIsScoreboardVisible(!isScoreboardVisible);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => setCurrentMove(move)}>{description}</button>
      </li>
    );
  });

  return (
    <Router>
      <div className="game">
        <div className="game-board">
          <Routes>
            <Route
              path="/"
              element={<Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />}
            />
            <Route
              path="/scoreboard"
              element={
                <Scoreboard scores={scores} onBack={toggleScoreboard} />
              }
            />
          </Routes>
          <button onClick={toggleScoreboard}>Toggle Scoreboard</button>
        </div>
        <div className="game-info">
          <Link to="/scoreboard">Go to Scoreboard</Link>
          <ol>{moves}</ol>
        </div>
      </div>
    </Router>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

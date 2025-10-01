import React, { useState } from "react";

/*
  Tic-Tac-Toe (Jogo da Velha) - estilo minimalista com sistema de pontuação
  - Quem vencer 3 rodadas (não precisa ser consecutivas) ganha a partida
*/

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
      return { winner: squares[a], line: lines[i] };
    }
  }
  return { winner: null, line: [] };
}

function Square({ value, onClick, highlight }) {
  return (
    <button
      onClick={onClick}
      className={`square ${highlight ? "highlight" : ""}`}
    >
      {value && <span className="mark">{value}</span>}
    </button>
  );
}

export default function TicTacToeApp() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [scores, setScores] = useState({ X: 0, O: 0 });
  const [champion, setChampion] = useState(null);

  function handleClick(i) {
    if (champion) return; // jogo finalizado

    const { winner } = calculateWinner(squares);
    if (winner || squares[i]) return;

    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  const { winner, line } = calculateWinner(squares);
  let status;
  if (champion) status = `Campeão: ${champion}!`; 
  else if (winner) status = `Rodada vencida por ${winner}`;
  else if (squares.every(Boolean)) status = "Empate!";
  else status = `Próximo: ${xIsNext ? "X" : "O"}`;

  // Atualiza pontuação quando alguém vence
  React.useEffect(() => {
    if (winner && !champion) {
      setScores(prev => {
        const updated = { ...prev, [winner]: prev[winner] + 1 };
        if (updated[winner] >= 3) {
          setChampion(winner);
        }
        return updated;
      });
    }
  }, [winner]);

  function restartBoard() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  }

  function resetMatch() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setScores({ X: 0, O: 0 });
    setChampion(null);
  }

  return (
    <div className="game">
      <h1>Jogo da Velha</h1>
      <div className="status">{status}</div>
      <div className="scoreboard">
        <div>Pontos X: {scores.X}</div>
        <div>Pontos O: {scores.O}</div>
      </div>
      <div className="game-board">
        {[0, 1, 2].map(row => (
          <div key={row} className="board-row">
            {[0, 1, 2].map(col => {
              const idx = row * 3 + col;
              return (
                <Square
                  key={idx}
                  value={squares[idx]}
                  onClick={() => handleClick(idx)}
                  highlight={line.includes(idx)}
                />
              );
            })}
          </div>
        ))}
      </div>
      <div className="controls">
        <button onClick={restartBoard} className="restart">Próxima Rodada</button>
        <button onClick={resetMatch} className="restart">Resetar Partida</button>
      </div>

      <style>{`
        body {
          background: #f8f9fa;
          margin: 0;
        }
        .game {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        h1 {
          font-size: 2rem;
          margin-bottom: 10px;
          color: #333;
        }
        .status {
          font-size: 1.2rem;
          margin-bottom: 10px;
          color: #555;
        }
        .scoreboard {
          display: flex;
          gap: 20px;
          margin-bottom: 20px;
          font-size: 1rem;
          color: #333;
        }
        .game-board {
          margin-bottom: 20px;
        }
        .board-row {
          display: flex;
        }
        .square {
          width: 80px;
          height: 80px;
          margin: 5px;
          font-size: 24px;
          font-weight: bold;
          text-align: center;
          border: 2px solid #333;
          border-radius: 8px;
          background: #fff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }
        .square:hover {
          background: #f0f0f0;
        }
        .highlight {
          background: #ffeaa7 !important;
        }
        .mark {
          display: inline-block;
          animation: pop 0.3s ease;
        }
        @keyframes pop {
          from { transform: scale(0.2); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .controls {
          display: flex;
          gap: 10px;
        }
        .restart {
          padding: 8px 16px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 1rem;
          transition: background 0.2s;
        }
        .restart:hover {
          background: #0056b3;
        }
      `}</style>
    </div>
  );
}

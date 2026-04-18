import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { RotateCcw } from "lucide-react";
import { submitScore } from "../services/api";

type Player = 'X' | 'O' | null;
type Board = Player[];

export function TicTacToeGame() {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');
  const [winner, setWinner] = useState<Player>(null);
  const [winningLine, setWinningLine] = useState<number[]>([]);
  const [isDraw, setIsDraw] = useState(false);
  const [player1Name, setPlayer1Name] = useState("Player 1");
  const [player2Name, setPlayer2Name] = useState("Player 2");
  const [gameStarted, setGameStarted] = useState(false);
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });

  const winningCombinations = [
    [0, 1, 2], // Top row
    [3, 4, 5], // Middle row
    [6, 7, 8], // Bottom row
    [0, 3, 6], // Left column
    [1, 4, 7], // Middle column
    [2, 5, 8], // Right column
    [0, 4, 8], // Diagonal top-left to bottom-right
    [2, 4, 6], // Diagonal top-right to bottom-left
  ];

  const startGame = () => {
    const p1 = prompt("Player One: Enter Your Name (you will be X)") || "Player 1";
    const p2 = prompt("Player Two: Enter Your Name (you will be O)") || "Player 2";
    setPlayer1Name(p1);
    setPlayer2Name(p2);
    setGameStarted(true);
  };

  useEffect(() => {
    startGame();
  }, []);

  const checkWinner = (board: Board): { winner: Player; line: number[] } => {
    for (const combination of winningCombinations) {
      const [a, b, c] = combination;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return { winner: board[a], line: combination };
      }
    }
    return { winner: null, line: [] };
  };

  const checkDraw = (board: Board): boolean => {
    return board.every(cell => cell !== null) && !checkWinner(board).winner;
  };

  const handleCellClick = (index: number) => {
    if (board[index] || winner || isDraw || !gameStarted) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const { winner: gameWinner, line } = checkWinner(newBoard);
    
    if (gameWinner) {
      setWinner(gameWinner);
      setWinningLine(line);
      setScores(prev => ({
        ...prev,
        [gameWinner]: prev[gameWinner] + 1
      }));

      // Submit score for winner
      const winnerName = gameWinner === 'X' ? player1Name : player2Name;
      const moves = newBoard.filter(cell => cell !== null).length;
      submitScore({
        playerName: winnerName,
        gameName: "Tic Tac Toe",
        score: 100,
        moves,
      }).catch(err => console.error("Failed to submit score:", err));
    } else if (checkDraw(newBoard)) {
      setIsDraw(true);
      setScores(prev => ({
        ...prev,
        draws: prev.draws + 1
      }));
    } else {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
    setWinningLine([]);
    setIsDraw(false);
  };

  const newGame = () => {
    const p1 = prompt("Player One: Enter Your Name (you will be X)") || "Player 1";
    const p2 = prompt("Player Two: Enter Your Name (you will be O)") || "Player 2";
    setPlayer1Name(p1);
    setPlayer2Name(p2);
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
    setWinningLine([]);
    setIsDraw(false);
    setScores({ X: 0, O: 0, draws: 0 });
    setGameStarted(true);
  };

  const getCurrentPlayerName = () => {
    return currentPlayer === 'X' ? player1Name : player2Name;
  };

  const getWinnerName = () => {
    return winner === 'X' ? player1Name : player2Name;
  };

  if (!gameStarted) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-center">
          <h2 className="mb-4">Loading game...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-purple)] bg-clip-text text-transparent">
          Tic Tac Toe
        </h1>
        {!winner && !isDraw ? (
          <p className="text-muted-foreground">
            {getCurrentPlayerName()}'s turn ({currentPlayer})
          </p>
        ) : winner ? (
          <p className="bg-gradient-to-r from-[var(--gaming-accent)] to-[var(--neon-purple)] bg-clip-text text-transparent">
            {getWinnerName()} wins! 🎉
          </p>
        ) : (
          <p className="text-muted-foreground">
            It's a draw! 🤝
          </p>
        )}
      </div>

      {/* Scoreboard */}
      <div className="flex gap-4">
        <div className="bg-card border rounded-lg p-4 min-w-[120px] text-center">
          <div className="text-sm text-muted-foreground mb-1">{player1Name}</div>
          <div className="text-2xl bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
            {scores.X}
          </div>
        </div>
        <div className="bg-card border rounded-lg p-4 min-w-[120px] text-center">
          <div className="text-sm text-muted-foreground mb-1">Draws</div>
          <div className="text-2xl text-muted-foreground">
            {scores.draws}
          </div>
        </div>
        <div className="bg-card border rounded-lg p-4 min-w-[120px] text-center">
          <div className="text-sm text-muted-foreground mb-1">{player2Name}</div>
          <div className="text-2xl bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
            {scores.O}
          </div>
        </div>
      </div>

      {/* Game Board */}
      <div className="bg-card border rounded-xl p-6 shadow-lg">
        <div className="grid grid-cols-3 gap-3">
          {board.map((cell, index) => (
            <button
              key={index}
              onClick={() => handleCellClick(index)}
              disabled={!!cell || !!winner || isDraw}
              className={`
                w-24 h-24 rounded-lg border-2 transition-all
                flex items-center justify-center text-4xl
                ${winningLine.includes(index) 
                  ? 'bg-primary/20 border-primary' 
                  : 'border-border hover:border-primary'
                }
                ${!cell && !winner && !isDraw ? 'cursor-pointer hover:bg-accent' : 'cursor-not-allowed'}
                ${cell === 'X' ? 'text-blue-500' : cell === 'O' ? 'text-red-500' : ''}
              `}
            >
              {cell}
            </button>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <Button onClick={resetGame} variant="outline" className="gap-2">
          <RotateCcw className="h-4 w-4" />
          Play Again
        </Button>
        <Button onClick={newGame} className="gap-2">
          <RotateCcw className="h-4 w-4" />
          New Game
        </Button>
      </div>

      {/* Instructions */}
      <div className="text-center text-sm text-muted-foreground max-w-md">
        <p>Click on any empty cell to place your mark. Get three in a row (horizontally, vertically, or diagonally) to win!</p>
      </div>
    </div>
  );
}

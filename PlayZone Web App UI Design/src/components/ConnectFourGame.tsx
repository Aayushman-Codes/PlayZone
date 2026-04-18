import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { RotateCcw } from "lucide-react";
import { submitScore } from "../services/api";

type CellColor = 'empty' | 'player1' | 'player2';
type Board = CellColor[][];

const ROWS = 6;
const COLS = 7;
const PLAYER1_COLOR = 'rgb(59, 130, 246)'; // Blue
const PLAYER2_COLOR = 'rgb(239, 68, 68)'; // Red
const EMPTY_COLOR = 'rgb(75, 85, 99)'; // Gray

export function ConnectFourGame() {
  const [board, setBoard] = useState<Board>(() => 
    Array(ROWS).fill(null).map(() => Array(COLS).fill('empty'))
  );
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [player1Name, setPlayer1Name] = useState("Player 1");
  const [player2Name, setPlayer2Name] = useState("Player 2");
  const [gameStarted, setGameStarted] = useState(false);
  const [hoveredCol, setHoveredCol] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);

  const resetGame = () => {
    const p1 = prompt("Player One: Enter Your Name (you will be Blue)") || "Player 1";
    const p2 = prompt("Player Two: Enter Your Name (you will be Red)") || "Player 2";
    setPlayer1Name(p1);
    setPlayer2Name(p2);
    setBoard(Array(ROWS).fill(null).map(() => Array(COLS).fill('empty')));
    setCurrentPlayer(1);
    setGameOver(false);
    setWinner(null);
    setGameStarted(true);
    setMoves(0);
  };

  const startGame = () => {
    const p1 = prompt("Player One: Enter Your Name (you will be Blue)") || "Player 1";
    const p2 = prompt("Player Two: Enter Your Name (you will be Red)") || "Player 2";
    setPlayer1Name(p1);
    setPlayer2Name(p2);
    setGameStarted(true);
  };

  useEffect(() => {
    startGame();
  }, []);

  const checkBottom = (col: number): number => {
    for (let row = ROWS - 1; row >= 0; row--) {
      if (board[row][col] === 'empty') {
        return row;
      }
    }
    return -1;
  };

  const checkWin = (row: number, col: number, player: 'player1' | 'player2'): boolean => {
    // Check horizontal
    for (let c = 0; c < COLS - 3; c++) {
      if (
        board[row][c] === player &&
        board[row][c + 1] === player &&
        board[row][c + 2] === player &&
        board[row][c + 3] === player
      ) {
        return true;
      }
    }

    // Check vertical
    for (let r = 0; r < ROWS - 3; r++) {
      if (
        board[r][col] === player &&
        board[r + 1][col] === player &&
        board[r + 2][col] === player &&
        board[r + 3][col] === player
      ) {
        return true;
      }
    }

    // Check diagonal (down-right)
    for (let r = 0; r < ROWS - 3; r++) {
      for (let c = 0; c < COLS - 3; c++) {
        if (
          board[r][c] === player &&
          board[r + 1][c + 1] === player &&
          board[r + 2][c + 2] === player &&
          board[r + 3][c + 3] === player
        ) {
          return true;
        }
      }
    }

    // Check diagonal (up-right)
    for (let r = 3; r < ROWS; r++) {
      for (let c = 0; c < COLS - 3; c++) {
        if (
          board[r][c] === player &&
          board[r - 1][c + 1] === player &&
          board[r - 2][c + 2] === player &&
          board[r - 3][c + 3] === player
        ) {
          return true;
        }
      }
    }

    return false;
  };

  const handleColumnClick = (col: number) => {
    if (gameOver || !gameStarted) return;

    const row = checkBottom(col);
    if (row === -1) return; // Column is full

    const newBoard = board.map(row => [...row]);
    const playerColor: CellColor = currentPlayer === 1 ? 'player1' : 'player2';
    newBoard[row][col] = playerColor;
    setBoard(newBoard);
    setMoves(moves + 1);

    // Check for win with the new board
    let hasWon = false;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (newBoard[r][c] === playerColor && checkWinWithBoard(newBoard, r, c, playerColor)) {
          hasWon = true;
          break;
        }
      }
      if (hasWon) break;
    }

    if (hasWon) {
      setGameOver(true);
      const winnerName = currentPlayer === 1 ? player1Name : player2Name;
      setWinner(winnerName);
      
      // Submit score to leaderboard
      submitScore({
        playerName: winnerName,
        gameName: "Connect Four",
        score: 100,
        moves: moves + 1,
      }).catch(err => console.error("Failed to submit score:", err));
    } else {
      setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
    }
  };

  const checkWinWithBoard = (board: Board, row: number, col: number, player: CellColor): boolean => {
    // Check horizontal
    for (let c = 0; c < COLS - 3; c++) {
      if (
        board[row][c] === player &&
        board[row][c + 1] === player &&
        board[row][c + 2] === player &&
        board[row][c + 3] === player
      ) {
        return true;
      }
    }

    // Check vertical
    for (let r = 0; r < ROWS - 3; r++) {
      if (
        board[r][col] === player &&
        board[r + 1][col] === player &&
        board[r + 2][col] === player &&
        board[r + 3][col] === player
      ) {
        return true;
      }
    }

    // Check diagonal (down-right)
    for (let r = 0; r < ROWS - 3; r++) {
      for (let c = 0; c < COLS - 3; c++) {
        if (
          board[r][c] === player &&
          board[r + 1][c + 1] === player &&
          board[r + 2][c + 2] === player &&
          board[r + 3][c + 3] === player
        ) {
          return true;
        }
      }
    }

    // Check diagonal (up-right)
    for (let r = 3; r < ROWS; r++) {
      for (let c = 0; c < COLS - 3; c++) {
        if (
          board[r][c] === player &&
          board[r - 1][c + 1] === player &&
          board[r - 2][c + 2] === player &&
          board[r - 3][c + 3] === player
        ) {
          return true;
        }
      }
    }

    return false;
  };

  const getCellColor = (cell: CellColor) => {
    if (cell === 'player1') return 'bg-blue-500';
    if (cell === 'player2') return 'bg-red-500';
    return 'bg-muted';
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
          Connect Four
        </h1>
        {!gameOver ? (
          <p className="text-muted-foreground">
            {currentPlayer === 1 ? player1Name : player2Name}: it's your turn, 
            pick a column to drop your {currentPlayer === 1 ? 'blue' : 'red'} chip
          </p>
        ) : (
          <p className="bg-gradient-to-r from-[var(--gaming-accent)] to-[var(--neon-purple)] bg-clip-text text-transparent">
            {winner} has won! 🎉
          </p>
        )}
      </div>

      {/* Game Board */}
      <div className="bg-card border rounded-xl p-4 shadow-lg">
        <div className="grid gap-1">
          {board.map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-1">
              {row.map((cell, colIndex) => (
                <button
                  key={colIndex}
                  onClick={() => handleColumnClick(colIndex)}
                  onMouseEnter={() => setHoveredCol(colIndex)}
                  onMouseLeave={() => setHoveredCol(null)}
                  disabled={gameOver}
                  className={`
                    w-16 h-16 rounded-full border-4 border-border transition-all
                    ${getCellColor(cell)}
                    ${!gameOver && hoveredCol === colIndex ? 'scale-105 ring-2 ring-primary' : ''}
                    ${!gameOver ? 'cursor-pointer hover:opacity-80' : 'cursor-not-allowed'}
                  `}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Reset Button */}
      <Button onClick={resetGame} className="gap-2">
        <RotateCcw className="h-4 w-4" />
        New Game
      </Button>

      {/* Instructions */}
      <div className="text-center text-sm text-muted-foreground max-w-md">
        <p>Click on any column to drop your chip. Connect four chips in a row (horizontally, vertically, or diagonally) to win!</p>
      </div>
    </div>
  );
}
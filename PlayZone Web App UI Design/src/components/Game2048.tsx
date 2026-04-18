import { useState, useEffect, useCallback } from "react";
import { Button } from "./ui/button";
import { RotateCcw, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";
import { submitScore } from "../services/api";
import { promptForPlayerName } from "./ScoreSubmission";

type Grid = number[][];

const SIZE = 4;

export function Game2048() {
  const [grid, setGrid] = useState<Grid>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [hasWon, setHasWon] = useState(false);
  const [playerName, setPlayerName] = useState("Player 1");
  const [moves, setMoves] = useState(0);

  const initializeGrid = (): Grid => {
    const newGrid: Grid = Array(SIZE).fill(null).map(() => Array(SIZE).fill(0));
    return newGrid;
  };

  const addRandomTile = (grid: Grid): Grid => {
    const emptyCells: [number, number][] = [];
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        if (grid[i][j] === 0) {
          emptyCells.push([i, j]);
        }
      }
    }
    
    if (emptyCells.length > 0) {
      const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      const newGrid = grid.map(row => [...row]);
      newGrid[row][col] = 2;
      return newGrid;
    }
    return grid;
  };

  const resetGame = () => {
    let newGrid = initializeGrid();
    newGrid = addRandomTile(newGrid);
    newGrid = addRandomTile(newGrid);
    setGrid(newGrid);
    setScore(0);
    setGameOver(false);
    setHasWon(false);
    setMoves(0);
  };

  useEffect(() => {
    const name = promptForPlayerName("Player 1");
    setPlayerName(name);
    resetGame();
  }, []);

  const checkGameOver = (grid: Grid): boolean => {
    // Check if there are any empty cells
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        if (grid[i][j] === 0) return false;
      }
    }

    // Check if any adjacent cells can be merged
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        if (j < SIZE - 1 && grid[i][j] === grid[i][j + 1]) return false;
        if (i < SIZE - 1 && grid[i][j] === grid[i + 1][j]) return false;
      }
    }

    return true;
  };

  const checkWin = (grid: Grid): boolean => {
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        if (grid[i][j] === 2048) return true;
      }
    }
    return false;
  };

  const moveLeft = (grid: Grid): { grid: Grid; scoreIncrease: number; moved: boolean } => {
    let newGrid = grid.map(row => [...row]);
    let scoreIncrease = 0;
    let moved = false;

    for (let i = 0; i < SIZE; i++) {
      let row = newGrid[i].filter(val => val !== 0);
      
      // Merge tiles
      for (let j = 0; j < row.length - 1; j++) {
        if (row[j] === row[j + 1]) {
          row[j] *= 2;
          scoreIncrease += row[j];
          row.splice(j + 1, 1);
        }
      }
      
      // Fill with zeros
      while (row.length < SIZE) {
        row.push(0);
      }
      
      // Check if row changed
      if (JSON.stringify(newGrid[i]) !== JSON.stringify(row)) {
        moved = true;
      }
      
      newGrid[i] = row;
    }

    return { grid: newGrid, scoreIncrease, moved };
  };

  const moveRight = (grid: Grid): { grid: Grid; scoreIncrease: number; moved: boolean } => {
    let newGrid = grid.map(row => [...row]);
    let scoreIncrease = 0;
    let moved = false;

    for (let i = 0; i < SIZE; i++) {
      let row = newGrid[i].filter(val => val !== 0);
      
      // Merge tiles from right
      for (let j = row.length - 1; j > 0; j--) {
        if (row[j] === row[j - 1]) {
          row[j] *= 2;
          scoreIncrease += row[j];
          row.splice(j - 1, 1);
          j--;
        }
      }
      
      // Fill with zeros at the beginning
      while (row.length < SIZE) {
        row.unshift(0);
      }
      
      // Check if row changed
      if (JSON.stringify(newGrid[i]) !== JSON.stringify(row)) {
        moved = true;
      }
      
      newGrid[i] = row;
    }

    return { grid: newGrid, scoreIncrease, moved };
  };

  const rotateGrid = (grid: Grid): Grid => {
    const newGrid: Grid = Array(SIZE).fill(null).map(() => Array(SIZE).fill(0));
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        newGrid[j][SIZE - 1 - i] = grid[i][j];
      }
    }
    return newGrid;
  };

  const reverseRotateGrid = (grid: Grid): Grid => {
    const newGrid: Grid = Array(SIZE).fill(null).map(() => Array(SIZE).fill(0));
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        newGrid[SIZE - 1 - j][i] = grid[i][j];
      }
    }
    return newGrid;
  };

  const moveUp = (grid: Grid): { grid: Grid; scoreIncrease: number; moved: boolean } => {
    let rotated = reverseRotateGrid(grid);
    const result = moveLeft(rotated);
    result.grid = rotateGrid(result.grid);
    return result;
  };

  const moveDown = (grid: Grid): { grid: Grid; scoreIncrease: number; moved: boolean } => {
    let rotated = rotateGrid(grid);
    const result = moveLeft(rotated);
    result.grid = reverseRotateGrid(result.grid);
    return result;
  };

  const handleMove = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    if (gameOver || hasWon) return;

    let result: { grid: Grid; scoreIncrease: number; moved: boolean };

    switch (direction) {
      case 'left':
        result = moveLeft(grid);
        break;
      case 'right':
        result = moveRight(grid);
        break;
      case 'up':
        result = moveUp(grid);
        break;
      case 'down':
        result = moveDown(grid);
        break;
    }

    if (result.moved) {
      const newGrid = addRandomTile(result.grid);
      setGrid(newGrid);
      setScore(score + result.scoreIncrease);
      setMoves(moves + 1);

      if (checkWin(newGrid) && !hasWon) {
        setHasWon(true);
      }

      if (checkGameOver(newGrid)) {
        setGameOver(true);
        // Submit normalized score to leaderboard
        const rawScore = score + result.scoreIncrease;
        const normalizedScore = Math.max(50, Math.round(rawScore / 10));
        submitScore({
          playerName,
          gameName: "2048",
          score: normalizedScore,
          moves: moves + 1,
        }).catch(err => console.error("Failed to submit score:", err));
      }
    }
  }, [grid, score, gameOver, hasWon, moves, playerName]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handleMove('left');
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleMove('right');
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        handleMove('up');
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        handleMove('down');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleMove]);

  const getTileColor = (value: number): string => {
    const colors: { [key: number]: string } = {
      0: 'bg-muted',
      2: 'bg-slate-200 dark:bg-slate-700',
      4: 'bg-slate-300 dark:bg-slate-600',
      8: 'bg-orange-300 dark:bg-orange-600',
      16: 'bg-orange-400 dark:bg-orange-700',
      32: 'bg-orange-500 dark:bg-orange-800',
      64: 'bg-red-400 dark:bg-red-700',
      128: 'bg-yellow-400 dark:bg-yellow-600',
      256: 'bg-yellow-500 dark:bg-yellow-700',
      512: 'bg-yellow-600 dark:bg-yellow-800',
      1024: 'bg-purple-500 dark:bg-purple-700',
      2048: 'bg-purple-600 dark:bg-purple-800',
    };
    return colors[value] || 'bg-primary';
  };

  const getTileTextColor = (value: number): string => {
    return value > 4 ? 'text-white' : 'text-foreground';
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-purple)] bg-clip-text text-transparent">
          2048 Game
        </h1>
        <p className="text-muted-foreground">
          Use arrow keys or buttons to play. Get to 2048 to win!
        </p>
      </div>

      {/* Score */}
      <div className="bg-card border rounded-xl p-6 min-w-[200px] text-center shadow-lg">
        <div className="text-muted-foreground mb-1">Score</div>
        <div className="text-4xl bg-gradient-to-r from-[var(--gaming-accent)] to-[var(--neon-purple)] bg-clip-text text-transparent">
          {score}
        </div>
      </div>

      {/* Game Status */}
      {gameOver && (
        <div className="bg-destructive/10 border border-destructive rounded-lg p-4">
          <p className="text-destructive">Game Over! No more moves available.</p>
        </div>
      )}
      
      {hasWon && !gameOver && (
        <div className="bg-green-500/10 border border-green-500 rounded-lg p-4">
          <p className="text-green-600 dark:text-green-400">Congratulations! You reached 2048! 🎉</p>
        </div>
      )}

      {/* Game Grid */}
      <div className="bg-card border rounded-xl p-4 shadow-lg">
        <div className="grid grid-cols-4 gap-2">
          {grid.map((row, i) =>
            row.map((cell, j) => (
              <div
                key={`${i}-${j}`}
                className={`
                  w-20 h-20 rounded-lg flex items-center justify-center
                  transition-all duration-200
                  ${getTileColor(cell)}
                  ${getTileTextColor(cell)}
                  ${cell !== 0 ? 'scale-100' : 'scale-95'}
                `}
              >
                {cell !== 0 && <span className="font-bold text-2xl">{cell}</span>}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-4">
        <div className="flex flex-col items-center gap-2">
          <Button onClick={() => handleMove('up')} variant="outline" size="icon" className="w-12 h-12">
            <ArrowUp className="h-5 w-5" />
          </Button>
          <div className="flex gap-2">
            <Button onClick={() => handleMove('left')} variant="outline" size="icon" className="w-12 h-12">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Button onClick={() => handleMove('down')} variant="outline" size="icon" className="w-12 h-12">
              <ArrowDown className="h-5 w-5" />
            </Button>
            <Button onClick={() => handleMove('right')} variant="outline" size="icon" className="w-12 h-12">
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <Button onClick={resetGame} className="gap-2 w-full">
          <RotateCcw className="h-4 w-4" />
          New Game
        </Button>
      </div>

      {/* Instructions */}
      <div className="text-center text-sm text-muted-foreground max-w-md">
        <p>Use arrow keys or click the buttons to move tiles. When two tiles with the same number touch, they merge into one!</p>
      </div>
    </div>
  );
}
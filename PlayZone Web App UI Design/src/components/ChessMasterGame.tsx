import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Crown, Gem, Building2, Hexagon, Shield, Circle } from "lucide-react";
import { submitScore } from "../services/api";
import { promptForPlayerNames } from "./ScoreSubmission";

type PieceType = "pawn" | "rook" | "knight" | "bishop" | "queen" | "king";
type Player = "white" | "black";

type Piece = {
  type: PieceType;
  player: Player;
} | null;

type Position = {
  row: number;
  col: number;
};

const pieceIcons = {
  king: Crown,
  queen: Gem,
  rook: Building2,
  bishop: Hexagon,
  knight: Shield,
  pawn: Circle,
};

function createInitialBoard(): Piece[][] {
  const board: Piece[][] = Array(8).fill(null).map(() => Array(8).fill(null));

  // Black pieces
  board[0] = [
    { type: "rook", player: "black" },
    { type: "knight", player: "black" },
    { type: "bishop", player: "black" },
    { type: "queen", player: "black" },
    { type: "king", player: "black" },
    { type: "bishop", player: "black" },
    { type: "knight", player: "black" },
    { type: "rook", player: "black" },
  ];
  board[1] = Array(8).fill({ type: "pawn", player: "black" });

  // White pieces
  board[6] = Array(8).fill({ type: "pawn", player: "white" });
  board[7] = [
    { type: "rook", player: "white" },
    { type: "knight", player: "white" },
    { type: "bishop", player: "white" },
    { type: "queen", player: "white" },
    { type: "king", player: "white" },
    { type: "bishop", player: "white" },
    { type: "knight", player: "white" },
    { type: "rook", player: "white" },
  ];

  return board;
}

export function ChessMasterGame() {
  const [board, setBoard] = useState<Piece[][]>(createInitialBoard());
  const [selectedSquare, setSelectedSquare] = useState<Position | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<Player>("white");
  const [capturedPieces, setCapturedPieces] = useState<{ white: Piece[]; black: Piece[] }>({
    white: [],
    black: [],
  });
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [message, setMessage] = useState("White's turn");
  const [whitePlayerName, setWhitePlayerName] = useState("White");
  const [blackPlayerName, setBlackPlayerName] = useState("Black");

  useEffect(() => {
    const [p1, p2] = promptForPlayerNames(2);
    setWhitePlayerName(p1 || "White");
    setBlackPlayerName(p2 || "Black");
  }, []);

  const isValidMove = (from: Position, to: Position): boolean => {
    const piece = board[from.row][from.col];
    if (!piece) return false;

    const targetPiece = board[to.row][to.col];
    if (targetPiece && targetPiece.player === piece.player) return false;

    const rowDiff = Math.abs(to.row - from.row);
    const colDiff = Math.abs(to.col - from.col);

    switch (piece.type) {
      case "pawn":
        const direction = piece.player === "white" ? -1 : 1;
        const startRow = piece.player === "white" ? 6 : 1;
        
        // Move forward
        if (from.col === to.col && !targetPiece) {
          if (to.row === from.row + direction) return true;
          if (from.row === startRow && to.row === from.row + 2 * direction) {
            return !board[from.row + direction][from.col];
          }
        }
        
        // Capture diagonally
        if (colDiff === 1 && to.row === from.row + direction && targetPiece) {
          return true;
        }
        return false;

      case "rook":
        if (from.row === to.row || from.col === to.col) {
          return isPathClear(from, to);
        }
        return false;

      case "bishop":
        if (rowDiff === colDiff) {
          return isPathClear(from, to);
        }
        return false;

      case "queen":
        if (from.row === to.row || from.col === to.col || rowDiff === colDiff) {
          return isPathClear(from, to);
        }
        return false;

      case "knight":
        return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);

      case "king":
        return rowDiff <= 1 && colDiff <= 1;

      default:
        return false;
    }
  };

  const isPathClear = (from: Position, to: Position): boolean => {
    const rowDir = to.row > from.row ? 1 : to.row < from.row ? -1 : 0;
    const colDir = to.col > from.col ? 1 : to.col < from.col ? -1 : 0;

    let currentRow = from.row + rowDir;
    let currentCol = from.col + colDir;

    while (currentRow !== to.row || currentCol !== to.col) {
      if (board[currentRow][currentCol]) return false;
      currentRow += rowDir;
      currentCol += colDir;
    }

    return true;
  };

  const handleSquareClick = (row: number, col: number) => {
    const piece = board[row][col];

    if (selectedSquare) {
      // Try to move
      if (isValidMove(selectedSquare, { row, col })) {
        const newBoard = board.map(r => [...r]);
        const movingPiece = newBoard[selectedSquare.row][selectedSquare.col];
        const capturedPiece = newBoard[row][col];

        if (capturedPiece) {
          setCapturedPieces(prev => ({
            ...prev,
            [currentPlayer]: [...prev[currentPlayer], capturedPiece],
          }));
        }

        newBoard[row][col] = movingPiece;
        newBoard[selectedSquare.row][selectedSquare.col] = null;

        setBoard(newBoard);
        setSelectedSquare(null);

        // Add to move history
        const moveNotation = `${movingPiece!.type} ${String.fromCharCode(97 + selectedSquare.col)}${8 - selectedSquare.row} → ${String.fromCharCode(97 + col)}${8 - row}`;
        setMoveHistory(prev => [...prev, moveNotation]);

        // Switch player
        const nextPlayer = currentPlayer === "white" ? "black" : "white";
        setCurrentPlayer(nextPlayer);
        setMessage(`${nextPlayer === "white" ? "White" : "Black"}'s turn`);

        // Check for king capture (simple win condition)
        if (capturedPiece?.type === "king") {
          const winnerName = currentPlayer === "white" ? whitePlayerName : blackPlayerName;
          setMessage(`${winnerName} wins! King captured!`);

          submitScore({
            playerName: winnerName,
            gameName: "Chess Master",
            score: 150,
            moves: moveHistory.length + 1,
          }).catch(err => console.error("Failed to submit score:", err));
        }
      } else {
        setSelectedSquare(null);
      }
    } else if (piece && piece.player === currentPlayer) {
      // Select piece
      setSelectedSquare({ row, col });
    }
  };

  const resetGame = () => {
    setBoard(createInitialBoard());
    setSelectedSquare(null);
    setCurrentPlayer("white");
    setCapturedPieces({ white: [], black: [] });
    setMoveHistory([]);
    setMessage("White's turn");
  };

  const renderSquare = (row: number, col: number) => {
    const piece = board[row][col];
    const isLight = (row + col) % 2 === 0;
    const isSelected = selectedSquare?.row === row && selectedSquare?.col === col;

    const PieceIcon = piece ? pieceIcons[piece.type] : null;

    return (
      <button
        key={`${row}-${col}`}
        onClick={() => handleSquareClick(row, col)}
        className={`w-14 h-14 md:w-16 md:h-16 flex items-center justify-center transition-colors ${
          isLight ? "bg-amber-100" : "bg-amber-700"
        } ${
          isSelected ? "ring-4 ring-blue-500" : ""
        } hover:opacity-80`}
      >
        {PieceIcon && piece && (
          <div className={`p-1.5 rounded-full ${
            piece.player === "white" 
              ? "bg-white border-2 border-gray-800 text-gray-900" 
              : "bg-gray-900 border-2 border-white text-white"
          }`}>
            <PieceIcon size={piece.type === "pawn" ? 16 : 24} strokeWidth={2.5} />
          </div>
        )}
      </button>
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Chess Board */}
        <div className="lg:col-span-2">
          <Card className="p-4">
            <div className="mb-4 flex justify-between items-center">
              <h3>{message}</h3>
              <button
                onClick={resetGame}
                className="px-4 py-2 bg-gradient-to-r from-primary to-accent text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                New Game
              </button>
            </div>

            {/* Column labels (a-h) */}
            <div className="flex justify-center mb-1">
              <div className="w-8"></div>
              {["a", "b", "c", "d", "e", "f", "g", "h"].map(label => (
                <div key={label} className="w-14 md:w-16 text-center text-sm opacity-60">
                  {label}
                </div>
              ))}
            </div>

            <div className="flex justify-center">
              {/* Row labels (8-1) */}
              <div>
                {[0, 1, 2, 3, 4, 5, 6, 7].map(row => (
                  <div key={row} className="w-8 h-14 md:h-16 flex items-center justify-center text-sm opacity-60">
                    {8 - row}
                  </div>
                ))}
              </div>

              {/* Board */}
              <div className="inline-block border-4 border-gray-800">
                {board.map((row, rowIndex) => (
                  <div key={rowIndex} className="flex">
                    {row.map((_, colIndex) => renderSquare(rowIndex, colIndex))}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Side Panel */}
        <div className="space-y-4">
          {/* Captured Pieces */}
          <Card className="p-4">
            <h3 className="mb-3">Captured Pieces</h3>
            <div className="space-y-3">
              <div>
                <div className="text-sm opacity-60 mb-1">Black captured:</div>
                <div className="flex flex-wrap gap-1">
                  {capturedPieces.white.map((piece, idx) => {
                    const PieceIcon = pieceIcons[piece!.type];
                    return (
                      <div key={idx} className="p-1 rounded-full bg-white border border-gray-800 text-gray-900">
                        <PieceIcon size={16} strokeWidth={2.5} />
                      </div>
                    );
                  })}
                  {capturedPieces.white.length === 0 && (
                    <span className="text-sm opacity-40">None</span>
                  )}
                </div>
              </div>
              <div>
                <div className="text-sm opacity-60 mb-1">White captured:</div>
                <div className="flex flex-wrap gap-1">
                  {capturedPieces.black.map((piece, idx) => {
                    const PieceIcon = pieceIcons[piece!.type];
                    return (
                      <div key={idx} className="p-1 rounded-full bg-gray-900 border border-white text-white">
                        <PieceIcon size={16} strokeWidth={2.5} />
                      </div>
                    );
                  })}
                  {capturedPieces.black.length === 0 && (
                    <span className="text-sm opacity-40">None</span>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Move History */}
          <Card className="p-4">
            <h3 className="mb-3">Move History</h3>
            <div className="max-h-64 overflow-y-auto space-y-1">
              {moveHistory.length === 0 ? (
                <p className="text-sm opacity-40">No moves yet</p>
              ) : (
                moveHistory.map((move, idx) => (
                  <div key={idx} className="text-sm">
                    <span className="opacity-60">{idx + 1}.</span> {move}
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

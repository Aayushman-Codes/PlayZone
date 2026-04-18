import { useState } from "react";
import { GameCard } from "../components/GameCard";
import connect4Image from "../images/connect4.jpg";
import game2048Image from "../images/2048.jpg";
import ticTacToeImage from "../images/tictactoe.png";
import memoryMatchImage from "../images/memory_match.png";
import blackjackImage from "../images/blackjack.jpg";
import puzzleMasterImage from "../images/puzzle_master.jpg";
import chessImage from "../images/chess.jpg";

interface GamesPageProps {
  onPlayGame: (gameId: string) => void;
}

const games = [
  {
    id: "connect-four",
    title: "Connect Four",
    description: "Classic strategy game. Drop discs and connect four in a row to win!",
    image: connect4Image,
    rating: 4.8,
    players: "2 Players"
  },
  {
    id: "2048",
    title: "2048",
    description: "Slide and merge tiles to reach 2048. Addictive puzzle game!",
    image: game2048Image,
    rating: 4.9,
    players: "Single Player"
  },
  {
    id: "tic-tac-toe",
    title: "Tic-Tac-Toe",
    description: "Simple yet fun! Get three in a row to win.",
    image: ticTacToeImage,
    rating: 4.3,
    players: "Single Player"
  },
  {
    id: "memory-match",
    title: "Memory Match",
    description: "Test your memory by matching pairs of cards.",
    image: memoryMatchImage,
    rating: 4.5,
    players: "Single Player"
  },
  {
    id: "blackjack",
    title: "Blackjack",
    description: "Beat the dealer and get as close to 21 as possible without going over.",
    image: blackjackImage,
    rating: 4.7,
    players: "2 Players"
  },
  {
    id: "puzzle",
    title: "Puzzle Master",
    description: "Challenge your brain with hundreds of mind-bending puzzles.",
    image: puzzleMasterImage,
    rating: 4.6,
    players: "Single Player"
  },
  {
    id: "chess",
    title: "Chess Master",
    description: "The ultimate strategic board game. Plan your moves carefully!",
    image: chessImage,
    rating: 4.9,
    players: "2 Players"
  }
];

export function GamesPage({ onPlayGame }: GamesPageProps) {
  const [filter, setFilter] = useState("all");

  const filteredGames = filter === "all" 
    ? games 
    : filter === "popular" 
    ? games.filter(g => g.rating >= 4.7)
    : games.slice(0, 3);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="mb-2">All Games</h1>
        <p className="text-muted-foreground">
          Browse and play from our collection of exciting games
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === "all" 
              ? "bg-primary text-primary-foreground" 
              : "bg-card hover:bg-accent"
          }`}
        >
          All Games
        </button>
        <button
          onClick={() => setFilter("popular")}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === "popular" 
              ? "bg-primary text-primary-foreground" 
              : "bg-card hover:bg-accent"
          }`}
        >
          Popular
        </button>
        <button
          onClick={() => setFilter("new")}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === "new" 
              ? "bg-primary text-primary-foreground" 
              : "bg-card hover:bg-accent"
          }`}
        >
          New
        </button>
      </div>

      {/* Games grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGames.map((game) => (
          <GameCard 
            key={game.id} 
            title={game.title}
            description={game.description}
            image={game.image}
            rating={game.rating}
            players={game.players}
            featured={false}
            onPlay={() => onPlayGame(game.id)}
          />
        ))}
      </div>
    </div>
  );
}
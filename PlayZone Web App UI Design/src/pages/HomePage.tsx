import { GameCard } from "../components/GameCard";
import { Card } from "../components/ui/card";
import { Sparkles, TrendingUp, Clock } from "lucide-react";
import connect4Image from "../images/connect4.jpg";
import game2048Image from "../images/2048.jpg";
import memoryMatchImage from "../images/memory_match.png";
import ticTacToeImage from "../images/tictactoe.png";
import puzzleMasterImage from "../images/puzzle_master.jpg";
import chessImage from "../images/chess.jpg";
import blackjackImage from "../images/blackjack.jpg";

interface HomePageProps {
  onPlayGame: (gameId: string) => void;
}

const featuredGames = [
  {
    id: "connect-four",
    title: "Connect Four",
    description: "Classic strategy game. Drop discs and connect four in a row to win!",
    image: connect4Image,
    rating: 4.8,
    players: "2 Players",
    featured: true
  },
  {
    id: "2048",
    title: "2048",
    description: "Slide and merge tiles to reach 2048. Addictive puzzle game!",
    image: game2048Image,
    rating: 4.9,
    players: "Single Player",
    featured: true
  },
  {
    id: "blackjack",
    title: "Blackjack",
    description: "Beat the dealer and get as close to 21 as possible without going over.",
    image: blackjackImage,
    rating: 4.7,
    players: "2 Players",
    featured: true
  }
];

const recentGames = [
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
  }
];

const topGames = [
  {
    id: "chess",
    title: "Chess Master",
    description: "The ultimate strategic board game. Plan your moves carefully!",
    image: chessImage,
    rating: 4.9,
    players: "2 Players",
    featured: false
  },
  {
    id: "puzzle",
    title: "Puzzle Master",
    description: "Challenge your brain with hundreds of mind-bending puzzles.",
    image: puzzleMasterImage,
    rating: 4.6,
    players: "Single Player",
    featured: false
  },
  {
    id: "2048",
    title: "2048",
    description: "Slide and merge tiles to reach 2048. Addictive puzzle game!",
    image: game2048Image,
    rating: 4.9,
    players: "Single Player",
    featured: false
  }
];

export function HomePage({ onPlayGame }: HomePageProps) {
  return (
    <div className="p-6 space-y-8">
      {/* Hero
      <Card className="relative overflow-hidden border-0 bg-gradient-to-r from-primary via-accent to-[var(--neon-purple)]">
        <div className="p-8 md:p-12">
          <div className="max-w-2xl text-white">
            <h1 className="mb-4 flex items-center gap-3">
              <Sparkles className="h-8 w-8" />
              Welcome to PlayZone!
            </h1>
            <p className="text-lg opacity-95 mb-6">
              Dive into a world of exciting games. Challenge yourself, compete with friends, and have endless fun!
            </p>
            <div className="flex gap-4">
              <button className="px-6 py-3 bg-white text-primary rounded-lg hover:bg-white/90 transition-colors">
                Explore Games
              </button>
              <button className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors">
                View Leaderboard
              </button>
            </div>
          </div>
        </div>
      </Card> */}

      {/* Featured */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="h-6 w-6 text-primary" />
          <h2>Featured Games</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredGames.map((game) => (
            <GameCard
              key={game.id}
              title={game.title}
              description={game.description}
              image={game.image}
              rating={game.rating}
              players={game.players}
              featured={game.featured}
              onPlay={() => onPlayGame(game.id)}
            />
          ))}
        </div>
      </section>

      {/* Recently Played */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <Clock className="h-6 w-6 text-accent" />
          <h2>Recently Played</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentGames.map((game) => (
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
      </section>

      {/* Top Rated */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="h-6 w-6 text-[var(--neon-purple)]" />
          <h2>Top Rated Games</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topGames.map((game) => (
            <GameCard
              key={game.id}
              title={game.title}
              description={game.description}
              image={game.image}
              rating={game.rating}
              players={game.players}
              featured={game.featured}
              onPlay={() => onPlayGame(game.id)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
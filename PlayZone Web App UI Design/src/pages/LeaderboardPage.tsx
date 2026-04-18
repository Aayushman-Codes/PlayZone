import { useState, useEffect } from "react";
import { Trophy, Medal, Award, TrendingUp, Filter, RotateCcw } from "lucide-react";
import { getLeaderboard, LeaderboardEntry } from "../services/api";
import { Button } from "../components/ui/button";

const GAMES = [
  "All Games",
  "Connect Four",
  "2048",
  "Tic Tac Toe",
  "Memory Match",
  "Blackjack",
  "Chess Master",
  "Puzzle Master"
];

interface LeaderboardPageProps {
  initialGame?: string | null;
}

export function LeaderboardPage({ initialGame }: LeaderboardPageProps) {
  const [selectedGame, setSelectedGame] = useState(
    initialGame && GAMES.includes(initialGame) ? initialGame : "All Games"
  );
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (initialGame && GAMES.includes(initialGame)) {
      setSelectedGame(initialGame);
    } else if (!initialGame) {
      setSelectedGame("All Games");
    }
  }, [initialGame]);

  useEffect(() => {
    loadLeaderboard();
  }, [selectedGame]);

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      const gameName = selectedGame === "All Games" ? undefined : selectedGame;
      const data = await getLeaderboard(gameName, 20);
      setLeaderboard(data);
    } catch (error) {
      console.error("Failed to load leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return <span className="text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white";
      case 2:
        return "bg-gradient-to-r from-gray-400 to-gray-500 text-white";
      case 3:
        return "bg-gradient-to-r from-amber-600 to-amber-700 text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 rounded-xl bg-gradient-to-br from-[var(--neon-blue)] to-[var(--neon-purple)]">
            <Trophy className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-purple)] bg-clip-text text-transparent">
              Leaderboard
            </h1>
            <p className="text-muted-foreground">
              Top players across all games
            </p>
          </div>
        </div>
      </div>

      {/* Game Filter */}
      <div className="mb-6 bg-card border rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <span>Filter by Game</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {GAMES.map((game) => (
            <button
              key={game}
              onClick={() => setSelectedGame(game)}
              className={`px-4 py-2 rounded-lg transition-all ${
                selectedGame === game
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "bg-muted hover:bg-accent"
              }`}
            >
              {game}
            </button>
          ))}
        </div>
        <div className="mt-3 flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={loadLeaderboard}
            className="gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Leaderboard Table */}
      {loading ? (
        <div className="bg-card border rounded-xl p-12 text-center">
          <div className="animate-pulse">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Loading leaderboard...</p>
          </div>
        </div>
      ) : leaderboard.length === 0 ? (
        <div className="bg-card border rounded-xl p-12 text-center">
          <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="mb-2">No Scores Yet</h3>
          <p className="text-muted-foreground">
            Play some games to see your name on the leaderboard!
          </p>
        </div>
      ) : (
        <div className="bg-card border rounded-xl overflow-hidden">
          {/* Table Header */}
          <div className="bg-muted/50 border-b px-6 py-4">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-1 text-center">Rank</div>
              <div className="col-span-4">Player</div>
              <div className="col-span-3">Game</div>
              <div className="col-span-2 text-center">Score</div>
              <div className="col-span-2 text-center">Date</div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y">
            {leaderboard.map((entry, index) => {
              const rank = entry.rank || index + 1;
              return (
                <div
                  key={entry._id || index}
                  className={`px-6 py-4 hover:bg-accent/50 transition-colors ${
                    rank <= 3 ? "bg-accent/20" : ""
                  }`}
                >
                  <div className="grid grid-cols-12 gap-4 items-center">
                    {/* Rank */}
                    <div className="col-span-1 flex justify-center">
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-full ${getRankBadgeColor(
                          rank
                        )}`}
                      >
                        {rank <= 3 ? (
                          getRankIcon(rank)
                        ) : (
                          <span className="font-semibold">{rank}</span>
                        )}
                      </div>
                    </div>

                    {/* Player Name */}
                    <div className="col-span-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white">
                          {entry.playerName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className={rank <= 3 ? "font-semibold" : ""}>
                            {entry.playerName}
                          </p>
                          {entry.moves && (
                            <p className="text-xs text-muted-foreground">
                              {entry.moves} moves
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Game Name */}
                    <div className="col-span-3">
                      <span className="px-3 py-1 bg-muted rounded-full text-sm">
                        {entry.gameName || "All Games"}
                      </span>
                    </div>

                    {/* Score */}
                    <div className="col-span-2 text-center">
                      <span
                        className={`text-xl ${
                          rank === 1
                            ? "bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-purple)] bg-clip-text text-transparent"
                            : ""
                        }`}
                      >
                        {entry.score.toLocaleString()}
                      </span>
                    </div>

                    {/* Date */}
                    <div className="col-span-2 text-center text-sm text-muted-foreground">
                      {entry.createdAt
                        ? new Date(entry.createdAt).toLocaleDateString()
                        : "N/A"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="mt-6 bg-card border rounded-xl p-6">
        <h3 className="mb-2">How Rankings Work</h3>
        <ul className="space-y-2 text-muted-foreground text-sm">
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            <span>
              Each game you complete is recorded with your player name and score
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            <span>
              Higher scores rank better on the leaderboard
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            <span>
              Filter by specific games to see game-specific rankings
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            <span>
              "All Games" shows cumulative rankings across all games played
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}

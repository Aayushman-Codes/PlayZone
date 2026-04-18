import { useState, useEffect } from "react";
import { ArrowLeft, Moon, Sun, Trophy } from "lucide-react";
import { ChessMasterGame } from "../components/ChessMasterGame";

interface ChessMasterPageProps {
  onBack: () => void;
  onViewLeaderboard: () => void;
}

export function ChessMasterPage({ onBack, onViewLeaderboard }: ChessMasterPageProps) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setDarkMode(isDark);
  }, []);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b bg-card/95 backdrop-blur">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 hover:bg-accent rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Games</span>
            </button>
            <h1 className="bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-purple)] bg-clip-text text-transparent">
              Chess Master
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onViewLeaderboard}
              className="flex items-center gap-2 px-4 py-2 hover:bg-accent rounded-lg transition-colors"
            >
              <Trophy className="h-4 w-4" />
              <span>View Leaderboard</span>
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Game */}
      <main className="flex-1 overflow-y-auto p-6">
        <ChessMasterGame />
      </main>
    </div>
  );
}

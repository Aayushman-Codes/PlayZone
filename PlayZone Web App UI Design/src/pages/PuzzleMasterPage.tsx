import { useState, useEffect } from "react";
import { ArrowLeft, Moon, Sun, Construction, Sparkles, Trophy } from "lucide-react";
import { Card } from "../components/ui/card";

interface PuzzleMasterPageProps {
  onBack: () => void;
  onViewLeaderboard: () => void;
}

export function PuzzleMasterPage({ onBack, onViewLeaderboard }: PuzzleMasterPageProps) {
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
              Puzzle Master
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

      {/* Work in Progress */}
      <main className="flex-1 flex items-center justify-center p-6">
        <Card className="max-w-2xl w-full p-12 text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Construction className="h-24 w-24 text-primary animate-pulse" />
              <Sparkles className="h-8 w-8 text-accent absolute -top-2 -right-2 animate-spin" />
            </div>
          </div>
          
          <h2 className="mb-4 bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-purple)] bg-clip-text text-transparent">
            Work in Progress
          </h2>
          
          <p className="text-muted-foreground mb-6">
            We're crafting an amazing puzzle experience for you! This game is currently under development and will feature:
          </p>

          <div className="space-y-3 text-left max-w-md mx-auto mb-8">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-primary mt-2" />
              <p className="text-muted-foreground">Multiple difficulty levels from beginner to expert</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-accent mt-2" />
              <p className="text-muted-foreground">Hundreds of unique puzzle challenges</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-[var(--neon-purple)] mt-2" />
              <p className="text-muted-foreground">Daily puzzles and leaderboard competitions</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-primary mt-2" />
              <p className="text-muted-foreground">Achievement system and rewards</p>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-lg">
            <Sparkles className="h-5 w-5" />
            <span>Coming Soon!</span>
          </div>
        </Card>
      </main>
    </div>
  );
}

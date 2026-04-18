import { TicTacToeGame } from "../components/TicTacToeGame";
import { ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";

interface TicTacToePageProps {
  onBack: () => void;
  onViewLeaderboard: () => void;
}

export function TicTacToePage({ onBack, onViewLeaderboard }: TicTacToePageProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto p-6">
        <div className="flex gap-3 mb-6">
          <Button 
            onClick={onBack} 
            variant="outline"
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Games
          </Button>
          <Button 
            onClick={onViewLeaderboard}
            variant="outline"
          >
            View Leaderboard
          </Button>
        </div>
        
        <TicTacToeGame />
      </div>
    </div>
  );
}

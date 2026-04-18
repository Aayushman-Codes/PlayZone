import { Game2048 } from "../components/Game2048";
import { ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";

interface Game2048PageProps {
  onBack: () => void;
  onViewLeaderboard: () => void;
}

export function Game2048Page({ onBack, onViewLeaderboard }: Game2048PageProps) {
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
        
        <Game2048 />
      </div>
    </div>
  );
}
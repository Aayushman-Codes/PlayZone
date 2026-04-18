import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { RotateCcw, Star, Heart, Circle, Square, Triangle, Zap, Crown, Diamond } from "lucide-react";
import { submitScore } from "../services/api";
import { promptForPlayerName } from "./ScoreSubmission";

interface Card {
  id: number;
  icon: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const icons = [
  { name: 'star', Icon: Star },
  { name: 'heart', Icon: Heart },
  { name: 'circle', Icon: Circle },
  { name: 'square', Icon: Square },
  { name: 'triangle', Icon: Triangle },
  { name: 'zap', Icon: Zap },
  { name: 'crown', Icon: Crown },
  { name: 'diamond', Icon: Diamond },
];

export function MemoryMatchGame() {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [bestScore, setBestScore] = useState<number | null>(null);
  const [playerName, setPlayerName] = useState<string>("Player 1");

  const initializeGame = () => {
    // Create pairs of cards
    const cardPairs = icons.flatMap((icon, index) => [
      { id: index * 2, icon: icon.name, isFlipped: false, isMatched: false },
      { id: index * 2 + 1, icon: icon.name, isFlipped: false, isMatched: false },
    ]);

    // Shuffle cards
    const shuffled = cardPairs.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setGameWon(false);
  };

  useEffect(() => {
    const name = promptForPlayerName("Player 1");
    setPlayerName(name);
    initializeGame();
    
    // Load best score from localStorage
    const saved = localStorage.getItem('memoryMatchBestScore');
    if (saved) {
      setBestScore(parseInt(saved));
    }
  }, []);

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [first, second] = flippedCards;
      const firstCard = cards.find(c => c.id === first);
      const secondCard = cards.find(c => c.id === second);

      if (firstCard && secondCard && firstCard.icon === secondCard.icon) {
        // Match found
        setTimeout(() => {
          setCards(prev =>
            prev.map(card =>
              card.id === first || card.id === second
                ? { ...card, isMatched: true }
                : card
            )
          );
          setMatches(prev => prev + 1);
          setFlippedCards([]);
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setCards(prev =>
            prev.map(card =>
              card.id === first || card.id === second
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setFlippedCards([]);
        }, 1000);
      }
      setMoves(prev => prev + 1);
    }
  }, [flippedCards, cards]);

  useEffect(() => {
    if (matches === icons.length && cards.length > 0) {
      setGameWon(true);
      
      // Update best score
      if (bestScore === null || moves < bestScore) {
        setBestScore(moves);
        localStorage.setItem('memoryMatchBestScore', moves.toString());
      }

      // Submit score to leaderboard (fewer moves = better score)
      const score = Math.max(100, 1000 - moves * 10);
      submitScore({
        playerName,
        gameName: "Memory Match",
        score,
        moves,
      }).catch(err => console.error("Failed to submit score:", err));
    }
  }, [matches, moves, bestScore, cards.length]);

  const handleCardClick = (id: number) => {
    const card = cards.find(c => c.id === id);
    if (!card || card.isFlipped || card.isMatched || flippedCards.length === 2) {
      return;
    }

    setCards(prev =>
      prev.map(c => (c.id === id ? { ...c, isFlipped: true } : c))
    );
    setFlippedCards(prev => [...prev, id]);
  };

  const getIconComponent = (iconName: string) => {
    const iconObj = icons.find(i => i.name === iconName);
    return iconObj ? iconObj.Icon : Circle;
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-purple)] bg-clip-text text-transparent">
          Memory Match
        </h1>
        <p className="text-muted-foreground">
          Find all the matching pairs!
        </p>
      </div>

      {/* Stats */}
      <div className="flex gap-4">
        <div className="bg-card border rounded-lg p-4 min-w-[120px] text-center">
          <div className="text-sm text-muted-foreground mb-1">Moves</div>
          <div className="text-2xl bg-gradient-to-r from-[var(--gaming-accent)] to-[var(--neon-purple)] bg-clip-text text-transparent">
            {moves}
          </div>
        </div>
        <div className="bg-card border rounded-lg p-4 min-w-[120px] text-center">
          <div className="text-sm text-muted-foreground mb-1">Matches</div>
          <div className="text-2xl text-primary">
            {matches}/{icons.length}
          </div>
        </div>
        {bestScore !== null && (
          <div className="bg-card border rounded-lg p-4 min-w-[120px] text-center">
            <div className="text-sm text-muted-foreground mb-1">Best</div>
            <div className="text-2xl text-yellow-500">
              {bestScore}
            </div>
          </div>
        )}
      </div>

      {/* Win Message */}
      {gameWon && (
        <div className="bg-gradient-to-r from-[var(--gaming-accent)]/10 to-[var(--neon-purple)]/10 border border-primary rounded-lg p-4">
          <p className="bg-gradient-to-r from-[var(--gaming-accent)] to-[var(--neon-purple)] bg-clip-text text-transparent text-center">
            🎉 Congratulations! You won in {moves} moves! 🎉
          </p>
        </div>
      )}

      {/* Game Board */}
      <div className="bg-card border rounded-xl p-6 shadow-lg">
        <div className="grid grid-cols-4 gap-3">
          {cards.map((card) => {
            const IconComponent = getIconComponent(card.icon);
            return (
              <button
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                disabled={card.isFlipped || card.isMatched}
                className={`
                  w-20 h-20 rounded-lg border-2 transition-all
                  flex items-center justify-center
                  ${card.isMatched 
                    ? 'bg-primary/20 border-primary cursor-not-allowed' 
                    : card.isFlipped
                    ? 'bg-accent border-primary'
                    : 'bg-muted border-border hover:border-primary cursor-pointer hover:scale-105'
                  }
                `}
              >
                {(card.isFlipped || card.isMatched) ? (
                  <IconComponent className={`h-8 w-8 ${card.isMatched ? 'text-primary' : 'text-foreground'}`} />
                ) : (
                  <div className="w-8 h-8 rounded bg-muted-foreground/20" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Reset Button */}
      <Button onClick={initializeGame} className="gap-2">
        <RotateCcw className="h-4 w-4" />
        New Game
      </Button>

      {/* Instructions */}
      <div className="text-center text-sm text-muted-foreground max-w-md">
        <p>Click on cards to flip them and reveal the icons. Find all matching pairs with the fewest moves possible!</p>
      </div>
    </div>
  );
}

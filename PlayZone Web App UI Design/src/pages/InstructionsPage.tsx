import { Card } from "../components/ui/card";
import { BookOpen, Gamepad2 } from "lucide-react";

const gameInstructions = [
  {
    id: "connect-four",
    title: "Connect Four",
    objective: "Be the first player to connect four discs in a row (horizontally, vertically, or diagonally).",
    howToPlay: [
      "Players take turns dropping colored discs into a 7-column, 6-row grid",
      "Discs fall to the lowest available position in the selected column",
      "The first player to align four discs in a row wins",
      "If the grid fills up with no winner, the game is a draw"
    ],
    tips: [
      "Control the center column for more winning opportunities",
      "Always watch for opponent's potential winning moves",
      "Create multiple threats to force your opponent into a losing position"
    ]
  },
  {
    id: "2048",
    title: "2048",
    objective: "Combine numbered tiles to reach the 2048 tile and achieve the highest score possible.",
    howToPlay: [
      "Use arrow keys (or swipe on mobile) to move all tiles in one direction",
      "When two tiles with the same number touch, they merge into one",
      "After each move, a new tile (2 or 4) appears in an empty spot",
      "The game ends when no valid moves remain"
    ],
    tips: [
      "Keep your highest tile in a corner and build around it",
      "Use a consistent swipe pattern (e.g., mostly left and down)",
      "Plan ahead to avoid trapping high-value tiles",
      "Don't just focus on creating 2048 - keep playing for higher scores!"
    ]
  },
  {
    id: "tic-tac-toe",
    title: "Tic-Tac-Toe",
    objective: "Get three of your symbols (X or O) in a row before your opponent does.",
    howToPlay: [
      "The game is played on a 3x3 grid",
      "Players take turns placing their symbol in an empty cell",
      "The first player to get three symbols in a row (horizontal, vertical, or diagonal) wins",
      "If all cells are filled with no winner, the game is a draw"
    ],
    tips: [
      "Control the center square for the most winning possibilities",
      "If your opponent takes the center, take a corner",
      "Always block your opponent's potential winning moves",
      "Create \"forks\" - positions where you have two ways to win"
    ]
  },
  {
    id: "memory-match",
    title: "Memory Match",
    objective: "Find all matching pairs of cards by remembering their positions.",
    howToPlay: [
      "Click on any card to reveal it",
      "Click on a second card to try to find its match",
      "If the cards match, they stay revealed",
      "If they don't match, both cards flip back over",
      "Continue until all pairs are found"
    ],
    tips: [
      "Pay close attention to card positions, even when they don't match",
      "Try to remember patterns or create mental associations",
      "Focus on one area of the grid at a time",
      "The fewer moves you make, the better your score!"
    ]
  },
  {
    id: "blackjack",
    title: "Blackjack",
    objective: "Get a hand value closer to 21 than the dealer without going over.",
    howToPlay: [
      "Place your bet to start the game",
      "You and the dealer each receive two cards (one dealer card is hidden)",
      "Face cards (J, Q, K) are worth 10, Aces are worth 1 or 11, others are face value",
      "Choose 'Hit' to take another card or 'Stand' to keep your current hand",
      "Dealer must hit until reaching 17 or higher",
      "If you go over 21, you 'bust' and lose. Closest to 21 wins!"
    ],
    tips: [
      "Always stand on 17 or higher",
      "Hit on 11 or lower",
      "Consider the dealer's visible card when making decisions",
      "Manage your chips wisely - don't bet everything at once"
    ]
  },
  {
    id: "chess",
    title: "Chess Master",
    objective: "Checkmate your opponent's king by putting it in a position where it cannot escape capture.",
    howToPlay: [
      "White moves first, then players alternate turns",
      "Each piece moves in a specific way: Pawns forward, Rooks straight, Bishops diagonally, etc.",
      "Capture opponent's pieces by moving to their square",
      "The game ends when a king is captured (simplified version)",
      "Click a piece to select it, then click a valid square to move it"
    ],
    tips: [
      "Control the center of the board with pawns and pieces",
      "Develop your pieces (knights and bishops) early",
      "Protect your king with castling when possible (not yet implemented)",
      "Think several moves ahead and consider your opponent's responses",
      "Don't leave your pieces undefended"
    ]
  },
  {
    id: "puzzle",
    title: "Puzzle Master",
    objective: "This game is currently under development. Check back soon for challenging puzzle experiences!",
    howToPlay: [
      "Coming soon with multiple puzzle types",
      "Various difficulty levels",
      "Daily challenges and competitions",
      "Achievement system"
    ],
    tips: [
      "Stay tuned for updates!",
      "Meanwhile, enjoy our other great games"
    ]
  }
];

export function InstructionsPage() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-3 rounded-lg bg-gradient-to-br from-primary to-accent">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <h1 className="bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-purple)] bg-clip-text text-transparent">
            Game Instructions
          </h1>
        </div>
        <p className="text-muted-foreground">
          Learn how to play all the games available on PlayZone. Master the rules and dominate the competition!
        </p>
      </div>

      {/* Instructions */}
      <div className="space-y-6">
        {gameInstructions.map((game) => (
          <Card key={game.id} className="p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Gamepad2 className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="mb-2">{game.title}</h2>
                <p className="text-muted-foreground">{game.objective}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* How to Play */}
              <div>
                <h3 className="mb-3 text-primary">How to Play</h3>
                <ol className="space-y-2">
                  {game.howToPlay.map((step, idx) => (
                    <li key={idx} className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm">
                        {idx + 1}
                      </span>
                      <span className="text-muted-foreground">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Tips & Strategy */}
              <div>
                <h3 className="mb-3 text-accent">Tips & Strategy</h3>
                <ul className="space-y-2">
                  {game.tips.map((tip, idx) => (
                    <li key={idx} className="flex gap-3">
                      <span className="flex-shrink-0 w-2 h-2 rounded-full bg-accent mt-2" />
                      <span className="text-muted-foreground">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Footer Note */}
      <Card className="mt-8 p-6 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
        <div className="flex items-start gap-3">
          <BookOpen className="h-5 w-5 text-primary mt-1" />
          <div>
            <h3 className="mb-2">Need More Help?</h3>
            <p className="text-muted-foreground">
              If you have questions about any game or need additional clarification, feel free to visit our Contact page or send us feedback. 
              We're here to help you have the best gaming experience!
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

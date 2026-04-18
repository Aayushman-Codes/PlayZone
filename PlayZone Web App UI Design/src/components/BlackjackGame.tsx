import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { submitScore } from "../services/api";
import { promptForPlayerNames } from "./ScoreSubmission";

type PlayingCard = {
  suit: "♠" | "♥" | "♦" | "♣";
  value: string;
  numValue: number;
};

type Hand = PlayingCard[];

const suits: PlayingCard["suit"][] = ["♠", "♥", "♦", "♣"];
const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

function createDeck(): PlayingCard[] {
  const deck: PlayingCard[] = [];
  for (const suit of suits) {
    for (const value of values) {
      let numValue = parseInt(value);
      if (value === "A") numValue = 11;
      else if (["J", "Q", "K"].includes(value)) numValue = 10;
      deck.push({ suit, value, numValue });
    }
  }
  return deck;
}

function shuffleDeck(deck: PlayingCard[]): PlayingCard[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function calculateHandValue(hand: Hand): number {
  let value = 0;
  let aces = 0;

  for (const card of hand) {
    value += card.numValue;
    if (card.value === "A") aces++;
  }

  // Adjust for aces
  while (value > 21 && aces > 0) {
    value -= 10;
    aces--;
  }

  return value;
}

export function BlackjackGame() {
  const [deck, setDeck] = useState<PlayingCard[]>(shuffleDeck(createDeck()));
  const [playerHand, setPlayerHand] = useState<Hand>([]);
  const [dealerHand, setDealerHand] = useState<Hand>([]);
  const [gameState, setGameState] = useState<"betting" | "playing" | "dealer" | "ended">("betting");
  const [message, setMessage] = useState("Place your bet to start!");
  const [chips, setChips] = useState(1000);
  const [bet, setBet] = useState(0);
  const [showDealerCard, setShowDealerCard] = useState(false);
  const [playerName, setPlayerName] = useState("Player 1");
  const [dealerName, setDealerName] = useState("Dealer");

  useEffect(() => {
    const [p1, p2] = promptForPlayerNames(2);
    setPlayerName(p1 || "Player 1");
    setDealerName(p2 || "Dealer");
  }, []);

  const startGame = (betAmount: number) => {
    if (betAmount > chips) {
      setMessage("Not enough chips!");
      return;
    }

    const newDeck = shuffleDeck(createDeck());
    const pHand = [newDeck[0], newDeck[2]];
    const dHand = [newDeck[1], newDeck[3]];
    
    setDeck(newDeck.slice(4));
    setPlayerHand(pHand);
    setDealerHand(dHand);
    setBet(betAmount);
    setChips(chips - betAmount);
    setGameState("playing");
    setShowDealerCard(false);
    setMessage("Hit or Stand?");

    // Check for blackjack
    const pValue = calculateHandValue(pHand);
    if (pValue === 21) {
      setShowDealerCard(true);
      const dValue = calculateHandValue(dHand);
      if (dValue === 21) {
        setMessage("Push! Both have Blackjack!");
        setChips(chips); // Return bet
        setGameState("ended");
      } else {
        setMessage("Blackjack! You win!");
        setChips(chips + betAmount * 2.5);
        setGameState("ended");

        // Submit score for player blackjack win
        submitScore({
          playerName,
          gameName: "Blackjack",
          score: betAmount * 10,
        }).catch(err => console.error("Failed to submit score:", err));
      }
    }
  };

  const hit = () => {
    if (gameState !== "playing") return;
    
    const newCard = deck[0];
    const newHand = [...playerHand, newCard];
    setPlayerHand(newHand);
    setDeck(deck.slice(1));

    const value = calculateHandValue(newHand);
    if (value > 21) {
      setMessage("Bust! Dealer wins.");
      setGameState("ended");
      setShowDealerCard(true);
    } else if (value === 21) {
      stand();
    }
  };

  const stand = () => {
    if (gameState !== "playing") return;
    
    setGameState("dealer");
    setShowDealerCard(true);
    
    // Dealer plays
    let dHand = [...dealerHand];
    let currentDeck = [...deck];
    
    while (calculateHandValue(dHand) < 17) {
      dHand.push(currentDeck[0]);
      currentDeck = currentDeck.slice(1);
    }
    
    setDealerHand(dHand);
    setDeck(currentDeck);

    const playerValue = calculateHandValue(playerHand);
    const dealerValue = calculateHandValue(dHand);

    setTimeout(() => {
      if (dealerValue > 21) {
        setMessage("Dealer busts! You win!");
        setChips(chips + bet * 2);
        submitScore({
          playerName,
          gameName: "Blackjack",
          score: bet * 10,
        }).catch(err => console.error("Failed to submit score:", err));
      } else if (dealerValue > playerValue) {
        setMessage("Dealer wins!");
        submitScore({
          playerName: dealerName,
          gameName: "Blackjack",
          score: bet * 10,
        }).catch(err => console.error("Failed to submit score:", err));
      } else if (playerValue > dealerValue) {
        setMessage("You win!");
        setChips(chips + bet * 2);
        submitScore({
          playerName,
          gameName: "Blackjack",
          score: bet * 10,
        }).catch(err => console.error("Failed to submit score:", err));
      } else {
        setMessage("Push! It's a tie.");
        setChips(chips + bet);
      }
      setGameState("ended");
    }, 1000);
  };

  const resetGame = () => {
    setPlayerHand([]);
    setDealerHand([]);
    setGameState("betting");
    setMessage("Place your bet to start!");
    setBet(0);
    setShowDealerCard(false);
  };

  const renderCard = (card: PlayingCard, hidden = false) => {
    const isRed = card.suit === "♥" || card.suit === "♦";
    
    if (hidden) {
      return (
        <div className="w-24 h-36 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center border-2 border-gray-700">
          <div className="text-white text-4xl">?</div>
        </div>
      );
    }

    return (
      <div className={`w-24 h-36 rounded-lg bg-white border-2 border-gray-300 p-3 flex flex-col justify-between shadow-lg ${isRed ? "text-red-600" : "text-black"}`}>
        <div>
          <div className="font-bold text-lg leading-none">{card.value}</div>
          <div className="text-3xl leading-none mt-0.5">{card.suit}</div>
        </div>
        <div className="text-right">
          <div className="text-3xl leading-none mb-0.5">{card.suit}</div>
          <div className="font-bold text-lg leading-none">{card.value}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <Card className="p-6 bg-gradient-to-br from-green-700 to-green-900">
        {/* Game Info */}
        <div className="flex justify-between items-center mb-6 text-white">
          <div className="flex items-center gap-4">
            <div className="px-4 py-2 bg-black/30 rounded-lg">
              <div className="text-sm opacity-80">Chips</div>
              <div className="text-xl">${chips}</div>
            </div>
            {bet > 0 && (
              <div className="px-4 py-2 bg-yellow-600/80 rounded-lg">
                <div className="text-sm opacity-80">Bet</div>
                <div className="text-xl">${bet}</div>
              </div>
            )}
          </div>
          <div className="text-2xl">{message}</div>
        </div>

        {/* Dealer's Hand */}
        <div className="mb-8">
          <h3 className="text-white mb-3">
            Dealer's Hand {showDealerCard && `(${calculateHandValue(dealerHand)})`}
          </h3>
          <div className="flex gap-2 flex-wrap">
            {dealerHand.map((card, idx) => (
              <div key={idx}>
                {renderCard(card, idx === 1 && !showDealerCard)}
              </div>
            ))}
          </div>
        </div>

        {/* Player's Hand */}
        <div className="mb-8">
          <h3 className="text-white mb-3">
            Your Hand {playerHand.length > 0 && `(${calculateHandValue(playerHand)})`}
          </h3>
          <div className="flex gap-2 flex-wrap">
            {playerHand.map((card, idx) => (
              <div key={idx}>{renderCard(card)}</div>
            ))}
          </div>
        </div>

        {/* Betting Controls */}
        {gameState === "betting" && (
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => startGame(10)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Bet $10
            </button>
            <button
              onClick={() => startGame(25)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Bet $25
            </button>
            <button
              onClick={() => startGame(50)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Bet $50
            </button>
            <button
              onClick={() => startGame(100)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Bet $100
            </button>
          </div>
        )}

        {/* Game Controls */}
        {gameState === "playing" && (
          <div className="flex gap-3">
            <button
              onClick={hit}
              className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Hit
            </button>
            <button
              onClick={stand}
              className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Stand
            </button>
          </div>
        )}

        {/* Reset Button */}
        {gameState === "ended" && (
          <button
            onClick={resetGame}
            className="px-8 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
          >
            New Game
          </button>
        )}
      </Card>
    </div>
  );
}

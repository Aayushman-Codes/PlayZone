import { useEffect } from "react";
import { submitScore } from "../services/api";

interface ScoreSubmissionProps {
  playerName: string;
  gameName: string;
  score: number;
  moves?: number;
  timeElapsed?: number;
}

/**
 * Helper component to submit scores to the leaderboard
 * This component doesn't render anything, it just handles score submission
 */
export function ScoreSubmission({
  playerName,
  gameName,
  score,
  moves,
  timeElapsed,
}: ScoreSubmissionProps) {
  useEffect(() => {
    if (playerName && score > 0) {
      submitScore({
        playerName,
        gameName,
        score,
        moves,
        timeElapsed,
      }).catch((err) => console.error("Failed to submit score:", err));
    }
  }, [playerName, gameName, score, moves, timeElapsed]);

  return null;
}

/**
 * Utility function to prompt for player name at game start
 */
export const promptForPlayerName = (defaultName = "Player 1"): string => {
  const name = prompt("Enter your name for the leaderboard:") || defaultName;
  return name.trim() || defaultName;
};

/**
 * Utility function to prompt for multiple player names
 */
export const promptForPlayerNames = (
  count: number
): string[] => {
  const names: string[] = [];
  for (let i = 0; i < count; i++) {
    const name =
      prompt(`Player ${i + 1}: Enter your name`) || `Player ${i + 1}`;
    names.push(name.trim() || `Player ${i + 1}`);
  }
  return names;
};

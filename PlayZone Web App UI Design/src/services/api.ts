/**
 * API Service Layer for PlayZone
 * 
 * This file contains all API calls to the backend.
 * Currently uses localStorage for demo purposes.
 * 
 * TO CONNECT TO YOUR MONGODB BACKEND:
 * 1. Replace the API_BASE_URL with your backend URL (e.g., 'http://localhost:5000/api')
 * 2. Uncomment the fetch() implementations
 * 3. Remove the localStorage mock implementations
 * 4. Start your MongoDB backend server (see BACKEND_SETUP.md)
 */

// CONFIGURATION
const USE_REAL_API = true; // Backend is ready – send requests to MongoDB API
const API_BASE_URL = 'http://localhost:5000/api'; // Your backend URL

// Types
export interface Player {
  _id?: string;
  name: string;
  email?: string;
  avatar?: string;
  createdAt?: Date;
}

export interface GameScore {
  _id?: string;
  playerId?: string;
  playerName: string;
  gameName: string;
  score: number;
  moves?: number;
  timeElapsed?: number;
  createdAt?: Date;
}

export interface LeaderboardEntry {
  _id?: string;
  playerName: string;
  gameName: string;
  score: number;
  moves?: number;
  timeElapsed?: number;
  rank?: number;
  createdAt?: Date;
}

// Mock data storage (remove when using real API)
const STORAGE_KEYS = {
  SCORES: 'playzone_scores',
  PLAYERS: 'playzone_players',
};

// Helper to get from localStorage
const getFromStorage = (key: string) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

// Helper to save to localStorage
const saveToStorage = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Storage error:', error);
  }
};

/**
 * Submit a game score
 * 
 * REAL API IMPLEMENTATION:
 * 
 * export const submitScore = async (scoreData: GameScore): Promise<GameScore> => {
 *   const response = await fetch(`${API_BASE_URL}/scores`, {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify(scoreData),
 *   });
 *   if (!response.ok) throw new Error('Failed to submit score');
 *   return response.json();
 * };
 */
export const submitScore = async (scoreData: GameScore): Promise<GameScore> => {
  if (USE_REAL_API) {
    const response = await fetch(`${API_BASE_URL}/scores`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(scoreData),
    });
    if (!response.ok) throw new Error('Failed to submit score');
    return response.json();
  }

  // Mock implementation using localStorage
  const scores = getFromStorage(STORAGE_KEYS.SCORES);
  const newScore = {
    ...scoreData,
    _id: Date.now().toString(),
    createdAt: new Date(),
  };
  scores.push(newScore);
  saveToStorage(STORAGE_KEYS.SCORES, scores);
  return newScore;
};

/**
 * Get leaderboard for a specific game
 * 
 * REAL API IMPLEMENTATION:
 * 
 * export const getLeaderboard = async (gameName?: string, limit = 10): Promise<LeaderboardEntry[]> => {
 *   const url = gameName 
 *     ? `${API_BASE_URL}/leaderboard/${gameName}?limit=${limit}`
 *     : `${API_BASE_URL}/leaderboard?limit=${limit}`;
 *   const response = await fetch(url);
 *   if (!response.ok) throw new Error('Failed to fetch leaderboard');
 *   return response.json();
 * };
 */
export const getLeaderboard = async (
  gameName?: string,
  limit = 10
): Promise<LeaderboardEntry[]> => {
  if (USE_REAL_API) {
    const url = gameName
      ? `${API_BASE_URL}/leaderboard/${gameName}?limit=${limit}`
      : `${API_BASE_URL}/leaderboard?limit=${limit}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch leaderboard');
    return response.json();
  }

  // Mock implementation using localStorage
  const scores: GameScore[] = getFromStorage(STORAGE_KEYS.SCORES);
  
  let filtered = scores;
  if (gameName) {
    filtered = scores.filter(s => s.gameName === gameName);
  }

  // Sort by score (descending) and take top entries
  const sorted = filtered
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));

  return sorted;
};

/**
 * Get all game scores for a specific player
 * 
 * REAL API IMPLEMENTATION:
 * 
 * export const getPlayerScores = async (playerName: string): Promise<GameScore[]> => {
 *   const response = await fetch(`${API_BASE_URL}/scores/player/${encodeURIComponent(playerName)}`);
 *   if (!response.ok) throw new Error('Failed to fetch player scores');
 *   return response.json();
 * };
 */
export const getPlayerScores = async (playerName: string): Promise<GameScore[]> => {
  if (USE_REAL_API) {
    const response = await fetch(
      `${API_BASE_URL}/scores/player/${encodeURIComponent(playerName)}`
    );
    if (!response.ok) throw new Error('Failed to fetch player scores');
    return response.json();
  }

  // Mock implementation using localStorage
  const scores: GameScore[] = getFromStorage(STORAGE_KEYS.SCORES);
  return scores.filter(s => s.playerName === playerName);
};

/**
 * Get player statistics
 * 
 * REAL API IMPLEMENTATION:
 * 
 * export const getPlayerStats = async (playerName: string) => {
 *   const response = await fetch(`${API_BASE_URL}/players/${encodeURIComponent(playerName)}/stats`);
 *   if (!response.ok) throw new Error('Failed to fetch player stats');
 *   return response.json();
 * };
 */
export const getPlayerStats = async (playerName: string) => {
  if (USE_REAL_API) {
    const response = await fetch(
      `${API_BASE_URL}/players/${encodeURIComponent(playerName)}/stats`
    );
    if (!response.ok) throw new Error('Failed to fetch player stats');
    return response.json();
  }

  // Mock implementation using localStorage
  const scores: GameScore[] = getFromStorage(STORAGE_KEYS.SCORES);
  const playerScores = scores.filter(s => s.playerName === playerName);

  return {
    totalGames: playerScores.length,
    bestScore: Math.max(...playerScores.map(s => s.score), 0),
    averageScore: playerScores.length > 0 
      ? playerScores.reduce((sum, s) => sum + s.score, 0) / playerScores.length 
      : 0,
    gamesPlayed: playerScores.reduce((acc, score) => {
      acc[score.gameName] = (acc[score.gameName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
  };
};

export async function submitFeedback(data: {
  name?: string;
  rating: number;
  category?: string;
  feedback: string;
}) {
  const res = await fetch(`${API_BASE_URL}/feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return res.json();
}


export async function submitContactForm(data: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}) {
  const res = await fetch(`${API_BASE_URL}/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return res.json();
}

/**
 * Clear all scores (for testing)
 */
export const clearAllScores = () => {
  saveToStorage(STORAGE_KEYS.SCORES, []);
};

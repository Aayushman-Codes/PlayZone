# MongoDB Backend Integration Guide for PlayZone

## Overview

Your PlayZone gaming application now has a complete frontend with leaderboard functionality. Currently, it uses **localStorage** for demo purposes, but it's fully structured to connect to a MongoDB backend.

## What's Been Implemented

### Frontend (/services/api.ts)
- ✅ Complete API service layer with mock data
- ✅ All API calls structured and ready for backend integration
- ✅ TypeScript interfaces matching MongoDB schemas
- ✅ Error handling and loading states

### Leaderboard System
- ✅ Leaderboard page with filtering by game
- ✅ Real-time score updates (when backend is connected)
- ✅ Top 20 player rankings
- ✅ Player statistics tracking

### Games with Score Submission
- ✅ Connect Four - submits winner's score
- ✅ 2048 - submits score on game over
- ✅ All games prompt for player names
- ✅ Scores include: player name, game name, score, moves, timestamp

## Backend Setup (See /services/BACKEND_SETUP.md)

The complete MongoDB + Express + Node.js backend structure is documented in `/services/BACKEND_SETUP.md`. Follow these steps:

### Quick Start:

1. **Create the backend project** (in a separate directory):
   ```bash
   mkdir playzone-backend
   cd playzone-backend
   npm init -y
   npm install express mongoose cors dotenv
   ```

2. **Set up MongoDB**:
   - Install MongoDB locally OR use MongoDB Atlas (cloud)
   - Create a database called `playzone`

3. **Copy the backend code** from `/services/BACKEND_SETUP.md`:
   - `server.js` - Main server file
   - `models/` - MongoDB models (Player, Score)
   - `routes/` - API routes (players, scores, leaderboard)
   - `config/db.js` - Database connection

4. **Configure environment**:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/playzone
   ```

5. **Start backend**:
   ```bash
   npm run dev
   ```

## Connecting Frontend to Backend

### Step 1: Update API Configuration

In `/services/api.ts`, change:

```typescript
const USE_REAL_API = true;  // Change from false to true
const API_BASE_URL = 'http://localhost:5000/api';  // Your backend URL
```

### Step 2: Test the Connection

1. Start your backend server (port 5000)
2. Start your frontend (Figma Make)
3. Play a game and submit a score
4. Check the leaderboard page

## API Endpoints

Your backend will provide these endpoints:

### Scores
- `POST /api/scores` - Submit a new score
- `GET /api/scores` - Get all scores
- `GET /api/scores/player/:name` - Get scores for a specific player

### Leaderboard
- `GET /api/leaderboard` - Get global leaderboard
- `GET /api/leaderboard/:gameName` - Get leaderboard for specific game

### Players
- `POST /api/players` - Create or get player
- `GET /api/players/:name/stats` - Get player statistics

## MongoDB Schema

### Scores Collection
```javascript
{
  _id: ObjectId,
  playerName: String (required),
  gameName: String (required),
  score: Number (required),
  moves: Number (optional),
  timeElapsed: Number (optional),
  createdAt: Date (default: now)
}
```

### Players Collection
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (optional),
  avatar: String (optional),
  createdAt: Date (default: now)
}
```

## Data Flow

1. **Player plays a game** → Game component tracks score and moves
2. **Game ends** → Prompts for player name
3. **Submit score** → Frontend calls `submitScore()` from `/services/api.ts`
4. **API request** → Sent to backend `POST /api/scores`
5. **Backend saves** → MongoDB stores the score
6. **Leaderboard updates** → GET `/api/leaderboard` retrieves latest data

## Current Status (Demo Mode)

While `USE_REAL_API = false`:
- Scores are stored in browser localStorage
- Data persists until browser cache is cleared
- No cross-device synchronization
- Perfect for testing UI/UX

## Testing Without Backend

You can test the leaderboard functionality right now:

1. Play Connect Four or 2048
2. Complete a game
3. Enter your name when prompted
4. Go to Leaderboard page
5. See your score listed!

The data is stored locally and will appear on the leaderboard immediately.

## Game Score Submissions

Each game submits different data:

### Connect Four
- **Score**: 100 points for winner
- **Moves**: Number of moves to win
- **Player Name**: Winner's name

### 2048
- **Score**: Final score from game
- **Moves**: Number of moves made
- **Player Name**: Entered at game over

### Other Games
You can add score submission to other games using the same pattern:

```typescript
import { submitScore } from "../services/api";

// When game ends:
submitScore({
  playerName: playerName,
  gameName: "Your Game Name",
  score: finalScore,
  moves: totalMoves,
}).catch(err => console.error("Failed to submit score:", err));
```

## Troubleshooting

### Scores not appearing on leaderboard?
- Check browser console for errors
- Verify `USE_REAL_API` setting in `/services/api.ts`
- If using backend, ensure it's running on correct port

### CORS errors?
- Backend must have CORS enabled (already included in setup)
- Check backend console for connection logs

### MongoDB connection failed?
- Verify MongoDB is running: `mongod`
- Check connection string in backend `.env`
- For Atlas, check network access settings

## Next Steps

1. Follow `/services/BACKEND_SETUP.md` to create backend
2. Set up MongoDB locally or on Atlas
3. Update frontend API configuration
4. Test with real database!

## Need Help?

- Backend code: See `/services/BACKEND_SETUP.md`
- API structure: See `/services/api.ts`
- Leaderboard UI: See `/pages/LeaderboardPage.tsx`

---

**Note**: This application is currently frontend-only. The MongoDB backend needs to be created separately following the instructions in `/services/BACKEND_SETUP.md`.

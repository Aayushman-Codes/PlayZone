# 🎮 PlayZone - Complete Setup Guide

## Overview

Your PlayZone gaming application now has **complete frontend + backend integration** with MongoDB database and leaderboard functionality!

---

## 📦 What You Have

### ✅ Frontend (Current - Figma Make)
- **7 Fully Functional Games**: Connect Four, 2048, Tic Tac Toe, Memory Match, Blackjack, Chess Master, Puzzle Master
- **Leaderboard Page**: Beautiful UI with filtering, rankings, and player stats
- **Score Submission**: Automatic submission when games end
- **API Service Layer**: Ready to connect to backend
- **Theme Support**: Dark/Light mode toggle
- **Responsive Design**: Works on all devices

### ✅ Backend (MongoDB + Express + Node.js)
All backend files are in the `/backend` directory:
- `server.js` - Main Express server
- `package.json` - Dependencies
- `config/db.js` - MongoDB connection
- `models/Player.js` - Player schema
- `models/Score.js` - Score schema
- `routes/players.js` - Player API endpoints
- `routes/scores.js` - Score API endpoints
- `routes/leaderboard.js` - Leaderboard API endpoints
- `.env.example` - Environment variables template
- `README.md` - Complete backend documentation

---

## 🚀 Quick Start Guide

### Step 1: Copy Backend Files

1. **Copy the entire `/backend` folder** to a location outside this project:
   ```bash
   # Example: Copy to your Desktop
   cp -r backend ~/Desktop/playzone-backend
   cd ~/Desktop/playzone-backend
   ```

2. **Or create manually**:
   - Copy each file from `/backend` directory
   - Maintain the folder structure

### Step 2: Install Backend Dependencies

```bash
cd playzone-backend
npm install
```

This installs:
- `express` - Web server framework
- `mongoose` - MongoDB ORM
- `cors` - Cross-origin resource sharing
- `dotenv` - Environment variables
- `nodemon` - Auto-restart during development

### Step 3: Setup MongoDB

**Option A: Local MongoDB**
```bash
# macOS (Homebrew)
brew install mongodb-community
brew services start mongodb-community

# Ubuntu
sudo apt-get install mongodb
sudo systemctl start mongod

# Windows
Download from https://www.mongodb.com/try/download/community
Install and start MongoDB service
```

**Option B: MongoDB Atlas (Cloud - Recommended)**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create a cluster
4. Click "Connect" → "Connect your application"
5. Copy the connection string

### Step 4: Configure Environment

```bash
# In playzone-backend directory
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
# For local MongoDB:
MONGODB_URI=mongodb://localhost:27017/playzone

# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/playzone
```

### Step 5: Start Backend Server

```bash
# Development mode (auto-restart on changes)
npm run dev

# Or production mode
npm start
```

You should see:
```
🎮 ================================= 🎮
🚀 PlayZone Backend Server Running
🎮 ================================= 🎮
📡 Server: http://localhost:5000
✅ MongoDB Connected: localhost:27017
```

### Step 6: Test Backend

Open browser to: `http://localhost:5000/api/health`

You should see:
```json
{
  "status": "ok",
  "message": "PlayZone API is running",
  "timestamp": "...",
  "uptime": 123.456
}
```

### Step 7: Connect Frontend to Backend

In your frontend code, edit `/services/api.ts`:

**Change these lines:**
```typescript
const USE_REAL_API = true;  // Change from false to true
const API_BASE_URL = 'http://localhost:5000/api';
```

### Step 8: Test Everything!

1. **Start backend**: `npm run dev` (in backend directory)
2. **Start frontend**: Run your Figma Make app
3. **Play a game**: Try Connect Four or 2048
4. **Enter your name**: When prompted
5. **Check leaderboard**: Click "Leaderboard" in sidebar
6. **See your score**: You should see your score listed!

---

## 🎯 How It Works

### Data Flow

```
┌─────────────┐
│   Browser   │
│  (Frontend) │
└──────┬──────┘
       │ Player finishes game
       ↓
┌──────────────────┐
│ submitScore()    │
│ /services/api.ts │
└──────┬───────────┘
       │ POST /api/scores
       ↓
┌──────────────────┐
│  Express Server  │
│   (Backend)      │
└──────┬───────────┘
       │ Save to database
       ↓
┌──────────────────┐
│    MongoDB       │
│   (Database)     │
└──────────────────┘
```

### When You Play a Game

1. **Game starts** → Prompts for player name
2. **Game ends** → Frontend submits score
3. **Backend receives** → Validates and saves to MongoDB
4. **Database stores** → Score + player info + timestamp
5. **Leaderboard updates** → Fetches latest data
6. **UI displays** → Shows rankings and scores

---

## 📊 Database Collections

### `players` Collection
```javascript
{
  _id: "507f1f77bcf86cd799439011",
  name: "John Doe",
  email: "john@example.com",
  totalGamesPlayed: 15,
  createdAt: "2025-01-15T10:30:00.000Z",
  lastPlayed: "2025-01-15T12:45:00.000Z"
}
```

### `scores` Collection
```javascript
{
  _id: "507f1f77bcf86cd799439022",
  playerName: "John Doe",
  gameName: "Connect Four",
  score: 100,
  moves: 25,
  timeElapsed: 120,
  createdAt: "2025-01-15T12:45:00.000Z"
}
```

---

## 🔌 API Endpoints Reference

### Submit Score
```bash
POST http://localhost:5000/api/scores
Content-Type: application/json

{
  "playerName": "John Doe",
  "gameName": "Connect Four",
  "score": 100,
  "moves": 25
}
```

### Get Leaderboard
```bash
# All games
GET http://localhost:5000/api/leaderboard?limit=10

# Specific game
GET http://localhost:5000/api/leaderboard/Connect%20Four?limit=10
```

### Get Player Stats
```bash
GET http://localhost:5000/api/players/John%20Doe/stats
```

---

## 🧪 Testing

### Test with cURL

```bash
# Submit a score
curl -X POST http://localhost:5000/api/scores \
  -H "Content-Type: application/json" \
  -d '{
    "playerName": "Test Player",
    "gameName": "2048",
    "score": 5000,
    "moves": 150
  }'

# Get leaderboard
curl http://localhost:5000/api/leaderboard
```

### Test in Browser

1. Open DevTools (F12)
2. Go to Console tab
3. Run:
```javascript
fetch('http://localhost:5000/api/health')
  .then(r => r.json())
  .then(console.log)
```

---

## 🎨 Frontend Features

### Games with Score Submission

✅ **Connect Four**
- Submits winner's name and move count
- Score: 100 points for winner

✅ **2048**
- Submits score when game ends
- Includes move count and final score

### Leaderboard Page

- **Filter by Game**: View rankings for specific games
- **Top 20 Rankings**: See best players
- **Trophy Icons**: Gold/Silver/Bronze for top 3
- **Player Stats**: Games played, scores, dates
- **Responsive Design**: Works on all devices

---

## 💾 View Your Data

### Using MongoDB Compass (GUI)

1. Download [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Connect to `mongodb://localhost:27017`
3. Open `playzone` database
4. Browse `scores` and `players` collections

### Using Mongo Shell (CLI)

```bash
mongo
use playzone
db.scores.find().pretty()
db.players.find().pretty()

# Count total scores
db.scores.count()

# Find top scores
db.scores.find().sort({score: -1}).limit(10)
```

---

## 🔧 Troubleshooting

### Backend Won't Start

**Error**: `Cannot find module 'express'`
```bash
npm install
```

**Error**: `Port 5000 already in use`
```bash
# Find process
lsof -i :5000
# Kill it
kill -9 <PID>
# Or change PORT in .env
```

### MongoDB Connection Failed

**Error**: `connect ECONNREFUSED 127.0.0.1:27017`
```bash
# Check if MongoDB is running
brew services list | grep mongodb
# Start it
brew services start mongodb-community
```

### CORS Errors in Frontend

Backend already has CORS enabled. If issues:
1. Check backend is running on port 5000
2. Verify `API_BASE_URL` in `/services/api.ts`
3. Check browser console for specific error

### Scores Not Appearing

1. Check backend terminal for logs
2. Verify `USE_REAL_API = true` in `/services/api.ts`
3. Check MongoDB has data: `db.scores.count()`
4. Clear browser cache and reload

---

## 📝 Current Status

### Demo Mode (Default)
- `USE_REAL_API = false`
- Uses localStorage
- Data saved in browser only
- Perfect for testing UI

### Production Mode (With Backend)
- `USE_REAL_API = true`
- Uses MongoDB
- Data persistent across devices
- Real-time leaderboard updates

---

## 🚀 Next Steps

### Immediate
1. ✅ Copy backend files
2. ✅ Install dependencies
3. ✅ Setup MongoDB
4. ✅ Start backend server
5. ✅ Connect frontend
6. ✅ Test with games

### Future Enhancements
- Add authentication (JWT)
- Add user profiles with avatars
- Add game history tracking
- Add multiplayer support
- Add real-time updates (Socket.io)
- Add email notifications
- Deploy to production (Heroku/Railway)

---

## 📚 Documentation Files

- `/services/api.ts` - API service layer
- `/services/BACKEND_SETUP.md` - Detailed backend guide
- `/backend/README.md` - Backend documentation
- `/MONGODB_INTEGRATION_GUIDE.md` - Integration guide
- `/COMPLETE_SETUP_GUIDE.md` - This file

---

## 🆘 Need Help?

### Check Logs
- **Backend**: Terminal where `npm run dev` is running
- **Frontend**: Browser console (F12)
- **MongoDB**: `tail -f /usr/local/var/log/mongodb/mongo.log`

### Common Issues

1. **"Failed to submit score"** → Backend not running
2. **"Network error"** → Wrong API_BASE_URL
3. **"Validation error"** → Check game name in enum
4. **Empty leaderboard** → No scores submitted yet

---

## ✨ Features Summary

### Frontend
- 7 fully functional games
- Beautiful leaderboard UI
- Score submission system
- Dark/Light theme
- Responsive design

### Backend
- RESTful API
- MongoDB database
- Player management
- Score tracking
- Leaderboard rankings
- Statistics and analytics

---

## 🎉 You're All Set!

Your PlayZone gaming platform is now fully integrated with a MongoDB backend and leaderboard system!

**Test it now:**
1. Start backend: `npm run dev`
2. Play Connect Four
3. Enter your name
4. Check the Leaderboard!

**Happy Gaming! 🎮**

# PlayZone MongoDB Backend Setup Guide

This guide will help you set up the Node.js + Express + MongoDB backend for PlayZone.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB installed locally or MongoDB Atlas account
- npm or yarn

## Backend Structure

Create a new directory for your backend (outside this frontend project):

```
playzone-backend/
├── server.js
├── package.json
├── models/
│   ├── Player.js
│   └── Score.js
├── routes/
│   ├── players.js
│   ├── scores.js
│   └── leaderboard.js
└── config/
    └── db.js
```

## Step 1: Initialize Backend Project

```bash
mkdir playzone-backend
cd playzone-backend
npm init -y
```

## Step 2: Install Dependencies

```bash
npm install express mongoose cors dotenv
npm install --save-dev nodemon
```

## Step 3: Create `.env` File

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/playzone
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/playzone
```

## Step 4: Database Configuration (`config/db.js`)

```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected Successfully');
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
```

## Step 5: Player Model (`models/Player.js`)

```javascript
const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    sparse: true,
    trim: true,
  },
  avatar: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create index for faster queries
playerSchema.index({ name: 1 });

module.exports = mongoose.model('Player', playerSchema);
```

## Step 6: Score Model (`models/Score.js`)

```javascript
const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  playerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
  },
  playerName: {
    type: String,
    required: true,
    trim: true,
  },
  gameName: {
    type: String,
    required: true,
    enum: [
      'Connect Four',
      '2048',
      'Tic Tac Toe',
      'Memory Match',
      'Blackjack',
      'Chess Master',
      'Puzzle Master'
    ],
  },
  score: {
    type: Number,
    required: true,
    default: 0,
  },
  moves: {
    type: Number,
  },
  timeElapsed: {
    type: Number, // in seconds
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create indexes for faster queries
scoreSchema.index({ gameName: 1, score: -1 });
scoreSchema.index({ playerName: 1 });
scoreSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Score', scoreSchema);
```

## Step 7: Players Routes (`routes/players.js`)

```javascript
const express = require('express');
const router = express.Router();
const Player = require('../models/Player');
const Score = require('../models/Score');

// Get or create player
router.post('/', async (req, res) => {
  try {
    const { name, email, avatar } = req.body;
    
    let player = await Player.findOne({ name });
    
    if (!player) {
      player = new Player({ name, email, avatar });
      await player.save();
    }
    
    res.json(player);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get player stats
router.get('/:name/stats', async (req, res) => {
  try {
    const { name } = req.params;
    
    const scores = await Score.find({ playerName: name });
    
    const stats = {
      totalGames: scores.length,
      bestScore: scores.length > 0 ? Math.max(...scores.map(s => s.score)) : 0,
      averageScore: scores.length > 0 
        ? scores.reduce((sum, s) => sum + s.score, 0) / scores.length 
        : 0,
      gamesPlayed: scores.reduce((acc, score) => {
        acc[score.gameName] = (acc[score.gameName] || 0) + 1;
        return acc;
      }, {}),
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

## Step 8: Scores Routes (`routes/scores.js`)

```javascript
const express = require('express');
const router = express.Router();
const Score = require('../models/Score');

// Submit a new score
router.post('/', async (req, res) => {
  try {
    const { playerName, gameName, score, moves, timeElapsed } = req.body;
    
    const newScore = new Score({
      playerName,
      gameName,
      score,
      moves,
      timeElapsed,
    });
    
    await newScore.save();
    res.status(201).json(newScore);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all scores for a player
router.get('/player/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const scores = await Score.find({ playerName: name }).sort({ createdAt: -1 });
    res.json(scores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all scores
router.get('/', async (req, res) => {
  try {
    const scores = await Score.find().sort({ createdAt: -1 });
    res.json(scores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

## Step 9: Leaderboard Routes (`routes/leaderboard.js`)

```javascript
const express = require('express');
const router = express.Router();
const Score = require('../models/Score');

// Get global leaderboard (all games)
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    const leaderboard = await Score.aggregate([
      {
        $group: {
          _id: '$playerName',
          totalScore: { $sum: '$score' },
          gamesPlayed: { $sum: 1 },
          bestScore: { $max: '$score' },
        }
      },
      { $sort: { totalScore: -1 } },
      { $limit: limit },
    ]);
    
    const formatted = leaderboard.map((entry, index) => ({
      rank: index + 1,
      playerName: entry._id,
      score: entry.totalScore,
      gamesPlayed: entry.gamesPlayed,
      bestScore: entry.bestScore,
    }));
    
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get leaderboard for specific game
router.get('/:gameName', async (req, res) => {
  try {
    const { gameName } = req.params;
    const limit = parseInt(req.query.limit) || 10;
    
    const leaderboard = await Score.find({ gameName })
      .sort({ score: -1 })
      .limit(limit);
    
    const formatted = leaderboard.map((entry, index) => ({
      rank: index + 1,
      _id: entry._id,
      playerName: entry.playerName,
      gameName: entry.gameName,
      score: entry.score,
      moves: entry.moves,
      timeElapsed: entry.timeElapsed,
      createdAt: entry.createdAt,
    }));
    
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

## Step 10: Main Server File (`server.js`)

```javascript
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/players', require('./routes/players'));
app.use('/api/scores', require('./routes/scores'));
app.use('/api/leaderboard', require('./routes/leaderboard'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'PlayZone API is running' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## Step 11: Update `package.json` Scripts

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

## Step 12: Start the Server

```bash
# Development mode (auto-restart on changes)
npm run dev

# Production mode
npm start
```

## Step 13: Test the API

You can test using curl or Postman:

```bash
# Health check
curl http://localhost:5000/api/health

# Submit a score
curl -X POST http://localhost:5000/api/scores \
  -H "Content-Type: application/json" \
  -d '{
    "playerName": "John Doe",
    "gameName": "Connect Four",
    "score": 100,
    "moves": 25
  }'

# Get leaderboard
curl http://localhost:5000/api/leaderboard/Connect%20Four?limit=10
```

## Step 14: Connect Frontend to Backend

In the frontend project, update `/services/api.ts`:

1. Set `USE_REAL_API = true`
2. Set `API_BASE_URL = 'http://localhost:5000/api'`

## MongoDB Database Structure

### Collections:

1. **players** - Stores player information
   - `_id`: ObjectId
   - `name`: String (indexed)
   - `email`: String (optional)
   - `avatar`: String (optional)
   - `createdAt`: Date

2. **scores** - Stores game scores
   - `_id`: ObjectId
   - `playerId`: ObjectId (reference to players)
   - `playerName`: String (indexed)
   - `gameName`: String (indexed)
   - `score`: Number (indexed)
   - `moves`: Number
   - `timeElapsed`: Number
   - `createdAt`: Date (indexed)

## Production Deployment

For production:

1. Use MongoDB Atlas for cloud database
2. Add environment variables for production
3. Enable HTTPS
4. Add rate limiting
5. Add authentication/authorization
6. Deploy to services like Heroku, Railway, or AWS

## Troubleshooting

- **Connection Error**: Check if MongoDB is running (`mongod` service)
- **CORS Error**: Ensure CORS is enabled in server.js
- **Port in Use**: Change PORT in .env file

## Security Notes

- Never commit `.env` file to git
- Use strong passwords for MongoDB
- Implement authentication for production
- Validate all inputs
- Use rate limiting to prevent abuse

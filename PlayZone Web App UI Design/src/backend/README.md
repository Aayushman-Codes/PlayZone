# PlayZone Backend - MongoDB + Express + Node.js

Complete backend API for the PlayZone gaming platform with MongoDB database.

## Quick Start

### Prerequisites
- Node.js v14 or higher
- MongoDB installed locally OR MongoDB Atlas account
- npm or yarn

### Installation

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and configure:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/playzone
   NODE_ENV=development
   ```

4. **Start MongoDB** (if using local installation):
   ```bash
   # macOS/Linux
   sudo mongod
   
   # Windows
   mongod
   ```

5. **Run the server**:
   ```bash
   # Development mode (auto-restart on changes)
   npm run dev
   
   # Production mode
   npm start
   ```

6. **Verify it's working**:
   Open browser to `http://localhost:5000/api/health`

## Project Structure

```
backend/
├── config/
│   └── db.js              # MongoDB connection
├── models/
│   ├── Player.js          # Player schema
│   └── Score.js           # Score schema
├── routes/
│   ├── players.js         # Player endpoints
│   ├── scores.js          # Score endpoints
│   └── leaderboard.js     # Leaderboard endpoints
├── server.js              # Main server file
├── package.json           # Dependencies
├── .env.example           # Environment template
├── .gitignore            # Git ignore rules
└── README.md             # This file
```

## 🔌 API Endpoints

### Health Check
```
GET /api/health
```
Returns server status and uptime.

### Scores

#### Submit Score
```
POST /api/scores
Content-Type: application/json

{
  "playerName": "John Doe",
  "gameName": "Connect Four",
  "score": 100,
  "moves": 25,
  "timeElapsed": 120
}
```

#### Get All Scores
```
GET /api/scores?limit=50&gameName=Connect Four
```

#### Get Player Scores
```
GET /api/scores/player/:name
```

#### Get Game Scores
```
GET /api/scores/game/:gameName
```

#### Delete Score
```
DELETE /api/scores/:id
```

### Leaderboard

#### Global Leaderboard
```
GET /api/leaderboard?limit=10
```
Returns combined scores from all games.

#### Game-Specific Leaderboard
```
GET /api/leaderboard/:gameName?limit=10
```
Examples:
- `/api/leaderboard/Connect Four`
- `/api/leaderboard/2048`
- `/api/leaderboard/Chess Master`

#### Best Scores Per Player
```
GET /api/leaderboard/best/:gameName?limit=10
```

#### Recent Leaderboard
```
GET /api/leaderboard/recent/:gameName?days=7&limit=10
```

#### Statistics Summary
```
GET /api/leaderboard/stats/summary
```

### Players

#### Create or Get Player
```
POST /api/players
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "avatar": "https://..."
}
```

#### Get Player by Name
```
GET /api/players/:name
```

#### Get Player Statistics
```
GET /api/players/:name/stats
```
Returns detailed stats including:
- Total games played
- Best score
- Average score
- Games played by type
- Recent scores

#### Get All Players
```
GET /api/players?limit=50
```

#### Delete Player
```
DELETE /api/players/:name
```

## Database Schema

### Player Collection
```javascript
{
  _id: ObjectId,
  name: String (required, unique),
  email: String (optional),
  avatar: String (optional),
  totalGamesPlayed: Number,
  createdAt: Date,
  lastPlayed: Date
}
```

### Score Collection
```javascript
{
  _id: ObjectId,
  playerId: ObjectId (ref: Player),
  playerName: String (required),
  gameName: String (required),
  score: Number (required),
  moves: Number (optional),
  timeElapsed: Number (optional),
  difficulty: String (optional),
  createdAt: Date
}
```

## Configuration

### MongoDB Local Setup
```env
MONGODB_URI=mongodb://localhost:27017/playzone
```

### MongoDB Atlas (Cloud)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string
4. Update `.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/playzone?retryWrites=true&w=majority
```

## Testing the API

### Using cURL

#### Health Check
```bash
curl http://localhost:5000/api/health
```

#### Submit Score
```bash
curl -X POST http://localhost:5000/api/scores \
  -H "Content-Type: application/json" \
  -d '{
    "playerName": "Alice",
    "gameName": "Connect Four",
    "score": 100,
    "moves": 20
  }'
```

#### Get Leaderboard
```bash
curl http://localhost:5000/api/leaderboard/Connect%20Four?limit=10
```

#### Get Player Stats
```bash
curl http://localhost:5000/api/players/Alice/stats
```

### Using Postman
Import the following base URL: `http://localhost:5000/api`

## Connect to Frontend

1. **In your frontend code** (`/services/api.ts`):
   ```typescript
   const USE_REAL_API = true;
   const API_BASE_URL = 'http://localhost:5000/api';
   ```

2. **Start both servers**:
   - Backend: `npm run dev` (port 5000)
   - Frontend: Run your Figma Make app

3. **Test integration**:
   - Play a game
   - Submit your score
   - Check leaderboard page
   - Verify data in MongoDB

## Monitoring

### View MongoDB Data

#### Using MongoDB Compass
1. Download [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Connect to `mongodb://localhost:27017`
3. Browse `playzone` database
4. View `players` and `scores` collections

#### Using Mongo Shell
```bash
mongo
use playzone
db.scores.find().pretty()
db.players.find().pretty()
```

### View Logs
Server logs will show all incoming requests and database operations.

## Development

### Add New Game
1. Add game name to `models/Score.js` enum
2. Frontend will automatically include it

### Custom Queries
Add new routes in `routes/` directory following existing patterns.

## Troubleshooting

### MongoDB Connection Failed
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Start MongoDB service
```bash
# macOS
brew services start mongodb-community

# Ubuntu
sudo systemctl start mongod

# Windows
net start MongoDB
```

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution**: Change PORT in `.env` or kill process using port 5000
```bash
# Find process
lsof -i :5000

# Kill process
kill -9 <PID>
```

### CORS Errors
**Solution**: CORS is already configured in `server.js`. If issues persist, check browser console for specific errors.

### Validation Errors
Check that your request data matches the schema requirements in `models/`.

## Production Deployment

### Heroku
```bash
heroku create playzone-api
heroku config:set MONGODB_URI="your-atlas-uri"
git push heroku main
```

### Railway
1. Connect GitHub repo
2. Add MongoDB plugin or use Atlas
3. Set environment variables
4. Deploy

### AWS/DigitalOcean
Use PM2 for process management:
```bash
npm install -g pm2
pm2 start server.js --name playzone-api
pm2 save
```

## Security Notes

- Never commit `.env` file
- Use strong passwords for production MongoDB
- Implement rate limiting for production
- Add authentication/authorization if needed
- Validate all user inputs
- Use HTTPS in production

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with auto-reload

## License

ISC

## Support

For issues or questions, check:
1. MongoDB connection string
2. Server logs in terminal
3. Environment variables in `.env`
4. Firewall/network settings

---

**Happy Gaming! 🎮**

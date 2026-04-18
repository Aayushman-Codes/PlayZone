# 🎮 PlayZone Backend - Quick Start

## 🚀 Get Running in 5 Minutes!

### 1️⃣ Install Dependencies
```bash
npm install
```

### 2️⃣ Setup Environment
```bash
cp .env.example .env
```

Edit `.env` file:
- For local MongoDB: Keep default `mongodb://localhost:27017/playzone`
- For cloud: Use MongoDB Atlas connection string

### 3️⃣ Start MongoDB

**macOS:**
```bash
brew services start mongodb-community
```

**Ubuntu:**
```bash
sudo systemctl start mongod
```

**Windows:**
- Start MongoDB service from Services app

**Or use MongoDB Atlas** (cloud - no local install needed):
- Sign up at https://www.mongodb.com/cloud/atlas
- Create free cluster
- Get connection string
- Update in `.env`

### 4️⃣ Start Server
```bash
npm run dev
```

### 5️⃣ Test It Works
Open browser: http://localhost:5000/api/health

Should see:
```json
{"status": "ok", "message": "PlayZone API is running"}
```

---

## ✅ If You See This, You're Ready!

```
🎮 ================================= 🎮
🚀 PlayZone Backend Server Running
🎮 ================================= 🎮
📡 Server: http://localhost:5000
✅ MongoDB Connected: localhost:27017
📊 Database: playzone
```

---

## 🔗 Connect Frontend

In your frontend `/services/api.ts`:

```typescript
const USE_REAL_API = true;
const API_BASE_URL = 'http://localhost:5000/api';
```

---

## 📝 Test API

### Submit a Score
```bash
curl -X POST http://localhost:5000/api/scores \
  -H "Content-Type: application/json" \
  -d '{"playerName":"Test","gameName":"Connect Four","score":100}'
```

### Get Leaderboard
```bash
curl http://localhost:5000/api/leaderboard
```

---

## 🆘 Troubleshooting

### MongoDB not connecting?
```bash
# Check if MongoDB is running
ps aux | grep mongod

# Start it
brew services start mongodb-community
```

### Port 5000 already in use?
Edit `.env` and change:
```
PORT=3001
```

### Dependencies error?
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 Full Documentation

- `README.md` - Complete backend guide
- `/services/BACKEND_SETUP.md` - Detailed setup
- `/COMPLETE_SETUP_GUIDE.md` - Full project guide

---

## 🎉 Ready to Play!

Once backend is running:
1. Open PlayZone frontend
2. Play any game
3. Enter your name
4. Check Leaderboard page
5. See your score!

**Happy Gaming! 🎮**

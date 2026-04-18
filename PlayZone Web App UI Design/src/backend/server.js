require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: '*', // Allow all origins (change in production)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/players', require('./routes/players'));
app.use('/api/scores', require('./routes/scores'));
app.use('/api/leaderboard', require('./routes/leaderboard'));

// Root route
app.get('/', (req, res) => {
  res.json({
    message: '🎮 Welcome to PlayZone API',
    version: '1.0.0',
    endpoints: {
      players: '/api/players',
      scores: '/api/scores',
      leaderboard: '/api/leaderboard',
      health: '/api/health'
    }
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'PlayZone API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.use('/api/contact', require('./routes/contact'));
app.use('/api/feedback', require('./routes/feedback'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path,
    method: req.method
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});


// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('');
  console.log('🎮 ================================= 🎮');
  console.log('🚀 PlayZone Backend Server Running');
  console.log('🎮 ================================= 🎮');
  console.log(`📡 Server: http://localhost:${PORT}`);
  console.log(`🏥 Health: http://localhost:${PORT}/api/health`);
  console.log(`🎯 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('');
  console.log('📋 Available Endpoints:');
  console.log(`   POST   /api/scores          - Submit a score`);
  console.log(`   GET    /api/scores          - Get all scores`);
  console.log(`   GET    /api/leaderboard     - Global leaderboard`);
  console.log(`   GET    /api/leaderboard/:game - Game leaderboard`);
  console.log(`   POST   /api/players         - Create/get player`);
  console.log(`   GET    /api/players/:name/stats - Player stats`);
  console.log('');
  console.log('Press Ctrl+C to stop');
  console.log('');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  // Close server & exit process
  process.exit(1);
});


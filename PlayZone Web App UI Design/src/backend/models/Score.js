const mongoose = require('mongoose');

/**
 * Score Schema
 * Stores game scores and results
 */
const scoreSchema = new mongoose.Schema({
  playerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
  },
  playerName: {
    type: String,
    required: [true, 'Player name is required'],
    trim: true,
  },
  gameName: {
    type: String,
    required: [true, 'Game name is required'],
    enum: {
      values: [
        'Connect Four',
        '2048',
        'Tic Tac Toe',
        'Memory Match',
        'Blackjack',
        'Chess Master',
        'Puzzle Master'
      ],
      message: '{VALUE} is not a valid game name',
    },
  },
  score: {
    type: Number,
    required: [true, 'Score is required'],
    default: 0,
    min: [0, 'Score cannot be negative'],
  },
  moves: {
    type: Number,
    min: [0, 'Moves cannot be negative'],
  },
  timeElapsed: {
    type: Number, // in seconds
    min: [0, 'Time cannot be negative'],
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound indexes for better query performance
scoreSchema.index({ gameName: 1, score: -1 });
scoreSchema.index({ playerName: 1, createdAt: -1 });
scoreSchema.index({ score: -1 });
scoreSchema.index({ createdAt: -1 });

// Index for leaderboard queries
scoreSchema.index({ gameName: 1, score: -1, createdAt: -1 });

// Virtual for score ID
scoreSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

// Ensure virtual fields are serialized
scoreSchema.set('toJSON', {
  virtuals: true,
});

// Pre-save middleware to update player's last played time
scoreSchema.pre('save', async function(next) {
  try {
    const Player = mongoose.model('Player');
    await Player.findOneAndUpdate(
      { name: this.playerName },
      { 
        lastPlayed: new Date(),
        $inc: { totalGamesPlayed: 1 }
      },
      { upsert: false }
    );
    next();
  } catch (error) {
    next();
  }
});

module.exports = mongoose.model('Score', scoreSchema);

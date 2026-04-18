const mongoose = require('mongoose');

/**
 * Player Schema
 * Stores player information
 */
const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Player name is required'],
    trim: true,
    minlength: [1, 'Name must be at least 1 character'],
    maxlength: [50, 'Name must be less than 50 characters'],
  },
  email: {
    type: String,
    sparse: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
  },
  avatar: {
    type: String,
    default: null,
  },
  totalGamesPlayed: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastPlayed: {
    type: Date,
    default: Date.now,
  },
});

// Indexes for better query performance
playerSchema.index({ name: 1 });
playerSchema.index({ email: 1 });
playerSchema.index({ createdAt: -1 });

// Virtual for player ID
playerSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

// Ensure virtual fields are serialized
playerSchema.set('toJSON', {
  virtuals: true,
});

module.exports = mongoose.model('Player', playerSchema);

const express = require('express');
const router = express.Router();
const Score = require('../models/Score');
const Player = require('../models/Player');

/**
 * @route   POST /api/scores
 * @desc    Submit a new score
 * @access  Public
 */
router.post('/', async (req, res) => {
  try {
    const { playerName, gameName, score, moves, timeElapsed, difficulty } = req.body;

    // Validate required fields
    if (!playerName || !gameName || score === undefined) {
      return res.status(400).json({ 
        error: 'Player name, game name, and score are required' 
      });
    }

    // Create or update player
    await Player.findOneAndUpdate(
      { name: playerName },
      { 
        name: playerName,
        lastPlayed: new Date(),
        $inc: { totalGamesPlayed: 1 }
      },
      { upsert: true, new: true }
    );

    // Create new score
    const newScore = new Score({
      playerName,
      gameName,
      score,
      moves,
      timeElapsed,
      difficulty,
    });

    await newScore.save();

    console.log(`✅ New score submitted: ${playerName} - ${gameName} - ${score} points`);

    res.status(201).json(newScore);
  } catch (error) {
    console.error('Error submitting score:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route   GET /api/scores
 * @desc    Get all scores
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const gameName = req.query.gameName;

    let query = {};
    if (gameName) {
      query.gameName = gameName;
    }

    const scores = await Score.find(query)
      .sort({ createdAt: -1 })
      .limit(limit);

    res.json(scores);
  } catch (error) {
    console.error('Error getting scores:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route   GET /api/scores/player/:name
 * @desc    Get all scores for a specific player
 * @access  Public
 */
router.get('/player/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const limit = parseInt(req.query.limit) || 50;

    const scores = await Score.find({ playerName: name })
      .sort({ createdAt: -1 })
      .limit(limit);

    res.json(scores);
  } catch (error) {
    console.error('Error getting player scores:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route   GET /api/scores/game/:gameName
 * @desc    Get all scores for a specific game
 * @access  Public
 */
router.get('/game/:gameName', async (req, res) => {
  try {
    const { gameName } = req.params;
    const limit = parseInt(req.query.limit) || 100;

    const scores = await Score.find({ gameName })
      .sort({ score: -1, createdAt: -1 })
      .limit(limit);

    res.json(scores);
  } catch (error) {
    console.error('Error getting game scores:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route   GET /api/scores/:id
 * @desc    Get a specific score by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const score = await Score.findById(req.params.id);

    if (!score) {
      return res.status(404).json({ error: 'Score not found' });
    }

    res.json(score);
  } catch (error) {
    console.error('Error getting score:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route   DELETE /api/scores/:id
 * @desc    Delete a specific score
 * @access  Public
 */
router.delete('/:id', async (req, res) => {
  try {
    const score = await Score.findByIdAndDelete(req.params.id);

    if (!score) {
      return res.status(404).json({ error: 'Score not found' });
    }

    res.json({ message: 'Score deleted successfully' });
  } catch (error) {
    console.error('Error deleting score:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route   DELETE /api/scores
 * @desc    Delete all scores (use with caution!)
 * @access  Public
 */
router.delete('/', async (req, res) => {
  try {
    const result = await Score.deleteMany({});
    res.json({ 
      message: 'All scores deleted successfully',
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    console.error('Error deleting all scores:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

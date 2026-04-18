const express = require('express');
const router = express.Router();
const Player = require('../models/Player');
const Score = require('../models/Score');

/**
 * @route   POST /api/players
 * @desc    Create or get a player
 * @access  Public
 */
router.post('/', async (req, res) => {
  try {
    const { name, email, avatar } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Player name is required' });
    }

    // Check if player exists
    let player = await Player.findOne({ name });

    if (player) {
      // Update last played time
      player.lastPlayed = new Date();
      await player.save();
      return res.json(player);
    }

    // Create new player
    player = new Player({
      name,
      email,
      avatar,
    });

    await player.save();
    res.status(201).json(player);
  } catch (error) {
    console.error('Error creating/getting player:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route   GET /api/players/:name
 * @desc    Get player by name
 * @access  Public
 */
router.get('/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const player = await Player.findOne({ name });

    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }

    res.json(player);
  } catch (error) {
    console.error('Error getting player:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route   GET /api/players/:name/stats
 * @desc    Get player statistics
 * @access  Public
 */
router.get('/:name/stats', async (req, res) => {
  try {
    const { name } = req.params;

    // Get all scores for this player
    const scores = await Score.find({ playerName: name });

    if (scores.length === 0) {
      return res.json({
        playerName: name,
        totalGames: 0,
        bestScore: 0,
        averageScore: 0,
        totalScore: 0,
        gamesPlayed: {},
        recentScores: [],
      });
    }

    // Calculate statistics
    const totalScore = scores.reduce((sum, s) => sum + s.score, 0);
    const bestScore = Math.max(...scores.map(s => s.score));
    const averageScore = totalScore / scores.length;

    // Count games by type
    const gamesPlayed = scores.reduce((acc, score) => {
      acc[score.gameName] = (acc[score.gameName] || 0) + 1;
      return acc;
    }, {});

    // Get recent scores (last 10)
    const recentScores = scores
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10)
      .map(s => ({
        gameName: s.gameName,
        score: s.score,
        moves: s.moves,
        createdAt: s.createdAt,
      }));

    // Best score per game
    const bestScorePerGame = {};
    scores.forEach(score => {
      if (!bestScorePerGame[score.gameName] || score.score > bestScorePerGame[score.gameName]) {
        bestScorePerGame[score.gameName] = score.score;
      }
    });

    res.json({
      playerName: name,
      totalGames: scores.length,
      bestScore,
      averageScore: Math.round(averageScore * 100) / 100,
      totalScore,
      gamesPlayed,
      bestScorePerGame,
      recentScores,
    });
  } catch (error) {
    console.error('Error getting player stats:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route   GET /api/players
 * @desc    Get all players
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const players = await Player.find()
      .sort({ lastPlayed: -1 })
      .limit(limit);

    res.json(players);
  } catch (error) {
    console.error('Error getting players:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route   DELETE /api/players/:name
 * @desc    Delete a player (and their scores)
 * @access  Public
 */
router.delete('/:name', async (req, res) => {
  try {
    const { name } = req.params;

    // Delete player
    const player = await Player.findOneAndDelete({ name });

    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }

    // Delete all scores for this player
    await Score.deleteMany({ playerName: name });

    res.json({ message: 'Player and associated scores deleted successfully' });
  } catch (error) {
    console.error('Error deleting player:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

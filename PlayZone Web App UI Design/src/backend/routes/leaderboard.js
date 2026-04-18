const express = require('express');
const router = express.Router();
const Score = require('../models/Score');

/**
 * @route   GET /api/leaderboard
 * @desc    Get global leaderboard (all games combined)
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    // Aggregate total scores per player
    const leaderboard = await Score.aggregate([
      {
        $group: {
          _id: '$playerName',
          totalScore: { $sum: '$score' },
          gamesPlayed: { $sum: 1 },
          bestScore: { $max: '$score' },
          averageScore: { $avg: '$score' },
          lastPlayed: { $max: '$createdAt' },
        }
      },
      { $sort: { totalScore: -1 } },
      { $limit: limit },
    ]);

    // Add rank to each entry
    const formatted = leaderboard.map((entry, index) => ({
      rank: index + 1,
      playerName: entry._id,
      score: entry.totalScore,
      gamesPlayed: entry.gamesPlayed,
      bestScore: entry.bestScore,
      averageScore: Math.round(entry.averageScore * 100) / 100,
      lastPlayed: entry.lastPlayed,
    }));

    res.json(formatted);
  } catch (error) {
    console.error('Error getting global leaderboard:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route   GET /api/leaderboard/:gameName
 * @desc    Get leaderboard for a specific game (scores summed per player)
 * @access  Public
 */
router.get('/:gameName', async (req, res) => {
  try {
    const { gameName } = req.params;
    const limit = parseInt(req.query.limit) || 10;

    // Aggregate scores per player for this specific game
    const leaderboard = await Score.aggregate([
      { $match: { gameName } },
      {
        $group: {
          _id: '$playerName',
          totalScore: { $sum: '$score' },
          gamesPlayed: { $sum: 1 },
          bestScore: { $max: '$score' },
          lastPlayed: { $max: '$createdAt' },
        }
      },
      { $sort: { totalScore: -1 } },
      { $limit: limit },
    ]);

    // Format with rank
    const formatted = leaderboard.map((entry, index) => ({
      rank: index + 1,
      playerName: entry._id,
      gameName,
      score: entry.totalScore,
      gamesPlayed: entry.gamesPlayed,
      bestScore: entry.bestScore,
      createdAt: entry.lastPlayed,
    }));

    res.json(formatted);
  } catch (error) {
    console.error('Error getting game leaderboard:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route   GET /api/leaderboard/best/:gameName
 * @desc    Get best score per player for a specific game
 * @access  Public
 */
router.get('/best/:gameName', async (req, res) => {
  try {
    const { gameName } = req.params;
    const limit = parseInt(req.query.limit) || 10;

    // Get best score per player for this game
    const leaderboard = await Score.aggregate([
      { $match: { gameName } },
      {
        $group: {
          _id: '$playerName',
          bestScore: { $max: '$score' },
          bestMoves: { $min: '$moves' },
          gamesPlayed: { $sum: 1 },
          firstPlayed: { $min: '$createdAt' },
          lastPlayed: { $max: '$createdAt' },
        }
      },
      { $sort: { bestScore: -1, bestMoves: 1 } },
      { $limit: limit },
    ]);

    // Format with rank
    const formatted = leaderboard.map((entry, index) => ({
      rank: index + 1,
      playerName: entry._id,
      gameName,
      score: entry.bestScore,
      moves: entry.bestMoves,
      gamesPlayed: entry.gamesPlayed,
      firstPlayed: entry.firstPlayed,
      lastPlayed: entry.lastPlayed,
    }));

    res.json(formatted);
  } catch (error) {
    console.error('Error getting best scores leaderboard:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route   GET /api/leaderboard/recent/:gameName
 * @desc    Get most recent top scores for a specific game
 * @access  Public
 */
router.get('/recent/:gameName', async (req, res) => {
  try {
    const { gameName } = req.params;
    const limit = parseInt(req.query.limit) || 10;
    const days = parseInt(req.query.days) || 7;

    // Calculate date threshold
    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - days);

    // Get recent high scores
    const leaderboard = await Score.find({
      gameName,
      createdAt: { $gte: dateThreshold }
    })
      .sort({ score: -1, createdAt: -1 })
      .limit(limit);

    // Format with rank
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
    console.error('Error getting recent leaderboard:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route   GET /api/leaderboard/stats/summary
 * @desc    Get overall statistics summary
 * @access  Public
 */
router.get('/stats/summary', async (req, res) => {
  try {
    const totalScores = await Score.countDocuments();
    const uniquePlayers = await Score.distinct('playerName');
    const gamesPlayed = await Score.aggregate([
      {
        $group: {
          _id: '$gameName',
          count: { $sum: 1 },
          avgScore: { $avg: '$score' },
          maxScore: { $max: '$score' },
        }
      }
    ]);

    const recentActivity = await Score.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('playerName gameName score createdAt');

    res.json({
      totalScores,
      totalPlayers: uniquePlayers.length,
      gamesPlayed,
      recentActivity,
    });
  } catch (error) {
    console.error('Error getting stats summary:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

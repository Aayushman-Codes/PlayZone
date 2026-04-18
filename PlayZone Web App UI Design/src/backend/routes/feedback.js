const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');

router.post('/', async (req, res) => {
  try {
    const { name, rating, category, feedback } = req.body;

    if (!rating || !feedback)
      return res.status(400).json({ error: "Rating and feedback required" });

    const newFeedback = await Feedback.create({ name, rating, category, feedback });

    res.json({ success: true, data: newFeedback });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

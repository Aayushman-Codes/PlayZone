const express = require('express');
const router = express.Router();
const ContactMessage = require('../models/ContactMessage');

router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message)
      return res.status(400).json({ error: "Name, email and message are required" });

    const newMessage = await ContactMessage.create({ name, email, subject, message });

    res.json({ success: true, data: newMessage });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

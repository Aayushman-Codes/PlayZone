const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  name: { type: String },
  rating: { type: Number, required: true },
  category: { type: String },
  feedback: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Feedback', feedbackSchema);

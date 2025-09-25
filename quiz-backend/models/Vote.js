const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  chosenOption: { type: Number, required: true }, // index
  isCorrect: { type: Boolean, required: true },
  createdAt: { type: Date, default: Date.now }
});

voteSchema.index({ quiz: 1, user: 1 }, { unique: true }); 
// ensures one vote per user per quiz

module.exports = mongoose.model('Vote', voteSchema);

const mongoose = require('mongoose');
const trainingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  completedAt: { type: Date, default: Date.now },
  type: { type: String, enum: ['security', 'privacy', 'other'], required: true }
});
module.exports = mongoose.model('Training', trainingSchema); 
const mongoose = require('mongoose');

const SafetyTimerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  durationMinutes: { type: Number, required: true },
  startTime: { type: Date, required: true },
  expectedEndTime: { type: Date, required: true },
  destination: { type: String },
  status: { type: String, enum: ['active', 'completed', 'expired', 'cancelled'], default: 'active' },
  extensions: [{
    durationMinutes: Number,
    addedAt: Date
  }]
}, { timestamps: true });

module.exports = mongoose.model('SafetyTimer', SafetyTimerSchema);

const mongoose = require('mongoose');

const SafetyJourneySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, default: 'My Journey' },
  mode: { type: String, enum: ['ONE_TAP', 'TIME_BASED', 'DESTINATION'], default: 'ONE_TAP' },
  durationMinutes: { type: Number },
  expectedArrivalTime: { type: Date },
  emergencyToken: { type: String },
  isSOSActivated: { type: Boolean, default: false },
  status: { type: String, enum: ['pending', 'active', 'paused', 'completed', 'cancelled'], default: 'active' },
  trustedContacts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TrustedContact' }]
}, { timestamps: true });

module.exports = mongoose.model('SafetyJourney', SafetyJourneySchema);

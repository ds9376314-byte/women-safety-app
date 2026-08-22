const mongoose = require('mongoose');

const LocationPointSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  journey: { type: mongoose.Schema.Types.ObjectId, ref: 'SafetyJourney' },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  accuracy: { type: Number },
  speed: { type: Number },
  heading: { type: Number },
  timestamp: { type: Date, required: true, default: Date.now },
  batteryLevel: { type: Number }
});
// Compound index to quickly fetch the most recent locations for a specific user/journey
LocationPointSchema.index({ user: 1, timestamp: -1 });
LocationPointSchema.index({ journey: 1, timestamp: -1 });

module.exports = mongoose.model('LocationPoint', LocationPointSchema);

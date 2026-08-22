const mongoose = require('mongoose');

const EmergencyLocationSchema = new mongoose.Schema({
  emergencySession: { type: mongoose.Schema.Types.ObjectId, ref: 'EmergencySession', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  accuracy: { type: Number },
  speed: { type: Number },
  heading: { type: Number },
  timestamp: { type: Date, default: Date.now },
}, { timestamps: true });

// Optimize querying locations for an active session
EmergencyLocationSchema.index({ emergencySession: 1, timestamp: -1 });

module.exports = mongoose.model('EmergencyLocation', EmergencyLocationSchema);

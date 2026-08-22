const mongoose = require('mongoose');

const SafetyEventSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  eventType: { 
    type: String, 
    enum: [
      'SAFETY_TIMER_STARTED', 'SAFETY_TIMER_EXTENDED', 'SAFETY_TIMER_COMPLETED', 'SAFETY_TIMER_EXPIRED',
      'JOURNEY_STARTED', 'JOURNEY_PAUSED', 'JOURNEY_RESUMED', 'JOURNEY_COMPLETED',
      'ROUTE_DEVIATION', 'ARRIVAL_DELAY', 'DESTINATION_REACHED',
      'SAFE_ZONE_ENTERED', 'SAFE_ZONE_EXITED',
      'EMERGENCY_SESSION_STARTED', 'EMERGENCY_SESSION_RESOLVED', 'EMERGENCY_SESSION_CANCELLED'
    ],
    required: true
  },
  location: {
    latitude: Number,
    longitude: Number
  },
  relatedId: { type: mongoose.Schema.Types.ObjectId }, // Timer ID, Journey ID, or Zone ID
  severity: { type: String, enum: ['info', 'warning', 'critical'], default: 'info' },
  metadata: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true });

module.exports = mongoose.model('SafetyEvent', SafetyEventSchema);

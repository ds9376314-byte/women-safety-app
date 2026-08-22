const mongoose = require('mongoose');

const EmergencySessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['STARTING', 'ACTIVE', 'CANCELLED', 'RESOLVED', 'FAILED'], default: 'STARTING' },
  triggerSource: { type: String, required: true }, // e.g., 'DASHBOARD_SOS', 'TIMER_EXPIRED'
  startedAt: { type: Date, default: Date.now },
  resolvedAt: { type: Date },
  cancelledAt: { type: Date },
  lastLocationAt: { type: Date },
  assignedAdmin: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser' },
  escalationState: { type: String, enum: ['NORMAL', 'ATTENTION', 'HIGH_PRIORITY', 'CRITICAL_REVIEW'], default: 'NORMAL' },
  escalationStatus: { type: String, enum: ['WAITING_FOR_1', 'WAITING_FOR_2', 'WAITING_FOR_3', 'ACKNOWLEDGED', 'NO_RESPONSE'], default: 'WAITING_FOR_1' },
  currentEscalationIndex: { type: Number, default: 0 },
  authorizedContactsSnapshot: [{
    contactId: { type: mongoose.Schema.Types.ObjectId, ref: 'TrustedContact' },
    priority: Number,
    phone: String,
    linkedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }],
  locationSharingStatus: { type: String, enum: ['NOT_STARTED', 'COUNTDOWN', 'ACTIVE', 'STOPPED_BY_USER', 'STOPPED_BY_SYSTEM', 'ENDED_WITH_EMERGENCY'], default: 'NOT_STARTED' },
  locationSharingStartsAt: { type: Date },
  primaryTrustedPerson: { type: mongoose.Schema.Types.ObjectId, ref: 'TrustedContact' },
  emergencyToken: { type: String },
  emergencyTokenExpiresAt: { type: Date },
  adminNotes: [{
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser' },
    note: String,
    timestamp: { type: Date, default: Date.now }
  }],
  resolutionReason: { type: String },
  policeDispatched: { type: Boolean, default: false },
  evidence: [{
    fileType: { type: String, enum: ['IMAGE', 'AUDIO', 'VIDEO'] },
    url: String,
    timestamp: { type: Date, default: Date.now }
  }]
}, { timestamps: true });
// Indexing for rapid queries on active emergencies per user
EmergencySessionSchema.index({ user: 1, status: 1 });
EmergencySessionSchema.index({ startedAt: -1 });

module.exports = mongoose.model('EmergencySession', EmergencySessionSchema);

const mongoose = require('mongoose');

const HelpRequestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { 
    type: String, 
    enum: ['EMERGENCY', 'LOCATION', 'TRUSTED_CIRCLE', 'SAFETY_TIMER', 'JOURNEY', 'SAFE_ZONE', 'NOTIFICATION', 'ACCOUNT', 'PRIVACY', 'OTHER'],
    required: true 
  },
  priority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], default: 'MEDIUM' },
  status: { type: String, enum: ['OPEN', 'ASSIGNED', 'INVESTIGATING', 'WAITING_FOR_USER', 'RESOLVED', 'CLOSED'], default: 'OPEN' },
  assignedAdmin: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser' },
  description: { type: String, required: true },
  internalNotes: [{
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser' },
    note: String,
    timestamp: { type: Date, default: Date.now }
  }],
  resolution: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('HelpRequest', HelpRequestSchema);

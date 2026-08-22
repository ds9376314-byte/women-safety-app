const mongoose = require('mongoose');

const SystemIncidentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  severity: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], required: true },
  affectedService: { 
    type: String, 
    enum: ['API', 'DATABASE', 'AUTHENTICATION', 'NOTIFICATIONS', 'WEBSOCKET', 'LOCATION_PROCESSING', 'BACKGROUND_JOBS', 'OTHER'],
    required: true
  },
  status: { type: String, enum: ['INVESTIGATING', 'IDENTIFIED', 'MONITORING', 'RESOLVED'], default: 'INVESTIGATING' },
  assignedAdmin: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser' },
  description: { type: String },
  resolution: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('SystemIncident', SystemIncidentSchema);

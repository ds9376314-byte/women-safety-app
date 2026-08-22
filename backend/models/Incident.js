const mongoose = require('mongoose');

const IncidentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, required: true }, // e.g., 'SYSTEM_OUTAGE', 'SECURITY_ALERT', 'HIGH_SOS_VOLUME'
  severity: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], required: true },
  status: { type: String, enum: ['OPEN', 'INVESTIGATING', 'MONITORING', 'RESOLVED', 'CLOSED'], default: 'OPEN' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser' },
  description: { type: String },
  relatedEmergency: { type: mongoose.Schema.Types.ObjectId, ref: 'EmergencySession' },
  resolvedAt: { type: Date }
}, { timestamps: true });

IncidentSchema.index({ status: 1, severity: 1 });

module.exports = mongoose.model('Incident', IncidentSchema);

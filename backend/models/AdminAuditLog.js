const mongoose = require('mongoose');

const AdminAuditLogSchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser', required: true },
  action: { type: String, required: true },
  resourceType: { type: String, required: true },
  resourceId: { type: String },
  details: { type: mongoose.Schema.Types.Mixed },
  ipAddress: { type: String },
  status: { type: String, enum: ['SUCCESS', 'FAILED'], default: 'SUCCESS' }
}, { timestamps: true });

// Optimize for time-based analytical queries
AdminAuditLogSchema.index({ createdAt: -1 });
AdminAuditLogSchema.index({ adminId: 1, createdAt: -1 });

module.exports = mongoose.model('AdminAuditLog', AdminAuditLogSchema);

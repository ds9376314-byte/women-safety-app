const mongoose = require('mongoose');

const EscalationRuleSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  triggerCondition: { type: String, required: true }, // e.g., "DURATION_GREATER_THAN_15M", "UNRESPONSIVE"
  action: { type: String, default: 'ESCALATION_READY' },
  enabled: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('EscalationRule', EscalationRuleSchema);

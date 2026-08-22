const SOSAlert = require('../models/SOSAlert');
const TrustedContact = require('../models/TrustedContact');
const ActivityLog = require('../models/ActivityLog');

const triggerSOS = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    
    // In Phase 1, we do NOT send real alerts. Just log it as a UI event.
    await ActivityLog.create({ user: req.user._id, action: 'SOS_TRIGGERED', description: 'Triggered SOS Alert' });

    // Mock active alert for UI state
    const alert = {
      _id: 'mock_alert_id',
      status: 'active',
      location: { latitude, longitude }
    };

    res.status(201).json({ 
      message: 'SOS simulated successfully. No real alerts sent (Phase 1).',
      alert,
      contactsNotifiedCount: 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const resolveSOS = async (req, res) => {
  try {
    const alert = await SOSAlert.findById(req.params.id);
    
    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }
    
    if (alert.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    alert.status = 'resolved';
    alert.resolvedAt = Date.now();
    await alert.save();
    
    await ActivityLog.create({ user: req.user._id, action: 'SOS_RESOLVED', description: 'Resolved SOS Alert' });

    res.json({ message: 'SOS Alert resolved' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const EmergencySession = require('../models/EmergencySession');

const uploadEvidence = async (req, res) => {
  try {
    const { fileType, base64Data } = req.body;
    
    // Create or find an active session to attach evidence to
    let session = await EmergencySession.findOne({ user: req.user._id, status: 'ACTIVE' });
    if (!session) {
      session = await EmergencySession.create({
        user: req.user._id,
        status: 'ACTIVE',
        triggerSource: 'EVIDENCE_UPLOAD'
      });
    }

    session.evidence.push({
      fileType,
      url: base64Data, // Storing base64 string directly for prototype
      timestamp: new Date()
    });
    await session.save();
    
    await ActivityLog.create({ user: req.user._id, action: 'EVIDENCE_UPLOADED', description: `Uploaded silent ${fileType} evidence to Cloud Vault` });

    res.json({ message: 'Evidence securely uploaded to vault.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { triggerSOS, resolveSOS, uploadEvidence };

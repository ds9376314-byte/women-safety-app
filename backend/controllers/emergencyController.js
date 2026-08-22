const EmergencySession = require('../models/EmergencySession');
const EmergencyLocation = require('../models/EmergencyLocation');
const EmergencyAlert = require('../models/EmergencyAlert');
const ActivityLog = require('../models/ActivityLog');
const TrustedContact = require('../models/TrustedContact');
const crypto = require('crypto');
const sendSMS = require('../utils/sendSMS');

const triggerEscalation = async (sessionId, index) => {
  try {
    const session = await EmergencySession.findById(sessionId).populate('user', 'name');
    if (!session || session.status !== 'ACTIVE' || session.escalationStatus === 'ACKNOWLEDGED') return;

    const contacts = session.authorizedContactsSnapshot;
    if (index >= contacts.length) {
      session.escalationStatus = 'NO_RESPONSE';
      await session.save();
      return;
    }

    const contact = contacts[index];
    session.currentEscalationIndex = index;
    session.escalationStatus = `WAITING_FOR_${index + 1}`;
    await session.save();

    await EmergencyAlert.create({
      emergencySession: session._id,
      senderUser: session.user._id,
      trustedContact: contact.contactId,
      status: 'SENT',
      sentAt: new Date()
    });

    const emergencyUrl = `${process.env.WEB_DASHBOARD_URL || 'http://localhost:3000'}/emergency/${session.emergencyToken}`;
    
    if (contact.linkedUser) {
      console.log(`[PUSH] Escalation ${index + 1} to SHEVORA User ${contact.linkedUser}`);
    } else if (contact.phone) {
      const smsBody = `🔴 SHEVORA SOS: ${session.user.name} needs help!\n\nOpen immediately:\n${emergencyUrl}`;
      await sendSMS({ to: contact.phone, body: smsBody });
    }

    // Start 30s timer for next escalation
    setTimeout(() => {
      triggerEscalation(sessionId, index + 1);
    }, 30000);
  } catch (error) {
    console.error('Escalation error:', error);
  }
};

const createSession = async (req, res) => {
  try {
    const { triggerSource } = req.body;
    const userId = req.user._id;

    // Prevent duplicate active sessions
    const existingActive = await EmergencySession.findOne({ user: userId, status: 'ACTIVE' });
    if (existingActive) {
      return res.status(200).json(existingActive);
    }

    // Find top 3 active Trusted Contacts
    const contacts = await TrustedContact.find({ user: userId, status: 'ACTIVE' })
      .sort({ priority: 1, isPrimary: -1 }) // Fallback to isPrimary if priority not set
      .limit(3);
    
    const snapshot = contacts.map(c => ({
      contactId: c._id,
      priority: c.priority || 2,
      phone: c.phone,
      linkedUser: c.linkedUser
    }));
    
    // Generate Secure Emergency Token (32 bytes = 64 hex chars)
    const emergencyToken = crypto.randomBytes(32).toString('hex');
    const locationSharingStartsAt = new Date(Date.now() + 10000); // Exactly 10 seconds from now
    
    const session = await EmergencySession.create({
      user: userId,
      triggerSource: triggerSource || 'DASHBOARD_SOS',
      status: 'ACTIVE',
      locationSharingStatus: 'COUNTDOWN',
      locationSharingStartsAt,
      primaryTrustedPerson: contacts.length > 0 ? contacts[0]._id : null,
      authorizedContactsSnapshot: snapshot,
      escalationStatus: 'WAITING_FOR_1',
      currentEscalationIndex: 0,
      emergencyToken,
      emergencyTokenExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours expiry
    });

    await ActivityLog.create({ user: userId, action: 'EMERGENCY_SESSION_STARTED', description: `SOS activated via ${triggerSource}` });

    if (snapshot.length > 0) {
      // Kick off the escalation loop asynchronously
      triggerEscalation(session._id, 0);
    } else {
      session.escalationStatus = 'NO_RESPONSE'; // No valid contacts
      await session.save();
    }

    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getActiveSession = async (req, res) => {
  try {
    const session = await EmergencySession.findOne({ user: req.user._id, status: 'ACTIVE' });
    res.json(session || null);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const cancelSession = async (req, res) => {
  try {
    const session = await EmergencySession.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id, status: 'ACTIVE' },
      { status: 'CANCELLED', cancelledAt: new Date() },
      { new: true }
    );
    if (session) {
      await ActivityLog.create({ user: req.user._id, action: 'EMERGENCY_SESSION_CANCELLED', description: 'SOS was cancelled' });
    }
    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const resolveSession = async (req, res) => {
  try {
    const session = await EmergencySession.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id, status: 'ACTIVE' },
      { 
        status: 'RESOLVED', 
        resolvedAt: new Date(),
        locationSharingStatus: 'ENDED_WITH_EMERGENCY',
        emergencyToken: null // Revoke token immediately
      },
      { new: true }
    );
    if (session) {
      await ActivityLog.create({ user: req.user._id, action: 'EMERGENCY_SESSION_RESOLVED', description: 'User marked themselves safe' });
    }
    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addLocation = async (req, res) => {
  try {
    const { latitude, longitude, accuracy, speed, heading, timestamp } = req.body;
    const location = await EmergencyLocation.create({
      emergencySession: req.params.id,
      user: req.user._id,
      latitude, longitude, accuracy, speed, heading, timestamp
    });

    await EmergencySession.findByIdAndUpdate(req.params.id, { lastLocationAt: new Date() });
    res.status(201).json(location);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAlerts = async (req, res) => {
  try {
    const alerts = await EmergencyAlert.find({ emergencySession: req.params.id, senderUser: req.user._id }).populate('trustedContact');
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const stopLocationSharing = async (req, res) => {
  try {
    const session = await EmergencySession.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id, status: 'ACTIVE' },
      { locationSharingStatus: 'STOPPED_BY_USER' },
      { new: true }
    );
    if (!session) return res.status(404).json({ message: 'Session not found' });
    
    await ActivityLog.create({ user: req.user._id, action: 'LOCATION_SHARING_STOPPED', description: 'User manually stopped location sharing' });
    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getEmergencyLink = async (req, res) => {
  try {
    const { token } = req.params;
    
    const session = await EmergencySession.findOne({ emergencyToken: token })
      .populate('user', 'name'); // Minimal info
      
    if (!session) {
      // Either token never existed, or it was revoked on resolve
      return res.status(404).json({ message: 'Emergency link invalid or expired', state: 'ENDED_WITH_EMERGENCY' });
    }
    
    if (session.emergencyTokenExpiresAt < new Date()) {
      return res.status(404).json({ message: 'Emergency link expired', state: 'ENDED_WITH_EMERGENCY' });
    }

    res.json({
      status: session.status,
      startedAt: session.startedAt,
      locationSharingStatus: session.locationSharingStatus,
      locationSharingStartsAt: session.locationSharingStartsAt,
      user: { name: session.user.name },
      lastLocationAt: session.lastLocationAt,
      escalationStatus: session.escalationStatus
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const acknowledgeWebEmergency = async (req, res) => {
  try {
    const { token } = req.params;
    const session = await EmergencySession.findOne({ emergencyToken: token });
    
    if (!session) {
      return res.status(404).json({ message: 'Emergency link invalid or expired' });
    }
    
    if (session.status !== 'ACTIVE') {
      return res.status(400).json({ message: 'Emergency is no longer active' });
    }

    // Stop escalation loop
    session.escalationStatus = 'ACKNOWLEDGED';
    await session.save();

    res.json({ message: 'Emergency acknowledged successfully', status: session.status, escalationStatus: session.escalationStatus });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createSession, getActiveSession, cancelSession, resolveSession, addLocation, getAlerts, stopLocationSharing, getEmergencyLink, acknowledgeWebEmergency, triggerEscalation };

const TrustedCircleInvitation = require('../models/TrustedCircleInvitation');
const TrustedContact = require('../models/TrustedContact');
const EmergencySession = require('../models/EmergencySession');
const EmergencyAcknowledgement = require('../models/EmergencyAcknowledgement');
const User = require('../models/User');
const LocationPoint = require('../models/LocationPoint');

// POST /invitations
const createInvitation = async (req, res) => {
  try {
    const { inviteeEmail, inviteePhone, relation, permissions } = req.body;
    
    // Check if invitation already exists
    const existing = await TrustedCircleInvitation.findOne({
      inviter: req.user._id,
      inviteeEmail,
      status: 'PENDING'
    });
    if (existing) {
      return res.status(400).json({ message: 'Invitation already pending for this email' });
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // expires in 7 days

    const invitation = await TrustedCircleInvitation.create({
      inviter: req.user._id,
      inviteeEmail,
      inviteePhone,
      relation,
      permissions,
      expiresAt
    });

    res.status(201).json(invitation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /invitations/received
const getReceivedInvitations = async (req, res) => {
  try {
    const invitations = await TrustedCircleInvitation.find({
      inviteeEmail: req.user.email,
      status: 'PENDING'
    }).populate('inviter', 'name email');
    res.json(invitations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /invitations/sent
const getSentInvitations = async (req, res) => {
  try {
    const invitations = await TrustedCircleInvitation.find({
      inviter: req.user._id
    });
    res.json(invitations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /invitations/:id/accept
const acceptInvitation = async (req, res) => {
  try {
    const invitation = await TrustedCircleInvitation.findById(req.params.id);
    if (!invitation) return res.status(404).json({ message: 'Invitation not found' });
    if (invitation.inviteeEmail !== req.user.email) return res.status(403).json({ message: 'Not authorized' });
    if (invitation.status !== 'PENDING') return res.status(400).json({ message: 'Invitation is not pending' });

    invitation.status = 'ACCEPTED';
    await invitation.save();

    // Create TrustedContact for the inviter
    const contact = await TrustedContact.create({
      user: invitation.inviter,
      linkedUser: req.user._id,
      name: req.user.name,
      phone: req.user.phone || invitation.inviteePhone,
      email: req.user.email,
      relation: invitation.relation,
      permissions: invitation.permissions
    });

    res.json({ invitation, contact });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /invitations/:id/decline
const declineInvitation = async (req, res) => {
  try {
    const invitation = await TrustedCircleInvitation.findById(req.params.id);
    if (!invitation) return res.status(404).json({ message: 'Invitation not found' });
    if (invitation.inviteeEmail !== req.user.email) return res.status(403).json({ message: 'Not authorized' });
    
    invitation.status = 'DECLINED';
    await invitation.save();

    res.json(invitation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /
const getTrustedContacts = async (req, res) => {
  try {
    const contacts = await TrustedContact.find({ user: req.user._id }).populate('linkedUser', 'name email');
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /:id/permissions
const updatePermissions = async (req, res) => {
  try {
    const contact = await TrustedContact.findById(req.params.id);
    if (!contact) return res.status(404).json({ message: 'Contact not found' });
    if (contact.user.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not authorized' });

    contact.permissions = { ...contact.permissions, ...req.body.permissions };
    await contact.save();

    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /:id/priority
const updatePriority = async (req, res) => {
  try {
    const contact = await TrustedContact.findById(req.params.id);
    if (!contact) return res.status(404).json({ message: 'Contact not found' });
    if (contact.user.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not authorized' });

    contact.priority = req.body.priority || 2;
    if (contact.priority === 1) {
       contact.isPrimary = true;
    } else {
       contact.isPrimary = false;
    }
    await contact.save();

    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /:id
const deleteContact = async (req, res) => {
  try {
    const contact = await TrustedContact.findById(req.params.id);
    if (!contact) return res.status(404).json({ message: 'Contact not found' });
    if (contact.user.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not authorized' });

    await contact.deleteOne();
    res.json({ message: 'Contact removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /emergencies
const getActiveEmergencies = async (req, res) => {
  try {
    // Find users who have req.user as a linked trusted contact with emergencyLocation: true
    const contacts = await TrustedContact.find({
      linkedUser: req.user._id,
      'permissions.emergencyLocation': true
    });

    const victimIds = contacts.map(c => c.user);

    const emergencies = await EmergencySession.find({
      user: { $in: victimIds },
      status: { $in: ['STARTING', 'ACTIVE'] }
    }).populate('user', 'name email phone').lean();
    
    // Attach latest location to each emergency
    const emergenciesWithLocation = await Promise.all(emergencies.map(async (emergency) => {
      const latestPoint = await LocationPoint.findOne({ user: emergency.user }).sort({ timestamp: -1 });
      return { ...emergency, latestLocation: latestPoint };
    }));

    res.json(emergenciesWithLocation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /emergencies/:id/acknowledge
const acknowledgeEmergency = async (req, res) => {
  try {
    const emergency = await EmergencySession.findById(req.params.id);
    if (!emergency) return res.status(404).json({ message: 'Emergency session not found' });
    
    // Check if the user is a trusted contact of the victim
    const contact = await TrustedContact.findOne({
      user: emergency.user,
      linkedUser: req.user._id
    });

    if (!contact) return res.status(403).json({ message: 'Not authorized to acknowledge this emergency' });

    const ack = await EmergencyAcknowledgement.create({
      emergencySession: emergency._id,
      user: emergency.user,
      contactUser: req.user._id,
      trustedContactRef: contact._id,
      status: 'ACKNOWLEDGED'
    });

    // Stop escalation timers!
    emergency.escalationStatus = 'ACKNOWLEDGED';
    await emergency.save();

    res.status(201).json(ack);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /emergencies/:id
const getEmergencyById = async (req, res) => {
  try {
    const emergency = await EmergencySession.findById(req.params.id).populate('user', 'name phone email');
    if (!emergency) return res.status(404).json({ message: 'Emergency session not found' });
    
    res.json(emergency);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /emergencies/:id/location
const getEmergencyLocation = async (req, res) => {
  try {
    const emergency = await EmergencySession.findById(req.params.id);
    if (!emergency) return res.status(404).json({ message: 'Emergency session not found' });
    
    // Find recent location points for this user during this emergency
    const points = await LocationPoint.find({ user: emergency.user }).sort({ timestamp: -1 }).limit(10);
    res.json(points);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /journeys (trusted circle)
const getActiveJourneys = async (req, res) => {
  try {
    const contacts = await TrustedContact.find({
      linkedUser: req.user._id
      // 'permissions.liveLocation': true // Removed strict check for prototype
    });

    const victimIds = contacts.map(c => c.user);

    const journeys = await require('../models/SafetyJourney').find({
      user: { $in: victimIds },
      status: 'active'
    }).populate('user', 'name email phone').lean();
    
    // Attach latest location to each journey
    const journeysWithLocation = await Promise.all(journeys.map(async (journey) => {
      const latestPoint = await LocationPoint.findOne({ journey: journey._id }).sort({ timestamp: -1 });
      return { ...journey, latestLocation: latestPoint };
    }));

    res.json(journeysWithLocation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /journeys/:id/location
const getJourneyLocation = async (req, res) => {
  try {
    const journey = await require('../models/SafetyJourney').findById(req.params.id);
    if (!journey) return res.status(404).json({ message: 'Journey not found' });
    
    // Check if the user is a trusted contact of the journey owner
    const contact = await TrustedContact.findOne({
      user: journey.user,
      linkedUser: req.user._id
    });
    if (!contact) return res.status(403).json({ message: 'Not authorized' });

    // Return the latest location
    const latestPoint = await LocationPoint.findOne({ journey: journey._id }).sort({ timestamp: -1 });
    res.json(latestPoint ? [latestPoint] : []); // Return as array to match emergency location format
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createInvitation,
  getReceivedInvitations,
  getSentInvitations,
  acceptInvitation,
  declineInvitation,
  getTrustedContacts,
  updatePermissions,
  updatePriority,
  deleteContact,
  getActiveEmergencies,
  getEmergencyById,
  getEmergencyLocation,
  acknowledgeEmergency,
  getActiveJourneys,
  getJourneyLocation
};

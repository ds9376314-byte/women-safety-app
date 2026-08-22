const SafetyJourney = require('../models/SafetyJourney');
const LocationPoint = require('../models/LocationPoint');
const TrustedContact = require('../models/TrustedContact');
const EmergencySession = require('../models/EmergencySession');
const crypto = require('crypto');
const sendSMS = require('../utils/sendSMS');
const sendEmail = require('../utils/sendEmail');
const { triggerEscalation } = require('./emergencyController');

const getJourneys = async (req, res) => {
  try {
    const journeys = await SafetyJourney.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(journeys);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getJourneyById = async (req, res) => {
  try {
    const journey = await SafetyJourney.findOne({ _id: req.params.id, user: req.user._id });
    if (!journey) return res.status(404).json({ message: 'Not found' });
    res.json(journey);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createJourney = async (req, res) => {
  try {
    const { mode, durationMinutes } = req.body;
    const emergencyToken = crypto.randomBytes(16).toString('hex');
    
    let expectedArrivalTime = null;
    if (mode === 'TIME_BASED' && durationMinutes) {
      expectedArrivalTime = new Date(Date.now() + durationMinutes * 60000);
    }

    const journey = await SafetyJourney.create({ 
      user: req.user._id,
      mode: mode || 'ONE_TAP',
      durationMinutes,
      expectedArrivalTime,
      emergencyToken,
      status: 'active'
    });

    const ActivityLog = require('../models/ActivityLog');
    await ActivityLog.create({ user: req.user._id, action: 'JOURNEY_STARTED', description: 'Started a safe journey' });

    // Notify Trusted Contact
    const primaryContact = await TrustedContact.findOne({ user: req.user._id })
      .sort({ priority: 1, isPrimary: -1 })
      .populate('linkedUser');

    if (primaryContact) {
      const isAppUser = !!primaryContact.linkedUser;
      
      if (!isAppUser) {
        const link = `${process.env.WEB_DASHBOARD_URL || 'http://localhost:3000'}/journey/${emergencyToken}`;
        const msg = `SHEVORA: ${req.user.name} has started a journey.\nTrack live status here: ${link}`;
        
        if (primaryContact.phone) {
          await sendSMS({ to: primaryContact.phone, body: msg });
        }
        if (primaryContact.email) {
          await sendEmail({ 
            to: primaryContact.email, 
            subject: 'SHEVORA: Journey Started', 
            text: msg 
          });
        }
      } else {
        // User is in the app, they will see it in the Command Center
        console.log(`[JOURNEY] Contact is app user (${primaryContact.linkedUser.name}), skipping SMS/Email.`);
      }
    }

    // Auto-SOS Timeout (Time-Based)
    if (mode === 'TIME_BASED' && durationMinutes) {
      setTimeout(async () => {
        try {
          const checkJourney = await SafetyJourney.findById(journey._id).populate('user');
          if (checkJourney && checkJourney.status === 'active' && !checkJourney.isSOSActivated) {
            checkJourney.isSOSActivated = true;
            await checkJourney.save();
            
            // Trigger Auto-Escalation Emergency
            const contacts = await TrustedContact.find({ user: checkJourney.user._id, status: 'ACTIVE' }).sort({ priority: 1, isPrimary: -1 }).limit(3);
            const snapshot = contacts.map(c => ({
              contactId: c._id, priority: c.priority || 2, phone: c.phone, linkedUser: c.linkedUser
            }));
            
            const session = await EmergencySession.create({
              user: checkJourney.user._id,
              triggerSource: 'JOURNEY_TIMEOUT',
              status: 'ACTIVE',
              locationSharingStatus: 'ACTIVE', // Immediate
              primaryTrustedPerson: contacts.length > 0 ? contacts[0]._id : null,
              authorizedContactsSnapshot: snapshot,
              escalationStatus: 'WAITING_FOR_1',
              currentEscalationIndex: 0,
              emergencyToken: crypto.randomBytes(32).toString('hex'),
              emergencyTokenExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
            });
            
            if (snapshot.length > 0) {
              triggerEscalation(session._id, 0);
            } else {
              session.escalationStatus = 'NO_RESPONSE';
              await session.save();
            }
            console.log(`[JOURNEY] Auto-SOS triggered for journey ${journey._id}`);
          }
        } catch (e) {
          console.error('Timeout check failed:', e);
        }
      }, durationMinutes * 60000);
    }

    res.status(201).json(journey);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateJourney = async (req, res) => {
  try {
    const journey = await SafetyJourney.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );
    res.json(journey);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateJourneyStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const journey = await SafetyJourney.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { status },
      { new: true }
    ).populate('user');
    
    if (status === 'completed') {
      const ActivityLog = require('../models/ActivityLog');
      await ActivityLog.create({ user: req.user._id, action: 'JOURNEY_ENDED', description: 'Arrived safely and ended journey' });
      
      const primaryContact = await TrustedContact.findOne({ user: req.user._id }).sort({ priority: 1, isPrimary: -1 });
      if (primaryContact && primaryContact.phone) {
        const msg = `SHEVORA: ${journey.user.name} has arrived safely and ended their journey.`;
        await sendSMS({ to: primaryContact.phone, body: msg });
      }
    }
    
    res.json(journey);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getJourneyLocations = async (req, res) => {
  try {
    const points = await LocationPoint.find({ journey: req.params.id, user: req.user._id }).sort({ timestamp: 1 });
    res.json(points);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPublicJourney = async (req, res) => {
  try {
    const journey = await SafetyJourney.findOne({ emergencyToken: req.params.token }).populate('user', 'name');
    if (!journey) return res.status(404).json({ message: 'Invalid token' });
    res.json(journey);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getJourneys, getJourneyById, createJourney, updateJourney, updateJourneyStatus, getJourneyLocations, getPublicJourney };

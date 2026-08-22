const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.phone = req.body.phone || user.phone;
      user.dob = req.body.dob || user.dob;
      user.address = req.body.address || user.address;
      user.bloodGroup = req.body.bloodGroup || user.bloodGroup;
      user.medicalNotes = req.body.medicalNotes || user.medicalNotes;
      user.emergencyMessage = req.body.emergencyMessage || user.emergencyMessage;
      
      if (req.body.duressPin !== undefined) user.duressPin = req.body.duressPin;
      
      if (req.body.pushNotifications !== undefined) user.pushNotifications = req.body.pushNotifications;
      if (req.body.emailAlerts !== undefined) user.emailAlerts = req.body.emailAlerts;
      if (req.body.shareLocation !== undefined) user.shareLocation = req.body.shareLocation;
      
      const updatedUser = await user.save();
      await ActivityLog.create({ user: user._id, action: 'update_profile', description: 'Updated profile information' });
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user && (await user.matchPassword(req.body.oldPassword))) {
      user.password = req.body.newPassword;
      await user.save();
      await ActivityLog.create({ user: user._id, action: 'change_password', description: 'User changed their password' });
      res.json({ message: 'Password updated successfully' });
    } else {
      res.status(401).json({ message: 'Invalid current password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const EmergencySession = require('../models/EmergencySession');
const LocationPoint = require('../models/LocationPoint');
const TrustedContact = require('../models/TrustedContact');
const PolicyAcceptance = require('../models/PolicyAcceptance');
const PrivacyRequest = require('../models/PrivacyRequest');

const exportData = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Collect all permitted data
    const activityLogs = await ActivityLog.find({ user: user._id }).select('action description createdAt');
    const trustedContacts = await TrustedContact.find({ user: user._id }).select('name phone relation isPrimary permissions');
    const emergencies = await EmergencySession.find({ user: user._id }).select('status triggerSource startedAt resolvedAt locationSharingStatus');
    const policyAcceptances = await PolicyAcceptance.find({ user: user._id }).select('documentName version acceptedAt');
    const privacyRequests = await PrivacyRequest.find({ user: user._id }).select('type status details createdAt resolvedAt');
    
    // Construct the export payload
    const exportData = {
      exportGeneratedAt: new Date(),
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        bloodGroup: user.bloodGroup,
        medicalNotes: user.medicalNotes,
        accountCreatedAt: user.createdAt
      },
      settings: {
        pushNotifications: user.pushNotifications,
        emailAlerts: user.emailAlerts,
        shareLocation: user.shareLocation
      },
      trustedContacts,
      emergencyHistory: emergencies,
      privacyRequests,
      legalAcceptances: policyAcceptances,
      activityLog: activityLogs
    };

    // Note: We DO NOT export other users' data, full raw GPS histories (unless explicitly requested/required), or secrets.
    await ActivityLog.create({ user: user._id, action: 'data_export', description: 'User requested and downloaded their data archive' });
    
    res.json(exportData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check for active emergencies
    const activeEmergency = await EmergencySession.findOne({ user: user._id, status: 'ACTIVE' });
    if (activeEmergency) {
      return res.status(400).json({ message: 'Cannot delete account with an active emergency. Please resolve it first.' });
    }

    // Safely delete associated data
    await ActivityLog.deleteMany({ user: user._id });
    await EmergencySession.deleteMany({ user: user._id });
    await LocationPoint.deleteMany({ user: user._id });
    await TrustedContact.deleteMany({ user: user._id });
    const SafeZone = require('../models/SafeZone');
    await SafeZone.deleteMany({ user: user._id });
    const SafetyJourney = require('../models/SafetyJourney');
    await SafetyJourney.deleteMany({ user: user._id });
    await PolicyAcceptance.deleteMany({ user: user._id });
    await PrivacyRequest.deleteMany({ user: user._id });
    const SOSAlert = require('../models/SOSAlert');
    await SOSAlert.deleteMany({ user: user._id });
    
    // Finally delete user
    await User.deleteOne({ _id: user._id });
    
    console.log(`Account ${user._id} deleted successfully`);
    res.json({ message: 'Account and associated data deleted successfully' });
  } catch (error) {
    console.error('Delete Account Error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProfile, updateProfile, changePassword, deleteAccount, exportData };

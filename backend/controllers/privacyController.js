const PrivacyRequest = require('../models/PrivacyRequest');
const ActivityLog = require('../models/ActivityLog');

const createRequest = async (req, res) => {
  try {
    const { type, details } = req.body;
    
    if (!['DATA_ACCESS', 'DATA_EXPORT', 'DATA_DELETION', 'PRIVACY_QUESTION'].includes(type)) {
      return res.status(400).json({ message: 'Invalid request type' });
    }

    const request = await PrivacyRequest.create({
      user: req.user._id,
      type,
      details
    });

    await ActivityLog.create({ user: req.user._id, action: 'privacy_request_created', description: `Filed a ${type} request` });

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyRequests = async (req, res) => {
  try {
    const requests = await PrivacyRequest.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createRequest, getMyRequests };

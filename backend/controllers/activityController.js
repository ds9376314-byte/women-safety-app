const ActivityLog = require('../models/ActivityLog');

const getActivity = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const query = { user: req.user._id };
    
    // If important=true, only show critical safety events
    if (req.query.important === 'true') {
      query.action = { $in: [
        'SOS_TRIGGERED', 'SOS_RESOLVED', 
        'EMERGENCY_SESSION_STARTED', 'EMERGENCY_SESSION_RESOLVED', 'EMERGENCY_SESSION_CANCELLED',
        'JOURNEY_STARTED', 'JOURNEY_ENDED', 
        'SAFE_ZONE_ENTRY', 'SAFE_ZONE_EXIT', 
        'TRUSTED_CONTACT_ADDED'
      ] };
    }

    const logs = await ActivityLog.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getActivity };

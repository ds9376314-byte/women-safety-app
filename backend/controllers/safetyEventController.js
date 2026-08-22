const SafetyEvent = require('../models/SafetyEvent');

const getSafetyEvents = async (req, res) => {
  try {
    const events = await SafetyEvent.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createSafetyEvent = async (req, res) => {
  try {
    // Accepts array or single object for offline sync batching
    const eventsToCreate = Array.isArray(req.body) 
      ? req.body.map(e => ({ ...e, user: req.user._id }))
      : { ...req.body, user: req.user._id };
      
    const events = await SafetyEvent.create(eventsToCreate);
    res.status(201).json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getSafetyEvents, createSafetyEvent };

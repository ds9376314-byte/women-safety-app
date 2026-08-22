const SafetyTimer = require('../models/SafetyTimer');

const createTimer = async (req, res) => {
  try {
    const timer = await SafetyTimer.create({ ...req.body, user: req.user._id });
    res.status(201).json(timer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getActiveTimer = async (req, res) => {
  try {
    const timer = await SafetyTimer.findOne({ user: req.user._id, status: 'active' });
    res.json(timer || null);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTimerStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const timer = await SafetyTimer.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { status },
      { new: true }
    );
    res.json(timer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const extendTimer = async (req, res) => {
  try {
    const { durationMinutes } = req.body;
    const timer = await SafetyTimer.findOne({ _id: req.params.id, user: req.user._id });
    if (!timer) return res.status(404).json({ message: 'Not found' });
    
    const newEndTime = new Date(timer.expectedEndTime.getTime() + durationMinutes * 60000);
    timer.expectedEndTime = newEndTime;
    timer.extensions.push({ durationMinutes, addedAt: new Date() });
    
    await timer.save();
    res.json(timer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createTimer, getActiveTimer, updateTimerStatus, extendTimer };

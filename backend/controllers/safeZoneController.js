const SafeZone = require('../models/SafeZone');

const getSafeZones = async (req, res) => {
  try {
    const zones = await SafeZone.find({ user: req.user._id });
    res.json(zones);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createSafeZone = async (req, res) => {
  try {
    const { name, location, radiusMeters, icon, notifyContacts, enabled } = req.body;
    
    // If notifyContacts is not provided, default to Priority 1 contact
    let contactsToNotify = notifyContacts;
    if (!contactsToNotify || contactsToNotify.length === 0) {
      const TrustedContact = require('../models/TrustedContact');
      const primaryContact = await TrustedContact.findOne({ user: req.user._id, isPrimary: true });
      if (primaryContact) {
        contactsToNotify = [primaryContact._id];
      } else {
        // Fallback to highest priority if no primary is set
        const highestPriority = await TrustedContact.findOne({ user: req.user._id }).sort({ priority: 1 });
        if (highestPriority) contactsToNotify = [highestPriority._id];
      }
    }

    const zone = await SafeZone.create({
      user: req.user._id,
      name,
      location,
      radiusMeters,
      icon,
      enabled,
      notifyContacts: contactsToNotify
    });
    res.status(201).json(zone);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateSafeZone = async (req, res) => {
  try {
    const zone = await SafeZone.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );
    if (!zone) return res.status(404).json({ message: 'Not found' });
    res.json(zone);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteSafeZone = async (req, res) => {
  try {
    const zone = await SafeZone.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!zone) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getSafeZones, createSafeZone, updateSafeZone, deleteSafeZone };

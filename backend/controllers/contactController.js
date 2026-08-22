const TrustedContact = require('../models/TrustedContact');
const ActivityLog = require('../models/ActivityLog');
const User = require('../models/User');

const getContacts = async (req, res) => {
  try {
    const contacts = await TrustedContact.find({ user: req.user._id });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addContact = async (req, res) => {
  try {
    const { name, phone, email, relation } = req.body;
    
    const count = await TrustedContact.countDocuments({ user: req.user._id });
    if (count >= 10) {
      return res.status(400).json({ message: 'Maximum 10 trusted contacts allowed' });
    }

    let linkedUserId = null;
    if (email) {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        linkedUserId = existingUser._id;
      }
    }

    const contact = await TrustedContact.create({
      user: req.user._id,
      linkedUser: linkedUserId,
      name,
      phone,
      email: email ? email.toLowerCase() : undefined,
      relation
    });

    await ActivityLog.create({ user: req.user._id, action: 'add_contact', description: `Added ${name} to trusted circle` });
    res.status(201).json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeContact = async (req, res) => {
  try {
    const contact = await TrustedContact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    
    if (contact.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await contact.deleteOne();
    await ActivityLog.create({ user: req.user._id, action: 'remove_contact', description: `Removed ${contact.name} from trusted circle` });
    res.json({ message: 'Contact removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatePriority = async (req, res) => {
  try {
    const contact = await TrustedContact.findById(req.params.id);
    if (!contact) return res.status(404).json({ message: 'Contact not found' });
    if (contact.user.toString() !== req.user._id.toString()) return res.status(401).json({ message: 'Not authorized' });

    contact.priority = req.body.priority || 2;
    if (contact.priority === 1) contact.isPrimary = true;
    else contact.isPrimary = false;
    
    await contact.save();
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getContacts, addContact, removeContact, updatePriority };

const express = require('express');
const { getContacts, addContact, removeContact, updatePriority } = require('../controllers/contactController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').get(protect, getContacts).post(protect, addContact);
router.route('/:id').delete(protect, removeContact);
router.route('/:id/priority').put(protect, updatePriority);

module.exports = router;

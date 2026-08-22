const express = require('express');
const router = express.Router();
const { getSafetyEvents, createSafetyEvent } = require('../controllers/safetyEventController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getSafetyEvents).post(protect, createSafetyEvent);

module.exports = router;

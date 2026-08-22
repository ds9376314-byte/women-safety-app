const express = require('express');
const router = express.Router();
const { createSession, getActiveSession, cancelSession, resolveSession, addLocation, getAlerts, stopLocationSharing, getEmergencyLink, acknowledgeWebEmergency } = require('../controllers/emergencyController');
const { protect } = require('../middleware/authMiddleware');

// Public link route
router.get('/link/:token', getEmergencyLink);
router.post('/link/:token/acknowledge', acknowledgeWebEmergency);

router.route('/').post(protect, createSession);
router.route('/active').get(protect, getActiveSession);
router.post('/:id/cancel', protect, cancelSession);
router.post('/:id/resolve', protect, resolveSession);
router.post('/:id/location', protect, addLocation);
router.post('/:id/stop-location', protect, stopLocationSharing);
router.get('/:id/alerts', protect, getAlerts);

module.exports = router;

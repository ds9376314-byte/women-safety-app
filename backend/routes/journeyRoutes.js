const express = require('express');
const router = express.Router();
const { getJourneys, getJourneyById, createJourney, updateJourney, updateJourneyStatus, getJourneyLocations, getPublicJourney } = require('../controllers/journeyController');
const { protect } = require('../middleware/authMiddleware');

router.get('/link/:token', getPublicJourney);

router.route('/').get(protect, getJourneys).post(protect, createJourney);
router.route('/:id').get(protect, getJourneyById).put(protect, updateJourney);
router.put('/:id/status', protect, updateJourneyStatus);
router.get('/:id/location', protect, getJourneyLocations);

module.exports = router;

const express = require('express');
const router = express.Router();
const { getSafeZones, createSafeZone, updateSafeZone, deleteSafeZone } = require('../controllers/safeZoneController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getSafeZones).post(protect, createSafeZone);
router.route('/:id').put(protect, updateSafeZone).delete(protect, deleteSafeZone);

module.exports = router;

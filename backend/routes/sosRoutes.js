const express = require('express');
const router = express.Router();
const { triggerSOS, resolveSOS, uploadEvidence } = require('../controllers/sosController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, triggerSOS);
router.put('/:id/resolve', protect, resolveSOS);
router.post('/evidence', protect, uploadEvidence);

module.exports = router;

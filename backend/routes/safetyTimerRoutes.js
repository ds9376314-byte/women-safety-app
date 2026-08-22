const express = require('express');
const router = express.Router();
const { createTimer, getActiveTimer, updateTimerStatus, extendTimer } = require('../controllers/safetyTimerController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createTimer);
router.get('/active', protect, getActiveTimer);
router.put('/:id', protect, updateTimerStatus);
router.post('/:id/extend', protect, extendTimer);
router.post('/:id/complete', protect, (req, res) => { req.body = req.body || {}; req.body.status = 'completed'; updateTimerStatus(req, res); });
router.post('/:id/cancel', protect, (req, res) => { req.body = req.body || {}; req.body.status = 'cancelled'; updateTimerStatus(req, res); });

module.exports = router;

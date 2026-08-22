const express = require('express');
const router = express.Router();
const { createRequest, getMyRequests } = require('../controllers/privacyController');
const { protect } = require('../middleware/authMiddleware');

router.post('/request', protect, createRequest);
router.get('/my-requests', protect, getMyRequests);

module.exports = router;

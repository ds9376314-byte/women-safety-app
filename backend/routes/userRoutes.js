const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, changePassword, deleteAccount, exportData } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/export', protect, exportData);

router.route('/profile').get(protect, getProfile).put(protect, updateProfile);
router.put('/password', protect, changePassword);

router.delete('/account', protect, deleteAccount);

module.exports = router;

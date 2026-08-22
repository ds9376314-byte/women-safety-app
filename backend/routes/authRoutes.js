const express = require('express');
const { registerUser, authUser, forgotPassword, resetPassword, verifyEmail, resendVerification, googleAuth } = require('../controllers/authController');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerification);
router.post('/google', googleAuth);

module.exports = router;

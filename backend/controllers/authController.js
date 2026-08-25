const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || '750720705579-6s9o0h6jt865bs6as2pdi001v7jmin84.apps.googleusercontent.com');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      if (existingUser.isVerified) {
        return res.status(400).json({ message: 'User already exists' });
      } else {
        // User exists but not verified, resend OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        existingUser.emailVerificationOtp = otp;
        existingUser.emailVerificationExpire = Date.now() + 10 * 60 * 1000;
        await existingUser.save();
        
        const message = `Welcome to SHEVORA!\n\nYour email verification code is: ${otp}\n\nThis code is valid for 10 minutes.`;
        try {
          await sendEmail({ to: existingUser.email, subject: 'SHEVORA - Verify Your Email', text: message });
        } catch (e) {
          console.error("Email send error:", e);
        }
        return res.status(201).json({ message: 'Verification code resent. Please verify email.', email: existingUser.email });
      }
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    const user = await User.create({ 
      name, 
      email, 
      password,
      isVerified: false,
      emailVerificationOtp: otp,
      emailVerificationExpire: Date.now() + 10 * 60 * 1000 // 10 mins
    });
    
    if (user) {
      const message = `Welcome to SHEVORA!\n\nYour email verification code is: ${otp}\n\nThis code is valid for 10 minutes.`;
      try {
        await sendEmail({
          to: user.email,
          subject: 'SHEVORA - Verify Your Email',
          text: message
        });
      } catch (e) {
        console.error("Email send error:", e);
      }
      
      res.status(201).json({ message: 'User registered. Please verify email.', email: user.email });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const authUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    
    if (user && (await user.matchPassword(password))) {
      // Allow if verified OR if it's an old test account (isVerified is undefined/null)
      if (user.isVerified === false) {
        return res.status(403).json({ message: 'Email not verified' });
      }

      await ActivityLog.create({ user: user._id, action: 'login', description: 'Logged in successfully' });
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordOtp = otp;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 mins
    await user.save();

    const message = `Your password reset code is: ${otp}\n\nThis code is valid for 10 minutes.`;
    await sendEmail({
      to: user.email,
      subject: 'SHEVORA - Password Reset',
      text: message
    });

    res.json({ message: 'Reset code sent to email' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({
      email,
      resetPasswordOtp: otp,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.password = newPassword;
    user.resetPasswordOtp = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({
      email,
      emailVerificationOtp: otp,
      emailVerificationExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.isVerified = true;
    user.emailVerificationOtp = undefined;
    user.emailVerificationExpire = undefined;
    await user.save();

    await ActivityLog.create({ user: user._id, action: 'signup', description: 'Account created and verified' });
    
    res.json({
      message: 'Email verified successfully',
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.isVerified !== false) {
      return res.status(400).json({ message: 'Email is already verified' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.emailVerificationOtp = otp;
    user.emailVerificationExpire = Date.now() + 10 * 60 * 1000;
    await user.save();

    const message = `Your new email verification code is: ${otp}\n\nThis code is valid for 10 minutes.`;
    await sendEmail({
      to: user.email,
      subject: 'SHEVORA - Verify Your Email',
      text: message
    });

    res.json({ message: 'Verification code resent to email' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const googleAuth = async (req, res) => {
  try {
    const { idToken } = req.body;
    
    // Verify Google ID token
    const ticket = await client.verifyIdToken({
        idToken,
        // audience: process.env.GOOGLE_CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
    });
    
    const payload = ticket.getPayload();
    const { email, name, sub: googleId, picture } = payload;
    
    // Check if user exists
    let user = await User.findOne({ email });
    
    if (user) {
      // Update with google auth provider if needed
      if (user.authProvider !== 'google') {
          user.googleId = googleId;
          user.authProvider = 'google';
          user.isVerified = true;
          await user.save();
      }
      
      await ActivityLog.create({ user: user._id, action: 'login', description: 'Logged in with Google' });
      
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        profilePhoto: user.profilePhoto || picture,
        token: generateToken(user._id)
      });
    } else {
      // Create new user
      user = await User.create({
          name,
          email,
          googleId,
          authProvider: 'google',
          isVerified: true,
          profilePhoto: picture
      });
      
      await ActivityLog.create({ user: user._id, action: 'signup', description: 'Account created with Google' });
      
      return res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        profilePhoto: user.profilePhoto,
        token: generateToken(user._id)
      });
    }
  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(401).json({ message: 'Invalid Google token' });
  }
};

module.exports = { registerUser, authUser, forgotPassword, resetPassword, verifyEmail, resendVerification, googleAuth };

const AdminUser = require('../models/AdminUser');
const User = require('../models/User');
const EmergencySession = require('../models/EmergencySession');
const HelpRequest = require('../models/HelpRequest');
const SystemIncident = require('../models/SystemIncident');
const AdminAuditLog = require('../models/AdminAuditLog');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', { expiresIn: '8h' });
};

const createAuditLog = async (req, action, resourceType, resourceId = null, details = {}) => {
  try {
    await AdminAuditLog.create({
      adminId: req.admin._id,
      action,
      resourceType,
      resourceId,
      details,
      ipAddress: req.ip
    });
  } catch (error) {
    console.error('Failed to create audit log', error);
  }
};

// @desc    Auth admin & request OTP
// @route   POST /api/admin/auth/login
const authAdmin = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const admin = await AdminUser.findOne({ email });

    if (admin && (await admin.matchPassword(password))) {
      if (admin.status === 'SUSPENDED') {
        return res.status(403).json({ message: 'Account is suspended' });
      }
      
      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      admin.otp = otp;
      admin.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
      await admin.save();
      
      // MOCK SEND EMAIL
      console.log(`\n\n======================================\n📧 EMAIL TO: ${email}\n🔐 YOUR ADMIN LOGIN OTP IS: ${otp}\n======================================\n\n`);

      // ACTUAL SEND EMAIL (Requires EMAIL_USER and EMAIL_PASS in .env)
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        await sendEmail({
          to: email,
          subject: 'SHEVORA Admin - Login Verification Code',
          text: `Your SHEVORA Admin login code is: ${otp}\n\nThis code will expire in 10 minutes.`,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #1a202c; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 8px;">
              <h2 style="color: #2b6cb0; text-align: center;">SHEVORA Admin Verification</h2>
              <p>Hello,</p>
              <p>You requested a login to the SHEVORA Operations Center. Please use the following One-Time Password (OTP) to complete your login:</p>
              <div style="background-color: #f7fafc; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; border-radius: 6px; margin: 20px 0;">
                ${otp}
              </div>
              <p style="font-size: 14px; color: #718096;">This code is valid for 10 minutes.</p>
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
              <p style="font-size: 12px; color: #a0aec0;">If you did not request this login, please contact a Super Admin immediately.</p>
            </div>
          `
        });
      }

      res.json({ message: 'OTP sent to email', step: 'OTP_REQUIRED', email });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify OTP and get token
// @route   POST /api/admin/auth/verify-otp
const verifyAdminOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const admin = await AdminUser.findOne({ email });
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    if (admin.otp !== otp || admin.otpExpires < Date.now()) {
      return res.status(401).json({ message: 'Invalid or expired OTP' });
    }

    // Clear OTP
    admin.otp = undefined;
    admin.otpExpires = undefined;
    admin.lastLogin = Date.now();
    await admin.save();

    req.admin = admin;
    await createAuditLog(req, 'LOGIN_VERIFIED', 'AUTH');

    res.json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      token: generateToken(admin._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get dashboard metrics
// @route   GET /api/admin/dashboard
const getDashboardMetrics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeEmergencies = await EmergencySession.countDocuments({ status: 'ACTIVE' });
    
    // In a real app we'd aggregate today's sessions, active timers, etc.
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const emergenciesToday = await EmergencySession.countDocuments({ startedAt: { $gte: today } });

    await createAuditLog(req, 'VIEW_DASHBOARD', 'DASHBOARD');

    res.json({
      users: {
        total: totalUsers,
        active: totalUsers, // placeholder
      },
      safety: {
        activeEmergencies,
        emergenciesToday,
      },
      system: {
        apiStatus: 'HEALTHY',
        databaseStatus: 'HEALTHY'
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get users (limited info based on role)
// @route   GET /api/admin/users
const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    
    // We only send back basic info, NEVER exact locations or passwords
    const users = await User.find({})
      .select('name email phone role status createdAt')
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });
      
    await createAuditLog(req, 'LIST_USERS', 'USER_MANAGEMENT');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Suspend user account
// @route   POST /api/admin/users/:id/suspend
const suspendUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // Check if there is an active emergency, prevent suspension if so
    const activeSession = await EmergencySession.findOne({ user: user._id, status: 'ACTIVE' });
    if (activeSession) {
      return res.status(400).json({ message: 'Cannot suspend user with an active emergency session.' });
    }

    user.status = 'SUSPENDED'; // Assuming you add this to the User model, for now just theoretical or mapped to a flag
    await user.save();
    
    await createAuditLog(req, 'SUSPEND_USER', 'USER_MANAGEMENT', user._id, { reason: req.body.reason });
    res.json({ message: 'User suspended' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get active emergencies (EOC)
// @route   GET /api/admin/emergencies
const getEmergencies = async (req, res) => {
  try {
    const statusFilter = req.query.status ? req.query.status : 'ACTIVE';
    const sessions = await EmergencySession.find({ status: statusFilter })
      .populate('user', 'name phone')
      .sort({ startedAt: -1 });
      
    await createAuditLog(req, 'VIEW_EMERGENCIES', 'EMERGENCY_OPS');
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Audit Logs
// @route   GET /api/admin/audit-logs
const getAuditLogs = async (req, res) => {
  try {
    const logs = await AdminAuditLog.find({})
      .populate('adminId', 'name role email')
      .sort({ createdAt: -1 })
      .limit(100); // Pagination in real world
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// EMERGENCY RESPONSE CENTER (Phase 6 Part 2)
// ==========================================

// @desc    Get active emergencies for the Response Center
// @route   GET /api/admin/emergencies/active
const getActiveEmergencies = async (req, res) => {
  try {
    const emergencies = await EmergencySession.find({ status: { $in: ['STARTING', 'ACTIVE'] } })
      .populate('user', 'name phone')
      .populate('assignedAdmin', 'name')
      .sort({ startedAt: -1 });

    res.json(emergencies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get detailed view of a specific emergency
// @route   GET /api/admin/emergencies/:id
const getEmergencyDetails = async (req, res) => {
  try {
    const emergency = await EmergencySession.findById(req.params.id)
      .populate('user', 'name phone email')
      .populate('assignedAdmin', 'name')
      .populate('adminNotes.admin', 'name');

    if (!emergency) return res.status(404).json({ message: 'Emergency not found' });

    // In a real app we would aggregate Trusted Circle responses here

    res.json(emergency);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Assign admin to emergency
// @route   PUT /api/admin/emergencies/:id/assign
const assignEmergency = async (req, res) => {
  try {
    const emergency = await EmergencySession.findById(req.params.id);
    if (!emergency) return res.status(404).json({ message: 'Emergency not found' });

    emergency.assignedAdmin = req.admin._id;
    await emergency.save();

    await createAuditLog(req, 'ASSIGN_EMERGENCY', 'EMERGENCY_SESSION', emergency._id, { assignedTo: req.admin._id });

    res.json(emergency);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add internal note to emergency
// @route   PUT /api/admin/emergencies/:id/note
const addEmergencyNote = async (req, res) => {
  try {
    const { note } = req.body;
    const emergency = await EmergencySession.findById(req.params.id);
    if (!emergency) return res.status(404).json({ message: 'Emergency not found' });

    emergency.adminNotes.push({ admin: req.admin._id, note });
    await emergency.save();

    res.json(emergency);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Resolve emergency
// @route   PUT /api/admin/emergencies/:id/resolve
const resolveEmergency = async (req, res) => {
  try {
    const { reason } = req.body;
    const emergency = await EmergencySession.findById(req.params.id);
    if (!emergency) return res.status(404).json({ message: 'Emergency not found' });

    emergency.status = 'RESOLVED';
    emergency.resolvedAt = Date.now();
    emergency.resolutionReason = reason;
    await emergency.save();

    await createAuditLog(req, 'RESOLVE_EMERGENCY', 'EMERGENCY_SESSION', emergency._id, { reason });

    res.json(emergency);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Dispatch Police
// @route   PUT /api/admin/emergencies/:id/dispatch-police
const dispatchPolice = async (req, res) => {
  try {
    const emergency = await EmergencySession.findById(req.params.id);
    if (!emergency) return res.status(404).json({ message: 'Emergency not found' });

    emergency.policeDispatched = true;
    emergency.adminNotes.push({ admin: req.admin._id, note: 'Dispatched Police/Authorities' });
    await emergency.save();

    await createAuditLog(req, 'DISPATCH_POLICE', 'EMERGENCY_SESSION', emergency._id);

    res.json(emergency);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Log access to emergency location
// @route   POST /api/admin/emergencies/:id/location-access
const logEmergencyLocationAccess = async (req, res) => {
  try {
    const emergency = await EmergencySession.findById(req.params.id);
    if (!emergency) return res.status(404).json({ message: 'Emergency not found' });

    await createAuditLog(req, 'VIEW_EMERGENCY_LOCATION', 'EMERGENCY_SESSION', emergency._id, { userId: emergency.user });

    res.json({ message: 'Location access logged' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// HELP REQUEST CENTER (Phase 6 Part 2)
// ==========================================

// @desc    Get all help requests
// @route   GET /api/admin/support/requests
const getHelpRequests = async (req, res) => {
  try {
    const requests = await HelpRequest.find()
      .populate('user', 'name email')
      .populate('assignedAdmin', 'name')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update help request (Assign, Status, Note, Resolve)
// @route   PUT /api/admin/support/requests/:id
const updateHelpRequest = async (req, res) => {
  try {
    const { status, assignedAdmin, resolution, note } = req.body;
    const request = await HelpRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Help Request not found' });

    if (status) request.status = status;
    if (assignedAdmin) request.assignedAdmin = assignedAdmin;
    if (resolution) request.resolution = resolution;
    if (note) request.internalNotes.push({ admin: req.admin._id, note });

    await request.save();
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// SYSTEM-WIDE INCIDENT CENTER
// ==========================================

// @desc    Get system incidents
// @route   GET /api/admin/system/incidents
const getSystemIncidents = async (req, res) => {
  try {
    const incidents = await SystemIncident.find()
      .populate('assignedAdmin', 'name')
      .sort({ createdAt: -1 });
    res.json(incidents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get system health status
// @route   GET /api/admin/system/health
const getSystemHealth = async (req, res) => {
  try {
    // Determine active system incidents
    const activeIncidents = await SystemIncident.find({ status: { $ne: 'RESOLVED' } });
    
    // Simulate real-time checks
    const health = {
      api: activeIncidents.some(i => i.affectedService === 'API') ? 'DEGRADED' : 'HEALTHY',
      database: activeIncidents.some(i => i.affectedService === 'DATABASE') ? 'DEGRADED' : 'HEALTHY',
      authentication: activeIncidents.some(i => i.affectedService === 'AUTHENTICATION') ? 'DEGRADED' : 'HEALTHY',
      notifications: activeIncidents.some(i => i.affectedService === 'NOTIFICATIONS') ? 'DEGRADED' : 'HEALTHY',
      websocket: activeIncidents.some(i => i.affectedService === 'WEBSOCKET') ? 'DEGRADED' : 'HEALTHY',
      lastChecked: new Date()
    };
    
    res.json(health);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Broadcast message to all users
// @route   POST /api/admin/broadcast
const broadcastMessage = async (req, res) => {
  try {
    const { message, severity } = req.body;
    // In a real app, this would use FCM or OneSignal to push notifications
    await createAuditLog(req, 'BROADCAST_MESSAGE', 'SYSTEM', null, { message, severity });
    res.json({ message: 'Broadcast sent successfully to all users.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  authAdmin,
  verifyAdminOtp,
  getDashboardMetrics,
  getUsers,
  suspendUser,
  getEmergencies,
  getActiveEmergencies,
  getEmergencyDetails,
  assignEmergency,
  addEmergencyNote,
  resolveEmergency,
  dispatchPolice,
  logEmergencyLocationAccess,
  getHelpRequests,
  updateHelpRequest,
  getSystemIncidents,
  getSystemHealth,
  getAuditLogs,
  broadcastMessage
};

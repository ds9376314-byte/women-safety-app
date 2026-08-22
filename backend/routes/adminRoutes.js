const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/adminController');
const { protectAdmin, authorizeRoles } = require('../middleware/adminAuthMiddleware');

// Public route for admin login
router.post('/auth/login', authAdmin);
router.post('/auth/verify-otp', verifyAdminOtp);

// Protected Dashboard routes (All admins can view dashboard overview)
router.get('/dashboard', protectAdmin, getDashboardMetrics);

// Protected User Management routes (Support and above)
router.get('/users', protectAdmin, authorizeRoles('SUPER_ADMIN', 'ADMIN', 'SUPPORT'), getUsers);
router.post('/users/:id/suspend', protectAdmin, authorizeRoles('SUPER_ADMIN', 'ADMIN'), suspendUser);

// Protected Emergency Operations routes (Admin and above)
router.get('/emergencies', protectAdmin, authorizeRoles('SUPER_ADMIN', 'ADMIN'), getEmergencies);
router.get('/emergencies/active', protectAdmin, authorizeRoles('SUPER_ADMIN', 'ADMIN', 'SUPPORT'), getActiveEmergencies);
router.get('/emergencies/:id', protectAdmin, authorizeRoles('SUPER_ADMIN', 'ADMIN', 'SUPPORT'), getEmergencyDetails);
router.put('/emergencies/:id/assign', protectAdmin, authorizeRoles('SUPER_ADMIN', 'ADMIN', 'SUPPORT'), assignEmergency);
router.put('/emergencies/:id/note', protectAdmin, authorizeRoles('SUPER_ADMIN', 'ADMIN', 'SUPPORT'), addEmergencyNote);
router.put('/emergencies/:id/resolve', protectAdmin, authorizeRoles('SUPER_ADMIN', 'ADMIN', 'SUPPORT'), resolveEmergency);
router.put('/emergencies/:id/dispatch-police', protectAdmin, authorizeRoles('SUPER_ADMIN', 'ADMIN', 'SUPPORT'), dispatchPolice);
router.post('/emergencies/:id/location-access', protectAdmin, authorizeRoles('SUPER_ADMIN', 'ADMIN', 'SUPPORT'), logEmergencyLocationAccess);

// Protected Help Request Operations (Support and above)
router.get('/support/requests', protectAdmin, authorizeRoles('SUPER_ADMIN', 'ADMIN', 'SUPPORT'), getHelpRequests);
router.put('/support/requests/:id', protectAdmin, authorizeRoles('SUPER_ADMIN', 'ADMIN', 'SUPPORT'), updateHelpRequest);

// Protected System Status (Admin and above)
router.get('/system/incidents', protectAdmin, authorizeRoles('SUPER_ADMIN', 'ADMIN'), getSystemIncidents);
router.get('/system/health', protectAdmin, authorizeRoles('SUPER_ADMIN', 'ADMIN', 'SUPPORT'), getSystemHealth);
router.post('/broadcast', protectAdmin, authorizeRoles('SUPER_ADMIN', 'ADMIN'), broadcastMessage);

// Protected Audit Logs (Super Admin only for integrity)
router.get('/audit-logs', protectAdmin, authorizeRoles('SUPER_ADMIN'), getAuditLogs);

module.exports = router;

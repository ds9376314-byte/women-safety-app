const jwt = require('jsonwebtoken');
const AdminUser = require('../models/AdminUser');
const AdminAuditLog = require('../models/AdminAuditLog');

// 1. Verify token and load AdminUser
const protectAdmin = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
      
      const admin = await AdminUser.findById(decoded.id).select('-password');
      if (!admin) {
        return res.status(401).json({ message: 'Not authorized, admin not found' });
      }
      
      if (admin.status === 'SUSPENDED') {
        return res.status(403).json({ message: 'Admin account suspended' });
      }

      req.admin = admin;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// 2. Role-Based Access Control
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.admin || !roles.includes(req.admin.role)) {
      // Create an audit log for the denied access attempt
      if (req.admin) {
        AdminAuditLog.create({
          adminId: req.admin._id,
          action: 'ACCESS_DENIED',
          resourceType: 'API_ROUTE',
          resourceId: req.originalUrl,
          details: { method: req.method, requiredRoles: roles, userRole: req.admin.role },
          ipAddress: req.ip,
          status: 'FAILED'
        }).catch(err => console.error('Failed to log audit:', err));
      }

      return res.status(403).json({ 
        message: `Role (${req.admin ? req.admin.role : 'UNKNOWN'}) is not authorized to access this resource` 
      });
    }
    next();
  };
};

module.exports = { protectAdmin, authorizeRoles };

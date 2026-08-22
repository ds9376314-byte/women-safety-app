const mongoose = require('mongoose');
const dotenv = require('dotenv');
const EmergencySession = require('../models/EmergencySession');
const LocationPoint = require('../models/LocationPoint');
const ActivityLog = require('../models/ActivityLog');

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected for Cleanup Job'))
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });

const RETENTION_DAYS = 30;
const RETENTION_MS = RETENTION_DAYS * 24 * 60 * 60 * 1000;
const cutoffDate = new Date(Date.now() - RETENTION_MS);

const runCleanup = async () => {
  console.log(`[Retention Job] Starting data minimization cleanup. Cutoff Date: ${cutoffDate.toISOString()}`);
  
  try {
    // 1. Delete Emergency Sessions older than 30 days that are RESOLVED or CANCELLED
    const sessionResult = await EmergencySession.deleteMany({
      status: { $in: ['RESOLVED', 'CANCELLED'] },
      createdAt: { $lt: cutoffDate }
    });
    console.log(`[Retention Job] Deleted ${sessionResult.deletedCount} old emergency sessions.`);

    // 2. Delete Location Points older than 30 days
    const locationResult = await LocationPoint.deleteMany({
      timestamp: { $lt: cutoffDate }
    });
    console.log(`[Retention Job] Deleted ${locationResult.deletedCount} old location points.`);

    // 3. Delete Activity Logs older than 30 days
    const activityResult = await ActivityLog.deleteMany({
      createdAt: { $lt: cutoffDate }
    });
    console.log(`[Retention Job] Deleted ${activityResult.deletedCount} old activity logs.`);

    console.log('[Retention Job] Cleanup completed successfully.');
  } catch (error) {
    console.error('[Retention Job] Error during cleanup:', error.message);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
};

runCleanup();

const LocationPoint = require('../models/LocationPoint');
const SafeZone = require('../models/SafeZone');
const TrustedContact = require('../models/TrustedContact');
const { sendSMS } = require('../utils/sendSMS');

// Haversine formula to calculate distance in meters
const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Earth radius in meters
  const toRad = (value) => (value * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const checkGeofences = async (userId, previousPoint, currentPoint) => {
  if (!previousPoint || !currentPoint) return;

  const safeZones = await SafeZone.find({ user: userId, enabled: true }).populate('notifyContacts');
  if (!safeZones.length) return;

  for (const zone of safeZones) {
    const prevDist = getDistance(previousPoint.latitude, previousPoint.longitude, zone.location.latitude, zone.location.longitude);
    const currDist = getDistance(currentPoint.latitude, currentPoint.longitude, zone.location.latitude, zone.location.longitude);
    
    const wasInside = prevDist <= zone.radiusMeters;
    const isInside = currDist <= zone.radiusMeters;

    let eventType = null;
    if (!wasInside && isInside) eventType = 'ENTERED';
    if (wasInside && !isInside) eventType = 'EXITED';

    if (eventType) {
      // Cooldown check (30 minutes)
      const now = new Date();
      if (zone.lastTriggeredAt) {
        const diffMins = (now - zone.lastTriggeredAt) / 1000 / 60;
        if (diffMins < 30) continue; // Skip alert if within cooldown
      }

      // Trigger Alert!
      console.log(`[GEOFENCE] User ${userId} ${eventType} safe zone: ${zone.name}`);
      zone.lastTriggeredAt = now;
      await zone.save();

      const ActivityLog = require('../models/ActivityLog');
      await ActivityLog.create({ 
        user: userId, 
        action: eventType === 'ENTERED' ? 'SAFE_ZONE_ENTRY' : 'SAFE_ZONE_EXIT', 
        description: `${eventType === 'ENTERED' ? 'Arrived at' : 'Left'} safe zone: ${zone.name}` 
      });

      // Notify contacts
      for (const contact of zone.notifyContacts) {
        if (!contact.linkedUser && contact.phone) {
          // If not an app user, send SMS
          const msg = `SHEVORA Alert: The user has ${eventType.toLowerCase()} the safe zone: ${zone.name}.`;
          sendSMS({ to: contact.phone, body: msg }).catch(e => console.log('SMS failed', e));
        } else {
          // If app user, create an in-app notification (For now, just console log since we don't have a Push Notification system built out yet, but it can be added to Command Center)
          console.log(`[IN-APP ALERT] Notify user ${contact.linkedUser} that victim ${userId} ${eventType.toLowerCase()} ${zone.name}`);
        }
      }
    }
  }
};

const addLocationPoints = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Fetch the previous location before adding new ones
    const previousPoint = await LocationPoint.findOne({ user: userId }).sort({ timestamp: -1 });

    // Accepts array or single object for batching
    const pointsToCreate = Array.isArray(req.body) 
      ? req.body.map(p => ({ ...p, user: userId }))
      : { ...req.body, user: userId };
      
    const points = await LocationPoint.create(pointsToCreate);

    // Run geofencing check asynchronously
    const currentPoint = Array.isArray(points) ? points[points.length - 1] : points;
    checkGeofences(userId, previousPoint, currentPoint).catch(e => console.error('Geofencing error:', e));

    res.status(201).json(points);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addLocationPoints };

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createInvitation,
  getReceivedInvitations,
  getSentInvitations,
  acceptInvitation,
  declineInvitation,
  getTrustedContacts,
  updatePermissions,
  updatePriority,
  deleteContact,
  getActiveEmergencies,
  getEmergencyById,
  getEmergencyLocation,
  acknowledgeEmergency,
  getActiveJourneys,
  getJourneyLocation
} = require('../controllers/trustedCircleController');

router.use(protect);

router.post('/invitations', createInvitation);
router.get('/invitations/received', getReceivedInvitations);
router.get('/invitations/sent', getSentInvitations);
router.post('/invitations/:id/accept', acceptInvitation);
router.post('/invitations/:id/decline', declineInvitation);

router.get('/', getTrustedContacts);
router.put('/:id/permissions', updatePermissions);
router.put('/:id/priority', updatePriority);
router.delete('/:id', deleteContact);

router.get('/emergencies', getActiveEmergencies);
router.get('/emergencies/:id', getEmergencyById);
router.get('/emergencies/:id/location', getEmergencyLocation);
router.post('/emergencies/:id/acknowledge', acknowledgeEmergency);
router.get('/journeys', getActiveJourneys);
router.get('/journeys/:id/location', getJourneyLocation);

module.exports = router;

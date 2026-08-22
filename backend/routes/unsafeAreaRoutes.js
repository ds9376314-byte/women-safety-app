const express = require('express');
const router = express.Router();
const UnsafeArea = require('../models/UnsafeArea');
const { protect } = require('../middleware/authMiddleware');

// Get all active unsafe areas within a certain radius or globally
router.get('/', async (req, res) => {
  try {
    const { lng, lat, radius = 50000 } = req.query; // default 50km
    
    let query = { isActive: true };
    
    if (lng && lat) {
      query.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(radius)
        }
      };
    }
    
    const areas = await UnsafeArea.find(query).populate('reportedBy', 'name');
    res.json(areas);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching unsafe areas', error: error.message });
  }
});

// Report a new unsafe area (requires auth)
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, lng, lat, severity } = req.body;
    
    const newArea = await UnsafeArea.create({
      title,
      description,
      location: {
        type: 'Point',
        coordinates: [lng, lat]
      },
      severity,
      reportedBy: req.user._id
    });
    
    res.status(201).json(newArea);
  } catch (error) {
    res.status(500).json({ message: 'Error reporting unsafe area', error: error.message });
  }
});

module.exports = router;

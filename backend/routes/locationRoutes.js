const express = require('express');
const router = express.Router();
const axios = require('axios');
const { addLocationPoints } = require('../controllers/locationController');
const { protect } = require('../middleware/authMiddleware');

router.post('/points', protect, addLocationPoints);

// Fetch nearby police stations and hospitals
router.get('/nearby-safe-places', protect, async (req, res) => {
  try {
    const { lat, lng, radius = 5000 } = req.query; // default 5km
    if (!lat || !lng) {
      return res.status(400).json({ message: 'Latitude and Longitude are required' });
    }
    
    // Using OpenStreetMap Overpass API
    // Search for police and hospitals
    const query = `
      [out:json];
      (
        node["amenity"="police"](around:${radius},${lat},${lng});
        way["amenity"="police"](around:${radius},${lat},${lng});
        node["amenity"="hospital"](around:${radius},${lat},${lng});
        way["amenity"="hospital"](around:${radius},${lat},${lng});
      );
      out center;
    `;
    
    const response = await axios.post('https://overpass-api.de/api/interpreter', `data=${encodeURIComponent(query)}`);
    
    // Format the response
    const places = response.data.elements.map(el => {
      const lat = el.lat || (el.center && el.center.lat);
      const lon = el.lon || (el.center && el.center.lon);
      return {
        id: el.id,
        type: el.tags.amenity, // 'police' or 'hospital'
        name: el.tags.name || 'Unknown',
        latitude: lat,
        longitude: lon,
      };
    });
    
    res.json(places);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching nearby places', error: error.message });
  }
});

module.exports = router;


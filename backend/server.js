const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
dotenv.config();

const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/contacts', require('./routes/contactRoutes'));
app.use('/api/sos', require('./routes/sosRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/activity', require('./routes/activityRoutes'));
app.use('/api/safety-timers', require('./routes/safetyTimerRoutes'));
app.use('/api/journeys', require('./routes/journeyRoutes'));
app.use('/api/safe-zones', require('./routes/safeZoneRoutes'));
app.use('/api/safety-events', require('./routes/safetyEventRoutes'));
app.use('/api/location', require('./routes/locationRoutes'));
app.use('/api/emergency-sessions', require('./routes/emergencyRoutes'));
app.use('/api/trusted-circle', require('./routes/trustedCircleRoutes'));
app.use('/api/privacy', require('./routes/privacyRoutes'));
app.use('/api/unsafe-areas', require('./routes/unsafeAreaRoutes'));

app.get('/', (req, res) => {
  res.send('SafeHer API is running...');
});

// Socket.io for Real-time location tracking
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) {
    return next(new Error('Authentication error: Token missing'));
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    socket.user = decoded;
    next();
  } catch (err) {
    return next(new Error('Authentication error: Invalid token'));
  }
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id, 'User:', socket.user?.id);

  // User joins their own secure room
  socket.on('join_emergency', (data) => {
    console.log(`User ${socket.user?.id} joining room ${data.emergencyId}`);
    socket.join(data.emergencyId);
  });

  socket.on('update_location', async (data) => {
    // Ensure the sender is the one claiming to send the location
    if (data.userId && data.userId !== socket.user?.id) {
      console.log('Unauthorized location update blocked.');
      return; 
    }

    try {
      const EmergencySession = mongoose.model('EmergencySession');
      const session = await EmergencySession.findById(data.emergencyId);
      
      if (!session || session.status !== 'ACTIVE') return;
      
      // Delay Enforcer (60 seconds)
      if (session.locationSharingStatus === 'COUNTDOWN' || new Date() < session.locationSharingStartsAt) {
        console.log(`[SECURE] Dropping location packet for ${data.emergencyId} - Countdown still active.`);
        return;
      }
      
      if (session.locationSharingStatus === 'STOPPED_BY_USER' || session.locationSharingStatus === 'ENDED_WITH_EMERGENCY') {
        console.log(`[SECURE] Dropping location packet for ${data.emergencyId} - Sharing stopped.`);
        return;
      }

      // If we reach here, location is authorized to be broadcast
      if (session.locationSharingStatus === 'COUNTDOWN') {
        // First packet after countdown -> Switch status to ACTIVE
        session.locationSharingStatus = 'ACTIVE';
        await session.save();
      }

      console.log('Location update broadcasted:', data.emergencyId);
      io.to(data.emergencyId).emit('location_updated', data);
    } catch (error) {
      console.error('WebSocket location error:', error.message);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });



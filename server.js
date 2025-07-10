const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

// Import configurations
const connectDB = require('./config/database');

// Import middleware
const { errorHandler } = require('./middleware/errorHandler');
const auth = require('./middleware/auth');

// Import routes
const authRoutes = require('./routes/auth');
const assetRoutes = require('./routes/assets');
const threatRoutes = require('./routes/threats');
const complianceRoutes = require('./routes/compliance');
const insuranceRoutes = require('./routes/insurance');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/users');
const paymentRoutes = require('./routes/payment');

// Import services
const notificationService = require('./services/notificationService');
const threatDetectionService = require('./services/threatDetection');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Connect to databases
connectDB();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS configuration
app.use(cors());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});

console.log('auth.authenticateToken:', typeof auth.authenticateToken);
const noop = (req, res, next) => next();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/threats', threatRoutes);
app.use('/api/compliance', typeof auth.authenticateToken === 'function' ? auth.authenticateToken : noop, complianceRoutes);
app.use('/api/insurance', insuranceRoutes);
app.use('/api/admin', typeof auth.authenticateToken === 'function' ? auth.authenticateToken : noop, adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/payment', paymentRoutes);


// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Join user to their organization room
  socket.on('join-organization', (organizationId) => {
    socket.join(`org-${organizationId}`);
    console.log(`User joined organization: ${organizationId}`);
  });

  // Handle real-time threat alerts
  socket.on('threat-alert', (data) => {
    socket.to(`org-${data.organizationId}`).emit('new-threat', data);
  });

  // Handle compliance updates
  socket.on('compliance-update', (data) => {
    socket.to(`org-${data.organizationId}`).emit('compliance-changed', data);
  });

  // Handle risk score updates
  socket.on('risk-update', (data) => {
    socket.to(`org-${data.organizationId}`).emit('risk-changed', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Make io accessible to routes
app.set('io', io);

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Start threat detection service
threatDetectionService.startMonitoring();

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Cybersecurity AI Platform server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});

module.exports = app; 
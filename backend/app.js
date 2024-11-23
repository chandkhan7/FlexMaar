const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { handleError } = require('./utils/errorHandler'); // Custom error handler

// Import routes
const authRoutes = require('./routes/authRoutes');
const roomRoutes = require('./routes/roomRoutes');

// Initialize Express
const app = express();

// Middleware
app.use(cors());
app.use(helmet()); // Adds various security headers to responses
app.use(morgan('dev')); // Logs requests in the console
app.use(express.json());

// Rate limiting to prevent brute force attacks (e.g., for login)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit to 100 requests per windowMs
  message: 'Too many requests, please try again later.',
});
app.use(limiter);

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/room', roomRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Global error handling
app.use(handleError);

// Graceful shutdown handling
const server = app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});

process.on('SIGINT', () => {
  console.log('Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated');
    mongoose.connection.close();
  });
});

module.exports = app;

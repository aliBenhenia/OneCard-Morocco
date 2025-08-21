// server.js

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Force port 3001
const PORT = process.env.PORT || 3001;

// ==================== MIDDLEWARE ====================
app.use(helmet({ contentSecurityPolicy: false }));

app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? process.env.CLIENT_URL
    : 'http://localhost:3000',
  credentials: true,
}));

app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ==================== ROUTES ====================
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// ==================== SERVER INITIALIZATION ====================
const server = app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
  console.log(`🚀 API available at http://localhost:${PORT}/api/v1`);
});

// ==================== ERROR HANDLING ====================
// Don’t kill server, just log errors
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION!', err);
});

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION!', err);
});

// Export app (optional, for testing)
// module.exports = app;

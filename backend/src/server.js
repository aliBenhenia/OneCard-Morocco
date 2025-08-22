const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth'); // Import auth routes
const path = require("path");
// Initialize Express app
const app = express();

// Serve static images
app.use("/images", express.static(path.resolve("./public/images")));


// Force port 3001
const PORT = 3001;

// ==================== MIDDLEWARE ====================
app.use(helmet({ contentSecurityPolicy: false }));

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ==================== ROUTES ====================
app.use('/api/auth', authRoutes); // Use auth routes


app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// ==================== DATABASE CONNECTION ====================
async function connectDB() {
  try {
    await mongoose.connect('mongodb://localhost:27017/mydatabase', {
      autoIndex: true, // build indexes automatically
      serverSelectionTimeoutMS: 5000, // timeout after 5s if cannot connect
    });
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1); // Exit app if DB not reachable
  }
}

// ==================== SERVER INITIALIZATION ====================
async function startServer() {
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
    console.log(`🚀 API available at http://localhost:${PORT}/api/v1`);
  });

  // Error handling
  process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION!', err);
  });

  process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION!', err);
  });
}

startServer();

// Export app (optional, for testing)
// module.exports = app;

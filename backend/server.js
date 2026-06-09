// KisanSaathi - Agriculture Support Portal
// Main Server Entry Point

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const schemeRoutes = require('./routes/schemeRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const marketRoutes = require('./routes/marketRoutes');
const userRoutes = require('./routes/userRoutes');
const learningRoutes = require('./routes/learningRoutes');

const { errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', project: 'KisanSaathi', version: '1.0.0' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/schemes', schemeRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/users', userRoutes);
app.use('/api/learning', learningRoutes);

// Error Handler
app.use(errorHandler);

// Database connection and server start
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ KisanSaathi: MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🚀 KisanSaathi server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });

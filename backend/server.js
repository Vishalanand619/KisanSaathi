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


const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.FRONTEND_URL,
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {

    if (!origin) return callback(null, true);

    
    if (allowedOrigins.includes(origin)) return callback(null, true);

    
    if (/^https:\/\/.*\.vercel\.app$/.test(origin)) return callback(null, true);

    
    if (/^https:\/\/.*\.onrender\.com$/.test(origin)) return callback(null, true);

    console.warn(`CORS blocked origin: ${origin}`);
    callback(new Error(`CORS policy: origin ${origin} not allowed`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  optionsSuccessStatus: 200, 
};


app.options("*", cors(corsOptions));

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));


app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', project: 'KisanSaathi', version: '1.0.0' });
});


app.use('/api/auth', authRoutes);
app.use('/api/schemes', schemeRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/users', userRoutes);
app.use('/api/learning', learningRoutes);


app.use(errorHandler);


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

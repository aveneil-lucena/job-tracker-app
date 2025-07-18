require('dotenv').config();
const express = require('express');   // Import express
const cors = require('cors');
const app = express();                // Initialize app instance
//app.use(cors());

const mongoose = require('mongoose');
const mongoUri = process.env.MONGO_URI; 
const PORT = process.env.PORT || 5000;

// Optional server test route
app.get('/', (req, res) => {
  res.send('Server is running!');
});

const allowedOrigins = [
  'https://job-tracker-app-rust.vercel.app',
  'http://localhost:5173'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`Blocked by CORS: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));





const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/jobs');
const userRoutes = require('./routes/user');

// Middleware route stuff :3
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/users', userRoutes);

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

const auth = require('./middleware/auth');
app.get('/api/test-auth', auth, (req, res) => {
  res.json({ message: 'Auth middleware working!', userId: req.user });
});


// Database connection and server listen
mongoose.connect(mongoUri)
    .then(() => {
      console.log('MongoDB connected successfully!');
      app.listen(PORT || 5000, () => {
        console.log(`Server running on port ${PORT}`);
      });
    })
    .catch((err) => console.error('MongoDB connection error:', err));
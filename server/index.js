require('dotenv').config();

const express = require('express');   // Import express
const app = express();                // Initialize app instance

const mongoose = require('mongoose');
const mongoUri = process.env.MONGO_URI; 
const PORT = process.env.PORT || 5000;

// Middleware stuff :3
app.use(express.json());
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
const jobRoutes = require('./routes/jobs');
app.use('/api/jobs', jobRoutes);

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

const auth = require('./middleware/auth'); // import middleware here
app.get('/api/test-auth', auth, (req, res) => {
  res.json({ message: 'Auth middleware working!', userId: req.user });
});





// Database connection
mongoose.connect(mongoUri)
    .then(() => {
      console.log('MongoDB connected successfully!');
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    })
    .catch((err) => console.error('MongoDB connection error:', err));

// Optional test route
app.get('/', (req, res) => {
  res.send('Server is running!');
});

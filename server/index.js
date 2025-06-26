require('dotenv').config();

const express = require('express');   // Import express
const app = express();                // Initialize app instance

const mongoose = require('mongoose');
const mongoUri = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

// Middleware (optional but recommended)
app.use(express.json());

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

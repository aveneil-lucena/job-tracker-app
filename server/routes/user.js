const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // your auth middleware
const User = require('../models/User'); // your user model

// GET /api/users/me
router.get('/me', auth, async (req, res) => {
  try {
    // req.user contains user ID from the auth middleware after token verification
    const user = await User.findById(req.user).select('-password'); // exclude password
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Export router
module.exports = router;

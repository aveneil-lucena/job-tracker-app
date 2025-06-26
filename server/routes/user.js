const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // your auth middleware
const User = require('../models/User'); // your user model

// GET /api/users/me (get user profile)
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

// PUT /api/users/me (update user profile)
router.put('/me', auth, async (req, res) => {
  try {
    const { username, email } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user,
      { username, email },
      { new: true, runValidators: true }
    );

    if (!updatedUser) return res.status(404).json({ message: 'User not found' });

    res.json({ user: updatedUser });
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// Export router
module.exports = router;

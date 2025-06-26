const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const auth = require('../middleware/auth');

// @route   POST /api/jobs
// @desc    Create a new job
// @access  Private (requires JWT)
router.post('/', auth, async (req, res) => {
  try {
    const { title, company, status, notes } = req.body;

    if (!title || !company) {
      return res.status(400).json({ message: 'Title and company are required' });
    }

    const newJob = new Job({
      title,
      company,
      status,
      notes,
      createdBy: req.user, // From the auth middleware
    });

    const savedJob = await newJob.save();
    res.status(201).json(savedJob);
  } catch (err) {
    console.error('Error creating job:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/jobs
// @desc    Get all jobs created by the logged-in user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user; // from auth middleware
    const jobs = await Job.find({ createdBy: userId }).sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (err) {
    console.error('Error fetching jobs:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/jobs/:id
// @desc    Get a single job by ID (only if owned by user)
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const jobId = req.params.id;
    const userId = req.user;

    const job = await Job.findOne({ _id: jobId, createdBy: userId });

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.status(200).json(job);
  } catch (err) {
    console.error('Error fetching job by ID:', err);
    if (err.kind === 'ObjectId') {
      // Invalid ObjectId format
      return res.status(400).json({ message: 'Invalid job ID' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});



module.exports = router;

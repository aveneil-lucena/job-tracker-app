const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const auth = require('../middleware/auth');

// @route   POST /api/jobs
// @desc    Create a new job
// @access  Private (requires JWT)
router.post('/', auth, async (req, res) => {
  try {
    console.log("📥 Incoming req.body:", req.body);

    const { title, company, status, notes, dateApplied } = req.body;

    if (!title || !company) {
      return res.status(400).json({ message: 'Title and company are required' });
    }

    const newJob = new Job({
      title,
      company,
      status,
      notes,
      dateApplied,
      createdBy: req.user,
    });


    const savedJob = await newJob.save();
    console.log("✅ Job saved:", savedJob);
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

// @route   DELETE /api/jobs/:id
// @desc    Delete a job by ID (only if owned by user)
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const jobId = req.params.id;
    const userId = req.user;

    const deletedJob = await Job.findOneAndDelete({ _id: jobId, createdBy: userId });

    if (!deletedJob) {
      return res.status(404).json({ message: 'Job not found or not authorized' });
    }

    res.status(200).json({ message: 'Job deleted successfully', job: deletedJob });
  } catch (err) {
    console.error('Error deleting job:', err);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid job ID' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});


// @route   UPDATE /api/jobs/:id
// @desc    Update a job by ID (only if owned by user)
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const updateData = { ...req.body };

    // Log what's being sent
    console.log("Incoming updateData:", updateData);

    // Ensure dateApplied is converted to a Date
    if (updateData.dateApplied) {
      const parsed = new Date(updateData.dateApplied);
      console.log("Parsed dateApplied:", parsed, "| Valid:", !isNaN(parsed.getTime()));
      if (!isNaN(parsed.getTime())) {
        updateData.dateApplied = parsed;
      } else {
        console.warn("Invalid dateApplied. Removing it.");
        delete updateData.dateApplied;
      }
    }

    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user },
      updateData,
      { new: true, runValidators: true }
    );

    if (!job) {
      return res.status(404).json({ message: 'Job not found or not authorized' });
    }

    console.log("✅ Updated Job:", job);
    res.status(200).json({ message: 'Job updated successfully', job });
  } catch (err) {
    console.error('Error updating job:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});






module.exports = router;

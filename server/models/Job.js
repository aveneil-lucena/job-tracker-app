const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide job title'],
    trim: true,
  },
  company: {
    type: String,
    required: [true, 'Please provide company name'],
    trim: true,
  },
  status: {
    type: String,
    enum: ['pending', 'offer', 'interview', 'declined', 'accepted'],
    default: 'pending',
  },
  dateApplied: {
    type: Date,
    default: null, // no date by default
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  notes: {
    type: String,
    trim: true,
    default: '',
  },
});

module.exports = mongoose.model('Job', JobSchema);

import React, { useEffect, useState } from 'react';
import backgroundImage from '../assets/lined-bg.jpg';
import {  TextField, Select, MenuItem, InputLabel, FormControl, Typography,
  Box, Paper, Button, Chip } from '@mui/material';

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState('');

  const [editingJob, setEditingJob] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    company: '',
    status: '',
    notes: ''
  });
  
  const [statusFilter, setStatusFilter] = useState('all');
  const [fadeClass, setFadeClass] = useState('fade-enter-active');
  
  //Job list pagination
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5;

  //Job list deletion
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this job?');
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/jobs/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const text = await res.text(); // For debugging
      console.log('Raw response:', text);

      if (!res.ok) {
        let data;
        try {
          data = JSON.parse(text);
        } catch (parseErr) {
          throw new Error(`Failed to parse JSON: ${parseErr.message}. Response: ${text}`);
        }
        throw new Error(data.message || 'Failed to delete job');
      }

      // Remove the job from local state
      setJobs(prevJobs => prevJobs.filter(job => job._id !== id));
    } catch (err) {
      alert('Error deleting job: ' + err.message);
    }
  };

  //End job list pagination, and deletion
  
  // Handle edit functionality
  const handleEdit = (job) => {
  setEditingJob(job._id);
  setEditForm({
    title: job.title,
    company: job.company,
    status: job.status,
    notes: job.notes
    });
  };
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/jobs/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Failed to update job');

      setJobs(prev =>
        prev.map(job => job._id === editingJob ? { ...job, ...editForm } : job)
      );

      setEditingJob(null);
      setEditForm({ title: '', company: '', status: '', notes: '' });
    } catch (err) {
      alert('Error updating job: ' + err.message);
    }
  };
  // End handle edit functionality

  // Job fetch
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/jobs', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.message || 'Failed to fetch jobs');
        setJobs(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchJobs();
  }, []);

    // Fade effect
    useEffect(() => {
    setFadeClass('fade-enter'); // Start fade-out

    const timeout = setTimeout(() => {
      setFadeClass('fade-enter-active'); // Fade back in after slight delay
    }, 50); // Small delay to allow reflow

    return () => clearTimeout(timeout); // Clean up timeout
  }, [statusFilter]);
    // end Fade effect

  // Filter jobs by status
  const filteredJobs =
  statusFilter === 'all'
    ? jobs
    : jobs.filter((job) => job.status === statusFilter);

  // Calculate current jobs for pagination
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  
  console.log('Current Jobs:', jobs);
  
  // Conditional status colors
  const getStatusColor = (status) => {
  switch (status) {
    case 'accepted':
      return 'success';
    case 'pending':
      return 'default';
    case 'declined':
      return 'error';
    case 'offer':
      return 'info';
    case 'interview':
      return 'warning';
    default:
      return 'default';
  }
};

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '100px',
        overflowX: 'hidden',
        boxSizing: 'border-box'
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          width: '700px',
          minWidth: '500px',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderRadius: 2,
          color: 'black',
          mb: 4
        }}
      >
      <h2 style={{ marginBottom: '1rem' }}>Job Dashboard</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <label htmlFor="statusFilter">Filter by status: </label>
      
      <select
        id="statusFilter"
        value={statusFilter}
        onChange={(e) => {
          const value = e.target.value;
          setStatusFilter(value);           // Update state immediately to keep dropdown in sync
          setFadeClass('fade-exit');        // Trigger fade out
          setTimeout(() => {
            setFadeClass('fade-enter');     // Trigger fade in
          }, 150); // Match this to your CSS transition duration
        }}
      >
        <option value="all">All</option>
        <option value="pending">Pending</option>
        <option value="interview">Interview</option>
        <option value="offer">Offer</option>
        <option value="declined">Declined</option>
        <option value="accepted">Accepted</option>
      </select>

      {/* Job list */}
      <div className={`job-list ${fadeClass}`}>
        {currentJobs.length > 0 ? (
      <ul style={{ paddingLeft: 0, margin: 0 }}>
        {currentJobs.map(job => (
        <li key={job._id} style={{ listStyle: 'none', marginBottom: '1rem' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap', // allow wrap instead of forcing one line
            padding: 2,
            backgroundColor: 'white',
            borderRadius: 2,
            boxShadow: 2,
            width: '100%',
            boxSizing: 'border-box',
            overflow: 'hidden',
          }}
        >
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  {job.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {job.company}
                </Typography>
                <Chip
                  label={job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                  color={getStatusColor(job.status)}
                  size="small"
                  sx={{ mt: 0.5 }}
                />
              </Box>

              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  size="small"
                  variant="contained"
                  color="warning"
                  onClick={() => handleEdit(job)}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  color="error"
                  onClick={() => handleDelete(job._id)}
                >
                  Delete
                </Button>
              </Box>
            </Box>

            {/* Show the form if this job is being edited */}
            {editingJob === job._id && (
              <Box
                component="form"
                onSubmit={handleUpdate}
                sx={{
                  mt: 2,
                  width: '100%',
                  backgroundColor: '#f9f9f9',
                  padding: 2,
                  borderRadius: 1,
                }}
              >
                <TextField
                  fullWidth
                  label="Title"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  label="Company"
                  value={editForm.company}
                  onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                  margin="normal"
                  required
                />
                <FormControl fullWidth margin="normal" required>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    label="Status"
                  >
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="interview">Interview</MenuItem>
                    <MenuItem value="offer">Offer</MenuItem>
                    <MenuItem value="declined">Declined</MenuItem>
                    <MenuItem value="accepted">Accepted</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  label="Notes"
                  multiline
                  rows={3}
                  value={editForm.notes}
                  onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  margin="normal"
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                  <Button type="submit" variant="contained" color="primary">
                    Save
                  </Button>
                  <Button variant="outlined" onClick={() => setEditingJob(null)}>
                    Cancel
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        </li>
          ))}
          </ul>
        ) : (
            <p>No jobs found.</p>
        )}
      </div>

      {/* Pagination buttons */}
      <div style=
      {{ 
        marginTop: '1rem', 
      }}>
        {Array.from({ length: Math.ceil(filteredJobs.length / jobsPerPage) }).map((_, index) => (
          <Button
            key={index}
            variant={currentPage === index + 1 ? 'contained' : 'outlined'}
            color="primary"
            onClick={() => setCurrentPage(index + 1)}
            disabled={currentPage === index + 1}
            sx={{ mx: 0.5, my: 1, minWidth: 36 }}
          >
            {index + 1}
          </Button>
        ))}
      </div>
      {/* Edit buttons */}

    </Paper>
    </Box>
  );
}

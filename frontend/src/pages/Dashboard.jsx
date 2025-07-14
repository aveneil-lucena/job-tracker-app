import React, { useEffect, useState } from 'react';
import backgroundImage from '../assets/lined-bg.jpg';
import {  TextField, Select, MenuItem, InputLabel, FormControl, Typography,
  Box, Paper, Button, Chip } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
//import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Tooltip from '@mui/material/Tooltip';

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState('');

  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState('');

  
  const [editingJob, setEditingJob] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    company: '',
    status: '',
    notes: '',
    dateApplied: '',
    createdAt: ''
  });

  const [statusFilter, setStatusFilter] = useState('all');
  //const [pendingFilter, setPendingFilter] = useState(null);
  const [fadeClass, setFadeClass] = useState('fade-enter-active');
  const [deletingJobId, setDeletingJobId] = useState(null);
  //Job list pagination
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5;

  //Job list deletion
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this job?');
    if (!confirmDelete) return;

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${BASE_URL}/api/jobs/${id}`, {
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
      setJobs(prev =>
        prev.map(job => job._id === editingJob ? { ...job, ...editForm } : job)
      );
    } catch (err) {
      alert('Error deleting job: ' + err.message);
    }
  };//End job list pagination, and deletion
  
  // Handle edit functionality
  const handleEdit = (job) => {
    setEditingJob(job._id);
    setEditForm({
      title: job.title,
      company: job.company,
      status: job.status,
      notes: job.notes,
      dateApplied: job.dateApplied ? new Date(job.dateApplied).toISOString().slice(0, 10) : '',
    });
  };

  
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const handleUpdate = async (id) => {
  try {
    const token = localStorage.getItem('token');

    const formattedEditForm = {
  ...editForm,
  dateApplied: editForm.dateApplied ? new Date(editForm.dateApplied).toISOString() : null
  };

    console.log('Updating job with data:', editForm);

    const res = await fetch(`${BASE_URL}/api/jobs/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(formattedEditForm)
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || 'Failed to update job');

    setJobs(prev =>
      prev.map(job => job._id === editingJob ? { ...job, ...editForm } : job)
    );

    setEditingJob(null);
    setEditForm({ title: '', company: '', status: '', notes: '', dateApplied: '' });
  } catch (err) {
    alert('Error updating job: ' + err.message);
  }
};
  // End handle edit functionality

  // Job fetch
  useEffect(() => {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${BASE_URL}/api/jobs`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await res.json();
        console.log("📦 Jobs from backend:", data);
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
    // End Fade effect

  // Filter jobs by status
  const filteredJobs =
  statusFilter === 'all'
    ? jobs
    : jobs.filter((job) => job.status === statusFilter);

  const searchedJobs = filteredJobs.filter((job) =>
  job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
  job.company.toLowerCase().includes(searchTerm.toLowerCase())
  );
  // Calculate current jobs for pagination
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = searchedJobs.slice(indexOfFirstJob, indexOfLastJob);
  
     //console.log('Current Jobs:', jobs);
  
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
        //minHeight: '100vh',
        width: '100vw',
        height: '100vh',
        //maxWidth: '100vw',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        pt: { xs: 8, sm: 10, md: 12 },
        px: 2,
        //padding: 2,
        overflowX: 'hidden',
        overflowY: 'auto',
        boxSizing: 'border-box',
        gap: 1,
        mb: 3,
        mt: 1
      }}
    >
      
      <Paper
        elevation={3}
        sx={{
          p: { xs: 1, sm: 4 },
          width: '95%',
          maxWidth: '700px',
          mx: 'auto', // Center horizontally
          backgroundColor: 'rgba(255, 255, 255, 0.75)',
          borderRadius: 2,
          color: 'black',
          mb: 4
        }}
      >
      <h2 style={{ 
        marginTop: '0rem', 
        marginBottom: '0.25rem' }}>
          Job Dashboard</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      { /* Search and Filter section */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <label htmlFor="searchJobs" style={{ color: 'grey', marginRight: 8 }}>
          Search Jobs:
          </label>
          <input
            id="searchJobs"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title or company"
            style={{
              padding: '6px 10px',
              borderRadius: 6,
              border: '1px solid #ccc',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              minWidth: 220,
              fontSize: 14,
              margin: 4
            }}
          />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <label 
        htmlFor="statusFilter" 
        style={{color: 'grey'}}>Filter by status:  </label>
      <select
        id="statusFilter"
        value={statusFilter}
        onChange={(e) => {
          const value = e.target.value;
          setStatusFilter(value);           // Update state immediately to keep dropdown in sync
        }}      
          style={{
          padding: '6px 10px',
          borderRadius: 6,
          border: '1px solid #ccc',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          //backgroundColor: 'grey',
          cursor: 'pointer',
          minWidth: 130,
          margin: 7
        }}
        >
        <option value="all">All</option>
        <option value="pending">Pending</option>
        <option value="interview">Interview</option>
        <option value="offer">Offer</option>
        <option value="declined">Declined</option>
        <option value="accepted">Accepted</option>
      </select>
      </Box>
      
      {/* Job list */}
      <div className={`job-list ${fadeClass}`}>
        {currentJobs.length > 0 ? (
      <ul style={{ paddingLeft: 0, margin: 0 }}>
        {currentJobs.map(job => (
      <li
        key={job._id}
        className={deletingJobId === job._id ? 'fade-out' : ''}
          style={{
            listStyle: 'none',
            marginTop: '0.7rem',
            marginBottom: '0.8rem',
            paddingLeft: '0.5rem',
            paddingRight: '0.5rem',
          }}
      >

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
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
          {/* Job Title */}
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
          >
            {job.title}
          </Typography>

          {/* Company */}
          <Typography variant="body2" color="text.secondary">
            {job.company}
          </Typography>

          {/* Date Applied */}
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
            Applied on: {job.dateApplied ? new Date(job.dateApplied).toLocaleDateString() : ''}
          </Typography>

          {/* Status + Notes Tooltip */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
            <Chip
              label={job.status.charAt(0).toUpperCase() + job.status.slice(1)}
              color={getStatusColor(job.status)}
              size="small"
            />
            {job.notes && (
              <Tooltip
                title={job.notes}
                placement="top"
                arrow
                componentsProps={{
                  tooltip: {
                    sx: {
                      backgroundColor: '#000',
                      color: '#fff',
                      fontSize: '0.95rem',
                      maxWidth: 300,
                      whiteSpace: 'pre-wrap',
                      border: '1px solid #888',
                      boxShadow: 3,
                    },
                  },
                }}
              >
                  <span
                    style={{
                      borderRadius: '50%',
                      backgroundColor: '#777777',
                      color: 'white',
                      width: '18px',
                      height: '18px',
                      display: 'inline-flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      fontSize: '10px',
                      cursor: 'pointer',
                      userSelect: 'none',
                      WebkitUserDrag: 'none',
                    }}
                    draggable={false}
                  >
                    i
                  </span>
                </Tooltip>
              )}
            </Box>
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
                onSubmit={(e) => {
                  e.preventDefault();
                  handleUpdate(job._id);
                }}
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
                  rows={2}
                  value={editForm.notes}
                  onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  margin="normal"
                />
                <DatePicker
                  label="Date Applied"
                  value={editForm.dateApplied}
                  onChange={(newDate) => {
                    setEditForm(prev => ({
                      ...prev,
                      dateApplied: newDate,  // ✅ don't convert to ISO string here
                    }));
                  }}
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
      <div
        style={{
          marginTop: '1rem',
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}
      >
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

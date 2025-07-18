import React, { useState } from 'react';
import { Box, Paper, Typography, TextField, Select, MenuItem, FormControl, 
    InputLabel, Button, Snackbar, Alert } from '@mui/material';
import backgroundImage from '../assets/lined-bg.jpg';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const AddJob = () => {
    const [editForm, setEditForm] = useState({
    title: '',
    company: '',
    status: 'pending',
    notes: '',
    dateApplied: Date.now,
  });

  //const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setEditForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const token = localStorage.getItem('token'); // make sure token is stored here after login
    
    // Convert Date object to ISO string (or null)
const payload = {
  ...editForm,
  dateApplied: editForm.dateApplied instanceof Date
    ? editForm.dateApplied.toISOString()
    : null,
};




    console.log("📤 Sending job:", payload);

    try {
      const res = await fetch(`${BASE_URL}/api/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong, failed to add job.');
      }

      setSuccess(true);
      setEditForm({ 
        title: '', 
        company: '', 
        status: 'pending', 
        notes: '',
        dateApplied: null });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
        <Box
        sx={{
            height: '100vh',
            width: '100vw',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            margin: 0,
            padding: 0,
        }}
        >
        <Paper
            elevation={4}
            sx={{
                p: 4,
                width: '100%',
                maxWidth: 500,
                bgcolor: 'rgba(255,255,255,0.95)',
                borderRadius: 3,
                mx: 2, // margin left & right for small screens
            }}
        >
        <Typography variant="h5" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
          Add New Job
        </Typography>

        <form onSubmit={handleSubmit} >
          <TextField
            label="Job Title"
            name="title"
            value={editForm.title}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Company"
            name="company"
            value={editForm.company}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={editForm.status}
              label="Status"
              onChange={handleChange}
              required
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="interview">Interview</MenuItem>
              <MenuItem value="offer">Offer</MenuItem>
              <MenuItem value="declined">Declined</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
              <MenuItem value="accepted">Accepted</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Notes"
            name="notes"
            value={editForm.notes}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
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
          {error && <Typography color="error" variant="body2">{error}</Typography>}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 2,
              backgroundColor: '#6649ab',
              '&:hover': {
                backgroundColor: '#403f9f',
              },
            }}
          >
            Add Job
          </Button>   
        </form>
        <Snackbar
          open={success}
          autoHideDuration={3000}
          onClose={() => setSuccess(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
            <Alert severity="success" variant="filled" sx={{ width: '150%' }}>
              Job added!
            </Alert>
        </Snackbar>
      </Paper>
    </Box>
  );
};

export default AddJob;
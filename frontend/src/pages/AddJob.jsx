import React, { useState } from 'react';
import { Box, Paper, Typography, TextField, Select, MenuItem, FormControl, 
    InputLabel, Button, Snackbar, Alert } from '@mui/material';
import backgroundImage from '../assets/lined-bg.jpg';


const AddJob = () => {
  
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    status: 'pending',
    notes: '',
    dateApplied: '',
  });

  //const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const token = localStorage.getItem('token'); // make sure token is stored here after login
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    try {
      const res = await fetch(`${BASE_URL}/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong, failed to add job.');
      }

      setSuccess(true);
      setFormData({ 
        title: '', 
        company: '', 
        status: 'pending', 
        notes: '',
        dateApplied: '', });
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
        <form onSubmit={handleSubmit}>
          <TextField
            label="Job Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={formData.status}
              label="Status"
              onChange={handleChange}
              required
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="interview">Interview</MenuItem>
              <MenuItem value="offer">Offer</MenuItem>
              <MenuItem value="declined">Declined</MenuItem>
              <MenuItem value="accepted">Accepted</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
            margin="normal"
          />
          <TextField
            label="Date Applied"
            name="dateApplied"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formData.dateApplied}
            onChange={handleChange}
            fullWidth
            margin="normal"
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
          autoHideDuration={2500}
          onClose={() => setSuccess(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity="success" sx={{ width: '100%' }}>
            Job added successfully!
          </Alert>
        </Snackbar>
      </Paper>
    </Box>
  );
};

export default AddJob;
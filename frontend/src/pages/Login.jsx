import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Box, Typography, 
        Paper, Snackbar, Alert } from '@mui/material';
import backgroundImage from '../assets/lined-bg.jpg';

//import Typography from '@mui/material/Typography';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleChange = e => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Save token to localStorage
      localStorage.setItem('token', data.token);

      setOpenSnackbar(true); // show toast
      setTimeout(() => navigate('/dashboard'), 1500); // redirect after toast
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
      <Paper elevation={3} sx={{ p: 4, width: 350 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ color: 'black', fontWeight: 600, textAlign: 'center' }}
        >
          Login
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
          />
          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Login
          </Button>
        </form>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={1350}
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={() => setOpenSnackbar(false)} severity="success" variant="filled" sx={{ width: '100%' }}>
            Login successful!
          </Alert>
        </Snackbar>
      </Paper>
    </Box>
  );
}

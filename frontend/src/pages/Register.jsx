import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, TextField, Button, Snackbar, Alert, Link } from '@mui/material';
import backgroundImage from '../assets/lined-bg.jpg';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openWarning, setOpenWarning] = useState(false);

  useEffect(() => {
    setOpenWarning(true);
  }, []);

  const handleChange = e => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    try {
      const res = await fetch(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      setOpenSnackbar(true);
      setTimeout(() => navigate('/login'), 1500);
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
      <Snackbar
        open={openWarning}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{
          zIndex: 1300,
          '& .MuiAlert-root': {
            backgroundColor: '#ffefc1',
            color: '#7a4f01',
            fontWeight: 500,
            border: '1px solid #ffe58f',
            boxShadow: '0 0 10px rgba(255, 206, 86, 0.5)',
            animation: 'glow 2s ease-in-out infinite',
          },
          '@keyframes glow': {
            '0%': { boxShadow: '0 0 10px rgba(255, 206, 86, 0.4)' },
            '50%': { boxShadow: '0 0 20px rgba(255, 206, 86, 0.9)' },
            '100%': { boxShadow: '0 0 10px rgba(255, 206, 86, 0.4)' },
          },
        }}
      >
        <Alert severity="warning" variant="filled" icon={false}>
          ⚠️ This is a public demo. Please do not use your real email! If you want to use a test email, go to the login page and input: <strong>"test@email.com"</strong> & <strong>"password"</strong>.
        </Alert>
      </Snackbar>

      <Paper elevation={3} sx={{ p: 4, width: 350 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ color: 'black', fontWeight: 600, textAlign: 'center' }}
        >
          Register
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            margin="normal"
            required
          />
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
            Register
          </Button>
        </form>

        <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
          Already have an account?{' '}
          <Link href="/login" underline="hover">
            Login here
          </Link>
        </Typography>

        <Snackbar
          open={openSnackbar}
          autoHideDuration={1500}
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setOpenSnackbar(false)}
            severity="success"
            variant="filled"
            sx={{ width: '100%' }}
          >
            Registration successful!
          </Alert>
        </Snackbar>
      </Paper>
    </Box>
  );
}

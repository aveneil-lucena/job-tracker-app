import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Button, TextField, Box, Typography, 
        Paper, Snackbar, Alert, Link } from '@mui/material';
import backgroundImage from '../assets/lined-bg.jpg';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  //const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isWakingUp, setIsWakingUp] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  // Warning toast state
  const [openWarning, setOpenWarning] = useState(false);
  useEffect(() => {
    setOpenWarning(true); // show warning on mount
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
    setIsLoading(true);
    setIsWakingUp(false); // Assume waking up by default

    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    // Start a timeout to show "Waking up" alert only if request takes > 1 sec
    const wakeUpTimeout = setTimeout(() => {
      setIsWakingUp(true);
    }, 650);

    try {
      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include'
      });

      clearTimeout(wakeUpTimeout); // Stop wake-up alert if request finished
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('token', data.token);

      setOpenSnackbar(true);
      setTimeout(() => navigate('/dashboard'), 1350); // artificial loading >:)
    } catch (err) {
      clearTimeout(wakeUpTimeout);
      setError(err.message);
    } finally {
      setIsLoading(false);
      setIsWakingUp(false);
    }
  };

  return (
    <>
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

          {/* Show loading message */}
          {isWakingUp && isLoading && (
            <Alert
              severity="info"
              sx={{
                mt: 2,
                fontWeight: 500,
                backgroundColor: '#e0f7fa',
                color: '#004d40',
                border: '1px solid #81d4fa',
              }}
            >
              {'Waking up the server, please wait a bit! (It\'ll take less than a minute.'}
            </Alert>
          )}


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
              disabled={isLoading} // disable while loading
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
              disabled={isLoading} // disable while loading
            />
            {error && (
              <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}
            <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            fullWidth 
            sx={{ mt: 2 }}
            disabled={isLoading} 
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </form>

          <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
            Don't have an account?{' '}
            <Link component={RouterLink} to="/register" underline="hover">
              Register here
            </Link>
          </Typography>

          {/* Login success snackbar */}
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

      {/* Floating warning toast */}
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
        <Alert
          severity="warning"
          variant="filled"
          sx={{
            bgcolor: 'transparent',
            color: 'inherit',
            boxShadow: 'none',
          }}
        >
          Please don't use your real email as this data is visible to me and I don't want your info! Just input a sample email and password. You can also use a test account: <strong>"test@email.com"</strong> and <strong>"password"</strong>, that works too.
        </Alert>
      </Snackbar>
    </>
  );
}

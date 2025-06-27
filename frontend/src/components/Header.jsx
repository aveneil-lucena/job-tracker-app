import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token
    navigate('/login'); // Redirect to login page
  };

  return (
    <AppBar position="fixed" sx={{ backgroundColor: '#1a237e', borderBottom: '2px solid #403f9f', zIndex: 1000 }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography
        variant="h5"
        component="div"
        sx={{ color: 'white', fontWeight: 800 }} 
        >
        Job Tracker
        </Typography>
<Box sx={{ display: 'flex', gap: 1 }}>
  {location.pathname !== '/profile' && (
    <Button
      color="inherit"
      onClick={() => navigate('/profile')}
      sx={{ textTransform: 'none' }}
    >
      Profile
    </Button>
  )}
  {location.pathname !== '/add-job' && (
    <Button
      color="inherit"
      onClick={() => navigate('/add-job')}
      sx={{ textTransform: 'none' }}
    >
      Add Job
    </Button>
  )}
  {location.pathname !== '/dashboard' && (
    <Button
      color="inherit"
      onClick={() => navigate('/dashboard')}
      sx={{ textTransform: 'none' }}
    >
      Dashboard
    </Button>
  )}
  <Button
    onClick={handleLogout}
    sx={{
      color: '#fff',
      backgroundColor: '#6649ab',
      textTransform: 'none',
      '&:hover': {
        backgroundColor: '#403f9f',
      },
    }}
  >
    Logout
  </Button>
</Box>
      </Toolbar>
    </AppBar>
  );
}

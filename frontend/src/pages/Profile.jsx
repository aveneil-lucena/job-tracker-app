import React, { useEffect, useState } from 'react';
import backgroundImage from '../assets/lined-bg.jpg';
import { Box } from '@mui/material';

export default function Profile() {
  const [profile, setProfile] = useState({ username: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${BASE_URL}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error('Failed to fetch profile');
        const data = await res.json();
        setProfile({ username: data.username, email: data.email });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
  
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`${BASE_URL}/users/me`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profile),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'Update failed');
    }

    setMessage('Profile updated successfully!');
    setProfile({ username: data.user.username, email: data.user.email });
  } catch (err) {
    setError(err.message);
  }
};

  /*if (loading) 
    return <p>Loading profile...</p>;*/

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
        color: 'black'
      }}
    >
    <div style={{ 
      padding: '2rem',
      backgroundColor: 'rgba(255,255,255,0.95)',
      borderRadius: '10px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      minWidth: '320px',
      }}>
      <h2 style={{ marginBottom: '1rem', textAlign: 'center' }}>Your Profile</h2>
      {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}
      {message && <p style={{ color: 'green', marginBottom: '1rem' }}>{message}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <label htmlFor="username">Username:</label>
        <input
          id="username"
          type="text"
          name="username"
          value={profile.username}
          onChange={handleChange}
          required
          style={{ width: '94%', padding: '8px', marginTop: '4px' }}
        />
      </div>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          name="email"
          value={profile.email}
          onChange={handleChange}
          required
          style={{ width: '94%', padding: '8px', marginTop: '4px' }}
        />
      </div>
      <button
        type="submit"
        style={{
          marginTop: '1rem',
          padding: '10px',
          backgroundColor: '#1976d2',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Update Profile
      </button>
    </form>
    </div>
  </Box>
  );
}

import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token
    navigate('/login'); // Redirect to login page
  };

  const goToProfile = () => navigate('/profile');
  const goToDashboard = () => navigate('/dashboard');

  return (
    <header
      style={{
        padding: '1rem',
        backgroundColor: '#f5f5f5',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
    <h1 
        style={{ cursor: 'pointer' }} 
        onClick={goToDashboard}>Job Tracker
    </h1>

      <nav style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div>
        {location.pathname !== '/profile' && (
          <button
            onClick={goToProfile}
            style={{
              marginRight: '1rem',
              background: 'blue',
              color: 'white',
              padding: '0.5rem 1rem',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Profile
          </button>
        )}
        {location.pathname !== '/dashboard' && (
          <button
            onClick={goToDashboard}
            style={{
              marginRight: '1rem',
              background: 'green',
              color: 'white',
              padding: '0.5rem 1rem',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Dashboard
          </button>
        )}
        <button
          onClick={handleLogout}
          style={{
            background: 'red',
            color: 'white',
            padding: '0.5rem 1rem',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Logout
        </button>
        </div>
      </nav>
    </header>
  );
}

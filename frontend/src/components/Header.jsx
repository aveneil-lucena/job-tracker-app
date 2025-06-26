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
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        backgroundColor: '#f5f5f5',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 1000,
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
        boxSizing: 'border-box',
        overflowX: 'hidden'
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

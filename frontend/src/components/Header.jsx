import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token
    navigate('/login'); // Redirect to login page
  };

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
      <h1>Job Tracker</h1>

      <nav style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Link to="/profile" style={{ textDecoration: 'none', color: '#333', fontWeight: 'bold' }}>
          Profile
        </Link>

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
      </nav>
    </header>
  );
}

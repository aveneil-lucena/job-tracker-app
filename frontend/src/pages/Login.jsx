import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

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

      setSuccessMessage('Login successful, welcome back!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000); // redirect after set amount of seconds
    } catch (err) {
      setError(err.message);
    }
  };

 return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',  // center horizontally
        alignItems: 'center',      // center vertically
        padding: '2rem',
        boxSizing: 'border-box',
        width: '100vw',            // full viewport width (avoid side scroll)
        backgroundColor: '#f9f9f9',
      }}
    >
      <h2 style={{ marginBottom: '0rem' }}>Login</h2>
        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            width: '100%',
            maxWidth: '400px',
            background: 'white',
            padding: '2rem',
            borderRadius: '8px',
            boxShadow: '0 0 10px rgba(201, 40, 40, 0.1)',
          }}
        >
          {successMessage && (
            <div style={{
              backgroundColor: '#4BB543',
              color: 'white',
              padding: '1rem',
              borderRadius: '5px',
              marginBottom: '1rem',
              textAlign: 'center',
            }}>
              {successMessage}
            </div>
          )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          style={{
            padding: '0.75rem 1rem',
            fontSize: '1rem',
            borderRadius: '4px',
            border: '1px solid #ccc',
            outline: 'none',
            transition: 'border-color 0.2s',
          }}
          onFocus={e => (e.target.style.borderColor = '#007bff')}
          onBlur={e => (e.target.style.borderColor = '#ccc')}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          style={{
            padding: '0.75rem 1rem',
            fontSize: '1rem',
            borderRadius: '4px',
            border: '1px solid #ccc',
            outline: 'none',
            transition: 'border-color 0.2s',
          }}
          onFocus={e => (e.target.style.borderColor = '#007bff')}
          onBlur={e => (e.target.style.borderColor = '#ccc')}
        />
        <button
          type="submit"
          style={{
            padding: '0.75rem',
            fontSize: '1rem',
            borderRadius: '4px',
            border: 'none',
            backgroundColor: '#007bff',
            color: '#fff',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={e => (e.target.style.backgroundColor = '#0056b3')}
          onMouseLeave={e => (e.target.style.backgroundColor = '#007bff')}
        >
          Login
        </button>
        {error && (
          <p style={{ color: 'red', fontWeight: 'bold', marginTop: '0.5rem' }}>{error}</p>
        )}
      </form>
    </div>
  );
}

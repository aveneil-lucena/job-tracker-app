import React, { useEffect, useState } from 'react';

export default function Profile() {
  const [profile, setProfile] = useState({ username: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/users/me', {
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
  try {
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:5000/api/users/me', {
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


  if (loading) return <p>Loading profile...</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Your Profile</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Username:{' '}
            <input
              type="text"
              name="username"
              value={profile.username}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div style={{ marginTop: '1rem' }}>
          <label>
            Email:{' '}
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <button type="submit" style={{ marginTop: '1rem' }}>
          Update Profile
        </button>
      </form>
    </div>
  );
}

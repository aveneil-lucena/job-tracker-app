import React, { useState } from 'react';

const AddJob = () => {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    status: 'pending',
    notes: ''
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token'); // make sure token is stored here after login

    try {
      const res = await fetch('http://localhost:5000/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      setMessage('✅ Job added successfully!');
      setFormData({ title: '', company: '', status: 'pending', notes: '' });
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    }
  };

  return (
    <div>
      <h2>Add Job</h2>
      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Job Title" value={formData.title} onChange={handleChange} required />
        <input name="company" placeholder="Company" value={formData.company} onChange={handleChange} required />
        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="pending">Pending</option>
          <option value="interview">Interview</option>
          <option value="offer">Offer</option>
          <option value="declined">Declined</option>
          <option value="accepted">Accepted</option>
        </select>
        <textarea name="notes" placeholder="Notes" value={formData.notes} onChange={handleChange} />
        <button type="submit">Add Job</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AddJob;
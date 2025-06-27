import React, { useEffect, useState } from 'react';
import backgroundImage from '../assets/lined-bg.jpg';
import { Box } from '@mui/material';

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState('');

  const [editingJob, setEditingJob] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    company: '',
    status: '',
    notes: ''
  });
  
  const [statusFilter, setStatusFilter] = useState('all');
  const [fadeClass, setFadeClass] = useState('fade-enter-active');
  
  //Job list pagination, and deletion
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5;
  const handleDelete = async (id) => {
  const confirmDelete = window.confirm('Are you sure you want to delete this job?');
  if (!confirmDelete) 
    return;
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:5000/api/jobs/${editingJob}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(editForm)
    });

    const text = await res.text(); // Grab raw response for debugging
    console.log('Raw response:', text);

    let data;
    try {
      data = JSON.parse(text);
    } catch (parseErr) {
      throw new Error(`Failed to parse JSON: ${parseErr.message}. Response: ${text}`);
    }

    if (!res.ok) throw new Error(data.message || 'Failed to update job');
    // Update local state to remove the deleted job
    setJobs(prevJobs => prevJobs.filter(job => job._id !== id));
  } 
  catch (err) {
    alert('Error deleting job: ' + err.message);
  }
  };
  //End job list pagination, and deletion
  
  // Handle edit functionality
  const handleEdit = (job) => {
  setEditingJob(job._id);
  setEditForm({
    title: job.title,
    company: job.company,
    status: job.status,
    notes: job.notes
    });
  };
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/jobs/${editingJob}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Failed to update job');

      setJobs(prev =>
        prev.map(job => job._id === editingJob ? { ...job, ...editForm } : job)
      );

      setEditingJob(null);
      setEditForm({ title: '', company: '', status: '', notes: '' });
    } catch (err) {
      alert('Error updating job: ' + err.message);
    }
  };
  // End handle edit functionality

  // Job fetch
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/jobs', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.message || 'Failed to fetch jobs');

        setJobs(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchJobs();
  }, []);

    // Fade effect
    useEffect(() => {
    setFadeClass('fade-enter'); // Start fade-out

    const timeout = setTimeout(() => {
      setFadeClass('fade-enter-active'); // Fade back in after slight delay
    }, 50); // Small delay to allow reflow

    return () => clearTimeout(timeout); // Clean up timeout
  }, [statusFilter]);

  // Filter jobs by status
  const filteredJobs =
  statusFilter === 'all'
    ? jobs
    : jobs.filter((job) => job.status === statusFilter);

  // Calculate current jobs for pagination
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  
  console.log('Current Jobs:', jobs);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '150px',
        overflowX: 'hidden',
        boxSizing: 'border-box'
      }}
    >
      <div
        style={{
          padding: '2rem',
          width: '600px',      // fixed width or use 'minWidth' instead
          minWidth: '500px',   // ensures it doesn’t shrink smaller than this
          margin: '0 auto',    // centers horizontally
          color: 'black',
        }}
      >
    <div style={{ padding: '2rem' }}>
      <h2>Dashboard</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <label htmlFor="statusFilter">Filter by status: </label>
      
      <select
        id="statusFilter"
        value={statusFilter}
        onChange={(e) => {
          const value = e.target.value;
          setStatusFilter(value);           // Update state immediately to keep dropdown in sync
          setFadeClass('fade-exit');        // Trigger fade out
          setTimeout(() => {
            setFadeClass('fade-enter');     // Trigger fade in
          }, 150); // Match this to your CSS transition duration
        }}
      >
        <option value="all">All</option>
        <option value="pending">Pending</option>
        <option value="interview">Interview</option>
        <option value="offer">Offer</option>
        <option value="declined">Declined</option>
        <option value="accepted">Accepted</option>
      </select>

      {/* Job list */}
      <div className={`job-list ${fadeClass}`}>
        {currentJobs.length > 0 ? (
          <ul>
            {currentJobs.map(job => (
              <li key={job._id}>
                <strong>{job.title}</strong> at {job.company} — <em>{job.status}</em><br />
                {/*<small>ID: {job._id}</small>*/}
                {/* Edit button */}
                <button
                  onClick={() => handleEdit(job)}
                  style={{ marginTop: '0.3rem', marginRight: '0.5rem', color: 'white', background: 'orange', border: 'none', padding: '4px 8px', cursor: 'pointer' }}
                >
                  Edit
                </button>
                {/* Delete button */}
                <button
                  onClick={() => handleDelete(job._id)}
                  style={{ marginTop: '0.3rem', color: 'white', background: 'red', border: 'none', padding: '4px 8px', cursor: 'pointer' }}
                >
                  Delete
                </button>
            </li>
          ))}
          </ul>
        ) : (
            <p>No jobs found.</p>
        )}
      </div>

      {/* Pagination buttons */}
      <div style=
      {{ 
        marginTop: '1rem', 
      }}>
        {Array.from({ length: Math.ceil(filteredJobs.length / jobsPerPage) }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            disabled={currentPage === index + 1}
            style={{
              margin: '0 5px',
              padding: '5px 10px',
              cursor: currentPage === index + 1 ? 'default' : 'pointer',
              backgroundColor: currentPage === index + 1 ? '#ccc' : '#fff'
            }}
          >
            {index + 1}
          </button>
        ))}
      </div>
      {/* Edit buttons */}
      {editingJob && (
      <form onSubmit={handleUpdate} style={{ marginTop: '2rem' }}>
        <h3>Edit Job</h3>
        <input
          type="text"
          placeholder="Title"
          value={editForm.title}
          onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Company"
          value={editForm.company}
          onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
          required
        />
        <select
          value={editForm.status}
          onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
          required
        >
          <option value="pending">Pending</option>
          <option value="interview">Interview</option>
          <option value="offer">Offer</option>
          <option value="declined">Declined</option>
          <option value="accepted">Accepted</option>
        </select>
        <textarea
          placeholder="Notes"
          value={editForm.notes}
          onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
        />
        <br />
        <button type="submit" style={{ marginTop: '1rem' }}>Update Job</button>
        <button type="button" onClick={() => setEditingJob(null)} style={{ marginLeft: '1rem' }}>Cancel</button>
      </form>
    )}
    </div>
    </div>
    </Box>
  );
}

import React, { useEffect, useState } from 'react';

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5;

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

  // Filter jobs by status
  const filteredJobs =
  statusFilter === 'all'
    ? jobs
    : jobs.filter((job) => job.status === statusFilter);

  // Calculate current jobs for pagination
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Dashboard</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <label htmlFor="statusFilter">Filter by status: </label>
      <select
        id="statusFilter"
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <option value="all">All</option>
        <option value="pending">Pending</option>
        <option value="interview">Interview</option>
        <option value="offer">Offer</option>
        <option value="declined">Declined</option>
        <option value="accepted">Accepted</option>
      </select>

      {/* Job list */}
      {currentJobs.length > 0 ? (
        <ul>
          {currentJobs.map(job => (
            <li key={job._id}>
              <strong>{job.title}</strong> at {job.company} — <em>{job.status}</em>
            </li>
          ))}
        </ul>
      ) : (
        <p>No jobs found.</p>
      )}

      {/* Pagination buttons */}
      <div style={{ marginTop: '1rem' }}>
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
    </div>
  );
}

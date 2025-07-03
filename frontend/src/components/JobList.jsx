import React, { useEffect, useState } from 'react';

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('❌ You must be logged in to view jobs.');
        return;
      }

      try {
        const BASE_URL = import.meta.env.VITE_API_BASE_URL;
        const res = await fetch(`${BASE_URL}/jobs`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch jobs');
        setJobs(data);
      } catch (err) {
        setMessage(`❌ ${err.message}`);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div>
      <h2>Your Jobs</h2>
      {message && <p>{message}</p>}
      {jobs.length === 0 && <p>No jobs found.</p>}
      <ul>
        {jobs.map(job => (
          <li key={job._id}>
            <strong>{job.title}</strong> at {job.company} — {job.status}
            <p>{job.notes}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default JobList;

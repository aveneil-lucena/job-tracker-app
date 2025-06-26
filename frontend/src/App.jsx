import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import AddJob from './pages/AddJob';
import Header from './components/Header';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <>
                <Header />
                <Dashboard />
              </>
            </PrivateRoute>
          }
        />
        <Route
          path="/add-job"
          element={
            <PrivateRoute>
              <>
                <Header />
                <AddJob />
              </>
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <>
                <Header />
                <Profile />
              </>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

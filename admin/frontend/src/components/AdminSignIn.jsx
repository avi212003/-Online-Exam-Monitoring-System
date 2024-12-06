import React, { useState } from 'react';
<<<<<<< HEAD
import axios from 'axios';
=======
>>>>>>> final
import api from '../config/axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/AdminSignIn.css';
<<<<<<< HEAD
=======
import Loader from './Loader'; // Import the Loader component
>>>>>>> final

const AdminSignIn = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
<<<<<<< HEAD
=======
  const [isLoading, setIsLoading] = useState(false); // Loading state
>>>>>>> final
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
<<<<<<< HEAD
    try {
      const response = await api.post('/api/auth/signin', formData); // Use `api` instead of `axios`
      login(response.data.token);
      navigate('/dashboard');
    } catch (error) {
      setError('Invalid credentials');
    }
  };

=======
    setIsLoading(true); // Show loader during form submission
    setError(''); // Clear previous errors

    try {
      const response = await api.post('/api/auth/signin', formData);
      const { token, firstname, lastname, subject, username } = response.data;
      login(token, username, firstname, lastname, subject);
      navigate('/dashboard');
    } catch (error) {
      alert('Invalid credentials');
    } finally {
      setIsLoading(false); // Hide loader after submission
    }
  };

  // Show the loader if `isLoading` is true
  if (isLoading) {
    return <Loader />;
  }

>>>>>>> final
  return (
    <div className="signin-container container">
      <h2 className="signin-title">Admin Sign-In</h2>
      <form onSubmit={handleSubmit} className="signin-form">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className="signin-input"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="signin-input"
        />
        <button type="submit" className="signin-button">Sign In</button>
        {error && <p className="error-message">{error}</p>}
      </form>
      <p>
        Don’t have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
};

export default AdminSignIn;

import React, { useState } from 'react';
import axios from 'axios';
import api from '../config/axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/AdminSignIn.css';

const AdminSignIn = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/api/auth/signin', formData);
      login(response.data.token, formData.username);
      navigate('/dashboard');
    } catch (error) {
      setError('Invalid credentials');
    }
  };

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

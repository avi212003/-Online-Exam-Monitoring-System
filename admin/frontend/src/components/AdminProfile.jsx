import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../config/axios';
import '../styles/AdminProfile.css';

const AdminProfile = () => {
  const { firstname, lastname, username, subject } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handlePasswordChange = async (e) => {
    e.preventDefault();
  
    if (newPassword !== confirmPassword) {
      setMessage('New passwords do not match.');
      return;
    }
  
    try {
      const response = await api.post(
        '/api/auth/change-password',
        {
          currentPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
  
      if (response.status === 200) {
        setMessage('Password changed successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setMessage(response.data.error || 'Failed to change password.');
      }
    } catch (error) {
      setMessage(
        error.response?.data?.error || 'An error occurred while changing the password.'
      );
    }
  };
  

  return (
    <div className="admin-profile">
      <h2>Admin Profile</h2>
      <div className="profile-details">
        <p>
          <strong>Name:</strong> {firstname} {lastname}
        </p>
        <p>
          <strong>Email:</strong> {username}
        </p>
        <p>
          <strong>Subject:</strong> {subject}
        </p>
      </div>

      <div className="change-password">
        <h3>Change Password</h3>
        <form onSubmit={handlePasswordChange}>
          <div className="form-group">
            <label htmlFor="current-password">Current Password:</label>
            <input
              type="password"
              id="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="new-password">New Password:</label>
            <input
              type="password"
              id="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirm-password">Confirm New Password:</label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn">
            Change Password
          </button>
        </form>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default AdminProfile;

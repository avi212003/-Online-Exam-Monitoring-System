// src/components/NavigationBar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/NavigationBar.css';

const NavigationBar = () => {
    const { username, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  return (
    <div className="navigation-bar">
      {/* <header className="navbar-header">
        <h1>Online Exam Monitoring System Admin</h1>
        {console.log(username)}
        <span className="navbar-username">Welcome, {username}</span>
      </header> */}
      <nav className="navbar-sidebar">
        <ul>
          <Link to="/dashboard"><li>Home</li></Link>
          <Link to="/profile"><li>My Profile</li></Link>
          <button onClick={handleLogout}><li>Logout</li></button>
        </ul>
      </nav>
    </div>
  );
};

export default NavigationBar;

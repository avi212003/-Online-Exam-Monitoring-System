// frontend/src/components/Dashboard.jsx

import React, { useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/dashboard.css';
import { FaHome, FaUser, FaEnvelope, FaSignOutAlt } from 'react-icons/fa';
import { AuthContext } from '../contexts/AuthContext';
import PastExamScores from './Scorechart'; // Adjust the path as necessary


const Dashboard = () => {
    const navigate = useNavigate();
    const { isAuthenticated, logout } = useContext(AuthContext);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/signin');
        }
    }, [isAuthenticated, navigate]);

    const handleLogout = () => {
        logout();
        navigate('/signin');
    };

    return (
        <div className="container">
            <header className="header">
                <div className="header-content">
                    <div className="app-title">
                        {/* <img className="logo" src="http://localhost:5000/static/assets/student_image.png" alt="Student Logo" /> */}
                        <h2>Online Monitoring System</h2>
                    </div>
                    <div className="welcome-section">
                        <img className="student-image" src="http://localhost:5000/static/assets/student_image.png" alt="Student" />
                        <h2 id="welcome-message">Welcome, {localStorage.getItem('username') || 'User'}!</h2>
                    </div>
                </div>
            </header>

            <div className="main">
        <aside className="sidebar">
          <ul>
            <button className="home-button" onClick={() => navigate('/dashboard')}>
              <FaHome size={20} style={{ marginRight: '8px' }} />
              Home
            </button>
            <button className = "myProfile-button" onClick={() => navigate('/profile')}>
              <FaUser style={{ marginRight: '8px' }} />
              My Profile
            </button>
            <button className = "contact-button">
              <FaEnvelope style={{ marginRight: '8px' }} />
              Contact Us
            </button>
            <button className = "logout-button" onClick={handleLogout}>
              <FaSignOutAlt style={{ marginRight: '8px' }} />
              Logout
            </button>
          </ul>
        </aside>
        <section className='right_side'>
          <div className ='dashboard'>Dashboard</div>

          <div className='current_exam'>
            <div className='exam-details'>
            <h3>Current Exam</h3>
              <p><strong>Subject:</strong> Data Structure </p>
              <p><strong>Date:</strong> 2024-10-15</p>
              <p><strong>Time:</strong> 10:00 AM - 12:00 PM</p>
              <button className='start-exam-button' onClick={() => navigate('/test')}>Start Exam</button>
            </div>
            <div className='upcoming_exams'>
              <h3>Upcoming Exams</h3>
              <ul>
                <li>
                  <p><strong>Software Engineering</strong></p>
                  <p>Date: 11-05-2024</p>
                </li>
                <li>
                  <p><strong>Discrete Math</strong></p>
                  <p>Date: 12-01-2024</p>
                </li>
                <li>
                  <p><strong>Operating System</strong></p>
                  <p>Date: 15-12-2024</p>
                </li>
              </ul>
            </div>
          </div>
        
          <div className='scores'>
            <div className='past_exam_scores'>
              <h3>Past Exam Scores</h3>
              <table>
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Score</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Discrete Math</td>
                    <td>85%</td>
                    <td>09-10-2024</td>
                  </tr>
                  <tr>
                    <td>Software Engineering</td>
                    <td>90%</td>
                    <td>08-20-2024</td>
                  </tr>
                  <tr>
                    <td>Operating System</td>
                    <td>78%</td>
                    <td>07-15-2024
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div>
            <PastExamScores />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
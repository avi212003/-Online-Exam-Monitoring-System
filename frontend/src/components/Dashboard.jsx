// frontend/src/components/Dashboard.jsx

import React, { useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/dashboard.css';
import { AuthContext } from '../contexts/AuthContext';

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
        <div className="container_Dashboard">
            <header className="header">
                <div className="header-content">
                    <div className="app-title">
                        <img className="logo" src="http://localhost:5000/static/assets/student_image.png" alt="Student Logo" />
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
                        <li className="active">Home</li>
                        <li>My Profile</li>
                        <li>Contact Us</li>
                        <li><button onClick={handleLogout} id="logout-link">Logout</button></li>
                    </ul>
                </aside>

                <section className="right_side">
                    <div className="current_exam">
                        <h3>Current Exam</h3>
                        <div className="exam-details">
                            <p><strong>Subject:</strong> History</p>
                            <p><strong>Date:</strong> 2024-10-15</p>
                            <p><strong>Time:</strong> 10:00 AM - 12:00 PM</p>
                            <button
                                className="start-exam-button"
                                onClick={() => navigate('/test')}
                            >
                                Start Exam
                            </button>
                        </div>
                    </div>

                    <div className="past_upcoming_exams">
                        <div className="past_exam_scores">
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
                                        <td>Mathematics</td>
                                        <td>85%</td>
                                        <td>2024-09-10</td>
                                    </tr>
                                    <tr>
                                        <td>Physics</td>
                                        <td>90%</td>
                                        <td>2024-08-20</td>
                                    </tr>
                                    <tr>
                                        <td>Chemistry</td>
                                        <td>78%</td>
                                        <td>2024-07-15</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="upcoming_exams">
                            <h3>Upcoming Exams</h3>
                            <ul>
                                <li>
                                    <p><strong>Biology</strong></p>
                                    <p>Date: 2024-11-05</p>
                                </li>
                                <li>
                                    <p><strong>Spanish</strong></p>
                                    <p>Date: 2024-12-01</p>
                                </li>
                                <li>
                                    <p><strong>French</strong></p>
                                    <p>Date: 2024-12-15</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Dashboard;

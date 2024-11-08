// frontend/src/components/Dashboard.jsx

import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/dashboard.css';
import { FaHome, FaUser, FaEnvelope, FaSignOutAlt } from 'react-icons/fa';
import { AuthContext } from '../contexts/AuthContext';
import PastExamScores from './Scorechart'; // Adjust the path as necessary


const Dashboard = () => {
    const navigate = useNavigate();
    const { isAuthenticated, logout } = useContext(AuthContext);
    const [exam, setExam] = useState(null);
    const [upcomingExams, setUpcomingExams] = useState([]);
    const [pastExams, setPastExams] = useState([]);
    const [currentExam, setCurrentExam] = useState(null); // State for current exam

    useEffect(() => {
        if (!isAuthenticated) {
          navigate('/signin');
        }

        // Fetch all exams and separate into past and upcoming
        const fetchExams = async () => {
          try {
            const response = await fetch('http://localhost:5001/api/exams/get_all_exams');
            if (response.ok) {
                const exams = await response.json();
                const today = new Date();
                today.setHours(0, 0, 0, 0); // Ensure only the date part is considered

                // Separate exams into past, upcoming, and current
                const upcoming = exams
                    .filter(exam => new Date(exam.date) > today)
                    .sort((a, b) => new Date(a.date) - new Date(b.date))
                    .slice(0, 3); // Limit to 3 exams
                
                const past = exams.filter(exam => new Date(exam.date) < today);
                const current = exams.find(exam => {
                    const examDate = new Date(exam.date);
                    return (
                        examDate.getDate() === today.getDate() &&
                        examDate.getMonth() === today.getMonth() &&
                        examDate.getFullYear() === today.getFullYear()
                    );
                });

                setUpcomingExams(upcoming);
                setPastExams(past);
                setCurrentExam(current);
            } else {
                console.error('Failed to fetch exams');
            }
          } catch (error) {
              console.error('Error fetching exams:', error);
          }
        };

        fetchExams();
      }, [isAuthenticated, navigate]);

    const handleLogout = () => {
          logout();
          navigate('/signin');
      };

    const handleStartExam = async () => {
      try {
          const response = await fetch('http://localhost:5001/api/exams/get_first_exam');
          if (response.ok) {
              const data = await response.json();
              setExam(data); // Store the exam data in state or localStorage
              localStorage.setItem('currentExam', JSON.stringify(data)); // Save exam to localStorage
              navigate('/test');
          } else {
              console.error('Failed to fetch exam');
          }
      } catch (error) {
          console.error('Error fetching exam:', error);
      }
    };

    return (
      <div className="dashboard_container">
        <header className="dashboard_header">
            <div className="dashboard_header-content">
                <div className="dashboard_app-title">
                    {/* <img className="logo" src="http://localhost:5000/static/assets/student_image.png" alt="Student Logo" /> */}
                    <h2>Online Monitoring System</h2>
                </div>
                <div className="dashboard_welcome-section">
                    <img className="student-image" src="http://localhost:5000/static/assets/student_image.png" alt="Student" />
                    <h2 id="welcome-message">Welcome, {localStorage.getItem('username') || 'User'}!</h2>
                </div>
            </div>
        </header>

        <div className="dashboard_main">
          <aside className="dashboard_sidebar">
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
              {currentExam && (
                <div className='current_exam'>
                    <h3>Current Exam</h3>
                    <p><strong>Subject:</strong> {currentExam.subject}</p>
                    <p><strong>Title:</strong> {currentExam.title}</p>
                    <p><strong>Date:</strong> {new Date(currentExam.date).toLocaleDateString()}</p>
                    <button className='start-exam-button' onClick={handleStartExam}>Start Exam</button>
                </div>
                )}
                {/* <button className='start-exam-button' onClick={() => navigate('/test')}>Start Exam</button> */}
              
              <div className="upcoming_exams">
                  <h3>Upcoming Exams</h3>
                  <ul>
                      {upcomingExams.map((exam, index) => (
                          <li key={index}>
                              <p><strong>{exam.subject}</strong></p>
                              <p>Title: {exam.title}</p>
                              <p>Date: {new Date(exam.date).toLocaleDateString()}</p>
                          </li>
                      ))}
                      {upcomingExams.length === 0 && <p>No upcoming exams.</p>}
                  </ul>
                </div>
            </div>
          
            <div className="scores">
              <div className="past_exam_scores">
                  <h3>Past Exam Scores</h3>
                  <table>
                      <thead>
                      <tr>
                        <th>Date</th><th>Subject</th><th>Title</th><th>Score</th>
                      </tr>
                      </thead>
                      <tbody>
                          {pastExams.map((exam, index) => (
                              <tr key={index}>
                                <td>{new Date(exam.date).toLocaleDateString()}</td>
                                <td>{exam.subject}</td>
                                <td>{exam.title}</td>
                                <td>0</td> {/* Placeholder score */}
                              </tr>
                          ))}
                          {pastExams.length === 0 && (
                            <tr>
                              <td colSpan="4">No past exams.</td>
                            </tr>
                          )}
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
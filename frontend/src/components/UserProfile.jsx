import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { FaHome, FaUser, FaEnvelope, FaSignOutAlt } from 'react-icons/fa';
import '../styles/userprofile.css';

const UserProfile = () => {
  let navigate = useNavigate();
  const { isAuthenticated, logout } = useContext(AuthContext);
  // Sample data for Exam History and Cheat Incidents
  const examData = [
    { id: 1, date: '2024-01-10', exam: 'Math', marks: 90, remarks: 'Excellent' },
    { id: 2, date: '2024-02-12', exam: 'Physics', marks: 85, remarks: 'Good' },
    { id: 3, date: '2024-03-15', exam: 'Chemistry', marks: 88, remarks: 'Well Done' },
  ];

  const cheatIncidentsData = [
    { id: 1, date: '2024-01-12', exam: 'Math', incident: 'Plagiarism detected', links: 'Link1' },
    { id: 2, date: '2024-02-14', exam: 'Physics', incident: 'Copying from unauthorized notes', links: 'Link2' },
    { id: 3, date: '2024-02-16', exam: 'Chemistry', incident: 'Plagiarism detected', links: 'Link3' }
  ];

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
            {/* <img className="logo" src={studentImage} alt="Student" /> */}
            <h2>Online Monitoring System</h2>
          </div>
          {<div className='welcome-section'>
              <img className='student-image' src='http://localhost:5000/static/assets/student_image.png' alt="Student" />
              <h2>Welcome, {name}!</h2>
          </div>}
          { <button className="profile-button">Profile</button>}
        </div>
      </header>
      <div className="main">
        <aside className='sidebar'>
          <ul>
            {/* <li className="active">Home</li> */}
            <button className="home-button" onClick={() => navigate('/dashboard')}>
              <FaHome size={20} style={{ marginRight: '8px' }} />
              Home
            </button>
            {/* <li>My Profile</li> */}
            <button className = "myProfile-button" onClick={() => navigate('/profile')}>
              <FaUser style={{ marginRight: '8px' }} />
              My Profile
            </button>
            {/* <li>Contact Us</li> */}
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
        
      <main className="main-content">
      <div className ='user_profile'>User Profile</div>
        {/* Personal Information Section */}
        <section className="profile-card">
        <div>
        <h2>Personal Information</h2>
        </div>
         <form className="form">
          <div className="info-section">
           <p><strong>Full Name:</strong></p>
           <p><strong>Email:</strong></p>
           <p><strong>Date of birth:</strong></p>
          </div>
         </form>
        </section>

        {/* Previous Exam History Section */}
        
        <section className="exam-history">
        <h2>Previous Exam History</h2>
          <table className="exam-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Date</th>
                <th>Exam</th>
                <th>Marks</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {examData.map((exam) => (
                <tr key={exam.id}>
                  <td>{exam.id}</td>
                  <td>{exam.date}</td>
                  <td>{exam.exam}</td>
                  <td>{exam.marks}</td>
                  <td>{exam.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Cheat Incidents Section */}
        <section className="cheat-incidents">
        <h2>Cheat Incidents</h2>
          <table className="cheat-incidents-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Date</th>
                <th>Exam</th>
                <th>Incident</th>
                <th>Links</th>
              </tr>
            </thead>
            <tbody>
              {cheatIncidentsData.map((incident) => (
                <tr key={incident.id}>
                  <td>{incident.id}</td>
                  <td>{incident.date}</td>
                  <td>{incident.exam}</td>
                  <td>{incident.incident}</td>
                  <td>{incident.links}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  </div>
  );
}

export default UserProfile;
import React from 'react';
import './Dashboard.css';
import studentImage from '../../assets/student_image.png';
import { FaHome, FaUser, FaEnvelope, FaSignOutAlt } from 'react-icons/fa';
import PastExamScores from './Scorechart'; // Adjust the path as necessary

const Dashboard = ({ name }) => {
  return (
    <div className="container">
      <header className='header'>
        <div className="header-content">
          <div className='app-title'>
              <h2>Online Monitoring System</h2>
          </div>
          <div className='welcome-section'>
              <img className='student-image' src={studentImage} alt="Student" />
              <h2>Welcome, {name}!</h2>
          </div>
            {/* <button className='profile-button'>Profile</button> */}
        </div>
      </header>
      <div className="main">
        <aside className='sidebar'>
          <ul>
            <button className="home-button">
              <FaHome size={20} style={{ marginRight: '8px' }} />
              Home
            </button>
            <button className = "myProfile-button">
              <FaUser style={{ marginRight: '8px' }} />
              My Profile
            </button>
            <button className = "contact-button">
              <FaEnvelope style={{ marginRight: '8px' }} />
              Contact Us
            </button>
            <button className = "logout-button">
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
              <p><strong>Subject:</strong> History</p>
              <p><strong>Date:</strong> 2024-10-15</p>
              <p><strong>Time:</strong> 10:00 AM - 12:00 PM</p>
              <button className='start-exam-button'>Start Exam</button>
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

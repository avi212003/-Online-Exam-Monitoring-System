import React from 'react';
import './Dashboard.css';
import studentImage from '../../assets/student_image.png';

const Dashboard = ({ name }) => {
  return (
    <div className="container">
      <header className='header'>
        <div className="header-content">
          <button className='profile-button'>Profile</button>
        </div>
      </header>
      <div className="main">
        <aside className='sidebar'>
          <ul>
            <li className="active">Home</li>
            <li>My Profile</li>
            <li>Contact Us</li>
            <li>Logout</li>
          </ul>
        </aside>
        <section className='right_side'>
          <div className='welcome-section'>
            <img className='student-image' src={studentImage} alt="Student" />
            <h2>Welcome, {name}!</h2>
          </div>
          
          <div className='current_exam'>
            <h3>Current Exam</h3>
            <div className='exam-details'>
              <p><strong>Subject:</strong> History</p>
              <p><strong>Date:</strong> 2024-10-15</p>
              <p><strong>Time:</strong> 10:00 AM - 12:00 PM</p>
              <button className='start-exam-button'>Start Exam</button>
            </div>
          </div>
          
          <div className='past_upcoming_exams'>
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
            <div className='upcoming_exams'>
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

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { FaHome, FaUser, FaEnvelope, FaSignOutAlt } from 'react-icons/fa';
import '../styles/userprofile.css';

const UserProfile = () => {
  let navigate = useNavigate();
  const { isAuthenticated, logout, userDetails, username } = useContext(AuthContext);
  const [pastExams, setPastExams] = useState([]);
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

  // useEffect(() => {
  //   if (!isAuthenticated) {
  //       navigate('/signin');
  //   }
  // }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signin');
    }

    const fetchExams = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/exams/get_all_exams');
        if (response.ok) {
          const exams = await response.json();
          const today = new Date();
          today.setHours(0, 0, 0, 1);

          // Get completed exams from user details
          const completedExamIds = new Set(
            userDetails.exams?.map(exam => exam.examID) || []
          );

          // const current = exams.filter(exam => {
          //   const examDate = new Date(exam.date);
          //   const isToday = (
          //     examDate.getDate() === today.getDate() &&
          //     examDate.getMonth() === today.getMonth() &&
          //     examDate.getFullYear() === today.getFullYear()
          //   );
          //   return isToday && !completedExamIds.has(exam.id);
          // });

          // const upcoming = exams
          //   .filter(exam => {
          //     const examDate = new Date(exam.date);
          //     const isFuture = (
          //       (examDate > today) || 
          //       (examDate.getDate() === today.getDate() && 
          //        examDate.getMonth() === today.getMonth() &&
          //        examDate.getFullYear() === today.getFullYear())
          //     );
          //     return isFuture && !completedExamIds.has(exam.id);
          //   })
          //   .sort((a, b) => new Date(a.date) - new Date(b.date));

          const past = exams.filter(exam => 
            new Date(exam.date) < today || completedExamIds.has(exam.id)
          );

          // Match past exams with user's exam scores
          const pastExamsWithScores = past.map(exam => {
            const userExam = userDetails.exams?.find(
              userExam => userExam.examID === exam.id
            );
            
            let scoreDisplay = 'Not taken';
            if (userExam) {
              scoreDisplay = userExam.score || 'Not available';
            }

            return {
              ...exam,
              score: scoreDisplay
            };
          });

          // Sort past exams by date, most recent first
          const sortedPastExams = pastExamsWithScores.sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          );

          // setUpcomingExams(upcoming);
          setPastExams(sortedPastExams);
          // setCurrentExam(current);
          setAllExams(exams);
        } else {
          console.error('Failed to fetch exams');
        }
      } catch (error) {
        console.error('Error fetching exams:', error);
      }
    };

    fetchExams();
  }, [isAuthenticated, navigate, userDetails]);

  const handleLogout = () => {
      logout();
      navigate('/signin');
  };

  return (
    <div className="profile_container">
      <header className="profile_header">
        <div className="profile_header-content">
          <div className="profile_app-title">
            {/* <img className="logo" src={studentImage} alt="Student" /> */}
            <h2>Online Monitoring System</h2>
          </div>
          {<div className='profile_welcome-section'>
              <img className='student-image' src='http://localhost:5000/static/assets/student_image.png' alt="Student" />
              <h2 id="profile_welcome-message">Welcome, {userDetails.firstname || 'User'}!</h2>
          </div>}
        </div>
      </header>
      <div className="profile_main">
        <aside className='profile_sidebar'>
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
        
      <main className="profile_main-content">
      <div className ='user_profile'>User Profile</div>
        {/* Personal Information Section */}
        <section className="profile-card">
        <div>
        <h3>Personal Information</h3>
        </div>
         <form className="form">
          <div className="info-section">
           <p><strong>Full Name: {userDetails.firstname || Avi} {userDetails.lastname || Chauhan}</strong></p>
           <p><strong>Email: {username || 'User'}</strong></p>
           <p><strong>Gender: {userDetails.gender || 'Undisclosed'}</strong></p>
          </div>
         </form>
        </section>

        {/* Previous Exam History Section */}
        <section className="exam-history">
        <h3>Previous Exam History</h3>
          <table className="exam-table">
            <thead>
              <tr>
                <th>Exam</th>
                <th>Date</th>
                <th>Score</th>
                <th>Exam ID</th>
              </tr>
            </thead>
            <tbody>
              {pastExams.map((exam) => (
                <tr key={exam.id}>
                  <td>{exam.title}</td>
                  <td>{exam.date}</td>
                  <td>{exam.score}</td>
                  <td>{exam.id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Cheat Incidents Section */}
        <section className="cheat-incidents">
        <h3>Cheat Incidents</h3>
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

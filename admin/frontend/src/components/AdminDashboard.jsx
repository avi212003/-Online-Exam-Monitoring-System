// AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import api from '../config/axios';
import { useAuth } from '../context/AuthContext';
import ExamForm from './ExamForm';
import ExamPopup from './ExamPopup';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const { auth, logout } = useAuth();
  const [exams, setExams] = useState([]);
  const [subject, setSubject] = useState('');
  const [selectedExam, setSelectedExam] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const decodedToken = JSON.parse(atob(auth.split('.')[1]));
    setSubject(decodedToken.subject);

    fetchExams();
  }, [auth]);

  const fetchExams = async () => {
    try {
      const response = await api.get('/api/exams/getExams', {
        headers: { Authorization: `Bearer ${auth}` }
      });
      setExams(response.data);
    } catch (error) {
      console.log('Error fetching exams:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  const handleExamCreated = () => {
    fetchExams();
  };

  const handleExamClick = (exam) => {
    setSelectedExam(exam);
  };

  const closePopup = () => {
    setSelectedExam(null);
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Admin Dashboard</h2>
      <p>Subject: {subject}</p>
      {/* <button onClick={handleLogout} className="logout-button">Logout</button> */}
      
      {/* <div className="form-section">
        <ExamForm subject={subject} onExamCreated={handleExamCreated} />
      </div> */}

      <button 
        onClick={() => navigate('/create-exam')} // Navigate to create exam route
        className="create-exam-button"
      >
        Create Exam
      </button>

      <h3 className="exams-title">Exams</h3>
      {exams.length > 0 ? (
        <ul className="exams-list">
          {exams.map((exam) => (
            <li 
              key={exam.id} 
              className="exam-item" 
              onClick={() => handleExamClick(exam)}
            >
              {exam.title}
            </li>
          ))}
        </ul>
      ) : (
        <p>You have not created any exam.</p>
      )}

      {/* Render ExamPopup when an exam is selected */}
      {selectedExam && <ExamPopup exam={selectedExam} onClose={closePopup} />}
    </div>
  );
};

export default AdminDashboard;

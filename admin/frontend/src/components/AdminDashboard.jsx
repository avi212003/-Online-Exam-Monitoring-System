import React, { useEffect, useState } from 'react';
import axios from 'axios';
import api from '../config/axios';
import { useAuth } from '../context/AuthContext';
import ExamForm from './ExamForm';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const { auth, logout } = useAuth();
  const [exams, setExams] = useState([]);
  const [subject, setSubject] = useState(''); // To store the admin's subject
  const navigate = useNavigate();

  useEffect(() => {
    // Decode token to get subject (assuming it contains subject information)
    const decodedToken = JSON.parse(atob(auth.split('.')[1]));
    setSubject(decodedToken.subject);
    console.log(decodedToken);

    const fetchExams = async () => {
      try {
        const response = await api.get('/api/exams/getExams', {
          headers: { Authorization: `Bearer ${auth}` }
        });
        console.log(response);
        const adminExams = response.data;
        setExams(adminExams);
        console.log(exams);
      } catch (error) {
        console.log('Error fetching exams:', error);
      }
    };
    fetchExams();
  }, [auth]);

  const handleLogout = () => {
    logout();
    navigate('/signin'); // Redirect to sign-in page
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Admin Dashboard</h2>
      <p>Subject: {subject}</p> {/* Display the subject */}
      <button onClick={handleLogout} className="logout-button">Logout</button>
      
      <div className="form-section">
        <ExamForm subject={subject}/>
      </div>
      <h3 className="exams-title">Exams</h3>
      {exams.length > 0 ? (
        <ul className="exams-list">
          {exams.map((exam) => (
            <li key={exam.id} className="exam-item">{exam.title}</li>
          ))}
        </ul>
      ) : (
        <p>You have not created any exam.</p>
      )}
    </div>
  );
};

export default AdminDashboard;

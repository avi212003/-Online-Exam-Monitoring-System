<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import api from '../config/axios';
import { useAuth } from '../context/AuthContext';
import ExamForm from './ExamForm';
=======
// AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import api from '../config/axios';
import { useAuth } from '../context/AuthContext';
import ExamForm from './ExamForm';
import ExamPopup from './ExamPopup';
>>>>>>> final
import { useNavigate } from 'react-router-dom';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const { auth, logout } = useAuth();
  const [exams, setExams] = useState([]);
<<<<<<< HEAD
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
=======
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
      const response = await axiox.get('http://localhost:5001/api/exams/getExams', {
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
    <div className="admindashboard-container">
      <h2 className="dashboard-title">Admin Dashboard</h2>
      <p className ="subjectName">Subject: {subject}</p>
       <main className="admindashboard-main">
        <section className="admincard">
          <h2>To create exam please click on the below "Create New Exam" button.</h2>
          <button className="admincard-button" onClick={() => navigate('/create-exam')} >Create New Exam</button>
        </section>
        <section className="admincard">
          <h2>To view exam scores please click on the below "View Scores" button.</h2>
          <button className="admincard-button" onClick={() => navigate('/view-scores')}>View Scores</button>
        </section>
        <section className="admincard">
            <h2>To log off question paper please click on the below "Logs Of Question Paper" button.</h2>
            <button className="admincard-button" onClick={() => navigate('/questions-log')}>Logs Of Question Paper</button>
        </section>
        <section className="admincard">
            <h2>To see students who cheated click on the below "Cheat Logs" button.</h2>
            <button className="admincard-button" onClick={() => navigate('/cheat-log')}>Cheat Logs</button>
        </section>
      </main>
>>>>>>> final
    </div>
  );
};

export default AdminDashboard;

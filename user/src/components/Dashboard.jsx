// user/src/components/Dashboard.jsx

import React, { useState, useEffect } from 'react';
import axios from '../config/axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [exams, setExams] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all available exams
    const fetchExams = async () => {
      try {
        const response = await axios.get('/exams');
        setExams(response.data);
      } catch (error) {
        setMessage('Failed to load exams.');
      }
    };
    fetchExams();
  }, []);

  const handleStartExam = (examId) => {
    navigate(`/test/${examId}`); // Redirect to the specific exam's test page
  };

  return (
    <div className="dashboard">
      <h2>Available Exams</h2>
      {message && <p>{message}</p>}
      {exams.length > 0 ? (
        <ul>
          {exams.map((exam) => (
            <li key={exam.id}>
              <h3>{exam.title}</h3>
              <button onClick={() => handleStartExam(exam.id)}>Start Exam</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No exams available at the moment.</p>
      )}
    </div>
  );
};

export default Dashboard;

import React, { useState, useEffect } from 'react';
import axios from '../config/axios';

const TestPage = () => {
  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch the exam data from the backend (ensure you're passing the correct exam ID)
    const fetchExam = async () => {
      try {
        const response = await axios.get('/exams');  // Fetch all exams
        if (response.data && response.data.length > 0) {
          setExam(response.data[0]);  // Assuming you want to use the first exam
        } else {
          setMessage('No exams available.');
        }
      } catch (error) {
        setMessage('Failed to load exam data.');
      }
    };

    fetchExam();
  }, []);

  const handleAnswerChange = (questionIndex, selectedAnswer) => {
    const updatedAnswers = [...answers];
    updatedAnswers[questionIndex] = selectedAnswer;
    setAnswers(updatedAnswers);
  };

  const handleSubmit = async () => {
    try {
      await axios.post('/exams/submit', { answers });
      setMessage('Your answers have been submitted successfully.');
    } catch (error) {
      setMessage('Error while submitting answers.');
    }
  };

  return (
    <div className="test-page">
      <h2>{exam ? exam.title : 'Loading Exam...'}</h2>
      {exam ? (
        <div>
          {exam.questions.map((question, index) => (
            <div key={index}>
              <h3>{question.question}</h3>
              {question.options.map((option, i) => (
                <label key={i}>
                  <input
                    type="radio"
                    name={`question-${index}`}
                    value={option}
                    onChange={() => handleAnswerChange(index, option)}
                  />
                  {option}
                </label>
              ))}
            </div>
          ))}
          <button onClick={handleSubmit}>Submit</button>
        </div>
      ) : (
        <p>Loading exam...</p>
      )}
      {message && <p>{message}</p>}
    </div>
  );
};

export default TestPage;

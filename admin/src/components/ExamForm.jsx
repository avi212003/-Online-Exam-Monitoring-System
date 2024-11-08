// admin/src/components/ExamForm.jsx

import React, { useState } from 'react';
import axios from '../config/axios';
import '../styles/ExamForm.css';

const ExamForm = () => {
  const [examTitle, setExamTitle] = useState('');
  const [examDescription, setExamDescription] = useState('');
  const [questions, setQuestions] = useState([{ question: '', options: ['', '', '', ''], answer: '' }]);
  const [message, setMessage] = useState('');

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (index, optionIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].options[optionIndex] = value;
    setQuestions(updatedQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/exams/create', {
        examTitle,  // Send examTitle
        examDescription,  // Send examDescription
        questions,  // Send questions as well
      });
      setMessage('Exam created successfully');
      // Clear form after submission
      setExamTitle('');
      setExamDescription('');
      setQuestions([{ question: '', options: ['', '', '', ''], answer: '' }]);
    } catch (error) {
      setMessage('Error creating exam');
    }
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { question: '', options: ['', '', '', ''], answer: '' },
    ]);
  };

  return (
    <div className="exam-form">
      <h2>Create Exam</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Exam Title"
          value={examTitle}
          onChange={(e) => setExamTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Exam Description"
          value={examDescription}
          onChange={(e) => setExamDescription(e.target.value)}
          required
        />
        {questions.map((question, index) => (
          <div key={index} className="question">
            <input
              type="text"
              placeholder={`Question ${index + 1}`}
              value={question.question}
              onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
              required
            />
            {question.options.map((option, optionIndex) => (
              <input
                key={optionIndex}
                type="text"
                placeholder={`Option ${optionIndex + 1}`}
                value={option}
                onChange={(e) =>
                  handleOptionChange(index, optionIndex, e.target.value)
                }
                required
              />
            ))}
            <input
              type="text"
              placeholder="Correct Answer"
              value={question.answer}
              onChange={(e) =>
                handleQuestionChange(index, 'answer', e.target.value)
              }
              required
            />
          </div>
        ))}
        <button type="button" onClick={handleAddQuestion}>
          Add Question
        </button>
        <button type="submit">Submit Exam</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ExamForm;

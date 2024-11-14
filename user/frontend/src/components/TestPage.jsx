import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/testpage.css';
import { AuthContext } from '../contexts/AuthContext';

const TestPage = () => {
    const navigate = useNavigate();
    const { isAuthenticated, username } = useContext(AuthContext); // assuming username is available in AuthContext
    const [welcomeMsg, setWelcomeMsg] = useState('');
    const [exam, setExam] = useState(null);
    const [selectedAnswers, setSelectedAnswers] = useState([]); // Initialize as array
    const [errorMessage, setErrorMessage] = useState('');
    const [showPopup, setShowPopup] = useState(false); // For error handling

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/signin');
        } else {
            const fetchedExam = JSON.parse(localStorage.getItem('currentExam'));
            if (fetchedExam) {
                const fetchWelcomeMsg = async () => {
                    const token = localStorage.getItem('token');
                    try {
                        const response = await fetch('/api/test_welcome_msg', {
                            method: 'GET',
                            headers: {
                                'Authorization': `Bearer ${token}`,
                            },
                        });
                        const data = await response.json();
                        if (response.ok) {
                            setWelcomeMsg(data.msg);
                        } else {
                            setWelcomeMsg(data.msg || 'Failed to fetch data.');
                        }
                    } catch (error) {
                        console.error('Error:', error);
                        setWelcomeMsg('An error occurred while fetching data.');
                    }
                };
                fetchWelcomeMsg();
                setExam(fetchedExam);
            } else {
                navigate('/dashboard');
            }
        }

        const handleBeforeUnload = (event) => {
            event.preventDefault();
            setShowPopup(true);
            return '';
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [isAuthenticated, navigate]);

    const handleAnswerChange = (questionIndex, answer) => {
        const updatedAnswers = [...selectedAnswers];
        updatedAnswers[questionIndex] = answer;
        setSelectedAnswers(updatedAnswers);
        setErrorMessage('');
    };

    const handleSubmit = async () => {
        if (Object.keys(selectedAnswers).length !== exam.questions.length || selectedAnswers.includes(undefined)) {
            setErrorMessage('Please answer all questions before submitting.');
            return;
        }

        let score = 0;
        exam.questions.forEach((question, index) => {
            if (selectedAnswers[index] === question.answer) {
                score += 10;
            }
        });

        const token = localStorage.getItem('token');
        const submissionData = {
            examID: exam.id,
            subject: exam.subject,
            title: exam.title,
            date: exam.date,
            username: localStorage.getItem('username'),
            answers: selectedAnswers,
            score,
            timestamp: new Date().toISOString(),
        };

        try {
            const response = await fetch('/api/submit_answers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(submissionData),
            });

            if (response.ok) {
                navigate('/dashboard');
            } else {
                console.error('Failed to submit answers.');
            }
        } catch (error) {
            console.error('Error submitting answers:', error);
        }
    };

    const handleCancel = () => {
        setShowPopup(false);
    };

    const handleContinue = () => {
        setShowPopup(false);
        window.location.reload();
    };

    return (
        <div className="container">
            {exam ? (
                <>
                    <div className="dash_row test_left">
                        <div className="camera_div">
                            <div className="video">
                                <img src="/api/test" alt="Live Monitoring" className="video_image" />
                            </div>
                        </div>
                    </div>
                    <div className="dash_row test_right">
                        <div className="dash_body">
                            <div className="welcome_message">
                                <h3>{welcomeMsg}</h3>
                            </div>
                            <div className="questions">
                                {exam.questions.map((question, index) => (
                                    <div key={index}>
                                        <div className='question'>{question.question}</div>
                                        {question.options.map((option, i) => (
                                            <label key={i}>
                                                <input
                                                    type="radio"
                                                    name={question.question}
                                                    value={option}
                                                    onChange={() => handleAnswerChange(index, option)}
                                                />
                                                <span>{option}</span>
                                            </label>
                                        ))}
                                    </div>
                                ))}
                            </div>
                            {errorMessage && <div className="error-message">{errorMessage}</div>}
                            <button className="test_submit_button" onClick={handleSubmit}>
                                Submit
                            </button>
                        </div>
                    </div>
                    {showPopup && (
                        <div className="popup">
                            <div className="popup-content">
                                <h2>Warning!!</h2>
                                <p>Are you sure you want to refresh the page? Unsaved changes may be lost.</p>
                                <button onClick={handleContinue}>Continue</button>
                                <button onClick={handleCancel}>Cancel</button>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <p>Loading exam...</p>
            )}
        </div>
    );
};

export default TestPage;

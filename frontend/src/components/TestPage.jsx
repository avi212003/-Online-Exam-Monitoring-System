// frontend/src/components/TestPage.jsx

import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/testpage.css';
import { AuthContext } from '../contexts/AuthContext';

const TestPage = () => {
    const navigate = useNavigate();
    const { isAuthenticated, username } = useContext(AuthContext); // assuming username is available in AuthContext
    const [welcomeMsg, setWelcomeMsg] = useState('');
    const [selectedAnswers, setSelectedAnswers] = useState({}); // Store answers
    const [errorMessage, setErrorMessage] = useState(''); // For error handling
    const [showPopup, setShowPopup] = useState(false);//Popup message

    // Define your questions and options
    const questions = [
        {
            id: 'question1',
            text: '1) Which of the following is not the type of queue?',
            options: [
                'Priority queue',
                'Single-ended queue',
                'Circular queue',
                'Ordinary queue'
            ]
        },
        {
            id: 'question2',
            text: '2) Which of the following is a linear data structure?',
            options: [
                'Array',
                'AVL Trees',
                'Binary Trees',
                'Graphs'
            ]
        },
        // Add more questions as needed
    ];

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/signin');
        } else {
            // Fetch welcome message from backend
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
        }
        //Beforeunload event listener
        const handleBeforeUnload = (event) => {
            event.preventDefault();
            setShowPopup(true);
            event.returnValue = ''; // Necessary for some browsers
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [isAuthenticated, navigate]);

    const handleAnswerChange = (questionId, answer) => {
        setSelectedAnswers((prev) => ({ ...prev, [questionId]: answer }));
        setErrorMessage(''); // Clear any error message when an answer is selected
    };

    const handleSubmit = async () => {
        console.log('Selected Answers: ', selectedAnswers)
        console.log('Questions length: ', questions.length)
        // Check if all questions have been answered
        if (Object.keys(selectedAnswers).length !== questions.length) {
            setErrorMessage('Please answer all questions before submitting.');
            return;
        }

        const token = localStorage.getItem('token');
        const timestamp = new Date().toISOString();
        const submissionData = {
            username: localStorage.username,
            timestamp,
            answers: selectedAnswers,
        };

        console.log('Submission Data: ', submissionData);

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
                window.removeEventListener('beforeunload', () => {});
                navigate('/dashboard'); // Redirect on success
            } else {
                console.error('Failed to submit answers.');
            }
        } catch (error) {
            console.error('Error submitting answers:', error);
        }
    };

    const handleCancel = () => {
        setShowPopup(false); // Close popup without refreshing
    };

    const handleContinue = () => {
        setShowPopup(false); // Allow refresh
        window.location.reload();
    };

    return (
        <div className="container">
            <div className="dash_row test_left">
                <div className="camera_div">
                    <div className="video">
                        <img src="/api/test" alt="Live Monitoring" className="video_image" />
                    </div>
                </div>
                <div className="test_bottom_div"></div>
            </div>
            <div className="dash_row test_right">
                <div className="dash_body">
                    <div className="welcome_message">
                        <h3>{welcomeMsg}</h3>
                    </div>
                    <div className="questions">
                        {questions.map((question) => (
                            <div key={question.id}>
                                <div className='question'>{question.text}</div>
                                {question.options.map((option) => (
                                    <label key={option}>
                                        <input
                                            type="radio"
                                            name={question.id}
                                            value={option}
                                            onChange={() => handleAnswerChange(question.id, option)}
                                        />
                                        <span>{option}</span>
                                    </label>
                                ))}
                            </div>
                        ))}
                    </div>
                    {errorMessage && <div className="error-message">{errorMessage}</div>} {/* Display error message */}
                    <button className="test_submit_button" onClick={() => {navigate('/dashboard')}}>
                        Submit
                    </button>
                </div>
            </div>
            {/* Popup for refresh warning */}
            {showPopup && (
                <div className="popup">
                    <div className="popup-content">
                        <h2>Warning</h2>
                        <p>Are you sure you want to refresh the page? Unsaved changes may be lost.</p>
                        <button onClick={handleContinue}>Continue</button>
                        <button onClick={handleCancel}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TestPage;


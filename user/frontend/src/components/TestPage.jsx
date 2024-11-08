// frontend/src/components/TestPage.jsx

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
    const [errorMessage, setErrorMessage] = useState(''); // For error handling

    // Define your questions and options
    // const questions = [
    //     {
    //         id: 'question1',
    //         text: '1) Which of the following is not the type of queue?',
    //         options: [
    //             'Priority queue',
    //             'Single-ended queue',
    //             'Circular queue',
    //             'Ordinary queue'
    //         ]
    //     },
    //     {
    //         id: 'question2',
    //         text: '2) Which of the following is a linear data structure?',
    //         options: [
    //             'Array',
    //             'AVL Trees',
    //             'Binary Trees',
    //             'Graphs'
    //         ]
    //     },
    //     // Add more questions as needed
    // ];

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/signin');
        } else {
            const fetchedExam = JSON.parse(localStorage.getItem('currentExam'));
            // Fetch welcome message from backend
            console.log("Fetched Exam : ", fetchedExam);
            if(fetchedExam){
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
                navigate('/dashboard'); // Redirect if no exam is loaded
            }
        }
    }, [isAuthenticated, navigate]);

    const handleAnswerChange = (questionIndex, answer) => {
        const updatedAnswers = [...selectedAnswers];
        updatedAnswers[questionIndex] = answer; // Update specific index
        setSelectedAnswers(updatedAnswers);
        setErrorMessage(''); // Clear any error message when an answer is selected
    };

    const handleSubmit = async () => {
        console.log('Selected Answers: ', selectedAnswers)
        // console.log("Exam: ", exam.questions);
        console.log('Questions length: ', exam.questions.length)
        // Check if all questions have been answered
        if (Object.keys(selectedAnswers).length !== exam.questions.length || selectedAnswers.includes(undefined)) {
            setErrorMessage('Please answer all questions before submitting.');
            return;
        }

        // Calculate the score
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
            score, // Include the calculated score
            timestamp: new Date().toISOString(),
        };

        // {
        //     username: localStorage.username,
        //     timestamp,
        //     answers: [answer1: "",],
        // };

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
                navigate('/dashboard'); // Redirect on success
            } else {
                console.error('Failed to submit answers.');
            }
        } catch (error) {
            console.error('Error submitting answers:', error);
        }
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
                        <div className="test_bottom_div"></div>
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
                            {errorMessage && <div className="error-message">{errorMessage}</div>} {/* Display error message */}
                            <button className="test_submit_button" onClick={handleSubmit}>
                                Submit
                            </button>
                        </div>
                    </div>
                </>
                ) : (
                    <p>Loading exam...</p>
                )}
        </div>
    );
};

export default TestPage;

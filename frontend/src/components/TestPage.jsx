// frontend/src/components/TestPage.jsx

import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/testpage.css'; // Ensure you have the CSS file
import { AuthContext } from '../contexts/AuthContext';

const TestPage = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useContext(AuthContext);
    const [welcomeMsg, setWelcomeMsg] = useState('');

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
    }, [isAuthenticated, navigate]);

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
                {/* <div className="dash_head">
                    <div className="dash_header">Demo questions</div>
                </div> */}
                <div className="dash_body">
                    <div className="welcome_message">
                        <h3>{welcomeMsg}</h3>
                    </div>
                    <div className="questions">
                        <div className='question'>1) Which of the following is not the type of queue?</div>
                        <br />
                        <label>
                            <input type="radio" value="option1" name="question1" />
                            <span>Priority queue</span>
                        </label>
                        <br />
                        <label>
                            <input type="radio" value="option2" name="question1" />
                            <span>Single-ended queue</span>
                        </label>
                        <br />
                        <label>
                            <input type="radio" value="option3" name="question1" />
                            <span>Circular queue</span>
                        </label>
                        <br />
                        <label>
                            <input type="radio" value="option4" name="question1" />
                            <span>Ordinary queue</span>
                        </label>
                        <br />
                        <br />
                        <div className='question'>2) Which of the following is a linear data structure?</div>
                        <br />
                        <label>
                            <input type="radio" value="option1" name="question2" />
                            <span>Array</span>
                        </label>
                        <br />
                        <label>
                            <input type="radio" value="option2" name="question2" />
                            <span>AVL Trees</span>
                        </label>
                        <br />
                        <label>
                            <input type="radio" value="option3" name="question2" />
                            <span>Binary Trees</span>
                        </label>
                        <br />
                        <label>
                            <input type="radio" value="option4" name="question2" />
                            <span>Graphs</span>
                        </label>
                        <br />
                        <br />
                    </div>
                    <Link to="/dashboard">
                        <button className="test_submit_button">
                            Submit
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default TestPage;

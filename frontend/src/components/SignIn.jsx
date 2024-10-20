// frontend/src/components/SignIn.jsx

import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/signin.css'; // Ensure to import your CSS file
import { AuthContext } from '../contexts/AuthContext';

const SignIn = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [msg, setMsg] = useState('');
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleSignIn = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                setMsg(data.msg);
                // Store JWT token and username in localStorage
                localStorage.setItem('token', data.access_token);
                localStorage.setItem('username', username);
                login(); // Update authentication state
                navigate('/dashboard'); // Redirect to dashboard on successful sign-in
            } else {
                setMsg(data.msg || 'Sign-in failed. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            setMsg('An error occurred. Please try again.');
        }
    };

    return (
        <div className="container">
            <div className="register_right">
                <div className="content">
                    <img className="register_image" src="http://localhost:5000/static/assets/SignIn.png" alt="Sign In Illustration" />
                    <div className="card">
                        <div className="header">Sign In</div>
                        <form onSubmit={handleSignIn} className="register_form">
                            <input
                                className="input_field"
                                type="text"
                                id="Username"
                                name="Username"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            /><br />
                            <input
                                className="input_field"
                                type="password"
                                id="password"
                                name="psw"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            /><br />
                            <input
                                className="submit_button"
                                type="submit"
                                value="Login"
                            /><br /><br />
                            <h5>{msg}</h5>
                        </form>
                        <div className="register_link">
                            Don't have an account? <Link to="/register" className="sign_up_instead">Register</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignIn;

// frontend/src/components/Register.jsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/register.css'; // Ensure to import your CSS file

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [gender, setGender] = useState('');
    const [file, setFile] = useState(null);
    const [msg, setMsg] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('Username', username);
        formData.append('psw', password);
        formData.append('gender', gender);
        if (file) {
            formData.append('filename', file);
        }
    
        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                body: formData,
            });
    
            const data = await response.json();
    
            if (response.ok) {
                setMsg(data.msg);
                // Store username in localStorage
                localStorage.setItem('username', username);
                // Optionally, navigate to dashboard or sign-in page
                navigate('/dashboard'); // Redirect to dashboard on successful registration
            } else {
                setMsg(data.msg || 'Registration failed. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            setMsg('An error occurred. Please try again.');
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    return (
        <div className="container">
            <div className="register_right">
                <div className="content">
                    <img className="register_image" src="http://localhost:5000/static/assets/register.png" alt="Register Illustration" />
                    <div className="card">
                        <div className="header">Register</div>
                        <form onSubmit={handleRegister} className="register_form" encType="multipart/form-data">
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
                            <select
                                className="input_field"
                                id="gender_select"
                                name="gender"
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                                required
                            >
                                <option value="" disabled>Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select><br />
                            <label className="label" htmlFor="image_file">Select Image</label><br />
                            <input
                                type="file"
                                id="image_file"
                                name="filename"
                                style={{ display: 'none' }}
                                accept=".jpg, .png, .jpeg"
                                required
                                onChange={handleFileChange}
                            />
                            {/* <button
                                type="button"
                                className="label"
                                onClick={() => document.getElementById('image_file').click()}
                            >
                                Choose File
                            </button><br /> */}
                            {file && <p>Selected File: {file.name}</p>}
                            <input
                                className="submit_button"
                                type="submit"
                                value="Register"
                            /><br />
                            <h5>{msg}</h5>
                            <div className="register_link">
                                Already have an Account? <Link to="/signin" className="black">Sign In</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;

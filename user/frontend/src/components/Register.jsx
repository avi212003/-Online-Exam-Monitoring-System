import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/register.css'; // Ensure to import your CSS file

const Register = () => {
    // const [firstname, setFirstname] = useState('');
    // const [lastname, setLastname] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [gender, setGender] = useState('');
    const [file, setFile] = useState(null);
    const [msg, setMsg] = useState('');
    const [errors, setErrors] = useState({ username: '', password: '' });
    const navigate = useNavigate();

    const toggleShowPassword = () => setShowPassword(!showPassword);

    // Helper functions for validation
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password) => {
        const minLength = /.{8,}/;
        const containsSpecial = /[!@#$%^&*(),.?":{}|<>]/;
        const containsNumber = /[0-9]/;
        const containsLetter = /[A-Za-z]/;
        return (
            minLength.test(password) &&
            containsSpecial.test(password) &&
            containsNumber.test(password) &&
            containsLetter.test(password)
        );
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        let formIsValid = true;

        // Reset errors
        setErrors({ username: '', password: '' });

        // Validate username
        if (!validateEmail(username)) {
            setErrors(prevErrors => ({ ...prevErrors, username: 'Please enter a valid email address.' }));
            formIsValid = false;
        }

        // Validate password
        if (!validatePassword(password)) {
            setErrors(prevErrors => ({
                ...prevErrors,
                password: 'Password must be at least 8 characters long, contain a letter, a number, and a special character.',
            }));
            formIsValid = false;
        }

        // If form is not valid, do not proceed with submission
        if (!formIsValid) return;

        const formData = new FormData();
        formData.append('Username', username);
        formData.append('psw', password);
        formData.append('gender', gender);
        // formData.append('Firstname', firstname);
        // formData.append('Lastname', lastname);
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
                        
                        <form onSubmit={handleRegister} className="register_form" encType="multipart/form-data">
                        <div className="registerr">Register</div>
                            {/* <input
                                className="input_field"
                                type="text"
                                id="Firstname"
                                name="Firstname"
                                placeholder="First Name"
                                value={firstname}
                                onChange={(e) => setFirstname(e.target.value)}
                                required
                            /><br />
                            <input
                                className="input_field"
                                type="text"
                                id="Lastname"
                                name="Lastname"
                                placeholder="Last Name"
                                value={lastname}
                                onChange={(e) => setLastname(e.target.value)}
                                required
                            /><br /> */}
                            <input
                                className="input_field"
                                type="text"
                                id="Username"
                                name="Username"
                                placeholder="Username (Email)"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            /><br />
                            {errors.username && <p style={{ color: 'red' }}>{errors.username}</p>}
                            <div className="register-password-container">
                                <input
                                    className="input_field"
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="psw"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <span onClick={toggleShowPassword} className="register-eye-icon">
                                    {showPassword ? '🙈' : '👁️'} {/* Eye icon, replace with FontAwesome if desired */}
                                </span>
                            </div>
                            {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}
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
                            {file && <p style={{ color: "black" }}>Selected File: {file.name}</p>}
                            <input
                                className="submit_button"
                                type="submit"
                                value="Register"
                            /><br />
                            <h5 style={{ color: "black" }}>{msg}</h5>
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

import React, { useState } from 'react';
import '../styles/Signin.css'; 
import login_illustration from '../assets/login_illustration.svg';

function SignIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    
    // Here you can handle the login logic
    if (username && password) {
      setMsg('Login successful!'); // Set success message
      // You would typically send a request to your backend here
    } else {
      setMsg('Please fill in all fields.');
    }
  };

  return (
    <div className="container">
      <div className="row">
        <form onSubmit={handleSubmit} className="login_form">
          <div className="header">Sign In</div>
          <input
            className="input_field"
            type="text"
            id="username"
            name="username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <br />
          <input
            className="input_field"
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <br />
          <input className="submit_button" type="submit" value="Login" />
          <br />
          <br />
          {/* Display the message */}
          <h5>{msg}</h5>
        </form>
        <div className="register_link">
          Don't have an account? <a href="/" className="black">Register</a>
        </div>
      </div>
      <div className="row login_left">
        <img
          className="login_left_image"
          src={login_illustration}
          alt="Login Illustration"
        />
      </div>
    </div>
  );
}

export default SignIn;

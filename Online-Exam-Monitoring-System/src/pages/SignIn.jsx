import React, { useState } from 'react';
import '../styles/style.css'; 
import login_illustration from "../assets/login_illustration.svg"
// Make sure your CSS is imported
//import React, {usestate} from 'react';
//const [state,setState]=usestate(initialValue);

function SignIn() {
  const [username,setUsername]=useState('');
  const [password,setPassword]=useState('');
  // State to manage the login message
  const [msg, setMsg] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // You can handle form submission here. Example:
    const formData = new FormData(event.target);
    const username = formData.get('username');
    const password = formData.get('password');

    // Here you would send the form data to your backend using fetch or axios.
    // Assuming a successful login, you could set a success/failure message in the state:
    setMsg('Login successful!'); // Set the message here based on the response.
  };

  return (
    <div className="container">
      <div className="row">
        <form onSubmit={handleSubmit} className="login_form">
          <div className="header">Sign In</div>
          <input
            className="input_field"
            type="text"
            id="Username"
            name="Username"
            placeholder="Username"
            required
          />
          <br />
          <input
            className="input_field"
            type="password"
            id="password"
            name="psw"
            placeholder="Password"
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
          New to A-EYE? <a href="/" className="black">Register</a>
        </div>
      </div>
      <div className="row login_left">
        <img
          className="login_left_image"
          src = {login_illustration}
          alt="Login Illustration"
        />
      </div>
    </div>
  );
}

export default SignIn;

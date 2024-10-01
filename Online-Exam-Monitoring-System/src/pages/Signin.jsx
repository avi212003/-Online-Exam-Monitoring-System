import { useState } from 'react'
import './Signin.css'
import register from '../assets/SignIn.png'

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (event) => {
    const { name, value, type, files } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'file' ? files[0] : value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(formData);
  };

  return (
    <div className="container">
      <div className="register_right">
        <div className='content'>
          <img className="register_image" src={register} alt="Register Illustration" />
          <div className='card'>
            <div className="header">SignIn</div>
            <form onSubmit={handleSubmit} className="register_form">
              {/* <div className="header">Register</div> */}
              <input
                className="input_field"
                type="text"
                id="Username"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
              /><br />
              <input
                className="input_field"
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              /><br />
              <input
                className="submit_button"
                type="submit"
                value="Sign In"
              />
              <br />
              <div className="register_link">
                Don't have an account? <a href="/login" className="sign_in_instead">Register</a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
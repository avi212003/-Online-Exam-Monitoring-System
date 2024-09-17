import { useState } from 'react'
import '../styles/Auth.css'; 
import registerIllustration from '../assets/register_illustration.png'

function App() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    gender: '',
    file: null,
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
      <div className="row register_left">
        <img className="register_left_image" src={registerIllustration} alt="Register Illustration" />
        <div className="text_header">A-EYE</div>
        <div className="text">
          A-EYE is an AI-based proctoring system. It is capable of recognizing candidates by their name,
          detecting their mobile phones and head position, and raises an alert message if any malpractice is observed.
        </div>
      </div>
      <div className="row register_right">
        <form onSubmit={handleSubmit} className="register_form">
          <div className="header">Register</div>
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
          <select
            className="input_field"
            id="gender_select"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
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
            name="file"
            style={{ display: 'none' }}
            accept=".jpg, .png, .jpeg"
            onChange={handleChange}
            required
          />
          <input
            className="submit_button"
            type="submit"
            value="Register"
          /><br />
          <div className="register_link">
            Already have an Account? <a href="/login" className="black">Sign In</a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
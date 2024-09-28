import { useState } from 'react'
import './register.css'
import register from '../../assets/register.png'

function Register() {
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
      <div className="register_right">
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
            Already have an account? <a href="/login" className="sign_in_instead">Sign In</a>
          </div>
        </form>
        <img className="register_image" src={register} alt="Register Illustration" />
      </div>
    </div>
  );
}

export default Register;
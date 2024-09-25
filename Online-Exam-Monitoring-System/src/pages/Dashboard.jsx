import React from 'react';
import './style.css'; // Assuming your styles are here
import registerIllustration from '../static/register_illustration.png';
import studentImage from '../static/student_image.png';
import dashboardIllustration from '../static/dashboard_illustration.png';

const Dashboard = () => {
  const name = "John Doe"; // You can replace this with dynamic data from props or state

  return (
    <div className="container">
      <div className="dash_row dashboard_left">
        <img className="dash_top_left_img" src={registerIllustration} alt="Register Illustration" />
        <div className="student_info">
          <img className="student_image" src={studentImage} alt="Student" />
          <div className="student_name">{name}</div>
        </div>
        <div className="dash_image_div">
          <img className="dash_image" src={dashboardIllustration} alt="Dashboard Illustration" />
        </div>
      </div>

      <div className="dash_row dashboard_right">
        <div className="dash_head">
          <div className="dash_header">Practice Tests</div>
          <button className="log_out">
            <a href="/login">Log Out</a>
          </button>
        </div>
        <div className="dash_body">
          <form action="/student_profile" method="post">
            <input className="take_test_button" type="submit" value="Take a demo test" />
          </form>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

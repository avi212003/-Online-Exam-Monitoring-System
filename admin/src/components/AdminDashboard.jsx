// admin/components/AdminDashboard.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      <p>Welcome, Admin! You can manage exams and users from here.</p>
      <Link to="/create-exam">Create Exam</Link>
    </div>
  );
};

export default AdminDashboard;

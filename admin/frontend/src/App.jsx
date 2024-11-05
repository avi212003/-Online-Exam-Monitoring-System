// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminRegister from './components/AdminRegister';
import AdminSignIn from './components/AdminSignIn';
import AdminDashboard from './components/AdminDashboard';
import { AuthProvider } from './context/AuthContext';
import './styles/global.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Default Route */}
          <Route path="/" element={<Navigate to="/register" />} />
          
          {/* Admin Registration Route */}
          <Route path="/register" element={<AdminRegister />} />

          {/* Admin Sign-In Route */}
          <Route path="/signin" element={<AdminSignIn />} />

          {/* Admin Dashboard Route */}
          <Route path="/dashboard" element={<AdminDashboard />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

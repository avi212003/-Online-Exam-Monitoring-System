import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom'; // Import Navigate
import AdminSignIn from './components/AdminSignIn';
import AdminRegister from './components/AdminRegister';
import AdminDashboard from './components/AdminDashboard';
import ExamForm from './components/ExamForm';
import { AuthProvider } from './contexts/AuthContext';

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/register" />} /> {/* Redirect to login if no route matches */}
        <Route path="/login" element={<AdminSignIn />} />
        <Route path="/register" element={<AdminRegister />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/create-exam" element={<ExamForm />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;

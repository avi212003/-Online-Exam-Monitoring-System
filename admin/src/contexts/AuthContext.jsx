// admin/src/contexts/AuthContext.jsx

import React, { createContext, useState, useEffect } from 'react';
import axios from '../config/axios';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({ isAuthenticated: false, user: null });
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('/auth/verify');
          setAuthState({
            isAuthenticated: true,
            user: response.data.user,
          });
        } catch (error) {
          setAuthState({ isAuthenticated: false, user: null });
        }
      }
    };
    checkAuth();
  }, []);

  const login = (user) => {
    setAuthState({ isAuthenticated: true, user });
    localStorage.setItem('token', user.token);
    navigate('/dashboard');
  };

  const logout = () => {
    setAuthState({ isAuthenticated: false, user: null });
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider };

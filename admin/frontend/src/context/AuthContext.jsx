import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const initialToken = localStorage.getItem('token');
  const initialUsername = localStorage.getItem('username');
  const [auth, setAuth] = useState(initialToken);
  const [username, setUsername] = useState(initialUsername);

  const login = (token, username) => {
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    setAuth(token);
    setUsername(username);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setAuth(null);
    setUsername(null);
  };

  return (
    <AuthContext.Provider value={{ auth, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

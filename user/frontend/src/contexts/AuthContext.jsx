// frontend/src/contexts/AuthContext.jsx

import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState(null);
    const [userDetails, setUserDetails] = useState(null); // 🔄 Add state for user details
    const [loading, setLoading] = useState(true); // 🔄 Add loading state

    // Check localStorage for token and user details on app load
    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUsername = localStorage.getItem('username');
        const storedUserDetails = localStorage.getItem('userDetails');

        if (token && storedUsername && storedUserDetails) {
            setIsAuthenticated(true);
            setUsername(storedUsername);
            setUserDetails(JSON.parse(storedUserDetails)); // Parse user details
        }
        setLoading(false); // 🔄 Set loading to false after check
    }, []);

    const login = (token, user) => {
        const { username, firstname, lastname, gender, exams } = user;

        // Save token and user details to localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('username', username);
        localStorage.setItem('userDetails', JSON.stringify({ firstname, lastname, gender, exams }));

        setIsAuthenticated(true);
        setUsername(username);
        setUserDetails({ firstname, lastname, gender, exams }); // Set user details in state
    };

    const logout = () => {
        // Remove all stored data from localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('userDetails');

        setIsAuthenticated(false);
        setUsername(null);
        setUserDetails(null); // Clear user details from state
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, username, userDetails, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

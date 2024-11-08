import React, { useContext } from 'react';
import { Route, Routes } from 'react-router-dom';
import { AuthContext, AuthProvider } from './contexts/AuthContext';
import TestPage from './components/TestPage';
import './styles/testpage.css';

const App = () => {
  // Use the context inside the App, as the provider is now wrapping everything
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <Routes>
      <Route
        path="/"
        element={isAuthenticated ? <TestPage /> : <div>Please sign in</div>}
      />
    </Routes>
  );
};

// Wrap App with AuthProvider so that the context is available to all components
export default () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);

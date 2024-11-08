import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
//import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import UserFormPage from './pages/Main';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
      	<Route path="/" element={<UserFormPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /> </ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;


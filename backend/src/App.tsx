import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Hero from './components/Hero';
import Features from './components/Features';
import Team from './components/Team';
import Feedback from './components/Feedback';
import PageTransition from './components/PageTransition';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import Dashboard from './components/dashboard/Dashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={
            <div className="min-h-screen bg-[#2A0944]">
              <PageTransition backgroundColor="#9336B4">
                <Hero />
              </PageTransition>
              
              <PageTransition backgroundColor="#3B0B5F">
                <Features />
              </PageTransition>
              
              <PageTransition backgroundColor="#2A0944">
                <Team />
              </PageTransition>
              
              <PageTransition backgroundColor="#3B0B5F">
                <Feedback />
              </PageTransition>
            </div>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route 
            path="/dashboard/*" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
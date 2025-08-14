import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { PlayerProvider } from './context/PlayerContext';
import { AppProvider } from './context/AppContext';
import HomePage from './components/pages/HomePage';
import LoginPage from './components/auth/LoginPage';
import DashboardPage from './components/dashboard/DashboardPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Notification from './components/common/Notification';
import './styles/themes.css';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <PlayerProvider>
          <AppProvider>
            <Router>
              <div className="App">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route
                    path="/dashboard/*"
                    element={
                      <ProtectedRoute>
                        <DashboardPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
                <Notification />
              </div>
            </Router>
          </AppProvider>
        </PlayerProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

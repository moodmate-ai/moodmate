import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';

import { GoogleOAuthProvider } from '@react-oauth/google';
import './App.css';

import { Layout } from './components/Layout';

import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import CalendarPage from './components/CalendarPage';
import DiaryPage from './components/DiaryPage';
import HistoryPage from './components/HistoryPage';
import ChatPage from './components/ChatPage';
import LandingPage from './components/LandingPage';
import ProfilePage from './components/ProfilePage';
import MainPage from './components/MainPage';

import { AuthProvider, useAuth } from './contexts/AuthContext';

function AppContent() {
  const { currentUser, isLoading, googleLogin, logout, updateUserProfile } = useAuth();
  const [theme, setTheme] = useState('light');
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleThemeChange = (newTheme: string) => setTheme(newTheme);

  const handleGoogleAuth = async (jwt: string) => {
    try {
      await googleLogin(jwt);
      navigate('/dashboard');
    } catch (error) {
      console.error('Authentication failed:', error);
      alert('로그인에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="loading-container" style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px'
      }}>
        로딩 중...
      </div>
    );
  }

  // Convert AuthUser to legacy User format for compatibility
  const user = currentUser ? {
    isLoggedIn: true,
    name: currentUser.name || '',
    profileImage: currentUser.profileImage || 'https://via.placeholder.com/150',
    email: currentUser.email,
    role: currentUser.role,
    userId: currentUser.userId,
    username: currentUser.username
  } : {
    isLoggedIn: false,
    name: '',
    profileImage: '',
    email: '',
    role: 'USER' as const,
    userId: 0,
    username: ''
  };

  return (
    <Routes>
      <Route path="/" element={user.isLoggedIn ? <Layout user={user} onLogout={handleLogout}><MainPage user={user} /></Layout> : <LandingPage />} />
      <Route path="/dashboard" element={user.isLoggedIn ? <Layout user={user} onLogout={handleLogout}><MainPage user={user} /></Layout> : <Navigate to="/login" replace />} />
      <Route path="/calendar" element={user.isLoggedIn ? <Layout user={user} onLogout={handleLogout}><CalendarPage isLoggedIn={true} userName={user.name || ''} onLogin={() => {}} onLogout={handleLogout} /></Layout> : <Navigate to="/login" replace />} />
      <Route path="/diary" element={user.isLoggedIn ? <Layout user={user} onLogout={handleLogout}><DiaryPage isLoggedIn={true} userName={user.name || ''} onLogin={() => {}} onLogout={handleLogout} /></Layout> : <Navigate to="/login" replace />} />
      <Route path="/chats" element={user.isLoggedIn ? <Layout user={user} onLogout={handleLogout}><ChatPage /></Layout> : <Navigate to="/login" replace />} />
      <Route path="/history" element={user.isLoggedIn ? <Layout user={user} onLogout={handleLogout}><HistoryPage /></Layout> : <Navigate to="/login" replace />} />
      <Route path="/login" element={!user.isLoggedIn ? <LoginPage onGoogleLogin={handleGoogleAuth} /> : <Navigate to="/dashboard" replace />} />
      <Route path="/signup" element={!user.isLoggedIn ? <SignupPage onGoogleSignup={handleGoogleAuth} /> : <Navigate to="/dashboard" replace />} />
      <Route path="/profile" element={user.isLoggedIn ? <Layout user={user} onLogout={handleLogout}><ProfilePage userName={user.name || ''} profileImage={user.profileImage || ''} onUpdateProfile={updateUserProfile} onThemeChange={handleThemeChange} /></Layout> : <Navigate to="/login" replace />} />
    </Routes>
  );
}

function AppWrapper() {
  return (
    <GoogleOAuthProvider clientId="915916980733-lvdt868sgdsre814er46fl3v3a5jkthn.apps.googleusercontent.com">
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;

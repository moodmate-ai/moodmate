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
import { googleLoginService, googleSignupService, logoutService } from './services/login';

import { AuthProvider } from './contexts/AuthContext';
import { DiaryProvider } from './contexts/DiaryContext';
import { User } from './types/User';

function AppWrapper() {
  const [user, setUser] = useState<User>({
    isLoggedIn: false,
    name: '홍길동',
    profileImage: 'https://via.placeholder.com/150',
    email: 'test@test.com',
    role: 'USER'
  });

  const [theme, setTheme] = useState('light');
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleThemeChange = (newTheme: string) => setTheme(newTheme);

  const handleGoogleLogin = (jwt: string) => {
    setUser(googleLoginService(jwt));
  };

  const handleGoogleSignup = (jwt: string) => {
    setUser(googleSignupService(jwt));
  };

  const handleLogout = () => {
    setUser({ isLoggedIn: false, name: '', email: '', role: '' });
    navigate('/');
  };

  const handleUpdateProfile = (name: string, profileImage: string) => {
    setUser(prev => ({ ...prev, name, profileImage }));
  };

  return (
    <GoogleOAuthProvider clientId="915916980733-lvdt868sgdsre814er46fl3v3a5jkthn.apps.googleusercontent.com">
      <AuthProvider>
        <DiaryProvider>
          <Routes>
            <Route path="/" element={user.isLoggedIn ? <Layout user={user} onLogout={handleLogout}><MainPage user={user} /></Layout> : <LandingPage />} />
            <Route path="/dashboard" element={user.isLoggedIn ? <Layout user={user} onLogout={handleLogout}><MainPage user={user} /></Layout> : <Navigate to="/login" replace />} />
            <Route path="/calendar" element={user.isLoggedIn ? <Layout user={user} onLogout={handleLogout}><CalendarPage isLoggedIn={true} userName={user.name || ''} onLogin={() => {}} onLogout={handleLogout} /></Layout> : <Navigate to="/login" replace />} />
            <Route path="/diary" element={user.isLoggedIn ? <Layout user={user} onLogout={handleLogout}><DiaryPage isLoggedIn={true} userName={user.name || ''} onLogin={() => {}} onLogout={handleLogout} /></Layout> : <Navigate to="/login" replace />} />
            <Route path="/chats" element={user.isLoggedIn ? <Layout user={user} onLogout={handleLogout}><ChatPage /></Layout> : <Navigate to="/login" replace />} />
            <Route path="/history" element={user.isLoggedIn ? <Layout user={user} onLogout={handleLogout}><HistoryPage /></Layout> : <Navigate to="/login" replace />} />
            <Route path="/login" element={!user.isLoggedIn ? <LoginPage onGoogleLogin={handleGoogleLogin} /> : <Navigate to="/dashboard" replace />} />
            <Route path="/signup" element={!user.isLoggedIn ? <SignupPage onGoogleSignup={handleGoogleSignup} /> : <Navigate to="/dashboard" replace />} />
            <Route path="/profile" element={<Layout user={user} onLogout={handleLogout}><ProfilePage userName={user.name || ''} profileImage={user.profileImage || ''} onUpdateProfile={handleUpdateProfile} onThemeChange={handleThemeChange} /></Layout>} />
          </Routes>
        </DiaryProvider>
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

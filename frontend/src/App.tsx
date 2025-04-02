import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { 
  BarChart2, Calendar, BookOpen, MessageCircle, 
  Clock, Settings, LogOut
} from 'lucide-react';
import './App.css';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import CalendarPage from './components/CalendarPage';
import DiaryPage from './components/DiaryPage';
import AnalysisPage from './components/AnalysisPage';
import ChatPage from './components/ChatPage';
import HistoryPage from './components/HistoryPage';
import SettingsPage from './components/SettingsPage';
import DashboardPage from './components/DashboardPage';

interface User {
  isLoggedIn: boolean;
  name?: string;
  profileImage?: string;
}

// 메인 페이지 컴포넌트
const MainPage: React.FC = () => {
  return (
    <main className="main-content">
      <div className="welcome-section">
        <h1 className="welcome-title">WELCOME</h1>
        <p className="welcome-subtitle">
          Unleash the Power of Your Words.<br />
          Discover the Depths of Your Emotions.
        </p>
      </div>
      
      <div className="background-image">
        {/* 배경 이미지는 CSS에서 처리 */}
      </div>
    </main>
  );
};

// 아직 구현되지 않은 페이지를 위한 임시 컴포넌트
const ComingSoonPage: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div className="coming-soon-container">
      <h1>{title}</h1>
      <p>This feature is coming soon. Stay tuned!</p>
    </div>
  );
};

// Layout 컴포넌트
const Layout: React.FC<{
  children: React.ReactNode;
  user: User;
  onLogout: () => void;
}> = ({ children, user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { 
      name: 'Dashboard', 
      icon: <BarChart2 size={24} />, 
      path: '/',
      label: 'Dashboard'
    },
    { 
      name: '달력', 
      icon: <Calendar size={24} />, 
      path: '/calendar',
      label: '달력'
    },
    { 
      name: '일기', 
      icon: <BookOpen size={24} />, 
      path: '/diary',
      label: '일기'
    },
    { 
      name: '채팅', 
      icon: <MessageCircle size={24} />, 
      path: '/chats',
      label: '채팅'
    },
    { 
      name: '기록', 
      icon: <Clock size={24} />, 
      path: '/history',
      label: '기록'
    },
    { 
      name: '분석', 
      icon: <BarChart2 size={24} />, 
      path: '/analysis',
      label: '분석'
    },
    { 
      name: 'Settings', 
      icon: <Settings size={24} />, 
      path: '/settings',
      label: 'Settings'
    },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="app-layout">
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <img src="/logo.png" alt="MoodMate Logo" className="logo-image" />
            <h1 className="logo-text">mood<br />mate</h1>
          </div>
          {user.isLoggedIn && (
            <div className="sidebar-profile">
              <img 
                src={user.profileImage || "/default-profile.png"} 
                alt="프로필" 
                className="profile-image"
              />
              <span className="profile-name">{user.name}</span>
            </div>
          )}
        </div>

        <nav className="sidebar-menu">
          <ul>
            {menuItems.map((item, index) => (
              <li key={index}>
                <button 
                  className={`menu-item ${isActive(item.path) ? 'active' : ''}`}
                  onClick={() => navigate(item.path)}
                >
                  <span className="item-icon">{item.icon}</span>
                  <span className="item-label">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-button" onClick={onLogout}>
            <LogOut size={20} />
            <span>Log out</span>
          </button>
        </div>
      </div>
      
      <div className="main-container">
        {children}
      </div>
    </div>
  );
};

function AppWrapper() {
  const [user, setUser] = useState<User>({ isLoggedIn: false });

  const handleLogin = (username: string, password: string) => {
    setUser({
      isLoggedIn: true,
      name: username || '사용자',
      profileImage: 'https://via.placeholder.com/40'
    });
  };

  const handleGoogleLogin = () => {
    console.log('구글 로그인 시도');
  };

  const handleSignup = (name: string, username: string, password: string, confirmPassword: string) => {
    console.log('회원가입 시도:', { name, username, password, confirmPassword });
    setUser({
      isLoggedIn: true,
      name: name,
      profileImage: 'https://via.placeholder.com/40'
    });
  };

  const handleGoogleSignup = () => {
    console.log('구글 회원가입 시도');
  };

  const handleLogout = () => {
    setUser({ isLoggedIn: false });
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Layout user={user} onLogout={handleLogout}>
              <MainPage />
            </Layout>
          }
        />
        <Route
          path="/login"
          element={
            user.isLoggedIn ? 
            <Navigate to="/" /> :
            <LoginPage
              onLogin={handleLogin}
              onGoogleLogin={handleGoogleLogin}
              onSignupClick={() => window.location.href = '/signup'}
            />
          }
        />
        <Route
          path="/signup"
          element={
            user.isLoggedIn ? 
            <Navigate to="/" /> :
            <SignupPage
              onSignup={handleSignup}
              onGoogleSignup={handleGoogleSignup}
            />
          }
        />
        <Route
          path="/calendar"
          element={
            <Layout user={user} onLogout={handleLogout}>
              <CalendarPage
                isLoggedIn={user.isLoggedIn}
                userName={user.name || ''}
                onLogin={() => {}}
                onLogout={handleLogout}
              />
            </Layout>
          }
        />
        <Route
          path="/diary"
          element={
            <Layout user={user} onLogout={handleLogout}>
              <DiaryPage
                isLoggedIn={user.isLoggedIn}
                userName={user.name || ''}
                onLogin={() => {}}
                onLogout={handleLogout}
              />
            </Layout>
          }
        />
        <Route
          path="/analysis"
          element={
            <Layout user={user} onLogout={handleLogout}>
              <AnalysisPage />
            </Layout>
          }
        />
        <Route
          path="/dashboard"
          element={
            <Layout user={user} onLogout={handleLogout}>
              <ComingSoonPage title="Dashboard" />
            </Layout>
          }
        />
        <Route
          path="/chats"
          element={
            <Layout user={user} onLogout={handleLogout}>
              <ComingSoonPage title="Chats" />
            </Layout>
          }
        />
        <Route
          path="/history"
          element={
            <Layout user={user} onLogout={handleLogout}>
              <ComingSoonPage title="History" />
            </Layout>
          }
        />
        <Route
          path="/settings"
          element={
            <Layout user={user} onLogout={handleLogout}>
              <ComingSoonPage title="Settings" />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default AppWrapper;
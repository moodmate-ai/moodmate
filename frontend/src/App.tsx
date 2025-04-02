import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { 
  BarChart2, Calendar, BookOpen, MessageCircle, 
  Clock, Settings, LogOut, User, Home, Smile
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
      name: '대시보드', 
      icon: <BarChart2 size={24} />, 
      path: '/',
      label: '대시보드'
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
      name: '설정', 
      icon: <Settings size={24} />, 
      path: '/settings',
      label: '설정'
    }
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="app-layout">
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="logo-container">
            <img src="/logo.png" alt="MoodMate Logo" className="logo-image" />
          </div>
        </div>
        <div className="user-profile">
          <img src={user?.profileImage || '/default-profile.png'} alt="Profile" className="profile-image" />
          <span className="user-name">{user?.name || '사용자'}</span>
        </div>
        <div className="sidebar-menu">
          {menuItems.map((item) => (
            <button
              key={item.name}
              className={`menu-item ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              {item.icon}
              <span className="item-label">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="logout-container">
        <button className="logout-button" onClick={onLogout}>
          <LogOut className="item-icon" />
          <span>로그아웃</span>
        </button>
      </div>
      <div className="content">
        {children}
      </div>
    </div>
  );
};

function AppWrapper() {
  const [user, setUser] = useState<User>({
    isLoggedIn: false,
    name: '홍길동',
    profileImage: 'https://via.placeholder.com/150'
  });

  const handleLogin = (username: string, password: string) => {
    // 실제 로그인 로직은 여기에 구현
    setUser({
      isLoggedIn: true,
      name: '홍길동',
      profileImage: 'https://via.placeholder.com/150'
    });
  };

  const handleGoogleLogin = () => {
    // Google 로그인 로직 구현
    setUser({
      isLoggedIn: true,
      name: '홍길동',
      profileImage: 'https://via.placeholder.com/150'
    });
  };

  const handleSignup = (name: string, username: string, password: string, confirmPassword: string) => {
    // 회원가입 로직 구현
    setUser({
      isLoggedIn: true,
      name: name,
      profileImage: 'https://via.placeholder.com/150'
    });
  };

  const handleGoogleSignup = () => {
    // Google 회원가입 로직 구현
    setUser({
      isLoggedIn: true,
      name: '홍길동',
      profileImage: 'https://via.placeholder.com/150'
    });
  };

  const handleLogout = () => {
    setUser({
      isLoggedIn: false
    });
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          user.isLoggedIn ? (
            <Layout user={user} onLogout={handleLogout}>
              <MainPage />
            </Layout>
          ) : (
            <Navigate to="/login" replace />
          )
        } />
        <Route path="/calendar" element={
          user.isLoggedIn ? (
            <Layout user={user} onLogout={handleLogout}>
              <CalendarPage />
            </Layout>
          ) : (
            <Navigate to="/login" replace />
          )
        } />
        <Route path="/diary" element={
          user.isLoggedIn ? (
            <Layout user={user} onLogout={handleLogout}>
              <DiaryPage />
            </Layout>
          ) : (
            <Navigate to="/login" replace />
          )
        } />
        <Route path="/analysis" element={
          user.isLoggedIn ? (
            <Layout user={user} onLogout={handleLogout}>
              <AnalysisPage />
            </Layout>
          ) : (
            <Navigate to="/login" replace />
          )
        } />
        <Route path="/chats" element={
          user.isLoggedIn ? (
            <Layout user={user} onLogout={handleLogout}>
              <ComingSoonPage title="Chat" />
            </Layout>
          ) : (
            <Navigate to="/login" replace />
          )
        } />
        <Route path="/history" element={
          user.isLoggedIn ? (
            <Layout user={user} onLogout={handleLogout}>
              <ComingSoonPage title="History" />
            </Layout>
          ) : (
            <Navigate to="/login" replace />
          )
        } />
        <Route path="/settings" element={
          user.isLoggedIn ? (
            <Layout user={user} onLogout={handleLogout}>
              <ComingSoonPage title="Settings" />
            </Layout>
          ) : (
            <Navigate to="/login" replace />
          )
        } />
        <Route path="/login" element={
          user.isLoggedIn ? (
            <Navigate to="/" replace />
          ) : (
            <LoginPage onLogin={handleLogin} onGoogleLogin={handleGoogleLogin} />
          )
        } />
        <Route path="/signup" element={
          user.isLoggedIn ? (
            <Navigate to="/" replace />
          ) : (
            <SignupPage onSignup={handleSignup} onGoogleSignup={handleGoogleSignup} />
          )
        } />
      </Routes>
    </Router>
  );
}

export default AppWrapper;
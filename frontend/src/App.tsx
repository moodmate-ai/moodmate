import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { 
  BarChart2, Calendar, BookOpen, MessageCircle, 
  Clock, LogOut 
} from 'lucide-react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './App.css';

import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import CalendarPage from './components/CalendarPage';
import DiaryPage from './components/DiaryPage';
import HistoryPage from './components/HistoryPage';
import ChatPage from './components/ChatPage';
import LandingPage from './components/LandingPage';
import DashboardPage from './components/DashboardPage';
import ProfilePage from './components/ProfilePage';

import { AuthProvider } from './contexts/AuthContext';
import { DiaryProvider } from './contexts/DiaryContext';

interface User {
  isLoggedIn: boolean;
  name?: string;
  profileImage?: string;
}


const MainPage: React.FC<{ user: User }> = ({ user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'dashboard');

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardPage userName={user.name || '사용자'} profileImage={user.profileImage} />;
      case 'chat':
        return <ChatPage />;
      case 'calendar':
        return <CalendarPage isLoggedIn={true} userName={user.name || ''} onLogin={() => {}} onLogout={() => {}} />;
      case 'diary':
        return <DiaryPage isLoggedIn={true} userName={user.name || ''} onLogin={() => {}} onLogout={() => {}} />;
      default:
        return (
          <div className="welcome-section">
            <h1 className="welcome-title">WELCOME</h1>
            <p className="welcome-subtitle">
              Unleash the Power of Your Words.<br />
              Discover the Depths of Your Emotions.
            </p>
          </div>
        );
    }
  };

  return (
    <main className="main-content">
      {renderContent()}
    </main>
  );
};


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
    { name: '대시보드', icon: <BarChart2 size={24} />, path: '/dashboard', label: '대시보드' },
    { name: '일기', icon: <BookOpen size={24} />, path: '/diary', label: '일기' },
    { name: '채팅', icon: <MessageCircle size={24} />, path: '/chats', label: '채팅' },
    { name: '달력', icon: <Calendar size={24} />, path: '/calendar', label: '달력' },
    { name: '기록', icon: <Clock size={24} />, path: '/history', label: '기록' }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="app-layout">
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="logo-container">
            <img src="/moodmate.png" alt="MoodMate Logo" className="logo-image" />
          </div>
        </div>
        <div className="user-profile" onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }}>
          <div className="profile-image-container">
            <img src={user?.profileImage || '/default-profile.png'} alt="Profile" className="profile-image" />
          </div>
          <span className="profile-name">{user?.name || '사용자'}</span>
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

  const [theme, setTheme] = useState('light');
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleThemeChange = (newTheme: string) => setTheme(newTheme);

  const handleLogin = (username: string, password: string) => {
    setUser({ isLoggedIn: true, name: '홍길동', profileImage: 'https://via.placeholder.com/150' });
  };

  const handleGoogleLogin = () => {
    setUser({ isLoggedIn: true, name: '홍길동', profileImage: 'https://via.placeholder.com/150' });
  };

  const handleSignup = (name: string, username: string, password: string, confirmPassword: string) => {
    setUser({ isLoggedIn: true, name, profileImage: 'https://via.placeholder.com/150' });
  };

  const handleGoogleSignup = () => {
    setUser({ isLoggedIn: true, name: '홍길동', profileImage: 'https://via.placeholder.com/150' });
  };

  const handleLogout = () => {
    setUser({ isLoggedIn: false });
    navigate('/');
  };

  const handleUpdateProfile = (name: string, profileImage: string) => {
    setUser(prev => ({ ...prev, name, profileImage }));
  };

  return (
    <GoogleOAuthProvider clientId="1097095888255-ck0tuobs981gtv02r082a9h8u6f6cf18.apps.googleusercontent.com">
      <AuthProvider>
        <DiaryProvider>
          <Routes>
            <Route path="/" element={user.isLoggedIn ? <Layout user={user} onLogout={handleLogout}><MainPage user={user} /></Layout> : <LandingPage />} />
            <Route path="/dashboard" element={user.isLoggedIn ? <Layout user={user} onLogout={handleLogout}><MainPage user={user} /></Layout> : <Navigate to="/login" replace />} />
            <Route path="/calendar" element={user.isLoggedIn ? <Layout user={user} onLogout={handleLogout}><CalendarPage isLoggedIn={true} userName={user.name || ''} onLogin={() => {}} onLogout={handleLogout} /></Layout> : <Navigate to="/login" replace />} />
            <Route path="/diary" element={user.isLoggedIn ? <Layout user={user} onLogout={handleLogout}><DiaryPage isLoggedIn={true} userName={user.name || ''} onLogin={() => {}} onLogout={handleLogout} /></Layout> : <Navigate to="/login" replace />} />
            <Route path="/chats" element={user.isLoggedIn ? <Layout user={user} onLogout={handleLogout}><ChatPage /></Layout> : <Navigate to="/login" replace />} />
            <Route path="/history" element={user.isLoggedIn ? <Layout user={user} onLogout={handleLogout}><HistoryPage /></Layout> : <Navigate to="/login" replace />} />
            <Route path="/login" element={!user.isLoggedIn ? <LoginPage onLogin={handleLogin} onGoogleLogin={handleGoogleLogin} /> : <Navigate to="/dashboard" replace />} />
            <Route path="/signup" element={!user.isLoggedIn ? <SignupPage onSignup={handleSignup} onGoogleSignup={handleGoogleSignup} /> : <Navigate to="/dashboard" replace />} />
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

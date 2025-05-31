import { 
    BarChart2, Calendar, BookOpen, MessageCircle, 
    Clock, LogOut 
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User } from '../types/User';
import '../App.css';

// Layout 컴포넌트
export const Layout: React.FC<{
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
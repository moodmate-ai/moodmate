import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Calendar, BookOpen, Settings } from 'lucide-react';

const Sidebar: React.FC = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-menu">
        <Link to="/chat" className="menu-item">
          <MessageSquare className="menu-icon" size={20} />
          <span className="menu-text">채팅</span>
        </Link>
        <Link to="/calendar" className="menu-item">
          <Calendar className="menu-icon" size={20} />
          <span className="menu-text">캘린더</span>
        </Link>
        <Link to="/diary" className="menu-item">
          <BookOpen className="menu-icon" size={20} />
          <span className="menu-text">일기</span>
        </Link>
        <Link to="/settings" className="menu-item">
          <Settings className="menu-icon" size={20} />
          <span className="menu-text">설정</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar; 
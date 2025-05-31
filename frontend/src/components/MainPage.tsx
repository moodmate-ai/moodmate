import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';


import ChatPage from './ChatPage';
import DashboardPage from './DashboardPage';
import CalendarPage from './CalendarPage';
import DiaryPage from './DiaryPage';

import '../App.css';

import { User } from '../types/User';

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

export default MainPage;
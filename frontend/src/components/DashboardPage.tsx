import React, { useState, useEffect } from 'react';
import { BarChart2, Calendar, BookOpen, MessageCircle, TrendingUp, Activity, Clock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDiary } from '../contexts/DiaryContext';
import { Diary } from '../types/Diary';
import './DashboardPage.css';

interface DashboardPageProps {
  userName: string;
  profileImage?: string;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ userName, profileImage }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [greeting, setGreeting] = useState('');
  const navigate = useNavigate();
  const { diaries } = useDiary();
  
  // 최근 일기 3개 가져오기
  const recentDiaries = diaries
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  // 감정 통계 데이터 (예시)
  const moodStats = [
    { name: '행복', value: 40, color: '#FBBF24' },
    { name: '보통', value: 30, color: '#A3E635' },
    { name: '불안', value: 15, color: '#60A5FA' },
    { name: '슬픔', value: 10, color: '#818CF8' },
    { name: '화남', value: 5, color: '#F87171' },
  ];

  // 인사말 설정
  useEffect(() => {
    const hour = currentDate.getHours();
    let newGreeting = '';
    
    if (hour < 12) {
      newGreeting = '좋은 아침이에요';
    } else if (hour < 18) {
      newGreeting = '좋은 오후에요';
    } else {
      newGreeting = '좋은 저녁이에요';
    }
    
    setGreeting(newGreeting);
  }, [currentDate]);

  // 날짜 포맷팅
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  // 간략한 날짜 포맷
  const formatShortDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDiaryClick = (diary: Diary) => {
    navigate('/diary', { state: { selectedDate: diary.date } });
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="welcome-panel">
          <h1 className="welcome-title">{greeting}, {userName}님</h1>
          <p className="current-date">{formatDate(currentDate)}</p>
        </div>
        <div className="profile-summary">
          <div className="streak-info">
            <div className="streak-count">7일</div>
            <div className="streak-label">연속 기록</div>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card mood-summary-card">
          <div className="card-header">
            <h2 className="card-title">
              <Activity size={20} />
              감정 요약
            </h2>
            <span className="card-subtitle">이번 달</span>
          </div>
          <div className="mood-stats">
            {moodStats.map((mood) => (
              <div key={mood.name} className="mood-stat-item">
                <div className="mood-bar-label">{mood.name}</div>
                <div className="mood-bar-container">
                  <div 
                    className="mood-bar" 
                    style={{ 
                      width: `${mood.value}%`,
                      backgroundColor: mood.color
                    }}
                  ></div>
                </div>
                <div className="mood-bar-value">{mood.value}%</div>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-card quick-actions-card">
          <div className="card-header">
            <h2 className="card-title">빠른 액션</h2>
          </div>
          <div className="quick-actions">
            <Link to="/diary" className="quick-action-button">
              <BookOpen size={24} />
              <span>일기 쓰기</span>
            </Link>
            <Link to="/calendar" className="quick-action-button">
              <Calendar size={24} />
              <span>캘린더 보기</span>
            </Link>
            <Link to="/chats" className="quick-action-button">
              <MessageCircle size={24} />
              <span>AI와 대화</span>
            </Link>
            <Link to="/history" className="quick-action-button">
              <Clock size={24} />
              <span>기록 확인</span>
            </Link>
          </div>
        </div>

        <div className="dashboard-card recent-entries-card">
          <div className="card-header">
            <h2 className="card-title">
              <BookOpen size={20} />
              최근 일기
            </h2>
            <Link to="/diary" className="view-all-link">전체보기</Link>
          </div>
          <div className="recent-entries">
            {recentDiaries.map((diary) => (
              <div 
                key={diary.id} 
                className="recent-entry"
                onClick={() => handleDiaryClick(diary)}
              >
                <div className="entry-date-mood">
                  <div className="entry-date">{formatShortDate(diary.date)}</div>
                  <div className="entry-mood">{diary.moodEmoji}</div>
                </div>
                <div className="entry-content">
                  {diary.content.length > 100 
                    ? `${diary.content.substring(0, 100)}...` 
                    : diary.content}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-card mood-trend-card">
          <div className="card-header">
            <h2 className="card-title">
              <TrendingUp size={20} />
              감정 추이
            </h2>
            <span className="card-subtitle">최근 7일</span>
          </div>
          <div className="mood-trend">
            <div className="trend-info">
              <div className="trend-value positive">+15%</div>
              <div className="trend-label">긍정적 감정 증가</div>
            </div>
            <div className="trend-chart">
              {/* 차트를 표현할 간단한 시각적 요소 */}
              <div className="trend-bars">
                <div className="trend-bar" style={{ height: '40%' }}></div>
                <div className="trend-bar" style={{ height: '30%' }}></div>
                <div className="trend-bar" style={{ height: '45%' }}></div>
                <div className="trend-bar" style={{ height: '60%' }}></div>
                <div className="trend-bar" style={{ height: '50%' }}></div>
                <div className="trend-bar" style={{ height: '75%' }}></div>
                <div className="trend-bar active" style={{ height: '85%' }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-card insight-card">
          <div className="card-header">
            <h2 className="card-title">
              <Activity size={20} />
              일일 인사이트
            </h2>
          </div>
          <div className="daily-insight">
            <p>
              <span className="insight-emoji">💡</span>
              최근 일주일 동안 운동을 했을 때 행복감이 증가했습니다. 
              오늘도 가벼운 운동을 해보는 건 어떨까요?
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, BarChart2, TrendingUp, Brain, Heart, ChevronLeft, ChevronRight, MessageSquare } from 'lucide-react';
import './DailyAnalysisPage.css';

interface DiaryEntry {
  id: number;
  date: string;
  day: string;
  mood: string;
  moodEmoji: string;
  content: string;
  images: string[];
  growth: number;
}

const DailyAnalysisPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const diary = location.state?.diary as DiaryEntry;
  const [currentDate, setCurrentDate] = useState(diary ? new Date(diary.date) : new Date());

  // 기본 분석 데이터
  const defaultAnalysisData = {
    sentiment: {
      positive: 0,
      neutral: 0,
      negative: 0
    },
    emotions: [
      { name: '기쁨', value: 0 },
      { name: '평온', value: 0 },
      { name: '불안', value: 0 },
      { name: '슬픔', value: 0 },
      { name: '분노', value: 0 }
    ],
    keywords: ['아직', '데이터가', '없습니다'],
    mood: '기록 없음',
    moodEmoji: '📝'
  };

  // 실제 분석 데이터 (diary가 있는 경우)
  const analysisData = diary ? {
    sentiment: {
      positive: 65,
      neutral: 25,
      negative: 10
    },
    emotions: [
      { name: '기쁨', value: 40 },
      { name: '평온', value: 30 },
      { name: '불안', value: 15 },
      { name: '슬픔', value: 10 },
      { name: '분노', value: 5 }
    ],
    keywords: ['행복', '여유', '휴식', '성장', '감사'],
    mood: diary.mood,
    moodEmoji: diary.moodEmoji
  } : defaultAnalysisData;

  // 날짜 포맷팅 함수
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  // 이전 날짜로 이동
  const handlePrevDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  // 다음 날짜로 이동
  const handleNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  // 채팅 페이지로 이동
  const handleChatClick = () => {
    navigate('/', {
      state: {
        activeTab: 'chat',
        date: currentDate.toISOString().split('T')[0],
        mood: diary?.mood || analysisData.mood,
        moodEmoji: diary?.moodEmoji || analysisData.moodEmoji,
        fromAnalysis: true
      }
    });
  };

  return (
    <div className="analysis-page">
      <div className="analysis-header">
        <button className="back-button" onClick={() => navigate('/diary')}>
          <ArrowLeft size={20} />
        </button>
        <h1>감정 분석 리포트</h1>
        
        {/* 날짜 네비게이션 추가 */}
        <div className="date-navigation">
          <button className="date-nav-button" onClick={handlePrevDay}>
            <ChevronLeft size={20} />
          </button>
          <div className="current-date">{formatDate(currentDate)}</div>
          <button className="date-nav-button" onClick={handleNextDay}>
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="analysis-content">
        {/* 감정 요약 */}
        <div className="analysis-card">
          <div className="card-header">
            <Heart size={20} />
            <h2>오늘의 감정</h2>
          </div>
          <div className="mood-summary">
            <div className="mood-emoji">{analysisData.moodEmoji}</div>
            <div className="mood-text">{analysisData.mood}</div>
          </div>
        </div>

        {/* 감정 분포 */}
        <div className="analysis-card">
          <div className="card-header">
            <BarChart2 size={20} />
            <h2>감정 분포</h2>
          </div>
          <div className="sentiment-bars">
            {Object.entries(analysisData.sentiment).map(([key, value]) => (
              <div key={key} className="sentiment-bar">
                <div className="bar-label">{key}</div>
                <div className="bar-container">
                  <div className="bar" style={{ width: `${value}%` }}></div>
                </div>
                <div className="bar-value">{value}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* 세부 감정 분석 */}
        <div className="analysis-card">
          <div className="card-header">
            <Brain size={20} />
            <h2>세부 감정 분석</h2>
          </div>
          <div className="emotion-circles">
            {analysisData.emotions.map((emotion) => (
              <div key={emotion.name} className="emotion-circle">
                <div 
                  className="circle" 
                  style={{ 
                    width: `${emotion.value + 30}px`,
                    height: `${emotion.value + 30}px`
                  }}
                ></div>
                <div className="emotion-label">{emotion.name}</div>
                <div className="emotion-value">{emotion.value}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* 주요 키워드 */}
        <div className="analysis-card">
          <div className="card-header">
            <TrendingUp size={20} />
            <h2>주요 키워드</h2>
          </div>
          <div className="keyword-cloud">
            {analysisData.keywords.map((keyword, index) => (
              <div key={index} className="keyword-tag">
                {keyword}
              </div>
            ))}
          </div>
        </div>

        {/* 채팅하기 버튼 */}
        <div className="chat-button-container">
          <button className="chat-button" onClick={handleChatClick}>
            <MessageSquare size={20} />
            <span>AI와 대화하기</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DailyAnalysisPage; 
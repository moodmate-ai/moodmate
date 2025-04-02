import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Image, BarChart2, Trash2, Edit3, Smile } from 'lucide-react';
import './DiaryPage.css';

interface DiaryPageProps {
  isLoggedIn: boolean;
  userName: string;
  onLogin: () => void;
  onLogout: () => void;
}

const DiaryPage: React.FC<DiaryPageProps> = ({ isLoggedIn, userName, onLogin, onLogout }) => {
  // 상태 관리
  const [currentMonth, setCurrentMonth] = useState(10); // 11월 (0-indexed)
  const [currentYear, setCurrentYear] = useState(2025);
  const [currentMood, setCurrentMood] = useState('neutral');
  
  // 월 이름 배열
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  // 예시 일기 데이터
  const diaryEntries = [
    {
      id: 1,
      date: '2025-11-01',
      day: 'Mon',
      mood: 'neutral',
      moodEmoji: '😌',
      content: '오늘 하루는 맑고 반짝인 시집텨서 기분이 좋았다. 사실에는 따뜻한 차를 마시면서 일했고, 오후에는 산책을 하면서 여유로운 시간을 보냈다. 바쁜 하루도 좋지만, 이렇게 조용히 쉬는 날도 참 소중한 것같다. 가끔은 나를위한 휴식이 삶고 필요의 순간을 즐기는 것이 행복이라는 생각이 들었다.',
      images: [
        '/api/placeholder/200/200',
        '/api/placeholder/200/200',
        '/api/placeholder/200/200'
      ],
      growth: 75
    },
    {
      id: 2,
      date: '2025-11-02',
      day: 'Tue',
      mood: 'happy',
      moodEmoji: '😊',
      content: '아침에 일어나자 날씨가 정말좋을 때, 맑고 푸른 하늘을 보고 기분이 좋았다. 바람도 시원하게 불고, 날씨가 너무 좋았다. 나는 오랫만에 쳇을 정리하며 집을 깨끗하게 만들었다. 나를위한 정성넣어 시간을 보낼 수 있다는 게 정말로 행복했지! 생각도 많았고, 오후에는 짧게 산책도 하며 사랑하는 꽃가게들도 구경했는데, 모두들 반갑게 인사해줘서 마음이 훈훈해졌다. 전체적으로 참 행복한 하루! 꽃의 소소한 향기가 주는 여유로움이 가장 큰 행복인 것 같다.',
      images: [],
      growth: 85
    }
  ];
  
  // 이전 달로 이동
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };
  
  // 다음 달로 이동
  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };
  
  // 감정에 따른 색상 반환
  const getMoodColor = (mood: string) => {
    switch(mood) {
      case 'happy': return 'happy';
      case 'sad': return 'sad';
      case 'angry': return 'angry';
      case 'neutral': return 'neutral';
      case 'anxious': return 'anxious';
      default: return 'neutral';
    }
  };
  
  // 감정 이모티콘 반환
  const getMoodEmoji = (mood: string) => {
    switch(mood) {
      case 'happy': return '😊';
      case 'sad': return '😢';
      case 'angry': return '😠';
      case 'neutral': return '😌';
      case 'anxious': return '😰';
      default: return '😐';
    }
  };
  
  const formatDate = (date: string) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][d.getDay()];
    return `${year}.${month}.${day} ${dayOfWeek}`;
  };
  
  return (
    <main className="diary-content">
      <div className="diary-container">
        {/* 월 네비게이션 */}
        <div className="month-navigation">
          <button 
            onClick={prevMonth}
            className="month-nav-button"
          >
            <ChevronLeft size={24} />
          </button>
          
          <h2 className="current-month">
            {months[currentMonth]} {currentYear}
          </h2>
          
          <button 
            onClick={nextMonth}
            className="month-nav-button"
          >
            <ChevronRight size={24} />
          </button>
        </div>
        
        {/* 새 일기 작성 영역 */}
        <div className="new-diary-card">
          <div className="diary-card-content">
            <div className="diary-card-header">
              <div>
                <div className="mood-icon">
                  <Smile size={28} />
                </div>
                <div>
                  <h3>새 일기 작성하기</h3>
                  <p>오늘의 기분과 생각을 기록해보세요</p>
                </div>
              </div>
              <div className="diary-date">
                {formatDate(new Date().toISOString().split('T')[0])}
              </div>
            </div>
            
            {/* 감정 선택 */}
            <div className="mood-selection">
              <p>오늘의 기분</p>
              <div className="mood-buttons">
                {['happy', 'neutral', 'sad', 'angry', 'anxious'].map((mood) => (
                  <button 
                    key={mood}
                    className={`mood-button ${currentMood === mood ? 'active' : ''} ${getMoodColor(mood)}`}
                    onClick={() => setCurrentMood(mood)}
                  >
                    {getMoodEmoji(mood)}
                  </button>
                ))}
              </div>
            </div>
            
            {/* 일기 입력 */}
            <textarea 
              className={`diary-input ${getMoodColor(currentMood)}`}
              placeholder="오늘 하루는 어땠나요? 생각과 느낌을 자유롭게 적어보세요..."
              rows={6}
            ></textarea>
            
            {/* 기능 버튼 */}
            <div className="diary-actions">
              <div className="action-buttons">
                <button className="action-button">
                  <Image size={20} />
                </button>
              </div>
              <button className="save-button">
                저장하기
              </button>
            </div>
          </div>
        </div>
        
        {/* 기존 일기 목록 */}
        <div className="diary-list">
          {diaryEntries.map((entry) => (
            <div 
              key={entry.id} 
              className={`diary-card ${getMoodColor(entry.mood)}`}
            >
              {/* 일기 헤더 */}
              <div className="diary-card-header">
                <div className="diary-mood">
                  <div className="mood-circle">
                    {getMoodEmoji(entry.mood)}
                  </div>
                  <p>{entry.mood}</p>
                  <div className="diary-date">
                    {formatDate(entry.date)}
                  </div>
                </div>
              </div>
              
              <div className="diary-content">
                <p>{entry.content}</p>
                
                {/* 이미지 갤러리 */}
                {entry.images.length > 0 && (
                  <div className="image-gallery">
                    {entry.images.map((image, index) => (
                      <img 
                        key={index}
                        src={image} 
                        alt={`이미지 ${index + 1}`} 
                      />
                    ))}
                  </div>
                )}
                
                {/* 일기 푸터 */}
                <div className="diary-footer">
                  <div className="growth-indicator">
                    <div className="growth-circle">
                      <div className="growth-dot"></div>
                    </div>
                    <span>감정지수: {entry.growth}%</span>
                  </div>
                  
                  <div className="diary-actions">
                    <button className="action-button">
                      <BarChart2 size={18} />
                    </button>
                    <button className="action-button">
                      <Edit3 size={18} />
                    </button>
                    <button className="action-button delete">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default DiaryPage; 
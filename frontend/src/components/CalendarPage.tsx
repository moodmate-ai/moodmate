import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useDiary } from '../contexts/DiaryContext';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { ko } from 'date-fns/locale';
import { FaChevronLeft, FaChevronRight, FaPlus, FaRegCalendarAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import './CalendarPage.css';
import { ChevronLeft, ChevronRight, BarChart2, Edit3, Trash2, MessageCircle } from 'lucide-react';
import { Diary } from '../types/Diary';

interface CalendarPageProps {
  isLoggedIn: boolean;
  userName: string;
  onLogin: () => void;
  onLogout: () => void;
}

const CalendarPage: React.FC<CalendarPageProps> = ({ isLoggedIn, userName, onLogin, onLogout }) => {
  const { currentUser } = useAuth();
  const { diaries, fetchDiaries, deleteDiary } = useDiary();
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerDate, setDatePickerDate] = useState(new Date());

  // 상태 관리
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  
  // 예시 일기 데이터
  const [diaryEntries, setDiaryEntries] = useState([
    {
      id: 1,
      date: '2025-04-01',
      day: 'Mon',
      mood: 'neutral',
      moodEmoji: '😌',
      content: '오늘 하루는 맑고 반짝인 시집텨서 기분이 좋았다. 사실에는 따뜻한 차를 마시면서 일했고, 오후에는 산책을 하면서 여유로운 시간을 보냈다. 바쁜 하루도 좋지만, 이렇게 조용히 쉬는 날도 참 소중한 것같다. 가끔은 나를위한 휴식이 삶고 필요의 순간을 즐기는 것이 행복이라는 생각이 들었다.',
      growth: 75
    },
    {
      id: 2,
      date: '2025-04-02',
      day: 'Tue',
      mood: 'happy',
      moodEmoji: '😊',
      content: '아침에 일어나자 날씨가 정말좋을 때, 맑고 푸른 하늘을 보고 기분이 좋았다. 바람도 시원하게 불고, 날씨가 너무 좋았다. 나는 오랫만에 쳇을 정리하며 집을 깨끗하게 만들었다. 나를위한 정성넣어 시간을 보낼 수 있다는 게 정말로 행복했지! 생각도 많았고, 오후에는 짧게 산책도 하며 사랑하는 꽃가게들도 구경했는데, 모두들 반갑게 인사해줘서 마음이 훈훈해졌다. 전체적으로 참 행복한 하루! 꽃의 소소한 향기가 주는 여유로움이 가장 큰 행복인 것 같다.',
      growth: 85
    }
  ]);
  
  // 요일 배열
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // 월 이름 배열
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  // 예시 감정 데이터 (실제로는 API에서 가져올 것)
  const moodData: { [key: string]: { mood: string; emoji: string } } = {
    '2025-4-1': { mood: 'happy', emoji: '😊' },
    '2025-4-2': { mood: 'happy', emoji: '🙂' },
    '2025-4-3': { mood: 'anxious', emoji: '😰' },
    '2025-4-4': { mood: 'excited', emoji: '🤩' },
    '2025-4-5': { mood: 'neutral', emoji: '😐' },
    '2025-4-6': { mood: 'sad', emoji: '🥶' },
    '2025-4-7': { mood: 'happy', emoji: '😀' },
    '2025-4-8': { mood: 'neutral', emoji: '😶' },
    '2025-4-9': { mood: 'happy', emoji: '😄' },
    '2025-4-10': { mood: 'neutral', emoji: '🙂' },
    '2025-4-11': { mood: 'happy', emoji: '😁' },
    '2025-4-13': { mood: 'neutral', emoji: '🙂' },
    '2025-4-14': { mood: 'neutral', emoji: '😐' },
    '2025-4-16': { mood: 'excited', emoji: '😁' },
    '2025-4-17': { mood: 'neutral', emoji: '😐' },
  };
  
  // 감정 타입 배열
  const moodTypes = [
    { type: 'happy', label: '행복', emoji: '😊' },
    { type: 'sad', label: '슬픔', emoji: '😢' },
    { type: 'angry', label: '화남', emoji: '😠' },
    { type: 'anxious', label: '불안', emoji: '😰' },
    { type: 'neutral', label: '보통', emoji: '😌' }
  ];

  // 감정에 따른 배경색 반환
  const getMoodColor = (mood: string) => {
    switch(mood) {
      case 'happy': return 'happy';
      case 'sad': return 'sad';
      case 'angry': return 'angry';
      case 'anxious': return 'anxious';
      case 'neutral': return 'neutral';
      default: return 'neutral';
    }
  };

  // 감정 이모티콘 반환
  const getMoodEmoji = (mood: string) => {
    switch(mood) {
      case 'happy': return '😊';
      case 'sad': return '😢';
      case 'angry': return '😠';
      case 'anxious': return '😰';
      case 'neutral': return '😌';
      default: return '😐';
    }
  };
  
  // 날짜 포맷팅
  const formatDate = (date: string) => {
    const now = new Date();
    const d = new Date(date);
    const diffInMinutes = Math.floor((now.getTime() - d.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return '방금 전';
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours}시간 전`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}일 전`;
  };
  
  // 이전 달로 이동
  const prevMonth = () => {
    const newDate = subMonths(currentDate, 1);
    setCurrentDate(newDate);
    setCurrentMonth(newDate.getMonth());
    setCurrentYear(newDate.getFullYear());
  };
  
  // 다음 달로 이동
  const nextMonth = () => {
    const newDate = addMonths(currentDate, 1);
    setCurrentDate(newDate);
    setCurrentMonth(newDate.getMonth());
    setCurrentYear(newDate.getFullYear());
  };
  
  // 달력 그리드 생성
  const generateCalendarGrid = () => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    const grid = [];
    let dayCount = 1;
    
    // 필요한 행 수 계산 (최대 6줄)
    const totalDays = firstDayOfMonth + daysInMonth;
    const rowsNeeded = Math.ceil(totalDays / 7);
    
    // 행 생성
    for (let i = 0; i < rowsNeeded; i++) {
      const row = [];
      
      // 열 생성
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < firstDayOfMonth) {
          // 이전 달의 날짜
          const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();
          const day = prevMonthDays - (firstDayOfMonth - j - 1);
          row.push({
            day: day,
            isCurrentMonth: false
          });
        } else if (dayCount > daysInMonth) {
          // 다음 달의 날짜
          const day = dayCount - daysInMonth;
          row.push({
            day: day,
            isCurrentMonth: false
          });
          dayCount++;
        } else {
          // 현재 달의 날짜
          const dateStr = `${currentYear}-${currentMonth + 1}-${dayCount}`;
          const mood = moodData[dateStr];
          row.push({
            day: dayCount,
            mood: mood || null,
            isCurrentMonth: true
          });
          dayCount++;
        }
      }
      
      grid.push(row);
    }
    
    return grid;
  };
  
  const calendarGrid = generateCalendarGrid();
  
  // 일기 분석 페이지로 이동
  const handleAnalysis = (diary: any) => {
    // 분석 페이지로 이동하는 로직
    console.log('분석 페이지로 이동:', diary);
  };

  // 일기 수정
  const handleEdit = (diaryId: string) => {
    const diaryToEdit = diaries.find(d => d.id === diaryId);
    if (diaryToEdit) {
      navigate('/diary', { 
        state: { 
          editingDiaryId: diaryId,
          selectedDate: diaryToEdit.date,
          currentMood: diaryToEdit.mood,
          content: diaryToEdit.content,
          isEditing: true
        } 
      });
    }
  };

  // 일기 삭제
  const handleDelete = (diaryId: string) => {
    if (window.confirm('정말로 이 일기를 삭제하시겠습니까?')) {
      deleteDiary(diaryId);
    }
  };

  // AI 챗봇과 대화 시작
  const handleStartChat = (diary: any) => {
    window.scrollTo(0, 0);
    navigate('/chats', { state: { diary, date: diary.date } });
  };

  // 일기 카드로 스크롤하는 함수
  const scrollToDiary = (diaryId: string) => {
    const diaryElement = document.getElementById(`diary-${diaryId}`);
    if (diaryElement) {
      diaryElement.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      });
      
      // 하이라이트 효과를 위한 클래스 추가
      diaryElement.classList.add('highlight');
      setTimeout(() => {
        diaryElement.classList.remove('highlight');
      }, 2000);
    }
  };

  // 날짜 클릭 핸들러
  const handleDateClick = (date: Date) => {
    const diary = diaries.find(diary => {
      const diaryDate = new Date(diary.date);
      return (
        diaryDate.getFullYear() === date.getFullYear() &&
        diaryDate.getMonth() === date.getMonth() &&
        diaryDate.getDate() === date.getDate()
      );
    });

    if (diary) {
      scrollToDiary(diary.id);
    }
  };

  const handleDatePickerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDatePicker(!showDatePicker);
  };

  const handleDatePickerChange = (date: Date) => {
    setDatePickerDate(date);
    setCurrentDate(date);
    setShowDatePicker(false);
    
    // 선택된 날짜의 일기 목록을 가져오는 로직 추가
    const formattedDate = format(date, 'yyyy-MM-dd');
    // TODO: API 호출로 해당 날짜의 일기 목록을 가져오는 로직 구현
  };

  // 현재 월의 일기 목록 가져오기
  const currentMonthDiaries = diaries.filter(diary => {
    const diaryDate = new Date(diary.date);
    return (
      diaryDate.getFullYear() === currentYear &&
      diaryDate.getMonth() === currentMonth
    );
  });

  // 오늘 날짜 확인 함수
  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  return (
    <main className="calendar-content">
      {/* 달력 컨테이너 */}
      <div className="calendar-container">
        {/* 달력 헤더 */}
        <div className="calendar-header-controls">
          <button 
            className="calendar-month-nav-button"
            onClick={prevMonth}
          >
            <FaChevronLeft />
          </button>
          
          <div className="calendar-current-month" onClick={handleDatePickerClick}>
            {format(currentDate, 'MMMM yyyy', { locale: ko })}
          </div>
          
          <button 
            className="calendar-month-nav-button"
            onClick={nextMonth}
          >
            <FaChevronRight />
          </button>
        </div>
        
        {showDatePicker && (
          <div className="date-picker-overlay" onClick={() => setShowDatePicker(false)}>
            <div className="date-picker" onClick={e => e.stopPropagation()}>
              <div className="date-picker-header">
                <button onClick={() => setCurrentYear(currentYear - 1)}>
                  <FaChevronLeft />
                </button>
                <span>{currentYear}년</span>
                <button onClick={() => setCurrentYear(currentYear + 1)}>
                  <FaChevronRight />
                </button>
              </div>
              <div className="date-picker-grid">
                {(() => {
                  const months = Array.from({ length: 12 }, (_, i) => {
                    const date = new Date(currentYear, i, 1);
                    return date;
                  });
                  
                  return months.map((date) => {
                    const isCurrentMonth = date.getMonth() === currentMonth;
                    
                    return (
                      <button
                        key={date.toString()}
                        className={`date-picker-day ${isCurrentMonth ? 'selected' : ''}`}
                        onClick={() => {
                          setCurrentMonth(date.getMonth());
                          setCurrentDate(new Date(currentYear, date.getMonth(), 1));
                          setShowDatePicker(false);
                        }}
                      >
                        {format(date, 'M월', { locale: ko })}
                      </button>
                    );
                  });
                })()}
              </div>
            </div>
          </div>
        )}
        
        {/* 달력 그리드 */}
        <div className="calendar-grid">
          {/* 요일 헤더 */}
          {weekdays.map((day, index) => (
            <div 
              key={day} 
              className={`calendar-weekday-header ${index === 0 ? 'sunday' : ''} ${index === 6 ? 'saturday' : ''}`}
            >
              {day}
            </div>
          ))}
          
          {/* 달력 날짜 */}
          {calendarGrid.map((row, rowIndex) => (
            row.map((cell, cellIndex) => {
              const date = new Date(currentYear, currentMonth, cell.day);
              const hasDiary = diaries.some(diary => {
                const diaryDate = new Date(diary.date);
                return (
                  diaryDate.getFullYear() === date.getFullYear() &&
                  diaryDate.getMonth() === date.getMonth() &&
                  diaryDate.getDate() === date.getDate()
                );
              });

              const diary = diaries.find(diary => {
                const diaryDate = new Date(diary.date);
                return (
                  diaryDate.getFullYear() === date.getFullYear() &&
                  diaryDate.getMonth() === date.getMonth() &&
                  diaryDate.getDate() === date.getDate()
                );
              });

              return (
                <div 
                  key={`${rowIndex}-${cellIndex}`} 
                  className={`calendar-cell ${
                    cell.isCurrentMonth ? '' : 'other-month'
                  } ${hasDiary ? 'has-diary' : ''} ${diary ? diary.mood : ''} ${
                    isToday(date) ? 'today' : ''
                  }`}
                  onClick={() => handleDateClick(date)}
                >
                  {cell && (
                    <>
                      <div className="calendar-day-number">{cell.day}</div>
                      {hasDiary && (
                        <div className="calendar-mood-emoji">
                          {getMoodEmoji(diary?.mood || 'neutral')}
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })
          ))}
        </div>
        
        {/* 감정 설명 */}
        <div className="calendar-mood-legend">
          {moodTypes.map(({ type, label }) => (
            <div key={type} className="calendar-legend-item">
              <div className={`calendar-legend-color ${type}`}></div>
              <span className="calendar-legend-text">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 일기카드 목록 */}
      <div className="diary-list">
        {currentMonthDiaries
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .map((entry) => (
            <div 
              key={entry.id} 
              id={`diary-${entry.id}`}
              className={`diary-card ${getMoodColor(entry.mood)}`}
            >
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
                
                <div className="diary-footer">
                  <div className="growth-indicator">
                    {getMoodEmoji(entry.mood)}
                    <span>AI의 감정 분석</span>
                  </div>
                  
                  <div className="diary-actions">
                    <button 
                      className="action-button"
                      onClick={() => handleStartChat(entry)}
                    >
                      <MessageCircle size={18} />
                    </button>
                    <button 
                      className="action-button"
                      onClick={() => handleEdit(entry.id)}
                    >
                      <Edit3 size={18} />
                    </button>
                    <button 
                      className="action-button delete"
                      onClick={() => handleDelete(entry.id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </main>
  );
};

export default CalendarPage; 
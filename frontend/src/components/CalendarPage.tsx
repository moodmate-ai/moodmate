import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { ko } from 'date-fns/locale';
import { FaChevronLeft, FaChevronRight, FaPlus, FaRegCalendarAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import './CalendarPage.css';
import { ChevronLeft, ChevronRight, BarChart2, Edit3, Trash2, MessageCircle } from 'lucide-react';
import { diaryApi, type DiaryResponseDTO } from '../services';

interface CalendarPageProps {
  isLoggedIn: boolean;
  userName: string;
  onLogin: () => void;
  onLogout: () => void;
}

const CalendarPage: React.FC<CalendarPageProps> = ({ isLoggedIn, userName, onLogin, onLogout }) => {
  const { currentUser } = useAuth();
  const [diaries, setDiaries] = useState<DiaryResponseDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerDate, setDatePickerDate] = useState(new Date());

  // 상태 관리
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  
  // 요일 배열
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // 월 이름 배열
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  // 감정 타입 배열
  const moodTypes = [
    { type: 'HAPPY', label: '행복', emoji: '😊' },
    { type: 'SAD', label: '슬픔', emoji: '😢' },
    { type: 'ANGRY', label: '화남', emoji: '😠' },
    { type: 'ANXIOUS', label: '불안', emoji: '😰' },
    { type: 'NEUTRAL', label: '보통', emoji: '😌' }
  ];

  // 일기 데이터 가져오기
  const fetchDiaries = async () => {
    if (!currentUser?.userId) return;
    
    setIsLoading(true);
    try {
      const data = await diaryApi.getDiariesByUserId(currentUser.userId);
      setDiaries(data);
    } catch (error) {
      console.error('일기 데이터를 가져오는데 실패했습니다:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트 마운트 시 일기 데이터 가져오기
  useEffect(() => {
    fetchDiaries();
  }, [currentUser?.userId]);

  // 감정에 따른 색상 반환
  const getMoodColor = (emotion: string) => {
    switch(emotion) {
      case 'HAPPY': return 'happy';
      case 'SAD': return 'sad';
      case 'ANGRY': return 'angry';
      case 'NEUTRAL': return 'neutral';
      case 'ANXIOUS': return 'anxious';
      default: return 'neutral';
    }
  };

  // 감정 이모티콘 반환
  const getMoodEmoji = (emotion: string) => {
    switch(emotion) {
      case 'HAPPY': return '😊';
      case 'SAD': return '😢';
      case 'ANGRY': return '😠';
      case 'NEUTRAL': return '😌';
      case 'ANXIOUS': return '😰';
      default: return '😌';
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
    
    // diaries를 기반으로 날짜별 감정 정보를 담은 객체 생성
    const moodData: { [key: string]: string } = {};
    if (diaries && Array.isArray(diaries)) {
      diaries.forEach(diary => {
        if (diary && diary.createdAt) {
          const date = new Date(diary.createdAt);
          const dateStr = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
          moodData[dateStr] = diary.emotion || 'NEUTRAL';
        }
      });
    }
    
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
          const mood = moodData[dateStr] || null;
          row.push({
            day: dayCount,
            mood: mood,
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
  const handleAnalysis = (diary: DiaryResponseDTO) => {
    // 분석 페이지로 이동하는 로직
    console.log('분석 페이지로 이동:', diary);
  };

  // 일기 수정
  const handleEdit = (diaryId: number) => {
    const diaryToEdit = diaries.find(d => d.diaryId === diaryId);
    if (diaryToEdit) {
      navigate('/diary', { 
        state: { 
          editingDiaryId: diaryId,
          selectedDate: diaryToEdit.createdAt,
          currentMood: diaryToEdit.emotion,
          content: diaryToEdit.body,
          isEditing: true
        } 
      });
    }
  };

  // 일기 삭제
  const handleDelete = async (diaryId: number) => {
    if (window.confirm('정말로 이 일기를 삭제하시겠습니까?')) {
      try {
        await diaryApi.deleteDiary(diaryId);
        await fetchDiaries(); // 새로고침
      } catch (error) {
        console.error('Failed to delete diary:', error);
        alert('일기 삭제에 실패했습니다. 다시 시도해주세요.');
      }
    }
  };

  // AI 챗봇과 대화 시작
  const handleStartChat = (diary: DiaryResponseDTO) => {
    window.scrollTo(0, 0);
    navigate('/chats', { state: { diary, date: diary.createdAt } });
  };

  // 일기 카드로 스크롤하는 함수
  const scrollToDiary = (diaryId: number) => {
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
      const diaryDate = new Date(diary.createdAt);
      return (
        diaryDate.getFullYear() === date.getFullYear() &&
        diaryDate.getMonth() === date.getMonth() &&
        diaryDate.getDate() === date.getDate()
      );
    });

    if (diary) {
      scrollToDiary(diary.diaryId);
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
    const diaryDate = new Date(diary.createdAt);
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

  // location.state에서 selectedDate를 받아 처리
  useEffect(() => {
    if (location.state?.selectedDate) {
      const date = new Date(location.state.selectedDate);
      setCurrentDate(date);
      setCurrentMonth(date.getMonth());
      setCurrentYear(date.getFullYear());
      
      // 해당 날짜의 일기 찾기
      const diary = diaries.find(d => {
        const diaryDate = new Date(d.createdAt);
        return (
          diaryDate.getFullYear() === date.getFullYear() &&
          diaryDate.getMonth() === date.getMonth() &&
          diaryDate.getDate() === date.getDate()
        );
      });

      if (diary) {
        // 일기로 스크롤
        setTimeout(() => {
          scrollToDiary(diary.diaryId);
        }, 100);
      }
    }
  }, [location.state, diaries]);

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
                const diaryDate = new Date(diary.createdAt);
                return (
                  diaryDate.getFullYear() === date.getFullYear() &&
                  diaryDate.getMonth() === date.getMonth() &&
                  diaryDate.getDate() === date.getDate()
                );
              });

              const diary = diaries.find(diary => {
                const diaryDate = new Date(diary.createdAt);
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
                  } ${hasDiary ? 'has-diary' : ''} ${diary ? diary.emotion.toLowerCase() : ''} ${
                    isToday(date) ? 'today' : ''
                  }`}
                  onClick={() => handleDateClick(date)}
                >
                  {cell && (
                    <>
                      <div className="calendar-day-number">{cell.day}</div>
                      {hasDiary && (
                        <div className="calendar-mood-emoji">
                          {getMoodEmoji(diary?.emotion || 'NEUTRAL')}
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
              <div className={`calendar-legend-color ${type.toLowerCase()}`}></div>
              <span className="calendar-legend-text">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 일기카드 목록 */}
      <div className="diary-list">
        {currentMonthDiaries
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .map((entry) => (
            <div 
              key={entry.diaryId} 
              id={`diary-${entry.diaryId}`}
              className={`diary-card ${getMoodColor(entry.emotion)}`}
            >
              <div className="diary-card-header">
                <div className="diary-mood">
                  <div className="mood-circle">
                    {getMoodEmoji(entry.emotion)}
                  </div>
                  <p>{entry.emotion}</p>
                  <div className="diary-date">
                    {formatDate(entry.createdAt)}
                  </div>
                </div>
              </div>
              
              <div className="diary-content">
                <p>{entry.body}</p>
                
                <div className="diary-footer">
                  <div className="growth-indicator">
                    {getMoodEmoji(entry.emotion)}
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
                      onClick={() => handleEdit(entry.diaryId)}
                    >
                      <Edit3 size={18} />
                    </button>
                    <button 
                      className="action-button delete"
                      onClick={() => handleDelete(entry.diaryId)}
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
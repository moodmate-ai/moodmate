import React, { useState } from 'react';
import './CalendarPage.css';

interface CalendarPageProps {
  isLoggedIn: boolean;
  userName: string;
  onLogin: () => void;
  onLogout: () => void;
}

const CalendarPage: React.FC<CalendarPageProps> = ({ isLoggedIn, userName, onLogin, onLogout }) => {
  // 상태 관리
  const [currentMonth, setCurrentMonth] = useState(10); // 11월 (0-indexed)
  const [currentYear, setCurrentYear] = useState(2025);
  
  // 요일 배열
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // 월 이름 배열
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  // 예시 감정 데이터 (실제로는 API에서 가져올 것)
  const moodData: { [key: string]: { mood: string; emoji: string } } = {
    '2025-11-1': { mood: 'happy', emoji: '😊' },
    '2025-11-2': { mood: 'happy', emoji: '🙂' },
    '2025-11-3': { mood: 'anxious', emoji: '😰' },
    '2025-11-4': { mood: 'excited', emoji: '🤩' },
    '2025-11-5': { mood: 'neutral', emoji: '😐' },
    '2025-11-6': { mood: 'sad', emoji: '🥶' },
    '2025-11-7': { mood: 'happy', emoji: '😀' },
    '2025-11-8': { mood: 'neutral', emoji: '😶' },
    '2025-11-9': { mood: 'happy', emoji: '😄' },
    '2025-11-10': { mood: 'neutral', emoji: '🙂' },
    '2025-11-11': { mood: 'happy', emoji: '😁' },
    '2025-11-13': { mood: 'neutral', emoji: '🙂' },
    '2025-11-14': { mood: 'neutral', emoji: '😐' },
    '2025-11-16': { mood: 'excited', emoji: '😁' },
    '2025-11-17': { mood: 'neutral', emoji: '😐' },
  };
  
  // 감정에 따른 배경색 반환
  const getMoodColor = (mood: string) => {
    switch(mood) {
      case 'happy': return 'happy';
      case 'sad': return 'sad';
      case 'anxious': return 'anxious';
      case 'excited': return 'excited';
      case 'neutral': return 'neutral';
      default: return '';
    }
  };
  
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
  
  // 달력 그리드 생성
  const generateCalendarGrid = () => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    const grid = [];
    let dayCount = 1;
    
    // 행 생성
    for (let i = 0; i < 6; i++) {
      const row = [];
      
      // 열 생성
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < firstDayOfMonth) {
          // 이전 달의 날짜
          row.push(null);
        } else if (dayCount > daysInMonth) {
          // 다음 달의 날짜
          row.push(null);
        } else {
          // 현재 달의 날짜
          const dateStr = `${currentYear}-${currentMonth + 1}-${dayCount}`;
          const mood = moodData[dateStr];
          row.push({
            day: dayCount,
            mood: mood || null
          });
          dayCount++;
        }
      }
      
      grid.push(row);
      
      // 해당 월의 모든 날짜를 채웠다면 중단
      if (dayCount > daysInMonth) break;
    }
    
    return grid;
  };
  
  const calendarGrid = generateCalendarGrid();
  
  return (
    <main className="calendar-content">
      {/* 달력 컨테이너 */}
      <div className="calendar-container">
        {/* 달력 헤더 */}
        <div className="calendar-header-controls">
          <button 
            onClick={prevMonth}
            className="month-nav-button"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
          
          <h2 className="current-month">
            {months[currentMonth]} {currentYear}
          </h2>
          
          <button 
            onClick={nextMonth}
            className="month-nav-button"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </div>
        
        {/* 달력 그리드 */}
        <div className="calendar-grid">
          {/* 요일 헤더 */}
          {weekdays.map((day, index) => (
            <div 
              key={index} 
              className={`weekday-header ${
                index === 0 ? 'sunday' : 
                index === 6 ? 'saturday' : ''
              }`}
            >
              {day}
            </div>
          ))}
          
          {/* 달력 날짜 */}
          {calendarGrid.map((row, rowIndex) => (
            row.map((cell, cellIndex) => (
              <div 
                key={`${rowIndex}-${cellIndex}`} 
                className={`calendar-cell ${
                  cell ? (
                    cell.mood ? getMoodColor(cell.mood.mood) : ''
                  ) : 'empty'
                }`}
              >
                {cell && (
                  <>
                    <span className="day-number">{cell.day}</span>
                    {cell.mood && (
                      <span className="mood-emoji">{cell.mood.emoji}</span>
                    )}
                  </>
                )}
              </div>
            ))
          ))}
        </div>
        
        {/* 감정 설명 */}
        <div className="mood-legend">
          <div className="legend-item">
            <div className="legend-color happy"></div>
            <span className="legend-text">행복</span>
          </div>
          <div className="legend-item">
            <div className="legend-color sad"></div>
            <span className="legend-text">슬픔</span>
          </div>
          <div className="legend-item">
            <div className="legend-color anxious"></div>
            <span className="legend-text">불안</span>
          </div>
          <div className="legend-item">
            <div className="legend-color excited"></div>
            <span className="legend-text">신남</span>
          </div>
          <div className="legend-item">
            <div className="legend-color neutral"></div>
            <span className="legend-text">보통</span>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CalendarPage; 
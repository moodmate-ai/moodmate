import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, BarChart2, Trash2, Edit3, Smile, Save, Calendar, MessageCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useDiary } from '../contexts/DiaryContext';
import { diaryApi, Diary } from '../services/api';
import './DiaryPage.css';
import { format, subMonths, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';
import { ko } from 'date-fns/locale';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface DiaryPageProps {
  isLoggedIn: boolean;
  userName: string;
  onLogin: () => void;
  onLogout: () => void;
}

const DiaryPage: React.FC<DiaryPageProps> = ({ isLoggedIn, userName, onLogin, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const { diaries, addDiary, updateDiary, deleteDiary, isLoading, error, fetchDiaries } = useDiary();
  // 상태 관리
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMood, setCurrentMood] = useState('neutral');
  const [content, setContent] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [editingDiaryId, setEditingDiaryId] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerDate, setDatePickerDate] = useState(new Date());
  
  // 수정 모드로 들어왔을 때 처리
  useEffect(() => {
    if (location.state) {
      const { editingDiaryId, selectedDate, currentMood, content } = location.state;
      if (editingDiaryId) {
        setEditingDiaryId(editingDiaryId);
        setSelectedDate(selectedDate);
        setCurrentMood(currentMood);
        setContent(content);
      }
    }
  }, [location.state]);

  // 컴포넌트 마운트 시 일기 데이터 가져오기
  useEffect(() => {
    if (currentUser?.id) {
      fetchDiaries();
    }
  }, [currentUser?.id]);
  
  // 월 이름 배열
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
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
      default: return '😌';
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

  // 시간 차이 계산 함수
  const getTimeAgo = (date: string) => {
    const now = new Date();
    const diaryDate = new Date(date);
    const diffInMinutes = Math.floor((now.getTime() - diaryDate.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return '방금 전';
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours}시간 전`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}일 전`;
  };

  const handleSave = async () => {
    if (!currentUser?.id) return;

    const diaryData = {
      date: selectedDate,
      mood: currentMood,
      moodEmoji: getMoodEmoji(currentMood),
      content,
      growth: 0,
      userId: currentUser.id
    };

    try {
      if (editingDiaryId) {
        await updateDiary(editingDiaryId, diaryData);
      } else {
        await addDiary(diaryData);
      }
      navigate('/calendar');
    } catch (error) {
      console.error('일기 저장에 실패했습니다:', error);
    }
  };

  const handleDelete = async () => {
    if (!editingDiaryId) return;

    try {
      await deleteDiary(editingDiaryId);
      navigate('/calendar');
    } catch (error) {
      console.error('일기 삭제에 실패했습니다:', error);
    }
  };

  // 분석 페이지로 이동
  const handleAnalysis = (diary: Diary) => {
    navigate('/analysis', { state: { diary } });
  };

  const handleEdit = (diaryId: string) => {
    const diaryToEdit = diaries.find((d: Diary) => d.id === diaryId);
    if (diaryToEdit) {
      setSelectedDate(diaryToEdit.date);
      setCurrentMood(diaryToEdit.mood);
      setContent(diaryToEdit.content);
      setEditingDiaryId(diaryId);
    }
  };

  const handleDatePickerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDatePicker(!showDatePicker);
  };

  const handleDatePickerChange = (date: Date) => {
    setDatePickerDate(date);
    setSelectedDate(format(date, 'yyyy-MM-dd'));
    setShowDatePicker(false);
  };

  // AI 챗봇과 대화 시작
  const handleStartChat = (diary: Diary) => {
    window.scrollTo(0, 0);
    navigate('/chats', { state: { diary, date: diary.date } });
  };

  // 현재 선택된 날짜의 일기 목록
  const currentDateDiaries = diaries.filter((entry: Diary) => {
    const entryDate = new Date(entry.date);
    const selectedDateObj = new Date(selectedDate);
    return (
      entryDate.getFullYear() === selectedDateObj.getFullYear() &&
      entryDate.getMonth() === selectedDateObj.getMonth() &&
      entryDate.getDate() === selectedDateObj.getDate()
    );
  });

  return (
    <div className="diary-page">
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner">로딩 중...</div>
        </div>
      )}
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <main className="diary-content">
        <div className="diary-container">
          {/* 날짜 선택 영역 */}
          <div className="date-selector">
            <button 
              className="date-nav-button"
              onClick={() => {
                const prevDay = new Date(selectedDate);
                prevDay.setDate(prevDay.getDate() - 1);
                setSelectedDate(prevDay.toISOString().split('T')[0]);
              }}
            >
              <ChevronLeft size={20} />
            </button>
            <div className="date-picker-container">
              <button 
                className="date-selector-button"
                onClick={handleDatePickerClick}
              >
                <span>{format(new Date(selectedDate), 'yyyy년 MM월 dd일 EEEE', { locale: ko })}</span>
              </button>
              {showDatePicker && (
                <div className="date-picker-overlay" onClick={() => setShowDatePicker(false)}>
                  <div className="date-picker" onClick={e => e.stopPropagation()}>
                    <div className="date-picker-header">
                      <button onClick={(e) => {
                        e.stopPropagation();
                        setDatePickerDate(subMonths(datePickerDate, 1));
                      }}>
                        <ChevronLeft size={20} />
                      </button>
                      <span>{format(datePickerDate, 'yyyy년 MM월', { locale: ko })}</span>
                      <button onClick={(e) => {
                        e.stopPropagation();
                        setDatePickerDate(addMonths(datePickerDate, 1));
                      }}>
                        <ChevronRight size={20} />
                      </button>
                    </div>
                    <div className="date-picker-grid">
                      {['일', '월', '화', '수', '목', '금', '토'].map(day => (
                        <div key={day} className="date-picker-weekday">{day}</div>
                      ))}
                      {(() => {
                        const firstDayOfMonth = startOfMonth(datePickerDate);
                        const lastDayOfMonth = endOfMonth(datePickerDate);
                        const firstDayOfWeek = firstDayOfMonth.getDay();
                        
                        const prevMonthDays = Array.from({ length: firstDayOfWeek }, (_, i) => {
                          const date = new Date(firstDayOfMonth);
                          date.setDate(date.getDate() - (firstDayOfWeek - i));
                          return date;
                        });
                        
                        const currentMonthDays = eachDayOfInterval({
                          start: firstDayOfMonth,
                          end: lastDayOfMonth
                        });
                        
                        const nextMonthDays = Array.from({ length: 42 - (prevMonthDays.length + currentMonthDays.length) }, (_, i) => {
                          const date = new Date(lastDayOfMonth);
                          date.setDate(date.getDate() + i + 1);
                          return date;
                        });
                        
                        return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays].map((date, i) => {
                          const isCurrentMonth = isSameMonth(date, datePickerDate);
                          const isToday = isSameDay(date, new Date());
                          const isSelected = isSameDay(date, new Date(selectedDate));
                          
                          return (
                            <button
                              key={date.toString()}
                              className={`date-picker-day 
                                ${isCurrentMonth ? '' : 'other-month'} 
                                ${isSelected ? 'selected' : ''}
                                ${isToday ? 'today' : ''}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDatePickerChange(date);
                              }}
                            >
                              {format(date, 'd')}
                            </button>
                          );
                        });
                      })()}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <button 
              className="date-nav-button"
              onClick={() => {
                const nextDay = new Date(selectedDate);
                nextDay.setDate(nextDay.getDate() + 1);
                setSelectedDate(nextDay.toISOString().split('T')[0]);
              }}
            >
              <ChevronRight size={20} />
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
                    <h3>{editingDiaryId ? '일기 수정하기' : '새 일기 작성하기'}</h3>
                    <p>{editingDiaryId ? '일기를 수정해보세요' : '오늘의 기분과 생각을 기록해보세요'}</p>
                  </div>
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
                value={content}
                onChange={(e) => setContent(e.target.value)}
              ></textarea>
              
              {/* 저장 버튼 */}
              <div className="save-button-container">
                <button className="save-button" onClick={handleSave}>
                  <Save size={20} />
                  <span>{editingDiaryId ? '수정하기' : '저장하기'}</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* 기존 일기 목록 */}
          <div className="diary-list">
            {currentDateDiaries.map((entry) => (
              <div key={entry.id}>
                <div 
                  className={`diary-card ${getMoodColor(entry.mood)}`}
                >
                  {/* 일기 헤더 */}
                  <div className="diary-card-header">
                    <div className="diary-mood">
                      <div className="mood-circle">
                        {entry.moodEmoji}
                      </div>
                      <p>{entry.mood}</p>
                      <div className="diary-date">
                        {formatDate(entry.date)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="diary-content">
                    <p>{entry.content}</p>
                    
                    {/* 일기 푸터 */}
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
                          onClick={() => handleDelete()}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI 댓글 섹션 */}
                <div className="ai-comment-section">
                  <div className="comment-list">
                    <div className="comment">
                      <div className="comment-avatar">🤖</div>
                      <div className="comment-body">
                        <div className="comment-bubble">
                          <p className="comment-content">
                            {entry.mood === 'happy' ? '오늘은 정말 행복한 하루였네요! 더 자세히 이야기해볼까요?' :
                             entry.mood === 'sad' ? '오늘은 조금 슬픈 하루였군요. 이야기를 나누며 마음이 편해질 수 있을 거예요.' :
                             entry.mood === 'angry' ? '화가 나는 일이 있었군요. 함께 이야기하며 마음을 정리해봐요.' :
                             entry.mood === 'anxious' ? '불안한 마음이 있으신가요? 이야기를 나누며 마음을 가볍게 해봐요.' :
                             '오늘 하루는 어떠셨나요? 함께 이야기를 나눠볼까요?'}
                          </p>
                          <div className="comment-footer">
                            <div className="comment-time">{getTimeAgo(entry.date)}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button className="reply-button" onClick={() => handleStartChat(entry)}>
                    <MessageCircle size={14} />
                    AI와 대화하기
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DiaryPage; 
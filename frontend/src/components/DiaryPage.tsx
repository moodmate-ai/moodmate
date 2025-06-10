import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, BarChart2, Trash2, Edit3, Smile, Save, Calendar, MessageCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { diaryApi, type DiaryResponseDTO, type DiaryRequestDTO } from '../services';
import './DiaryPage.css';
import { format, subMonths, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addDays, subDays, parseISO } from 'date-fns';
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
  const [diaries, setDiaries] = useState<DiaryResponseDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 상태 관리 - 새로운 emotion 타입으로 업데이트
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMood, setCurrentMood] = useState<'JOY' | 'SADNESS' | 'ANGER' | 'NO_EMOTION' | 'FEAR'>('NO_EMOTION');
  const [content, setContent] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [editingDiaryId, setEditingDiaryId] = useState<number | null>(null);
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

  // 일기 데이터 가져오기
  const fetchDiaries = async () => {
    if (!currentUser?.userId) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const data = await diaryApi.getDiariesByUserId(currentUser.userId);
      setDiaries(data);
    } catch (error) {
      console.error('일기 데이터를 가져오는데 실패했습니다:', error);
      setError('일기 데이터를 가져오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트 마운트 시 일기 데이터 가져오기
  useEffect(() => {
    fetchDiaries();
  }, [currentUser?.userId]);

  useEffect(() => {
    if (currentUser?.userId) {
      setEditingDiaryId(null);
      setContent('');
      fetchDiaries();
    }
  }, [selectedDate]);

  useEffect(() => {
    setEditingDiaryId(null);
    setContent('');
    if(diaries.length > 0) {
      const diary = diaries.find((diary) => diary.createdAt.split('T')[0] === selectedDate);
      if(diary) {
        setEditingDiaryId(diary.diaryId);
        setContent(diary.body);
      }
    }
  }, [diaries])

  
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
  
  // 감정에 따른 색상 반환 - 새로운 emotion 값으로 업데이트
  const getMoodColor = (emotion: string) => {
    switch(emotion) {
      case 'JOY': return 'happy';
      case 'SADNESS': return 'sad';
      case 'ANGER': return 'angry';
      case 'NO_EMOTION': return 'neutral';
      case 'FEAR': return 'anxious';
      default: return 'neutral';
    }
  };
  
  // 감정 이모티콘 반환 - 새로운 emotion 값으로 업데이트
  const getMoodEmoji = (emotion: string) => {
    switch(emotion) {
      case 'JOY': return '😊';
      case 'SADNESS': return '😢';
      case 'ANGER': return '😠';
      case 'NO_EMOTION': return '😌';
      case 'FEAR': return '😰';
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
    if (!currentUser?.userId) return;

    const [year, month, day] = selectedDate.split('-').map(Number);
    const selectedDateTime = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
    // UTC+0 로 강제

    const diaryRequest: DiaryRequestDTO = {
      body: content,
      userId: currentUser.userId,
      createdAt: selectedDateTime.toISOString()
    };

    setIsLoading(true);
    try {
      if (editingDiaryId) {
        await diaryApi.updateDiary(editingDiaryId, diaryRequest);
      } else {
        await diaryApi.createDiary(diaryRequest);
      }
      await fetchDiaries(); // 새로고침
      setContent(''); // 입력 필드 초기화
      setEditingDiaryId(null);
      navigate('/calendar');
    } catch (error) {
      console.error('일기 저장에 실패했습니다:', error);
      setError('일기 저장에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (diaryId: number) => {
    if (!window.confirm('정말로 이 일기를 삭제하시겠습니까?')) return;

    setIsLoading(true);
    try {
      await diaryApi.deleteDiary(diaryId);
      await fetchDiaries(); // 새로고침
    } catch (error) {
      console.error('일기 삭제에 실패했습니다:', error);
      setError('일기 삭제에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (diary: DiaryResponseDTO) => {
    const diaryDate = new Date(diary.createdAt);
    setSelectedDate(diary.createdAt.split('T')[0]);
    setDatePickerDate(diaryDate);
    setCurrentMood(diary.emotion);
    setContent(diary.body);
    setEditingDiaryId(diary.diaryId);
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
  const handleStartChat = (diary: DiaryResponseDTO) => {
    window.scrollTo(0, 0);
    navigate('/chats', { state: { diary, date: diary.createdAt } });
  };

  // 현재 선택된 날짜의 일기 목록
  const currentDateDiaries = diaries.filter((entry: DiaryResponseDTO) => {
    const entryDate = format(parseISO(entry.createdAt), 'yyyy-MM-dd');
    return entryDate === selectedDate;
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
                const currentDate = parseISO(selectedDate + 'T00:00:00');
                const prevDay = subDays(currentDate, 1);
                setSelectedDate(format(prevDay, 'yyyy-MM-dd'));
                setDatePickerDate(prevDay);
              }}
            >
              <ChevronLeft size={20} />
            </button>
            <div className="date-picker-container">
              <button 
                className="date-selector-button"
                onClick={handleDatePickerClick}
              >
                <span>{format(parseISO(selectedDate + 'T00:00:00'), 'yyyy년 MM월 dd일 EEEE', { locale: ko })}</span>
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
                const currentDate = parseISO(selectedDate + 'T00:00:00');
                const nextDay = addDays(currentDate, 1);
                setSelectedDate(format(nextDay, 'yyyy-MM-dd'));
                setDatePickerDate(nextDay);
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
              
              {/* 감정 선택 - 새로운 emotion 값으로 업데이트 */}
              {/* <div className="mood-selection">
                <p>오늘의 기분</p>
                <div className="mood-buttons">
                  {(['JOY', 'NO_EMOTION', 'SADNESS', 'ANGER', 'FEAR'] as const).map((mood) => (
                    <button 
                      key={mood}
                      className={`mood-button ${currentMood === mood ? 'active' : ''} ${getMoodColor(mood)}`}
                      onClick={() => setCurrentMood(mood)}
                    >
                      {getMoodEmoji(mood)}
                    </button>
                  ))}
                </div>
              </div> */}
              
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
                <button className="save-button" onClick={handleSave} disabled={isLoading}>
                  <Save size={20} />
                  <span>{editingDiaryId ? '수정하기' : '저장하기'}</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* 기존 일기 목록 */}
          <div className="diary-list">
            {currentDateDiaries.map((entry) => (
              <div key={entry.diaryId}>
                <div 
                  className={`diary-card ${getMoodColor(entry.emotion)}`}
                >
                  {/* 일기 헤더 */}
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
                    
                    {/* 일기 푸터 */}
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
                          onClick={() => handleEdit(entry)}
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

                {/* AI 댓글 섹션 - 새로운 emotion 값으로 업데이트 */}
                <div className="ai-comment-section">
                  <div className="comment-list">
                    <div className="comment">
                      <div className="comment-avatar">🤖</div>
                      <div className="comment-body">
                        <div className="comment-bubble">
                          <p className="comment-content">
                            {entry.aiResponse || (
                              entry.emotion === 'JOY' ? '오늘은 정말 행복한 하루였네요! 더 자세히 이야기해볼까요?' :
                              entry.emotion === 'SADNESS' ? '오늘은 조금 슬픈 하루였군요. 이야기를 나누며 마음이 편해질 수 있을 거예요.' :
                              entry.emotion === 'ANGER' ? '화가 나는 일이 있었군요. 함께 이야기하며 마음을 정리해봐요.' :
                              entry.emotion === 'FEAR' ? '불안한 마음이 있으신가요? 이야기를 나누며 마음을 가볍게 해봐요.' :
                              '오늘 하루는 어떠셨나요? 함께 이야기를 나눠볼까요?'
                            )}
                          </p>
                          <div className="comment-footer">
                            <div className="comment-time">{getTimeAgo(entry.createdAt)}</div>
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
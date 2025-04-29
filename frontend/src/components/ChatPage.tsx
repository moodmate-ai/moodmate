import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Send, Smile, Paperclip, Bot, Calendar, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import './ChatPage.css';
import { subMonths, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, format } from 'date-fns';
import { useLocation } from 'react-router-dom';

// Add blank export for components without explicit ChatPage import
export const ComingSoonPage: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div className="coming-soon-container">
      <h1>{title}</h1>
      <p>This feature is coming soon. Stay tuned!</p>
    </div>
  );
};

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

interface ChatPageProps {
  userName?: string;
  profileImage?: string;
}

const ChatPage: React.FC<ChatPageProps> = ({ userName = '홍길동', profileImage = 'https://via.placeholder.com/150' }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [datePickerDate, setDatePickerDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(messages.length === 0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const datePickerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // 전달받은 날짜로 초기화
  useEffect(() => {
    if (location.state?.date) {
      const date = new Date(location.state.date);
      setSelectedDate(date);
      setDatePickerDate(date);
    }
  }, [location.state?.date]);

  // 일기 데이터가 전달된 경우 초기 AI 메시지 설정
  useEffect(() => {
    if (location.state?.diary) {
      const diary = location.state.diary;
      const initialMessage: Message = {
        id: Date.now().toString(),
        content: diary.mood === 'happy' ? '오늘은 정말 행복한 하루였네요! 더 자세히 이야기해볼까요?' :
                diary.mood === 'sad' ? '오늘은 조금 슬픈 하루였군요. 이야기를 나누며 마음이 편해질 수 있을 거예요.' :
                diary.mood === 'angry' ? '화가 나는 일이 있었군요. 함께 이야기하며 마음을 정리해봐요.' :
                diary.mood === 'anxious' ? '불안한 마음이 있으신가요? 이야기를 나누며 마음을 가볍게 해봐요.' :
                '오늘 하루는 어떠셨나요? 함께 이야기를 나눠볼까요?',
        sender: 'assistant',
        timestamp: new Date(),
      };
      setMessages([initialMessage]);
      setShowAnalysis(false);
    }
  }, [location.state?.diary]);

  // Suggested prompts for the welcome screen
  const suggestedPrompts = [
    "오늘 기분이 좋지 않아요",
    "스트레스 관리 방법 추천해줘",
    "수면의 질을 높이는 방법",
    "감정 조절이 어려울 때 어떻게 해야 할까요?",
    "긍정적인 마인드를 유지하는 방법"
  ];

  // Auto-scroll to the bottom when new messages are added
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-resize the textarea input
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!input.trim() || isThinking) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsThinking(true);
    setShowAnalysis(false);

    // Simulate AI response (after a short delay)
    setTimeout(() => {
      generateResponse(input);
    }, 1500);
  };

  const generateResponse = (userInput: string) => {
    // Simple response patterns - in a real app this would be an API call
    let response = '';
    const lowercaseInput = userInput.toLowerCase();

    if (lowercaseInput.includes('안녕') || lowercaseInput.includes('hi') || lowercaseInput.includes('hello')) {
      response = `안녕하세요, ${userName}님! 오늘 기분이 어떠신가요?`;
    } else if (lowercaseInput.includes('기분') && (lowercaseInput.includes('나쁘') || lowercaseInput.includes('안좋'))) {
      response = '기분이 좋지 않으시군요. 혹시 무슨 일이 있으셨나요? 이야기를 나누면 도움이 될 수 있어요.';
    } else if (lowercaseInput.includes('스트레스')) {
      response = '스트레스 관리는 정말 중요해요. 깊은 호흡, 가벼운 운동, 충분한 수면이 도움이 될 수 있어요. 또한 좋아하는 취미 활동을 하는 것도 좋은 방법이에요.';
    } else if (lowercaseInput.includes('수면') || lowercaseInput.includes('잠')) {
      response = '양질의 수면을 위해서는 일정한 취침 시간을 유지하고, 자기 전 블루라이트를 피하며, 침실을 시원하고 조용하게 유지하는 것이 좋습니다. 또한, 카페인과 알코올을 자기 전에 피하는 것도 도움이 됩니다.';
    } else if (lowercaseInput.includes('행복') || lowercaseInput.includes('긍정')) {
      response = '긍정적인 마인드를 유지하기 위해 감사 일기를 쓰거나, 작은 성취에도 자신을 칭찬하는 것이 도움이 됩니다. 또한 마음챙김과 명상도 효과적인 방법이에요.';
    } else {
      response = '말씀해주셔서 감사합니다. 더 자세하게 이야기해주시면 도움이 될 수 있을 것 같아요. 감정이나 상황에 대해 더 알려주실 수 있을까요?';
    }

    const assistantMessage: Message = {
      id: Date.now().toString(),
      content: response,
      sender: 'assistant',
      timestamp: new Date(),
    };

    setIsThinking(false);
    setMessages(prev => [...prev, assistantMessage]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isThinking) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return '방금 전';
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours}시간 전`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}일 전`;
  };

  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleDatePickerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDatePicker(true);
  };

  const handleDatePickerChange = (date: Date) => {
    setSelectedDate(date);
    setDatePickerDate(date);
    setShowDatePicker(false);
  };

  const handlePrevDay = () => {
    const prevDay = new Date(selectedDate);
    prevDay.setDate(prevDay.getDate() - 1);
    console.log('Previous day:', prevDay);
    setSelectedDate(prevDay);
    setDatePickerDate(prevDay);
  };

  const handleNextDay = () => {
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);
    console.log('Next day:', nextDay);
    setSelectedDate(nextDay);
    setDatePickerDate(nextDay);
  };

  // 외부 클릭 시 날짜 선택기 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      console.log('Click outside detected');
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        console.log('Closing date picker');
        setShowDatePicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="date-selector">
          <button 
            className="date-nav-button"
            onClick={handlePrevDay}
          >
            <ChevronLeft size={20} />
          </button>
          <div className="date-picker-container" ref={datePickerRef}>
            <button 
              className="date-selector-button"
              onClick={handleDatePickerClick}
            >
              <span>{selectedDate.toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long'
              })}</span>
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
                    <span>{datePickerDate.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' })}</span>
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
                      
                      const totalDays = prevMonthDays.length + currentMonthDays.length;
                      const gridRows = Math.ceil(totalDays / 7);
                      const gridSize = gridRows * 7;
                      const nextMonthDays = Array.from({ length: gridSize - totalDays }, (_, i) => {
                        const date = new Date(lastDayOfMonth);
                        date.setDate(date.getDate() + i + 1);
                        return date;
                      });
                      
                      return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays].map((date, i) => {
                        const isCurrentMonth = isSameMonth(date, datePickerDate);
                        const isToday = isSameDay(date, new Date());
                        const isSelected = isSameDay(date, selectedDate);
                        
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
            onClick={handleNextDay}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      
      <div className={`analysis-section ${showAnalysis ? 'expanded' : 'collapsed'}`} onClick={() => setShowAnalysis(!showAnalysis)}>
        <div className="analysis-preview">
          <div className="mood-summary">
            <div className="mood-text">오늘의 기분 분석</div>
          </div>
          <ChevronDown className={`expand-icon ${showAnalysis ? 'rotated' : ''}`} size={24} />
        </div>
        
        {showAnalysis && (
          <div className="analysis-content">
            <div className="analysis-card">
              <div className="card-header">
                <h2>기분 요약</h2>
              </div>
              <div className="mood-summary">
                <div className="mood-emoji">😊</div>
                <div className="mood-text">기분이 좋은 하루</div>
                <div className="mood-description">
                  오늘은 전반적으로 긍정적인 감정이 우세한 하루였습니다. 
                  특히 행복과 평온함이 많이 느껴졌고, 기대감도 있었습니다.
                </div>
                <div className="mood-details">
                  <span className="sentiment-tag positive">긍정 70%</span>
                  <span className="sentiment-tag neutral">중립 20%</span>
                  <span className="sentiment-tag negative">부정 10%</span>
                </div>
              </div>
            </div>
            <div className="analysis-card">
              <div className="card-header">
                <h2>감정 분포</h2>
              </div>
              <div className="sentiment-bars">
                <div className="sentiment-bar">
                  <div className="bar-label">긍정</div>
                  <div className="bar-container">
                    <div className="bar" style={{ width: '70%' }}></div>
                  </div>
                  <div className="bar-value">70%</div>
                </div>
                <div className="sentiment-bar">
                  <div className="bar-label">중립</div>
                  <div className="bar-container">
                    <div className="bar" style={{ width: '20%' }}></div>
                  </div>
                  <div className="bar-value">20%</div>
                </div>
                <div className="sentiment-bar">
                  <div className="bar-label">부정</div>
                  <div className="bar-container">
                    <div className="bar" style={{ width: '10%' }}></div>
                  </div>
                  <div className="bar-value">10%</div>
                </div>
              </div>
            </div>
            <div className="analysis-card">
              <div className="card-header">
                <h2>상세 감정 분석</h2>
              </div>
              <div className="emotion-circles">
                <div className="emotion-circle">
                  <div className="circle" style={{ width: '60px', height: '60px' }}></div>
                  <div className="emotion-label">행복</div>
                  <div className="emotion-value">60%</div>
                </div>
                <div className="emotion-circle">
                  <div className="circle" style={{ width: '40px', height: '40px' }}></div>
                  <div className="emotion-label">평온</div>
                  <div className="emotion-value">40%</div>
                </div>
                <div className="emotion-circle">
                  <div className="circle" style={{ width: '30px', height: '30px' }}></div>
                  <div className="emotion-label">기대</div>
                  <div className="emotion-value">30%</div>
                </div>
                <div className="emotion-circle">
                  <div className="circle" style={{ width: '25px', height: '25px' }}></div>
                  <div className="emotion-label">감사</div>
                  <div className="emotion-value">25%</div>
                </div>
                <div className="emotion-circle">
                  <div className="circle" style={{ width: '20px', height: '20px' }}></div>
                  <div className="emotion-label">슬픔</div>
                  <div className="emotion-value">20%</div>
                </div>
                <div className="emotion-circle">
                  <div className="circle" style={{ width: '15px', height: '15px' }}></div>
                  <div className="emotion-label">걱정</div>
                  <div className="emotion-value">15%</div>
                </div>
                <div className="emotion-circle">
                  <div className="circle" style={{ width: '10px', height: '10px' }}></div>
                  <div className="emotion-label">분노</div>
                  <div className="emotion-value">10%</div>
                </div>
              </div>
            </div>
            <div className="analysis-card">
              <div className="card-header">
                <h2>키워드</h2>
              </div>
              <div className="keyword-cloud">
                <span className="keyword-tag">가족</span>
                <span className="keyword-tag">여행</span>
                <span className="keyword-tag">휴식</span>
                <span className="keyword-tag">운동</span>
                <span className="keyword-tag">음악</span>
              </div>
            </div>
            <button 
              className="start-chat-button"
              onClick={(e) => {
                e.stopPropagation();
                setShowAnalysis(false);
                if (textareaRef.current) {
                  textareaRef.current.focus();
                }
              }}
            >
              AI와 채팅하기
            </button>
          </div>
        )}
      </div>
      
      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="welcome-message">
            <div className="icon">🤖</div>
            <h2>MoodMate 챗봇에 오신 것을 환영합니다!</h2>
            <p>
              안녕하세요, {userName}님! 저는 여러분의 감정적 웰빙을 돕기 위해 여기 있어요.
              기분이 어떠신지 알려주시거나, 감정에 대해 이야기하거나, 마음 관리에 대한 조언을 구해보세요.
            </p>
          </div>
        ) : (
          <>
            <div className="welcome-message">
              <div className="icon">🤖</div>
              <h2>MoodMate 챗봇에 오신 것을 환영합니다!</h2>
              <p>
                안녕하세요, {userName}님! 저는 여러분의 감정적 웰빙을 돕기 위해 여기 있어요.
                기분이 어떠신지 알려주시거나, 감정에 대해 이야기하거나, 마음 관리에 대한 조언을 구해보세요.
              </p>
            </div>
            {messages.map((message) => (
              <div key={message.id} className={`message ${message.sender}`}>
                <div className={`message-avatar ${message.sender}`}>
                  {message.sender === 'user' ? (
                    <img src={profileImage} alt="User" />
                  ) : (
                    <Bot size={24} />
                  )}
                </div>
                <div>
                  <div className="message-content">
                    {message.content}
                    <span className="timestamp">{formatTime(message.timestamp)}</span>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {isThinking && (
          <div className="message assistant">
            <div className="message-avatar assistant">
              <Bot size={24} />
            </div>
            <div className="message-content">
              <div className="message-thinking">
                <div className="thinking-dot"></div>
                <div className="thinking-dot"></div>
                <div className="thinking-dot"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {!showAnalysis && (
        <div className="chat-input-container">
          <textarea
            ref={textareaRef}
            className="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isThinking ? "AI가 답변을 준비중입니다..." : "메시지를 입력하세요..."}
            rows={1}
          />
          <button 
            className="send-button"
            onClick={handleSendMessage}
            disabled={!input.trim() || isThinking}
          >
            <Send size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
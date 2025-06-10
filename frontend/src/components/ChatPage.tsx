import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Send, Smile, Paperclip, Bot, Calendar, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import './ChatPage.css';
import { subMonths, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, format } from 'date-fns';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { diaryApi, chatApiService, type DiaryResponseDTO, type ChatRequestDTO, type ChatMessageDTO } from '../services';

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
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [datePickerDate, setDatePickerDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(messages.length === 0);
  const [moodAnalysis, setMoodAnalysis] = useState<{
    summary: string;
    sentiment: { positive: number; neutral: number; negative: number };
    emotions: Array<{ name: string; value: number }>;
    keywords: string[];
  } | null>(null);
  const [currentDiary, setCurrentDiary] = useState<DiaryResponseDTO | null>(null);
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
      setCurrentDiary(diary);
      const initialMessage: Message = {
        id: Date.now().toString(),
        content: diary.aiResponse || '안녕하세요! 오늘 하루는 어떠셨나요?',
        sender: 'assistant',
        timestamp: new Date(),
      };
      setMessages([initialMessage]);
      setShowAnalysis(false);
    }
  }, [location.state?.diary]);

  // 선택된 날짜의 일기 데이터 가져오기
  useEffect(() => {
    if (currentUser?.userId) {
      const fetchDiaryData = async () => {
        try {
          const response = await diaryApi.getDiariesByUserId(currentUser.userId);
          const selectedDateStr = selectedDate.toISOString().split('T')[0];
          const diary = response.find((d: DiaryResponseDTO) => d.createdAt.startsWith(selectedDateStr));

          if (diary) {
            setCurrentDiary(diary);
            
            const existingChat = await chatApiService.getChatByDiary(diary.diaryId);
            if (existingChat?.length > 0) {
              setMessages(existingChat.map(msg => ({
                id: Date.now().toString(),
                content: msg.content,
                sender: msg.role === 'user' ? 'user' : 'assistant',
                timestamp: new Date(),
              })));
            } else {
              setMessages([
                {
                  id: Date.now().toString(),
                  content: diary.aiResponse || '안녕하세요! 오늘 하루는 어떠셨나요?',
                  sender: 'assistant',
                  timestamp: new Date(),
                }
              ]);
            }
            setShowAnalysis(false);

            // 감정 분석 데이터 생성 - 실제 emotion 값 사용
            const getEmotionValues = (emotion: string) => {
              switch (emotion) {
                case 'JOY':
                  return { positive: 70, neutral: 20, negative: 10 };
                case 'SADNESS':
                  return { positive: 10, neutral: 30, negative: 60 };
                case 'ANGER':
                  return { positive: 5, neutral: 25, negative: 70 };
                case 'FEAR':
                  return { positive: 15, neutral: 35, negative: 50 };
                case 'NO_EMOTION':
                default:
                  return { positive: 40, neutral: 50, negative: 10 };
              }
            };

            const sentiment = getEmotionValues(diary.emotion);

            // 감정 분포 계산 - 실제 emotion 값 기반
            const getEmotionDistribution = (emotion: string) => {
              const emotionMap = {
                'JOY': [
                  { name: '행복', value: 60 },
                  { name: '기대', value: 40 },
                  { name: '감사', value: 35 },
                  { name: '평온', value: 25 }
                ],
                'SADNESS': [
                  { name: '슬픔', value: 55 },
                  { name: '외로움', value: 35 },
                  { name: '아쉬움', value: 25 },
                  { name: '그리움', value: 20 }
                ],
                'ANGER': [
                  { name: '분노', value: 60 },
                  { name: '짜증', value: 45 },
                  { name: '실망', value: 30 },
                  { name: '억울함', value: 25 }
                ],
                'FEAR': [
                  { name: '불안', value: 50 },
                  { name: '걱정', value: 40 },
                  { name: '초조함', value: 30 },
                  { name: '긴장', value: 25 }
                ],
                'NO_EMOTION': [
                  { name: '평온', value: 45 },
                  { name: '안정', value: 35 },
                  { name: '차분함', value: 25 },
                  { name: '보통', value: 20 }
                ]
              };
              return emotionMap[emotion as keyof typeof emotionMap] || emotionMap['NO_EMOTION'];
            };

            const emotions = getEmotionDistribution(diary.emotion);

            // 키워드 추출 (실제로는 NLP를 사용해야 함)
            const keywords = diary.body
              .split(/[\s,\.!?]+/)
              .filter((word: string) => word.length > 1)
              .slice(0, 6);

            const getEmotionSummary = (emotion: string) => {
              const summaryMap = {
                'JOY': '기분이 좋은 하루',
                'SADNESS': '조금 우울한 하루',
                'ANGER': '화가 나는 하루',
                'FEAR': '불안한 하루',
                'NO_EMOTION': '평온한 하루'
              };
              return summaryMap[emotion as keyof typeof summaryMap] || '평범한 하루';
            };

            setMoodAnalysis({
              summary: getEmotionSummary(diary.emotion),
              sentiment,
              emotions,
              keywords
            });
          } else {
            setMoodAnalysis(null);
            setCurrentDiary(null);
            // 일기가 없는 경우 메시지 초기화
            if (!location.state?.diary) {
              setMessages([]);
            }
          }
        } catch (error) {
          console.error('일기 데이터를 가져오는데 실패했습니다:', error);
          setMoodAnalysis(null);
          setCurrentDiary(null);
          // 에러 발생 시 메시지 초기화
          if (!location.state?.diary) {
            setMessages([]);
          }
        }
      };

      fetchDiaryData();
    }
  }, [currentUser?.userId, selectedDate]);

  // Suggested prompts for the welcome screen
  const suggestedPrompts = [
    "오늘 하루는 어땠나요?",
    "지금 가장 신경 쓰이는 일이 있나요?",
    "요즘 자주 드는 생각이 있나요?",
    "오늘 가장 기억에 남는 순간은?",
    "내일은 어떤 하루가 되길 바라시나요?"
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

  const generateResponse = async (userInput: string) => {
    try {
      if (!currentUser?.userId || !currentDiary?.diaryId) {
        alert("일기를 먼저 작성해주세요.")
        window.location.href = '/diary';
        return;
      }

      const chatMessages: ChatMessageDTO[] = [
        ...messages.map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.content
        })),
        {
          role: 'user',
          content: userInput
        }
      ];

      const chatRequest: ChatRequestDTO = {
        userId: currentUser.userId,
        diaryId: currentDiary.diaryId,
        messages: chatMessages
      };

      const response = await chatApiService.processUserMessage(chatRequest);
      
      const assistantMessage: Message = {
        id: Date.now().toString(),
        content: response.botReply,
        sender: 'assistant',
        timestamp: new Date(),
      };

      setIsThinking(false);
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('AI 응답 생성 중 오류 발생:', error);
      
      // 에러 발생 시 기본 응답
      const fallbackMessage: Message = {
        id: Date.now().toString(),
        content: '죄송합니다. 응답을 생성하는데 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
        sender: 'assistant',
        timestamp: new Date(),
      };

      setIsThinking(false);
      setMessages(prev => [...prev, fallbackMessage]);
    }
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
                {moodAnalysis ? (
                  <>
                    <div className="mood-emoji">{moodAnalysis.summary.includes('좋은') ? '😊' : 
                                             moodAnalysis.summary.includes('우울') ? '😢' :
                                             moodAnalysis.summary.includes('화가') ? '😠' :
                                             moodAnalysis.summary.includes('불안') ? '😰' : '😌'}</div>
                    <div className="mood-text">{moodAnalysis.summary}</div>
                    <div className="mood-description">
                      {moodAnalysis.summary.includes('좋은') ? '오늘은 전반적으로 긍정적인 감정이 우세한 하루였습니다.' :
                       moodAnalysis.summary.includes('우울') ? '오늘은 다소 우울한 감정이 있었던 하루였습니다.' :
                       moodAnalysis.summary.includes('화가') ? '오늘은 화가 나는 일이 있었던 하루였습니다.' :
                       moodAnalysis.summary.includes('불안') ? '오늘은 불안한 감정이 있었던 하루였습니다.' :
                       '오늘은 평온한 하루였습니다.'}
                    </div>
                    <div className="mood-details">
                      <span className="sentiment-tag positive">긍정 {moodAnalysis.sentiment.positive}%</span>
                      <span className="sentiment-tag neutral">중립 {moodAnalysis.sentiment.neutral}%</span>
                      <span className="sentiment-tag negative">부정 {moodAnalysis.sentiment.negative}%</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mood-emoji">📝</div>
                    <div className="mood-text">아직 작성된 일기가 없습니다</div>
                    <div className="mood-description">
                      오늘의 일기를 작성하면 기분 분석을 확인할 수 있습니다.
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="analysis-card">
              <div className="card-header">
                <h2>감정 분포</h2>
              </div>
              <div className="sentiment-bars">
                {moodAnalysis ? (
                  <>
                    <div className="sentiment-bar">
                      <div className="bar-label">긍정</div>
                      <div className="bar-container">
                        <div className="bar" style={{ width: `${moodAnalysis.sentiment.positive}%` }}></div>
                      </div>
                      <div className="bar-value">{moodAnalysis.sentiment.positive}%</div>
                    </div>
                    <div className="sentiment-bar">
                      <div className="bar-label">중립</div>
                      <div className="bar-container">
                        <div className="bar" style={{ width: `${moodAnalysis.sentiment.neutral}%` }}></div>
                      </div>
                      <div className="bar-value">{moodAnalysis.sentiment.neutral}%</div>
                    </div>
                    <div className="sentiment-bar">
                      <div className="bar-label">부정</div>
                      <div className="bar-container">
                        <div className="bar" style={{ width: `${moodAnalysis.sentiment.negative}%` }}></div>
                      </div>
                      <div className="bar-value">{moodAnalysis.sentiment.negative}%</div>
                    </div>
                  </>
                ) : (
                  <div className="empty-state">
                    <p>일기를 작성하면 감정 분포를 확인할 수 있습니다.</p>
                  </div>
                )}
              </div>
            </div>
            <div className="analysis-card">
              <div className="card-header">
                <h2>상세 감정 분석</h2>
              </div>
              <div className="emotion-circles">
                {moodAnalysis ? (
                  moodAnalysis.emotions.map((emotion, index) => (
                    <div key={index} className="emotion-circle">
                      <div className="circle" style={{ width: `${emotion.value}px`, height: `${emotion.value}px` }}></div>
                      <div className="emotion-label">{emotion.name}</div>
                      <div className="emotion-value">{emotion.value}%</div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    <p>일기를 작성하면 상세 감정 분석을 확인할 수 있습니다.</p>
                  </div>
                )}
              </div>
            </div>
            <div className="analysis-card">
              <div className="card-header">
                <h2>키워드</h2>
              </div>
              <div className="keyword-cloud">
                {moodAnalysis ? (
                  moodAnalysis.keywords.map((keyword, index) => (
                    <span key={index} className="keyword-tag">{keyword}</span>
                  ))
                ) : (
                  <div className="empty-state">
                    <p>일기를 작성하면 키워드를 확인할 수 있습니다.</p>
                  </div>
                )}
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
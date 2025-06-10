import React, { useState, useEffect } from 'react';
import { BarChart2, Calendar, BookOpen, MessageCircle, TrendingUp, Activity, Clock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import './DashboardPage.css';
import { useAuth } from '../contexts/AuthContext';
import { diaryApi, type DiaryResponseDTO } from '../services';

interface DashboardPageProps {
  userName: string;
  profileImage?: string;
}

const getMoodValue = (emotion: string): number => {
  switch(emotion) {
    case 'JOY': return 5;
    case 'NO_EMOTION': return 3;
    case 'FEAR': return 2;
    case 'SADNESS': return 1;
    case 'ANGER': return 1;
    default: return 3;
  }
};

const DashboardPage: React.FC<DashboardPageProps> = ({ userName, profileImage }) => {
  const { currentUser } = useAuth();
  const [diaries, setDiaries] = useState<DiaryResponseDTO[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [greeting, setGreeting] = useState('');
  const [streakCount, setStreakCount] = useState(0);
  const [moodStats, setMoodStats] = useState<Array<{ name: string; value: number; color: string }>>([]);
  const [moodTrend, setMoodTrend] = useState<Array<{ date: string; value: number }>>([]);
  const [dailyInsight, setDailyInsight] = useState<string>('');
  const navigate = useNavigate();
  
  // 컴포넌트 마운트 시 일기 데이터 가져오기
  useEffect(() => {
    if (currentUser?.userId) {
      diaryApi.getDiariesByUserId(currentUser.userId)
        .then((data: DiaryResponseDTO[]) => {
          setDiaries(data);
          
          // 감정 통계 계산
          const moodCounts = {
            JOY: 0,
            NO_EMOTION: 0,
            FEAR: 0,
            SADNESS: 0,
            ANGER: 0
          };

          data.forEach((diary: DiaryResponseDTO) => {
            moodCounts[diary.emotion]++;
          });

          const total = data.length;
          const newMoodStats = [
            { name: '행복', value: Math.round((moodCounts.JOY / total) * 100), color: '#FBBF24' },
            { name: '보통', value: Math.round((moodCounts.NO_EMOTION / total) * 100), color: '#A3E635' },
            { name: '불안', value: Math.round((moodCounts.FEAR / total) * 100), color: '#60A5FA' },
            { name: '슬픔', value: Math.round((moodCounts.SADNESS / total) * 100), color: '#818CF8' },
            { name: '화남', value: Math.round((moodCounts.ANGER / total) * 100), color: '#F87171' },
          ];

          setMoodStats(newMoodStats);

          // 연속 작성 일수 계산
          if (data.length === 0) {
            setStreakCount(0);
            return;
          }

          const sortedDiaries = [...data].sort((a, b) => 
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );

          let currentStreak = 0;
          let currentDate = new Date();
          currentDate.setHours(0, 0, 0, 0);

          // 오늘 일기를 작성했는지 확인
          const hasTodayDiary = sortedDiaries.some(diary => {
            const diaryDate = new Date(diary.createdAt);
            diaryDate.setHours(0, 0, 0, 0);
            return diaryDate.getTime() === currentDate.getTime();
          });

          if (hasTodayDiary) {
            currentStreak = 1;
            let checkDate = new Date(currentDate);
            checkDate.setDate(checkDate.getDate() - 1);

            while (true) {
              const hasDiary = sortedDiaries.some(diary => {
                const diaryDate = new Date(diary.createdAt);
                diaryDate.setHours(0, 0, 0, 0);
                return diaryDate.getTime() === checkDate.getTime();
              });

              if (!hasDiary) break;
              currentStreak++;
              checkDate.setDate(checkDate.getDate() - 1);
            }
          }

          setStreakCount(currentStreak);

          // 감정 추이 계산 (최근 7일)
          const last7Days = Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - i);
            return date;
          }).reverse();

          const trendData = last7Days.map(date => {
            const diary = data.find(d => {
              const diaryDate = new Date(d.createdAt);
              return diaryDate.toDateString() === date.toDateString();
            });

            return {
              date: date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }),
              value: diary ? getMoodValue(diary.emotion) : 0
            };
          });

          setMoodTrend(trendData);

          // 일일 인사이트 생성
          const recentDiaries = data
            .filter((d: DiaryResponseDTO) => {
              const diaryDate = new Date(d.createdAt);
              const weekAgo = new Date();
              weekAgo.setDate(weekAgo.getDate() - 7);
              return diaryDate >= weekAgo;
            })
            .sort((a: DiaryResponseDTO, b: DiaryResponseDTO) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

          if (recentDiaries.length > 0) {
            const positiveDiaries = recentDiaries.filter((d: DiaryResponseDTO) => d.emotion === 'JOY');
            const exerciseDiaries = recentDiaries.filter((d: DiaryResponseDTO) => 
              d.body.toLowerCase().includes('운동') || 
              d.body.toLowerCase().includes('걷기') ||
              d.body.toLowerCase().includes('달리기')
            );

            let insight = '';
            if (exerciseDiaries.length > 0 && positiveDiaries.length > 0) {
              const exerciseWithPositive = exerciseDiaries.filter(d => d.emotion === 'JOY');
              if (exerciseWithPositive.length > 0) {
                insight = '최근 일주일 동안 운동을 했을 때 행복감이 증가했습니다. 오늘도 가벼운 운동을 해보는 건 어떨까요?';
              }
            } else if (recentDiaries[0].emotion === 'SADNESS' || recentDiaries[0].emotion === 'FEAR') {
              insight = '최근 감정이 다소 불안정한 것 같네요. 마음 편히 휴식을 취하는 시간을 가져보는 건 어떨까요?';
            } else {
              insight = '오늘 하루도 긍정적인 마음으로 시작해보세요. 작은 일에도 감사하는 마음을 가지면 더 행복해질 수 있어요.';
            }
            setDailyInsight(insight);
          }
        })
        .catch(error => {
          console.error('일기 데이터를 가져오는데 실패했습니다:', error);
        });
    }
  }, [currentUser?.userId]);

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

  // 최근 일기 3개 가져오기
  const recentDiaries = diaries
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

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
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDiaryClick = (diary: DiaryResponseDTO) => {
    navigate('/calendar', { state: { selectedDate: diary.createdAt } });
  };

  // 감정 이모티콘 반환
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

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="welcome-panel">
          <h1 className="welcome-title">{greeting}, {userName}님</h1>
          <p className="current-date">{formatDate(currentDate)}</p>
        </div>
        <div className="profile-summary">
          <div className="streak-info">
            <div className="streak-count">{streakCount}일</div>
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
            <Link to="/calendar" className="view-all-link">전체보기</Link>
          </div>
          <div className="recent-entries">
            {recentDiaries.map((diary) => (
              <div 
                key={diary.diaryId} 
                className="recent-entry"
                onClick={() => handleDiaryClick(diary)}
              >
                <div className="entry-date-mood">
                  <div className="entry-date">{formatShortDate(diary.createdAt)}</div>
                  <div className="entry-mood">{getMoodEmoji(diary.emotion)}</div>
                </div>
                <div className="entry-content">
                  {diary.body.length > 100 
                    ? `${diary.body.substring(0, 100)}...` 
                    : diary.body}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* <div className="dashboard-card mood-trend-card">
          <div className="card-header">
            <h2 className="card-title">
              <TrendingUp size={20} />
              감정 추이
            </h2>
            <span className="card-subtitle">최근 7일</span>
          </div>
          <div className="mood-trend">
            <div className="trend-info">
              <div className={`trend-value ${moodTrend[moodTrend.length - 1]?.value > moodTrend[0]?.value ? 'positive' : 'negative'}`}>
                {moodTrend.length > 0 ? 
                  `${Math.round(((moodTrend[moodTrend.length - 1].value - moodTrend[0].value) / moodTrend[0].value) * 100)}%` : 
                  '0%'}
              </div>
              <div className="trend-label">
                {moodTrend.length > 0 ? 
                  (moodTrend[moodTrend.length - 1].value > moodTrend[0].value ? '긍정적 감정 증가' : '감정 변화') : 
                  '데이터 없음'}
              </div>
            </div>
            <div className="trend-chart">
              <div className="trend-bars">
                {moodTrend.map((day, index) => (
                  <div 
                    key={day.date}
                    className={`trend-bar ${index === moodTrend.length - 1 ? 'active' : ''}`}
                    style={{ height: `${(day.value / 5) * 100}%` }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div> */}

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
              {dailyInsight || '아직 충분한 데이터가 없습니다. 일기를 작성하며 감정을 기록해보세요.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
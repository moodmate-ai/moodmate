import React, { useState, useEffect } from 'react';
import { FaChartLine, FaCalendarAlt, FaInfoCircle, FaFilter, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './HistoryPage.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, BarChart2, TrendingUp, Brain, Heart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { diaryApi, type DiaryResponseDTO } from '../services';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface TimeOfDayData {
  name: string;
  JOY: number;
  NO_EMOTION: number;
  FEAR: number;
  SADNESS: number;
  ANGER: number;
}

const HistoryPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [diaries, setDiaries] = useState<DiaryResponseDTO[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerDate, setDatePickerDate] = useState(new Date());
  const [moodStats, setMoodStats] = useState<Array<{ name: string; value: number; color: string }>>([]);
  const [moodFlowData, setMoodFlowData] = useState<Array<{ date: string; mood: number; label: string }>>([]);
  const [timeOfDayData, setTimeOfDayData] = useState<TimeOfDayData[]>([]);
  const [monthlyStats, setMonthlyStats] = useState<{
    averageMood: number;
    diaryRate: number;
    positiveRate: number;
    moodChange: number;
    diaryRateChange: number;
    positiveRateChange: number;
  }>({
    averageMood: 0,
    diaryRate: 0,
    positiveRate: 0,
    moodChange: 0,
    diaryRateChange: 0,
    positiveRateChange: 0
  });
  const [activityPatterns, setActivityPatterns] = useState<{
    positiveActivities: string[];
    negativeActivities: string[];
    patternDescription: string;
  }>({
    positiveActivities: [],
    negativeActivities: [],
    patternDescription: ''
  });

  useEffect(() => {
    if (currentUser?.userId) {
      diaryApi.getDiariesByUserId(currentUser.userId)
        .then((data: DiaryResponseDTO[]) => {
          setDiaries(data);
          
          // 현재 월의 데이터 필터링
          const currentMonthData = data.filter((diary: DiaryResponseDTO) => {
            const diaryDate = new Date(diary.createdAt);
            return diaryDate.getMonth() === currentDate.getMonth() &&
                   diaryDate.getFullYear() === currentDate.getFullYear();
          });

          // 이전 월의 데이터 필터링
          const prevMonthData = data.filter((diary: DiaryResponseDTO) => {
            const diaryDate = new Date(diary.createdAt);
            const prevMonth = new Date(currentDate);
            prevMonth.setMonth(prevMonth.getMonth() - 1);
            return diaryDate.getMonth() === prevMonth.getMonth() &&
                   diaryDate.getFullYear() === prevMonth.getFullYear();
          });

          // 월간 통계 계산
          const calculateMonthlyStats = (diaries: DiaryResponseDTO[]) => {
            if (diaries.length === 0) return {
              averageMood: 0,
              diaryRate: 0,
              positiveRate: 0
            };

            const totalMood = diaries.reduce((sum, diary) => sum + getMoodValue(diary.emotion), 0);
            const positiveCount = diaries.filter(diary => diary.emotion === 'JOY').length;
            const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

            return {
              averageMood: totalMood / diaries.length,
              diaryRate: (diaries.length / daysInMonth) * 100,
              positiveRate: (positiveCount / diaries.length) * 100
            };
          };

          const currentStats = calculateMonthlyStats(currentMonthData);
          const prevStats = calculateMonthlyStats(prevMonthData);

          setMonthlyStats({
            averageMood: currentStats.averageMood,
            diaryRate: currentStats.diaryRate,
            positiveRate: currentStats.positiveRate,
            moodChange: prevStats.averageMood ? ((currentStats.averageMood - prevStats.averageMood) / prevStats.averageMood) * 100 : 0,
            diaryRateChange: prevStats.diaryRate ? ((currentStats.diaryRate - prevStats.diaryRate) / prevStats.diaryRate) * 100 : 0,
            positiveRateChange: prevStats.positiveRate ? ((currentStats.positiveRate - prevStats.positiveRate) / prevStats.positiveRate) * 100 : 0
          });

          // 감정 통계 계산
          const moodCounts = {
            JOY: 0,
            NO_EMOTION: 0,
            FEAR: 0,
            SADNESS: 0,
            ANGER: 0
          };

          data.forEach(diary => {
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

          // 감정 흐름 데이터 계산
          const sortedDiaries = [...data].sort((a, b) => 
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );

          const newMoodFlowData = sortedDiaries.map(diary => {
            const date = new Date(diary.createdAt);
            const moodValue = getMoodValue(diary.emotion);
            return {
              date: `${date.getMonth() + 1}/${date.getDate()}`,
              mood: moodValue,
              label: `${date.getMonth() + 1}월 ${date.getDate()}일`
            };
          });

          setMoodFlowData(newMoodFlowData);

          // 시간대별 감정 통계 계산
          const timeOfDayStats: TimeOfDayData[] = [
            { name: '아침', JOY: 0, NO_EMOTION: 0, FEAR: 0, SADNESS: 0, ANGER: 0 },
            { name: '점심', JOY: 0, NO_EMOTION: 0, FEAR: 0, SADNESS: 0, ANGER: 0 },
            { name: '저녁', JOY: 0, NO_EMOTION: 0, FEAR: 0, SADNESS: 0, ANGER: 0 },
            { name: '밤', JOY: 0, NO_EMOTION: 0, FEAR: 0, SADNESS: 0, ANGER: 0 }
          ];

          data.forEach((diary: DiaryResponseDTO) => {
            const hour = new Date(diary.createdAt).getHours();
            let timeIndex = 0;

            if (hour >= 5 && hour < 11) timeIndex = 0;      // 아침
            else if (hour >= 11 && hour < 17) timeIndex = 1; // 점심
            else if (hour >= 17 && hour < 22) timeIndex = 2; // 저녁
            else timeIndex = 3;                              // 밤

            timeOfDayStats[timeIndex][diary.emotion]++;
          });

          setTimeOfDayData(timeOfDayStats);

          // 활동 패턴 분석
          const currentMonthContent = currentMonthData.map(diary => diary.body.toLowerCase());
          
          // 긍정적 활동 추출
          const positiveActivities = new Set<string>();
          const negativeActivities = new Set<string>();
          
          currentMonthContent.forEach(content => {
            // 운동 관련 키워드
            if (content.includes('운동') || content.includes('걷기') || content.includes('달리기') || 
                content.includes('헬스') || content.includes('요가') || content.includes('스트레칭')) {
              positiveActivities.add('운동');
            }
            // 독서 관련 키워드
            if (content.includes('책') || content.includes('독서') || content.includes('읽기')) {
              positiveActivities.add('독서');
            }
            // 산책 관련 키워드
            if (content.includes('산책') || content.includes('걷기') || content.includes('산행')) {
              positiveActivities.add('산책');
            }
            // 수면 관련 키워드
            if (content.includes('잠') || content.includes('수면') || content.includes('취침')) {
              if (content.includes('부족') || content.includes('적음') || content.includes('늦게')) {
                negativeActivities.add('수면 시간');
            }
            }
            // 스트레스 관련 키워드
            if (content.includes('스트레스') || content.includes('불안') || content.includes('걱정')) {
              negativeActivities.add('스트레스');
            }
            // 식사 관련 키워드
            if (content.includes('식사') || content.includes('밥') || content.includes('먹기')) {
              if (content.includes('불규칙') || content.includes('늦게') || content.includes('거르기')) {
                negativeActivities.add('불규칙한 식사');
              }
            }
          });

          // 패턴 설명 생성
          const weekendDiaries = currentMonthData.filter(diary => {
            const day = new Date(diary.createdAt).getDay();
            return day === 0 || day === 6; // 주말
          });

          const weekendRatio = (weekendDiaries.length / currentMonthData.length) * 100;
          let patternDescription = '';

          if (weekendRatio > 60) {
            patternDescription = '이번 달에는 주로 주말에 일기를 작성하는 경향이 있으며, 특히 주말에 가장 활발한 활동을 보였습니다.';
          } else if (weekendRatio < 30) {
            patternDescription = '이번 달에는 주로 평일에 일기를 작성하는 경향이 있으며, 특히 평일 저녁에 가장 활발한 활동을 보였습니다.';
          } else {
            patternDescription = '이번 달에는 주말과 평일에 고르게 일기를 작성하는 경향을 보였습니다.';
          }

          setActivityPatterns({
            positiveActivities: Array.from(positiveActivities),
            negativeActivities: Array.from(negativeActivities),
            patternDescription
          });
        })
        .catch(error => {
          console.error('일기 데이터를 가져오는데 실패했습니다:', error);
        });
    }
  }, [currentUser?.userId, currentDate]);

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

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDatePickerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDatePicker(!showDatePicker);
  };

  const handleDatePickerChange = (date: Date) => {
    setCurrentDate(date);
    setShowDatePicker(false);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' });
  };

  // 차트 데이터
  const lineChartData = {
    labels: moodFlowData.map(data => data.date),
    datasets: [
      {
        label: '기분 점수',
        data: moodFlowData.map(data => data.mood),
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  const barChartData = {
    labels: moodStats.map(stat => stat.name),
    datasets: [
      {
        data: moodStats.map(stat => stat.value),
        backgroundColor: moodStats.map(stat => stat.color),
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function(this: any, tickValue: number | string) {
            return `${tickValue}%`;
          },
        },
      },
    },
  };

  // 무드 단계 색상
  const moodColors = ['#F87171', '#FB923C', '#FBBF24', '#A3E635', '#34D399', '#60A5FA'];
  
  // 무드 단계를 색상으로 변환
  const getMoodColor = (mood: number) => {
    return moodColors[mood] || moodColors[0];
  };
  
  // 무드 설명
  const moodLabels = [
    { value: 5, label: '매우 행복', color: '#34D399' },
    { value: 4, label: '행복', color: '#A3E635' },
    { value: 3, label: '보통', color: '#FBBF24' },
    { value: 2, label: '우울', color: '#FB923C' },
    { value: 1, label: '매우 우울', color: '#F87171' },
  ];
  
  // 툴팁 커스텀 컴포넌트
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{data.label}</p>
          <p className="tooltip-value">
            감정 단계: 
            <span className="tooltip-mood" style={{ color: getMoodColor(data.mood) }}>
              {moodLabels.find(item => item.value === data.mood)?.label || '알 수 없음'}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="analysis-container">
      <div className="month-navigator">
        <button className="month-button" onClick={handlePrevMonth}>
          <FaChevronLeft />
        </button>
        <h2 className="month-title" onClick={handleDatePickerClick}>
          {formatDate(currentDate)}
        </h2>
        <button className="month-button" onClick={handleNextMonth}>
          <FaChevronRight />
        </button>
      </div>

      {showDatePicker && (
        <div className="date-picker-overlay" onClick={() => setShowDatePicker(false)}>
          <div className="date-picker" onClick={e => e.stopPropagation()}>
            <div className="date-picker-header">
              <button onClick={() => {
                setDatePickerDate(new Date(datePickerDate.getFullYear() - 1, datePickerDate.getMonth()));
              }}>
                <FaChevronLeft />
              </button>
              <span>{datePickerDate.getFullYear()}년</span>
              <button onClick={() => {
                setDatePickerDate(new Date(datePickerDate.getFullYear() + 1, datePickerDate.getMonth()));
              }}>
                <FaChevronRight />
              </button>
            </div>
            <div className="date-picker-grid">
              {Array.from({ length: 12 }, (_, i) => {
                const date = new Date(datePickerDate.getFullYear(), i, 1);
                const isCurrentMonth = date.getMonth() === currentDate.getMonth();
                return (
                  <button
                    key={date.toString()}
                    className={`date-picker-day ${isCurrentMonth ? 'selected' : ''}`}
                    onClick={() => {
                      setCurrentDate(date);
                      setShowDatePicker(false);
                    }}
                  >
                    {date.toLocaleDateString('ko-KR', { month: 'long' })}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

          <div className="insights-grid">
            <div className="insight-card">
              <div className="insight-label">평균 기분 점수</div>
              <div className="insight-value">
            {monthlyStats.averageMood.toFixed(1)}
            <span className={`insight-change ${monthlyStats.moodChange >= 0 ? 'positive' : 'negative'}`}>
              {monthlyStats.moodChange >= 0 ? '+' : ''}{monthlyStats.moodChange.toFixed(1)}%
            </span>
          </div>
          <div className="insight-description">
            지난 달 대비 {monthlyStats.moodChange >= 0 ? '상승' : '하락'}
              </div>
            </div>
            <div className="insight-card">
              <div className="insight-label">일기 작성률</div>
              <div className="insight-value">
            {monthlyStats.diaryRate.toFixed(1)}%
            <span className={`insight-change ${monthlyStats.diaryRateChange >= 0 ? 'positive' : 'negative'}`}>
              {monthlyStats.diaryRateChange >= 0 ? '+' : ''}{monthlyStats.diaryRateChange.toFixed(1)}%
            </span>
          </div>
          <div className="insight-description">
            지난 달 대비 {monthlyStats.diaryRateChange >= 0 ? '상승' : '하락'}
              </div>
            </div>
            <div className="insight-card">
              <div className="insight-label">긍정적 감정 비율</div>
              <div className="insight-value">
            {monthlyStats.positiveRate.toFixed(1)}%
            <span className={`insight-change ${monthlyStats.positiveRateChange >= 0 ? 'positive' : 'negative'}`}>
              {monthlyStats.positiveRateChange >= 0 ? '+' : ''}{monthlyStats.positiveRateChange.toFixed(1)}%
            </span>
              </div>
          <div className="insight-description">
            지난 달 대비 {monthlyStats.positiveRateChange >= 0 ? '상승' : '하락'}
          </div>
            </div>
          </div>

          <div className="charts-grid">
            <div className="chart-card">
              <div className="chart-header">
                <h3 className="chart-title">주간 기분 추이</h3>
                <button className="info-button">
                  <FaInfoCircle />
                </button>
              </div>
              <div className="chart-body">
                <div className="mood-legend">
                  <div className="mood-legend-item">
                    <div className="mood-color" style={{ backgroundColor: '#4CAF50' }}></div>
                    <span className="mood-name">매우 좋음</span>
                  </div>
                  <div className="mood-legend-item">
                    <div className="mood-color" style={{ backgroundColor: '#8BC34A' }}></div>
                    <span className="mood-name">좋음</span>
                  </div>
                  <div className="mood-legend-item">
                    <div className="mood-color" style={{ backgroundColor: '#FFC107' }}></div>
                    <span className="mood-name">보통</span>
                  </div>
                  <div className="mood-legend-item">
                    <div className="mood-color" style={{ backgroundColor: '#FF9800' }}></div>
                    <span className="mood-name">나쁨</span>
                  </div>
                  <div className="mood-legend-item">
                    <div className="mood-color" style={{ backgroundColor: '#F44336' }}></div>
                    <span className="mood-name">매우 나쁨</span>
                  </div>
                </div>
                <div className="chart-container">
                  <Line data={lineChartData} options={lineChartOptions} />
                </div>
              </div>
            </div>

            <div className="chart-card">
              <div className="chart-header">
                <h3 className="chart-title">감정 분포</h3>
                <button className="info-button">
                  <FaInfoCircle />
                </button>
              </div>
              <div className="chart-body">
                <div className="chart-container">
                  <Bar data={barChartData} options={barChartOptions} />
                </div>
              </div>
            </div>
          </div>

          <div className="patterns-card">
            <div className="patterns-header">
              <h3 className="patterns-title">패턴 분석</h3>
              <button className="filter-button">
                <FaFilter className="filter-icon" />
                필터
              </button>
            </div>
            <div className="pattern-section">
              <h4 className="pattern-title">주요 활동 패턴</h4>
              <p className="pattern-text">
            {activityPatterns.patternDescription}
              </p>
            </div>
            <div className="activity-grid">
              <div>
                <h4 className="activity-list-title">긍정적 활동</h4>
                <ul className="activity-list">
              {activityPatterns.positiveActivities.length > 0 ? (
                activityPatterns.positiveActivities.map((activity, index) => (
                  <li key={index} className="activity-item">{activity}</li>
                ))
              ) : (
                <li className="activity-item">긍정적 활동이 기록되지 않았습니다.</li>
              )}
                </ul>
              </div>
              <div>
                <h4 className="activity-list-title">개선 필요 활동</h4>
                <ul className="activity-list">
              {activityPatterns.negativeActivities.length > 0 ? (
                activityPatterns.negativeActivities.map((activity, index) => (
                  <li key={index} className="activity-item">{activity}</li>
                ))
              ) : (
                <li className="activity-item">개선이 필요한 활동이 기록되지 않았습니다.</li>
              )}
                </ul>
              </div>
            </div>
          </div>
    </div>
  );
};

export default HistoryPage; 
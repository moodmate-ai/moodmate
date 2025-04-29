import React, { useState } from 'react';
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

const HistoryPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState('overview');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerDate, setDatePickerDate] = useState(new Date());

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
    labels: ['월', '화', '수', '목', '금', '토', '일'],
    datasets: [
      {
        label: '기분 점수',
        data: [4, 3, 5, 4, 3, 5, 4],
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
    labels: ['매우 좋음', '좋음', '보통', '나쁨', '매우 나쁨'],
    datasets: [
      {
        data: [30, 25, 20, 15, 10],
        backgroundColor: [
          '#4CAF50',
          '#8BC34A',
          '#FFC107',
          '#FF9800',
          '#F44336',
        ],
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

  // 무드 흐름 데이터 (샘플)
  const moodFlowData = [
    { date: '11/1', mood: 3, label: '11월 1일' },
    { date: '11/3', mood: 4, label: '11월 3일' },
    { date: '11/5', mood: 5, label: '11월 5일' },
    { date: '11/7', mood: 3, label: '11월 7일' },
    { date: '11/9', mood: 4, label: '11월 9일' },
    { date: '11/11', mood: 2, label: '11월 11일' },
    { date: '11/13', mood: 1, label: '11월 13일' },
    { date: '11/15', mood: 3, label: '11월 15일' },
    { date: '11/17', mood: 4, label: '11월 17일' },
    { date: '11/19', mood: 5, label: '11월 19일' },
    { date: '11/21', mood: 3, label: '11월 21일' },
    { date: '11/23', mood: 2, label: '11월 23일' },
    { date: '11/25', mood: 4, label: '11월 25일' },
    { date: '11/27', mood: 5, label: '11월 27일' },
    { date: '11/29', mood: 3, label: '11월 29일' },
    { date: '12/1', mood: 2, label: '12월 1일' },
  ];
  
  // 무드 통계 데이터 (샘플)
  const moodStatsData = [
    { name: '행복', value: 12, color: '#FBBF24' },
    { name: '보통', value: 8, color: '#A3E635' },
    { name: '불안', value: 5, color: '#60A5FA' },
    { name: '슬픔', value: 3, color: '#818CF8' },
    { name: '화남', value: 2, color: '#F87171' },
  ];
  
  // 시간대별 감정 분포 데이터 (샘플)
  const timeOfDayData = [
    { 
      name: '아침', 
      행복: 4, 
      보통: 2, 
      불안: 1, 
      슬픔: 0, 
      화남: 0 
    },
    { 
      name: '점심', 
      행복: 3, 
      보통: 3, 
      불안: 2, 
      슬픔: 1, 
      화남: 0 
    },
    { 
      name: '저녁', 
      행복: 5, 
      보통: 2, 
      불안: 1, 
      슬픔: 2, 
      화남: 1 
    },
    { 
      name: '밤', 
      행복: 0, 
      보통: 1, 
      불안: 1, 
      슬픔: 0, 
      화남: 1 
    },
  ];
  
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

      <div className="tabs-container">
        <div className="tabs-list">
          <button
            className={`tab-button ${activeTab === 'overview' ? 'tab-button-active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <FaChartLine className="tab-icon" />
            개요
          </button>
          <button
            className={`tab-button ${activeTab === 'calendar' ? 'tab-button-active' : ''}`}
            onClick={() => setActiveTab('calendar')}
          >
            <FaCalendarAlt className="tab-icon" />
            캘린더
          </button>
        </div>
      </div>

      {activeTab === 'overview' ? (
        <>
          <div className="insights-grid">
            <div className="insight-card">
              <div className="insight-label">평균 기분 점수</div>
              <div className="insight-value">
                7.5
                <span className="insight-change">+0.3</span>
              </div>
              <div className="insight-description">지난 달 대비 0.3점 상승</div>
            </div>
            <div className="insight-card">
              <div className="insight-label">일기 작성률</div>
              <div className="insight-value">
                85%
                <span className="insight-change">+5%</span>
              </div>
              <div className="insight-description">지난 달 대비 5% 상승</div>
            </div>
            <div className="insight-card">
              <div className="insight-label">긍정적 감정 비율</div>
              <div className="insight-value">
                72%
                <span className="insight-change">+3%</span>
              </div>
              <div className="insight-description">지난 달 대비 3% 상승</div>
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
                이번 달에는 주로 주말에 일기를 작성하는 경향이 있으며, 
                특히 토요일 저녁에 가장 활발한 활동을 보였습니다.
              </p>
            </div>
            <div className="activity-grid">
              <div>
                <h4 className="activity-list-title">긍정적 활동</h4>
                <ul className="activity-list">
                  <li className="activity-item">운동 (주 3회)</li>
                  <li className="activity-item">독서 (하루 30분)</li>
                  <li className="activity-item">산책 (하루 20분)</li>
                </ul>
              </div>
              <div>
                <h4 className="activity-list-title">개선 필요 활동</h4>
                <ul className="activity-list">
                  <li className="activity-item">수면 시간 (평균 6시간)</li>
                  <li className="activity-item">업무 스트레스</li>
                  <li className="activity-item">불규칙한 식사</li>
                </ul>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">월간 캘린더</h3>
            <button className="info-button">
              <FaInfoCircle />
            </button>
          </div>
          <div className="chart-body">
            <div className="chart-container">
              {/* 캘린더 컴포넌트가 들어갈 위치 */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryPage; 
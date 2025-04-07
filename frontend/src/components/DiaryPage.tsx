import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Image, BarChart2, Trash2, Edit3, Smile, Save, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './DiaryPage.css';

interface DiaryPageProps {
  isLoggedIn: boolean;
  userName: string;
  onLogin: () => void;
  onLogout: () => void;
}

const DiaryPage: React.FC<DiaryPageProps> = ({ isLoggedIn, userName, onLogin, onLogout }) => {
  const navigate = useNavigate();
  // 상태 관리
  const [currentMonth, setCurrentMonth] = useState(10); // 11월 (0-indexed)
  const [currentYear, setCurrentYear] = useState(2025);
  const [currentMood, setCurrentMood] = useState('neutral');
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [editingDiaryId, setEditingDiaryId] = useState<number | null>(null);
  
  // 월 이름 배열
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  // 예시 일기 데이터
  const diaryEntries = [
    {
      id: 1,
      date: '2025-11-01',
      day: 'Mon',
      mood: 'neutral',
      moodEmoji: '😌',
      content: '오늘 하루는 맑고 반짝인 시집텨서 기분이 좋았다. 사실에는 따뜻한 차를 마시면서 일했고, 오후에는 산책을 하면서 여유로운 시간을 보냈다. 바쁜 하루도 좋지만, 이렇게 조용히 쉬는 날도 참 소중한 것같다. 가끔은 나를위한 휴식이 삶고 필요의 순간을 즐기는 것이 행복이라는 생각이 들었다.',
      images: [
        '/api/placeholder/200/200',
        '/api/placeholder/200/200',
        '/api/placeholder/200/200'
      ],
      growth: 75
    },
    {
      id: 2,
      date: '2025-11-02',
      day: 'Tue',
      mood: 'happy',
      moodEmoji: '😊',
      content: '아침에 일어나자 날씨가 정말좋을 때, 맑고 푸른 하늘을 보고 기분이 좋았다. 바람도 시원하게 불고, 날씨가 너무 좋았다. 나는 오랫만에 쳇을 정리하며 집을 깨끗하게 만들었다. 나를위한 정성넣어 시간을 보낼 수 있다는 게 정말로 행복했지! 생각도 많았고, 오후에는 짧게 산책도 하며 사랑하는 꽃가게들도 구경했는데, 모두들 반갑게 인사해줘서 마음이 훈훈해졌다. 전체적으로 참 행복한 하루! 꽃의 소소한 향기가 주는 여유로움이 가장 큰 행복인 것 같다.',
      images: [],
      growth: 85
    }
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
      default: return '😐';
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
  
  // 이미지 업로드 처리
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onloadend = () => {
          newImages.push(reader.result as string);
          if (i === files.length - 1) {
            setImages(prev => [...prev, ...newImages]);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  // 이미지 버튼 클릭 처리
  const handleImageButtonClick = () => {
    fileInputRef.current?.click();
  };

  // 일기 저장 처리
  const handleSave = () => {
    if (!content.trim()) {
      alert('일기 내용을 입력해주세요.');
      return;
    }

    if (editingDiaryId) {
      // 일기 수정 로직
      const updatedEntries = diaryEntries.map(entry => 
        entry.id === editingDiaryId 
          ? {
              ...entry,
              date: selectedDate,
              mood: currentMood,
              content: content,
              images: images
            }
          : entry
      );
      // 실제로는 API 호출로 서버에서 수정해야 함
      console.log('일기가 수정되었습니다:', editingDiaryId);
      setEditingDiaryId(null);
    } else {
      // 새 일기 작성 로직
      const newEntry = {
        id: diaryEntries.length + 1,
        date: selectedDate,
        day: ['일', '월', '화', '수', '목', '금', '토'][new Date(selectedDate).getDay()],
        mood: currentMood,
        moodEmoji: getMoodEmoji(currentMood),
        content: content,
        images: images,
        growth: Math.floor(Math.random() * 30) + 70
      };
      // 실제로는 API 호출로 서버에서 저장해야 함
      console.log('새로운 일기 저장:', newEntry);
    }

    // 상태 초기화
    setContent('');
    setImages([]);
    setCurrentMood('neutral');
    setSelectedDate(new Date().toISOString().split('T')[0]);
    
    alert(editingDiaryId ? '일기가 수정되었습니다!' : '일기가 저장되었습니다!');
  };

  // 분석 페이지로 이동
  const handleAnalysis = (diary: any) => {
    navigate('/analysis', { state: { diary } });
  };

  const handleEdit = (diaryId: number) => {
    const diaryToEdit = diaryEntries.find(d => d.id === diaryId);
    if (diaryToEdit) {
      setSelectedDate(diaryToEdit.date);
      setCurrentMood(diaryToEdit.mood);
      setContent(diaryToEdit.content);
      setImages(diaryToEdit.images);
      // 수정 중인 일기 ID 저장
      setEditingDiaryId(diaryId);
    }
  };

  const handleDelete = (diaryId: number) => {
    if (window.confirm('정말로 이 일기를 삭제하시겠습니까?')) {
      // 일기 삭제 로직 구현
      const updatedEntries = diaryEntries.filter(d => d.id !== diaryId);
      // 실제로는 API 호출로 서버에서 삭제해야 함
      console.log('일기가 삭제되었습니다:', diaryId);
    }
  };

  return (
    <main className="diary-content">
      <div className="diary-container">
        {/* 월 네비게이션 */}
        <div className="month-navigation">
          <button 
            onClick={prevMonth}
            className="month-nav-button"
          >
            <ChevronLeft size={24} />
          </button>
          
          <h2 className="current-month">
            {months[currentMonth]} {currentYear}
          </h2>
          
          <button 
            onClick={nextMonth}
            className="month-nav-button"
          >
            <ChevronRight size={24} />
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
              <div className="date-input-container">
                <Calendar size={16} />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="date-input"
                />
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
            
            {/* 이미지 미리보기 */}
            {images.length > 0 && (
              <div className="image-preview">
                {images.map((image, index) => (
                  <div key={index} className="preview-image-container">
                    <img src={image} alt={`미리보기 ${index + 1}`} />
                    <button 
                      className="remove-image"
                      onClick={() => setImages(prev => prev.filter((_, i) => i !== index))}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {/* 기능 버튼 */}
            <div className="diary-actions">
              <div className="action-buttons">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  multiple
                  style={{ display: 'none' }}
                />
                <button className="action-button" onClick={handleImageButtonClick}>
                  <Image size={20} />
                </button>
              </div>
              <div className="save-button-container">
                <button className="save-button" onClick={handleSave}>
                  <Save size={20} />
                  <span>{editingDiaryId ? '수정하기' : '저장하기'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* 기존 일기 목록 */}
        <div className="diary-list">
          {diaryEntries.map((entry) => (
            <div 
              key={entry.id} 
              className={`diary-card ${getMoodColor(entry.mood)}`}
            >
              {/* 일기 헤더 */}
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
                
                {/* 이미지 갤러리 */}
                {entry.images.length > 0 && (
                  <div className="image-gallery">
                    {entry.images.map((image, index) => (
                      <img 
                        key={index}
                        src={image} 
                        alt={`이미지 ${index + 1}`} 
                      />
                    ))}
                  </div>
                )}
                
                {/* 일기 푸터 */}
                <div className="diary-footer">
                  <div className="growth-indicator">
                    <div className="growth-circle">
                      <div className="growth-dot"></div>
                    </div>
                    <span>감정지수: {entry.growth}%</span>
                  </div>
                  
                  <div className="diary-actions">
                    <button 
                      className="action-button"
                      onClick={() => handleAnalysis(entry)}
                    >
                      <BarChart2 size={18} />
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
      </div>
    </main>
  );
};

export default DiaryPage; 
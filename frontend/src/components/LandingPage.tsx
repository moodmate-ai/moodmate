import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Heart, Calendar, BarChart2, MessageCircle, CheckCircle } from 'lucide-react';
import './LandingPage.css';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const featuresRef = useRef<HTMLDivElement>(null);

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="landing-container">
      {/* 네비게이션 */}
      <nav className="landing-nav">
        <div className="logo">
          <img src="/moodmate.png" alt="MoodMate Logo" className="nav-logo" />
          <h1>MoodMate</h1>
        </div>
        <div className="nav-buttons">
          <button className="nav-button login" onClick={() => navigate('/login')}>
            로그인
          </button>
          <button className="nav-button signup" onClick={() => navigate('/signup')}>
            회원가입
          </button>
        </div>
      </nav>

      {/* 히어로 섹션 */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">MoodMate</h1>
          <p className="hero-subtitle">
            당신의 감정을 기록하고, 분석하며, 더 나은 일상을 만들어보세요.
          </p>
          <div className="hero-buttons">
            <button className="hero-button primary" onClick={() => navigate('/signup')}>
              시작하기
            </button>
            <button className="hero-button secondary" onClick={scrollToFeatures}>
              자세히 알아보기
              <ChevronDown size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* 특징 섹션 */}
      <section className="features-section" ref={featuresRef}>
        <h2 className="section-title">MoodMate와 함께하는 감정 여정</h2>
        <p className="section-subtitle">
          일상 속 감정을 기록하고 분석하여 더 건강한 마음을 만들어보세요
        </p>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <Heart size={32} color="#10B981" />
            </div>
            <h3 className="feature-title">감정 기록</h3>
            <p className="feature-description">
              매일의 감정을 다양한 이모티콘으로 표현하고, 일기를 통해 자세히 기록해보세요.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <Calendar size={32} color="#10B981" />
            </div>
            <h3 className="feature-title">캘린더 뷰</h3>
            <p className="feature-description">
              월별 캘린더를 통해 감정 패턴을 한눈에 확인하고, 과거의 기록을 쉽게 찾아볼 수 있어요.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <BarChart2 size={32} color="#10B981" />
            </div>
            <h3 className="feature-title">감정 분석</h3>
            <p className="feature-description">
              AI가 당신의 감정 패턴을 분석하여 인사이트를 제공하고, 감정 관리에 도움을 드립니다.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <MessageCircle size={32} color="#10B981" />
            </div>
            <h3 className="feature-title">AI 챗봇</h3>
            <p className="feature-description">
              감정적 어려움이 있을 때 AI 챗봇과 대화하며 마음을 가볍게 해보세요.
            </p>
          </div>
        </div>
      </section>

      {/* 작동 방식 섹션 */}
      <section className="how-it-works">
        <h2 className="section-title">어떻게 작동하나요?</h2>
        <p className="section-subtitle">
          MoodMate는 간단한 3단계로 당신의 정서적 웰빙을 지원합니다
        </p>

        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3 className="step-title">매일 감정 기록하기</h3>
            <p className="step-description">
              하루의 감정과 경험을 기록하세요. 짧은 메모부터 긴 일기까지 자유롭게 작성할 수 있습니다.
            </p>
          </div>

          <div className="step-arrow">→</div>

          <div className="step">
            <div className="step-number">2</div>
            <h3 className="step-title">패턴 확인하기</h3>
            <p className="step-description">
              시간이 지남에 따라 당신의 감정 패턴을 확인하고, 어떤 요소가 기분에 영향을 미치는지 파악해보세요.
            </p>
          </div>

          <div className="step-arrow">→</div>

          <div className="step">
            <div className="step-number">3</div>
            <h3 className="step-title">인사이트 얻기</h3>
            <p className="step-description">
              AI 분석을 통해 정서적 웰빙을 향상시키는 맞춤형 제안과 인사이트를 받아보세요.
            </p>
          </div>
        </div>
      </section>

      {/* 혜택 섹션 */}
      <section className="benefits-section">
        <h2 className="section-title">MoodMate의 혜택</h2>
        <p className="section-subtitle">
          정서적 웰빙을 위한 첫 번째 단계를 함께 시작해보세요
        </p>

        <div className="benefits-list">
          <div className="benefit-item">
            <CheckCircle size={24} color="#10B981" />
            <p>자기 이해와 인식 향상</p>
          </div>
          <div className="benefit-item">
            <CheckCircle size={24} color="#10B981" />
            <p>스트레스와 불안 감소</p>
          </div>
          <div className="benefit-item">
            <CheckCircle size={24} color="#10B981" />
            <p>감정 패턴 파악을 통한 정서 안정</p>
          </div>
          <div className="benefit-item">
            <CheckCircle size={24} color="#10B981" />
            <p>일상 속 작은 행복 발견</p>
          </div>
          <div className="benefit-item">
            <CheckCircle size={24} color="#10B981" />
            <p>지속적인 자기 성장 도모</p>
          </div>
          <div className="benefit-item">
            <CheckCircle size={24} color="#10B981" />
            <p>감정 관리 능력 향상</p>
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="cta-section">
        <h2 className="cta-title">지금 바로 시작하세요</h2>
        <p className="cta-subtitle">
          더 건강한 정서적 웰빙을 위한 여정, MoodMate와 함께 시작해보세요
        </p>
        <button className="cta-button" onClick={() => navigate('/signup')}>
          시작하기
        </button>
      </section>

      {/* 푸터 */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <img src="/moodmate.png" alt="MoodMate Logo" className="footer-logo-img" />
            <h3>MoodMate</h3>
          </div>
          <p className="footer-copyright">© 2025 MoodMate. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SignupPage.css';

interface SignupPageProps {
  onGoogleSignup: () => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onGoogleSignup }) => {
  const navigate = useNavigate();

  return (
    <div className="signup-container">
      <div className="signup-box">
        <div className="logo-container">
          <img src="/moodmate.png" alt="MoodMate Logo" />
        </div>
        
        <button className="google-signup-button" onClick={onGoogleSignup}>
          <span className="google-icon-text">G</span>
          Google로 계속하기
        </button>

        <div className="login-link">
          이미 계정이 있으신가요? <a href="#" onClick={(e) => { e.preventDefault(); navigate('/login'); }}>로그인</a>
        </div>
      </div>
    </div>
  );
};

export default SignupPage; 
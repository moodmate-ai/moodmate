import React, { useState } from 'react';
import './SignupPage.css';
import { useNavigate } from 'react-router-dom';

interface SignupPageProps {
  onSignup: (name: string, username: string, password: string, confirmPassword: string) => void;
  onGoogleSignup: () => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onSignup, onGoogleSignup }) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSignup(name, username, password, confirmPassword);
    navigate('/dashboard');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <div className="logo-container">
          <h1 className="logo-text">MoodMate</h1>
        </div>
        
        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              className="signup-input"
              placeholder="이름"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className="input-group">
            <input
              type="text"
              className="signup-input"
              placeholder="아이디"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              className="signup-input"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
            >
              {showPassword ? "👁️" : "👁"}
            </button>
          </div>
          
          <div className="input-group">
            <input
              type={showConfirmPassword ? "text" : "password"}
              className="signup-input"
              placeholder="비밀번호 확인"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={toggleConfirmPasswordVisibility}
              aria-label={showConfirmPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
            >
              {showConfirmPassword ? "👁️" : "👁"}
            </button>
          </div>
          
          <button type="submit">회원가입</button>
        </form>
        
        <div className="separator">
          <span className="separator-text">또는</span>
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
import React, { useState } from 'react';
import './LoginPage.css';

interface LoginPageProps {
  onLogin: (username: string, password: string) => void;
  onGoogleLogin: () => void;
  onSignupClick: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onGoogleLogin, onSignupClick }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(username, password);
    window.location.href = '/';
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="logo-container">
          <h1 className="logo-text">MoodMate</h1>
        </div>
        
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              className="login-input"
              placeholder="아이디"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              className="login-input"
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
          
          <div className="remember-me">
            <label className="checkbox-container">
              <input
                type="checkbox"
                className="remember-checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span className="checkbox-custom"></span>
              <span className="checkbox-label">로그인 상태 유지</span>
            </label>
          </div>
          
          <button type="submit">로그인</button>
        </form>
        
        <div className="separator">
          <span className="separator-text">또는</span>
        </div>
        
        <button className="google-login-button" onClick={onGoogleLogin}>
          <span className="google-icon-text">G</span>
          Google로 계속하기
        </button>

        <div className="signup-link">
          계정이 없으신가요? <a href="#" onClick={(e) => { e.preventDefault(); onSignupClick(); }}>회원가입</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 
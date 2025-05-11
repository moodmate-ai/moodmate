import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import './LoginPage.css';

interface LoginPageProps {
  onLogin: (username: string, password: string) => void;
  onGoogleLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onGoogleLogin }) => {
  const navigate = useNavigate();

  const handleSuccess = (credentialResponse: any) => {
    const token = credentialResponse.credential;
    console.log("Google token:", token);
    onGoogleLogin();
    // add backend API 
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="logo-container">
          <img src="/moodmate.png" alt="MoodMate Logo" />
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              console.log("Google Login Success:", credentialResponse);
              onGoogleLogin(); 
            }}
            onError={() => {
              console.log("Google Login Failed");
            }}
            size="large"
            width="100%"
          />
        </div>

        <div className="signup-link">
          계저이 없으신가요? <a href="/signup">회원가입</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
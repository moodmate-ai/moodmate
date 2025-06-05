import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import './LoginPage.css';

interface LoginPageProps {
  onGoogleLogin: (jwt: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onGoogleLogin }) => {
  const handleGoogleSuccess = async (credentialResponse: any) => {
    const credential = credentialResponse.credential;
    if (!credential) return;

    try {
      await onGoogleLogin(credential);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="logo-container">
          <img src="/moodmate.png" alt="MoodMate Logo" />
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => {
              console.log("Google Login Failed");
            }}
            size="large"
            width="100%"
          />
        </div>

        <div className="signup-link">
          {process.env.REACT_APP_BACKEND_URL}
          계정이 없으신가요? <a href="/signup">회원가입</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
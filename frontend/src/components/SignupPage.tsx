import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google'; 
import './SignupPage.css';

interface SignupPageProps {
  onSignup: (name: string, username: string, password: string, confirmPassword: string) => void;
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

    
        <div className="google-signup-button">
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              console.log(credentialResponse);
              onGoogleSignup();
                        }}
            onError={() => {
              console.log('Google Sign Up Failed');
            }}
            text="signup_with"
            shape="pill"
            width="100%" 
          />
        </div>

        <div className="login-link">
          이미 계정이 있으신가요?{' '}
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/login'); }}>로그인</a>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;

import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Save, User, Moon, Sun, Monitor, Trash2, ArrowLeft } from 'lucide-react';
import './ProfilePage.css';

interface ProfilePageProps {
  userName: string;
  profileImage: string;
  onUpdateProfile: (name: string, image: string) => void;
  onThemeChange?: (theme: string) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ 
  userName, 
  profileImage, 
  onUpdateProfile,
  onThemeChange 
}) => {
  const navigate = useNavigate();
  const [name, setName] = useState(userName);
  const [image, setImage] = useState(profileImage);
  const [theme, setTheme] = useState('light'); // 'light', 'dark'
  const [showPictureModal, setShowPictureModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const presetImages = [
    '/avatars/avatar1.png',
    '/avatars/avatar2.png',
    '/avatars/avatar3.png',
    '/avatars/avatar4.png',
    '/avatars/avatar5.png',
    '/avatars/avatar6.png',
  ];

  const handleSave = () => {
    onUpdateProfile(name, image);
    if (onThemeChange) {
      onThemeChange(theme);
    }
    alert('프로필이 성공적으로 업데이트되었습니다!');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
    setShowPictureModal(false);
  };

  const handleSelectPreset = (presetImage: string) => {
    setImage(presetImage);
    setShowPictureModal(false);
  };

  const handleDeleteAccount = () => {
    if (window.confirm('정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      alert('계정이 삭제되었습니다.');
      navigate('/');
    }
  };

  return (
    <div className="profile-container">
      <button 
        className="back-button"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={20} />
        돌아가기
      </button>
      <div className="profile-header">
        <h1 className="profile-title">내 프로필</h1>
        <p className="profile-subtitle">프로필 정보를 관리하고 업데이트하세요</p>
        
        <div className="profile-picture-container">
          <img src={image || '/default-profile.png'} alt="Profile" className="profile-picture" />
          <button 
            className="edit-picture-button"
            onClick={() => setShowPictureModal(true)}
          >
            <Camera size={18} />
          </button>
        </div>
      </div>
      
      <div className="profile-sections">
        <div className="profile-section">
          <div className="section-header">
            <h2 className="section-title">
              <User size={20} />
              개인 정보
            </h2>
          </div>
          <div className="section-content">
            <div className="profile-field">
              <label className="field-label">이름</label>
              <input 
                type="text" 
                className="field-input" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="이름을 입력하세요"
              />
            </div>
          </div>
        </div>
        
        <div className="profile-section">
          <div className="section-header">
            <h2 className="section-title">
              <Monitor size={20} />
              테마 설정
            </h2>
          </div>
          <div className="section-content">
            <div 
              className={`theme-option ${theme === 'light' ? 'selected' : ''}`}
              onClick={() => setTheme('light')}
            >
              <div className="theme-icon">
                <Sun size={20} />
              </div>
              <div className="theme-text">
                <h3>라이트 모드</h3>
                <p>밝은 배경과 어두운 텍스트로 표시됩니다</p>
              </div>
            </div>
            <div 
              className={`theme-option ${theme === 'dark' ? 'selected' : ''}`}
              onClick={() => setTheme('dark')}
            >
              <div className="theme-icon">
                <Moon size={20} />
              </div>
              <div className="theme-text">
                <h3>다크 모드</h3>
                <p>어두운 배경과 밝은 텍스트로 표시됩니다</p>
              </div>
            </div>
          </div>
        </div>

        <button 
          className="save-button"
          onClick={handleSave}
        >
          <Save size={16} />
          저장하기
        </button>
        
        <div className="danger-section">
          <h2 className="danger-title">계정 삭제</h2>
          <p className="danger-text">
            계정을 삭제하면 모든 데이터가 영구적으로 제거되며 복구할 수 없습니다.
          </p>
          <button 
            className="delete-button"
            onClick={handleDeleteAccount}
          >
            <Trash2 size={16} />
            계정 삭제하기
          </button>
        </div>
      </div>
      
      {showPictureModal && (
        <div className="picture-modal" onClick={() => setShowPictureModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">프로필 사진 변경</h2>
              <button 
                className="close-button"
                onClick={() => setShowPictureModal(false)}
              >
                &times;
              </button>
            </div>
            <div className="modal-body">
              <div className="upload-section">
                <button 
                  className="upload-button"
                  onClick={() => fileInputRef.current?.click()}
                >
                  내 기기에서 사진 업로드
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="picture-upload-input" 
                  accept="image/*"
                  onChange={handleFileUpload}
                />
              </div>
              
              <div className="preset-section">
                <h3>프로필 이미지 선택</h3>
                <div className="preset-pictures">
                  {presetImages.map((preset, index) => (
                    <div 
                      key={index}
                      className={`preset-picture ${image === preset ? 'selected' : ''}`}
                      onClick={() => handleSelectPreset(preset)}
                    >
                      <img src={preset} alt={`Preset ${index + 1}`} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { userApi, type UserRequestDTO, type UserResponseDTO } from '../services';
import assert from 'assert';

interface GoogleJwtPayload {
  email: string;
  name: string;
  picture: string;
  sub: string;
  iat: number;
  exp: number;
}

interface AuthUser {
  userId: number;
  email: string;
  username: string;
  role: 'USER' | 'ADMIN';
  name?: string;
  profileImage?: string;
  createdAt: string;
  modifiedAt?: string;
}

interface AuthContextType {
  currentUser: AuthUser | null;
  isLoading: boolean;
  googleLogin: (jwt: string) => Promise<void>;
  logout: () => void;
  updateUserProfile: (name: string, profileImage: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('googleToken');
      if (storedToken) {
        try {
          // Verify token is still valid
          const decoded = jwtDecode<GoogleJwtPayload>(storedToken);
          const currentTime = Date.now() / 1000;
          
          if (decoded.exp > currentTime) {
            // Token is still valid, try to get user info
            await handleGoogleAuth(storedToken, false); // false = don't store token again
          } else {
            // Token expired, clear it
            localStorage.removeItem('googleToken');
          }
        } catch (error) {
          console.error('Error initializing auth:', error);
          localStorage.removeItem('googleToken');
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const handleGoogleAuth = async (jwt: string, shouldStoreToken: boolean = true) => {
    setIsLoading(true);
    try {
      // Decode JWT to get user information
      const decoded = jwtDecode<GoogleJwtPayload>(jwt);
      
      // Store token if needed (for new logins)
      if (shouldStoreToken) {
        localStorage.setItem('googleToken', jwt);
      }

      let userResponse: UserResponseDTO = await userApi.getUserByEmail(decoded.email);
      if (userResponse == null || userResponse.email == null) {
        console.log('User not found, creating new user...');
          
        const userRequest: UserRequestDTO = {
          email: decoded.email,
          username: decoded.email, // Use email as username
          role: 'USER',
          name: decoded.name
        };

        userResponse = await userApi.createUser(userRequest);
        console.log('New user created:', userResponse);
      };


      // Set user in auth context
      const authUser: AuthUser = {
        userId: userResponse.userId,
        email: userResponse.email,
        username: userResponse.username,
        role: userResponse.role,
        name: userResponse.name,
        profileImage: decoded.picture, // Use Google profile picture
        createdAt: userResponse.createdAt?.toString(),
        modifiedAt: userResponse.modifiedAt?.toString()
      };

      setCurrentUser(authUser);
    } catch (error) {
      console.error('Error in Google authentication:', error);
      // Clear token on error
      localStorage.removeItem('googleToken');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = async (jwt: string) => {
    await handleGoogleAuth(jwt, true);
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('googleToken');
  };

  const updateUserProfile = (name: string, profileImage: string) => {
    if (currentUser) {
      setCurrentUser(prev => prev ? { ...prev, name, profileImage } : null);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      isLoading, 
      googleLogin, 
      logout, 
      updateUserProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 
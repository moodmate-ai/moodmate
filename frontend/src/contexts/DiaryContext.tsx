import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { Diary, diaryApi } from '../services/api';
import { useAuth } from './AuthContext';

interface DiaryContextType {
  diaries: Diary[];
  fetchDiaries: () => Promise<void>;
  addDiary: (diary: Omit<Diary, 'id'>) => Promise<void>;
  updateDiary: (id: string, diary: Partial<Diary>) => Promise<void>;
  deleteDiary: (id: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const DiaryContext = createContext<DiaryContextType | undefined>(undefined);

export const DiaryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();

  const fetchDiaries = useCallback(async () => {
    if (!currentUser) {
      setError('사용자가 로그인되어 있지 않습니다.');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await diaryApi.getDiariesByUserId(currentUser.id);
      console.log(response);
      setDiaries(response.map(diary => ({
        id: diary.diaryId.toString(),
        date: diary.createdAt,
        mood: diary.emotion,
        moodEmoji: '',
        content: diary.body,
        growth: 0,
        userId: currentUser.id
      })));
    } catch (error) {
      setError('일기 데이터를 가져오는데 실패했습니다.');
      console.error('Failed to fetch diaries:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  const addDiary = async (diary: Omit<Diary, 'id'>) => {
    if (!currentUser) {
      setError('사용자가 로그인되어 있지 않습니다.');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const newDiary = await diaryApi.createDiary({
        body: diary.content,
        userId: currentUser.id
      });
      setDiaries(prevDiaries => [...prevDiaries, newDiary]);
    } catch (error) {
      setError('일기 생성에 실패했습니다.');
      console.error('Failed to create diary:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateDiary = async (id: string, updatedDiary: Partial<Diary>) => {
    if (!currentUser) {
      setError('사용자가 로그인되어 있지 않습니다.');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await diaryApi.updateDiary(id, {
        ...updatedDiary,
        userId: currentUser.id
      });
      setDiaries(prevDiaries => 
        prevDiaries.map(diary => diary.id === id ? response : diary)
      );
    } catch (error) {
      setError('일기 수정에 실패했습니다.');
      console.error('Failed to update diary:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteDiary = async (id: string) => {
    if (!currentUser) {
      setError('사용자가 로그인되어 있지 않습니다.');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await diaryApi.deleteDiary(id);
      setDiaries(prevDiaries => prevDiaries.filter(diary => diary.id !== id));
    } catch (error) {
      setError('일기 삭제에 실패했습니다.');
      console.error('Failed to delete diary:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchDiaries();
    }
  }, [currentUser]);

  return (
    <DiaryContext.Provider value={{ 
      diaries, 
      fetchDiaries, 
      addDiary, 
      updateDiary, 
      deleteDiary,
      isLoading,
      error
    }}>
      {children}
    </DiaryContext.Provider>
  );
};

export const useDiary = () => {
  const context = useContext(DiaryContext);
  if (!context) {
    throw new Error('useDiary must be used within a DiaryProvider');
  }
  return context;
}; 
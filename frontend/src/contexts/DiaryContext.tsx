import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Diary, diaryApi } from '../services/api';
import { useAuth } from './AuthContext';

interface DiaryContextType {
  diaries: Diary[];
  fetchDiaries: () => Promise<void>;
  addDiary: (diary: Omit<Diary, 'id'>) => Promise<void>;
  updateDiary: (id: string, diary: Partial<Diary>) => Promise<void>;
  deleteDiary: (id: string) => Promise<void>;
}

const DiaryContext = createContext<DiaryContextType | undefined>(undefined);

export const DiaryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const { currentUser } = useAuth();

  const fetchDiaries = async () => {
    try {
      if (!currentUser) {
        console.error('User is not logged in');
        return;
      }
      const response = await diaryApi.getDiariesByUserId(currentUser.id);
      setDiaries(response);
    } catch (error) {
      console.error('Failed to fetch diaries:', error);
    }
  };

  const addDiary = async (diary: Omit<Diary, 'id'>) => {
    try {
      if (!currentUser) {
        console.error('User is not logged in');
        return;
      }
      const newDiary = await diaryApi.createDiary({
        ...diary,
        userId: currentUser.id
      });
      setDiaries(prevDiaries => [...prevDiaries, newDiary]);
    } catch (error) {
      console.error('Failed to create diary:', error);
    }
  };

  const updateDiary = async (id: string, updatedDiary: Partial<Diary>) => {
    try {
      if (!currentUser) {
        console.error('User is not logged in');
        return;
      }
      const response = await diaryApi.updateDiary(id, {
        ...updatedDiary,
        userId: currentUser.id
      });
      setDiaries(prevDiaries => 
        prevDiaries.map(diary => diary.id === id ? response : diary)
      );
    } catch (error) {
      console.error('Failed to update diary:', error);
    }
  };

  const deleteDiary = async (id: string) => {
    try {
      if (!currentUser) {
        console.error('User is not logged in');
        return;
      }
      await diaryApi.deleteDiary(id);
      setDiaries(prevDiaries => prevDiaries.filter(diary => diary.id !== id));
    } catch (error) {
      console.error('Failed to delete diary:', error);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchDiaries();
    }
  }, [currentUser]);

  return (
    <DiaryContext.Provider value={{ diaries, fetchDiaries, addDiary, updateDiary, deleteDiary }}>
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
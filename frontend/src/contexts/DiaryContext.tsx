import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Diary } from '../types/Diary';

interface DiaryContextType {
  diaries: Diary[];
  fetchDiaries: () => Promise<void>;
  addDiary: (diary: Diary) => void;
  updateDiary: (id: number, diary: Diary) => void;
  deleteDiary: (id: string) => void;
}

const DiaryContext = createContext<DiaryContextType | undefined>(undefined);

export const DiaryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [diaries, setDiaries] = useState<Diary[]>(() => {
    const savedDiaries = localStorage.getItem('diaryEntries');
    return savedDiaries ? JSON.parse(savedDiaries) : [];
  });

  useEffect(() => {
    localStorage.setItem('diaryEntries', JSON.stringify(diaries));
  }, [diaries]);

  const fetchDiaries = async () => {
    const savedDiaries = localStorage.getItem('diaryEntries');
    if (savedDiaries) {
      setDiaries(JSON.parse(savedDiaries));
    }
  };

  const addDiary = (diary: Diary) => {
    setDiaries(prevDiaries => [...prevDiaries, diary]);
  };

  const updateDiary = (id: number, updatedDiary: Diary) => {
    setDiaries(diaries.map(diary => diary.id === id ? updatedDiary : diary));
  };

  const deleteDiary = (id: string) => {
    setDiaries(prevDiaries => prevDiaries.filter(diary => diary.id !== id));
  };

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
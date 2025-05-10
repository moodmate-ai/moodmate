import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Diary {
  id: string;
  date: string;
  mood: string;
  moodEmoji: string;
  content: string;
  growth: number;
  userId: number;
}

export const diaryApi = {
  // Create
  createDiary: async (diary: Omit<Diary, 'id'>) => {
    const response = await api.post('/diary/create', diary);
    return response.data;
  },

  // Read
  getDiaryById: async (id: string) => {
    const response = await api.get(`/diary/searchid/${id}`);
    return response.data;
  },

  getDiariesByUserId: async (userId: number) => {
    const response = await api.get(`/diary/searchuserid/${userId}`);
    return response.data;
  },

  // Update
  updateDiary: async (id: string, diary: Partial<Diary>) => {
    const response = await api.put(`/diary/update/${id}`, diary);
    return response.data;
  },

  // Delete
  deleteDiary: async (id: string) => {
    const response = await api.delete(`/diary/delete/${id}`);
    return response.data;
  },
}; 
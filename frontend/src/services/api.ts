import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('googleToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export interface Diary {
  id: string;
  date: string;
  mood: string;
  moodEmoji: string;
  content: string;
  growth: number;
  userId: number;
}

export interface DiaryRequest {
  body: string;
  userId: number;
}

export const diaryApi = {
  // Create
  createDiary: async (diary: DiaryRequest) => {
    const response = await api.post('/diary/create', diary);
    console.log(response.data);
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
import api from './api';

// DTOs based on DiaryDTO.java
export interface DiaryRequestDTO {
  body: string;
  userId: number;
  createdAt: string; // ISO string format for the selected date
}

export interface DiaryResponseDTO {
  diaryId: number;
  body: string;
  userId: number;
  emotion: 'JOY' | 'SADNESS' | 'FEAR' | 'ANGER' | 'NO_EMOTION';
  aiResponse: string;
  createdAt: string;
  modifiedAt?: string;
}

// Legacy interface for compatibility with existing frontend code
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
  // POST /api/v1/diary/create
  createDiary: async (diaryRequest: DiaryRequestDTO): Promise<DiaryResponseDTO> => {
    const response = await api.post('/diary/create', diaryRequest);
    return response.data;
  },

  // GET /api/v1/diary/searchid/{diaryId}
  getDiaryById: async (diaryId: number): Promise<DiaryResponseDTO> => {
    const response = await api.get(`/diary/searchid/${diaryId}`);
    return response.data;
  },

  // GET /api/v1/diary/searchuserid/{userId}
  getDiariesByUserId: async (userId: number): Promise<DiaryResponseDTO[]> => {
    const response = await api.get(`/diary/searchuserid/${userId}`);
    return response.data;
  },

  // PUT /api/v1/diary/update/{diaryId}
  updateDiary: async (diaryId: number, diaryRequest: DiaryRequestDTO): Promise<DiaryResponseDTO> => {
    const response = await api.put(`/diary/update/${diaryId}`, diaryRequest);
    return response.data;
  },

  // DELETE /api/v1/diary/delete/{diaryId}
  deleteDiary: async (diaryId: number): Promise<string> => {
    const response = await api.delete(`/diary/delete/${diaryId}`);
    return response.data;
  },
};

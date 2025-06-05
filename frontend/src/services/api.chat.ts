import axios from 'axios';

// Note: Chat API uses different base URL (without /v1)
const CHAT_API_BASE_URL = process.env.REACT_APP_BACKEND_URL + "/api";

const chatApi = axios.create({
  baseURL: CHAT_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

chatApi.interceptors.request.use(
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

// DTOs based on ChatDTO.java
export interface ChatMessageDTO {
  role: string;
  content: string;
}

export interface ChatRequestDTO {
  userId: number;
  diaryId: number;
  messages: ChatMessageDTO[];
}

export interface ChatResponseDTO {
  userMessage: string;
  botReply: string;
}

// Chat entity interface (for getChatsByDiary response)
export interface Chat {
  id?: number;
  userId: number;
  diaryId: number;
  userMessage: string;
  botReply: string;
  createdAt?: string;
}

export const chatApiService = {
  // POST /api/chat
  processUserMessage: async (chatRequest: ChatRequestDTO): Promise<ChatResponseDTO> => {
    const response = await chatApi.post('/chat', chatRequest);
    return response.data;
  },

  // GET /api/chat/diary/{diaryId}
  getChatsByDiary: async (diaryId: number): Promise<Chat[]> => {
    const response = await chatApi.get(`/chat/diary/${diaryId}`);
    return response.data;
  },
};

import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add Google token to Authorization header
api.interceptors.request.use(
  (config) => {
    const googleToken = localStorage.getItem('googleToken');
    if (googleToken) {
      config.headers.Authorization = `Bearer ${googleToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common responses
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, clear from localStorage
      localStorage.removeItem('googleToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api; 
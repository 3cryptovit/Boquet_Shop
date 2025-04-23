import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Добавляем токен к каждому запросу
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Обрабатываем ошибки
instance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Если токен истек или недействителен, очищаем состояние пользователя
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const apiClient = {
  get: (url, config) => instance.get(url, config),
  post: (url, data, config) => instance.post(url, data, config),
  put: (url, data, config) => instance.put(url, data, config),
  delete: (url, config) => instance.delete(url, config)
}; 
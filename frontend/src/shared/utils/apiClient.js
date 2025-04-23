import axios from 'axios';
import { refreshToken } from './token';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Важно для работы с cookies
});

// Перехватчик ответов для обработки ошибок аутентификации
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Если ошибка 401 (Unauthorized) и запрос еще не пытались повторить
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Пробуем обновить токен
        const result = await refreshToken();

        if (result) {
          // Токен обновлен в refreshToken, повторяем запрос
          return apiClient(originalRequest);
        } else {
          // Если обновление не удалось, возвращаем ошибку
          // Обработку выхода из системы будем делать на уровне компонента
          return Promise.reject(new Error('Сессия истекла. Пожалуйста, войдите снова.'));
        }
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;

// Хелперы для работы с API
export const api = {
  get: (endpoint, config = {}) => apiClient.get(endpoint, config),
  post: (endpoint, data = {}, config = {}) => apiClient.post(endpoint, data, config),
  put: (endpoint, data = {}, config = {}) => apiClient.put(endpoint, data, config),
  patch: (endpoint, data = {}, config = {}) => apiClient.patch(endpoint, data, config),
  delete: (endpoint, config = {}) => apiClient.delete(endpoint, config),

  // Более безопасная проверка авторизации
  requireAuth: () => {
    const isAuth = !!localStorage.getItem('user');
    if (!isAuth) {
      return Promise.reject(new Error('Требуется авторизация'));
    }
    return Promise.resolve();
  }
};

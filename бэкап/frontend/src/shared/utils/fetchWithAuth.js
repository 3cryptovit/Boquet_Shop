import { apiClient } from '../api/apiClient';

/**
 * Выполняет аутентифицированный запрос к API
 * @param {string} url - URL для запроса
 * @param {Object} options - Опции запроса
 * @returns {Promise<Response>} - Promise с ответом от сервера
 */
export const fetchWithAuth = async (url, options = {}) => {
  try {
    const response = await apiClient({
      url,
      ...options
    });
    return response;
  } catch (error) {
    if (error.response?.status === 401) {
      // Если токен истек, перенаправляем на страницу входа
      window.location.href = '/login';
    }
    throw error;
  }
}; 
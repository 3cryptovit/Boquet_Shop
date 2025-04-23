import { getAccessToken, refreshToken } from './authService';

/**
 * Выполняет аутентифицированный запрос к API
 * @param {string} url - URL для запроса
 * @param {Object} options - Опции запроса
 * @returns {Promise<Response>} - Promise с ответом от сервера
 */
export const fetchWithAuth = async (url, options = {}) => {
  // Получаем текущий токен
  const token = getAccessToken();

  // Если токен есть, добавляем его в заголовки
  if (token) {
    options.headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`
    };
  }

  // Выполняем запрос
  let response = await fetch(url, { ...options, credentials: 'include' });

  // Если получили 401 (Unauthorized), пробуем обновить токен
  if (response.status === 401) {
    try {
      // Пробуем обновить токен
      const success = await refreshToken();

      if (success) {
        // Если токен обновлен успешно, повторяем запрос с новым токеном
        const newToken = getAccessToken();
        options.headers = {
          ...options.headers,
          'Authorization': `Bearer ${newToken}`
        };
        response = await fetch(url, { ...options, credentials: 'include' });
      }
    } catch (error) {
      console.error('Ошибка при обновлении токена:', error);
    }
  }

  return response;
}; 
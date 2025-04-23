import apiClient from './apiClient';

const USER_KEY = 'user';

/**
 * Получить данные текущего пользователя из localStorage
 * @returns {Object|null} Данные пользователя или null
 */
export const getStoredUser = () => {
  const userStr = localStorage.getItem(USER_KEY);
  return userStr ? JSON.parse(userStr) : null;
};

/**
 * Сохранить данные пользователя
 * @param {Object} data - Объект с данными пользователя
 */
export const saveUser = (data) => {
  localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  // accessToken не сохраняем в localStorage намеренно для безопасности
  // он хранится только в памяти и устанавливается через setAuthToken
};

/**
 * Удалить данные пользователя
 */
export const removeUser = () => {
  localStorage.removeItem(USER_KEY);
};

/**
 * Установить токен в заголовки запросов
 * @param {string} token - JWT токен
 */
export const setAuthToken = (token) => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
};

/**
 * Обновить токен через API
 * @returns {Promise<Object|null>} Объект с токеном и данными пользователя или null при ошибке
 */
export const refreshToken = async () => {
  try {
    // Используем fetch вместо apiClient чтобы избежать рекурсии с interceptors
    const response = await fetch(`${apiClient.defaults.baseURL}/api/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Не удалось обновить токен');
    }

    const data = await response.json();

    // Сохраняем данные пользователя
    saveUser(data);

    // Устанавливаем токен в заголовки запросов
    setAuthToken(data.accessToken);

    return data;
  } catch (error) {
    console.error('Ошибка при обновлении токена:', error);
    removeUser();

    // Очищаем заголовок авторизации
    delete apiClient.defaults.headers.common['Authorization'];

    return null;
  }
};

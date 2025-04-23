import { api } from '../../shared/utils/apiClient';

/**
 * Авторизация пользователя
 * @param {Object} credentials - Учетные данные пользователя
 * @param {string} credentials.email - Email пользователя
 * @param {string} credentials.password - Пароль пользователя
 * @returns {Promise<Object>} Данные пользователя и токен
 */
export const login = async (credentials) => {
  const response = await api.post('/api/auth/login', credentials);
  return response.data;
};

/**
 * Регистрация нового пользователя
 * @param {Object} userData - Данные нового пользователя
 * @param {string} userData.username - Имя пользователя
 * @param {string} userData.email - Email пользователя
 * @param {string} userData.password - Пароль пользователя
 * @returns {Promise<Object>} Данные пользователя и токен
 */
export const register = async (userData) => {
  const response = await api.post('/api/auth/register', userData);
  return response.data;
};

/**
 * Выход пользователя
 * @returns {Promise<void>}
 */
export const logout = async () => {
  await api.post('/api/auth/logout');
};

/**
 * Получение информации о текущем пользователе
 * @returns {Promise<Object>} Данные пользователя
 */
export const getCurrentUser = async () => {
  const response = await api.get('/api/auth/me');
  return response.data;
};

/**
 * Обновление токена
 * @returns {Promise<Object>} Новый токен
 */
export const refreshAuthToken = async () => {
  const response = await api.post('/api/auth/refresh');
  return response.data;
};

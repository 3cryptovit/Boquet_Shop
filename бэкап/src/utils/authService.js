/**
 * Сервис для работы с аутентификацией и токенами
 */

import useUserStore from '../store/useUserStore';
import useCartStore from '../store/useCartStore';
import useFavoritesStore from '../store/useFavoritesStore';
import { fetchWithAuth } from './fetchWithAuth';

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Получить текущий access token
 * @returns {string|null} Токен или null, если пользователь не авторизован
 */
export const getAccessToken = () => {
  return localStorage.getItem('accessToken');
};

/**
 * Сохранить токены и данные пользователя
 * @param {Object} data - Данные с токенами и информацией о пользователе
 */
export const saveAuthData = async (data) => {
  localStorage.setItem('accessToken', data.accessToken);
  localStorage.setItem('user', JSON.stringify(data.user));
  const userStore = useUserStore.getState();
  await userStore.fetchUser();
};

/**
 * Очистить данные аутентификации
 */
export const clearAuthData = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('user');

  // Очищаем все Zustand-хранилища
  useUserStore.getState().clearUser();
  useCartStore.getState().clearCart();
  useFavoritesStore.getState().clearFavorites();
};

/**
 * Обновить токен
 * @returns {Promise<boolean>} True, если обновление успешно
 */
export const refreshToken = async () => {
  try {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Ошибка обновления токена');
    }

    const data = await response.json();
    await saveAuthData(data);
    return true;
  } catch (error) {
    console.error('Ошибка при обновлении токена:', error);
    clearAuthData();
    return false;
  }
};

/**
 * Выполнить аутентифицированный запрос с обновлением токена при необходимости
 * @param {string} url - URL для запроса
 * @param {Object} options - Опции запроса
 * @returns {Promise<Response>} Ответ сервера
 */
export const authenticatedFetch = async (url, options = {}) => {
  let token = getAccessToken();

  // Добавляем заголовок авторизации
  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`
  };

  // Выполняем запрос
  let response = await fetch(url, { ...options, headers, credentials: 'include' });

  // Если токен истек (401), пробуем обновить
  if (response.status === 401) {
    const isRefreshed = await refreshToken();

    if (isRefreshed) {
      // Если обновление успешно, повторяем запрос с новым токеном
      token = getAccessToken();
      headers.Authorization = `Bearer ${token}`;
      response = await fetch(url, { ...options, headers, credentials: 'include' });
    }
  }

  return response;
};

/**
 * Выход из системы
 * @returns {Promise<boolean>} True, если выход успешен
 */
export const logout = async () => {
  const response = await fetchWithAuth(`${API_URL}/api/auth/logout`, {
    method: 'POST'
  });
  if (!response.ok) throw new Error('Ошибка выхода');
  return response.json();
};

export const getUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const isAuthenticated = () => {
  return !!getAccessToken();
};

export const isAdmin = () => {
  const user = getUser();
  return user?.role === 'admin';
};

/**
 * Регистрация нового пользователя
 */
export const register = async (userData) => {
  const response = await fetchWithAuth(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  });
  if (!response.ok) throw new Error('Ошибка регистрации');
  return response.json();
};

/**
 * Авторизация пользователя
 */
export const login = async (credentials) => {
  const response = await fetchWithAuth(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  });
  if (!response.ok) throw new Error('Ошибка авторизации');
  return response.json();
};

/**
 * Получить информацию о текущем пользователе
 */
export const getCurrentUser = async () => {
  const response = await fetchWithAuth(`${API_URL}/api/auth/me`);
  if (!response.ok) throw new Error('Ошибка получения данных пользователя');
  return response.json();
}; 
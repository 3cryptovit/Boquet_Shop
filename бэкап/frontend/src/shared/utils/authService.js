import { apiClient } from '../api/apiClient';
import { useUserStore } from './userStore';

export const login = async (credentials) => {
  try {
    const response = await apiClient.post('/auth/login', credentials);
    const { user, token } = response.data;

    // Сохраняем токен
    localStorage.setItem('token', token);

    // Обновляем состояние пользователя
    useUserStore.getState().setUser(user);

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const register = async (userData) => {
  try {
    const response = await apiClient.post('/auth/register', userData);
    const { user, token } = response.data;

    // Сохраняем токен
    localStorage.setItem('token', token);

    // Обновляем состояние пользователя
    useUserStore.getState().setUser(user);

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    await apiClient.post('/auth/logout');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Удаляем токен
    localStorage.removeItem('token');

    // Очищаем состояние пользователя
    useUserStore.getState().clearUser();
  }
};

export const fetchMe = async () => {
  try {
    const response = await apiClient.get('/auth/me');
    const { user } = response.data;

    // Обновляем состояние пользователя
    useUserStore.getState().setUser(user);

    return response.data;
  } catch (error) {
    throw error;
  }
}; 
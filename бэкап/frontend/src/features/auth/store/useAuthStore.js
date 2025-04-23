import { create } from 'zustand';
import { apiClient } from '../../../shared/api/apiClient';
import { showError, showSuccess } from '../../../shared/utils/notifications';

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  setUser: (user) => set({
    user,
    isAuthenticated: !!user,
    error: null
  }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const data = await apiClient.post('/auth/login', credentials);
      localStorage.setItem('token', data.token);
      set({
        user: data.user,
        isAuthenticated: true,
        isLoading: false
      });
      showSuccess('Вы успешно вошли в систему');
      return data;
    } catch (error) {
      set({
        error: error.message,
        isLoading: false
      });
      showError(error.message || 'Ошибка входа');
      throw error;
    }
  },

  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      set({
        user: null,
        isAuthenticated: false,
        error: null
      });
    }
  },

  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const data = await apiClient.post('/auth/register', userData);
      localStorage.setItem('token', data.token);
      set({
        user: data.user,
        isAuthenticated: true,
        isLoading: false
      });
      showSuccess('Регистрация успешна');
      return data;
    } catch (error) {
      set({
        error: error.message,
        isLoading: false
      });
      showError(error.message || 'Ошибка регистрации');
      throw error;
    }
  },

  fetchMe: async () => {
    try {
      const data = await apiClient.get('/auth/me');
      set({
        user: data.user,
        isAuthenticated: true
      });
      return data;
    } catch (error) {
      set({
        user: null,
        isAuthenticated: false
      });
      throw error;
    }
  }
})); 
import { create } from 'zustand';
import { getCurrentUser, login as loginApi, logout as logoutApi, register as registerApi } from './api';
import { saveUser, removeUser, getStoredUser, setAuthToken } from '../../shared/utils/token';
import { mapUserFromAPI } from '../../entities/user/user.model';

export const useAuthStore = create((set, get) => ({
  // Состояние
  user: getStoredUser(),
  isAuth: !!getStoredUser(),
  isLoading: false,
  error: null,

  // Действия
  setToken: (token) => {
    setAuthToken(token);
  },

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const data = await loginApi(credentials);
      saveUser(data);

      get().setToken(data.accessToken);

      set({
        user: mapUserFromAPI(data.user),
        isAuth: true,
        isLoading: false,
        error: null
      });
      return data.user;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Ошибка при входе',
        isLoading: false
      });
      throw error;
    }
  },

  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const data = await registerApi(userData);
      saveUser(data);

      get().setToken(data.accessToken);

      set({
        user: mapUserFromAPI(data.user),
        isAuth: true,
        isLoading: false,
        error: null
      });
      return data.user;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Ошибка при регистрации',
        isLoading: false
      });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await logoutApi();
      removeUser();

      get().setToken(null);

      set({
        user: null,
        isAuth: false,
        isLoading: false,
        error: null
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Ошибка при выходе',
        isLoading: false
      });
      throw error;
    }
  },

  checkAuth: async () => {
    if (!getStoredUser()) return null;

    set({ isLoading: true });
    try {
      const userData = await getCurrentUser();
      set({
        user: mapUserFromAPI(userData),
        isAuth: true,
        isLoading: false,
        error: null
      });
      return userData;
    } catch (error) {
      removeUser();

      get().setToken(null);

      set({
        user: null,
        isAuth: false,
        isLoading: false,
        error: error.response?.data?.message || 'Ошибка проверки авторизации'
      });
      return null;
    }
  },

  clearError: () => set({ error: null }),
}));

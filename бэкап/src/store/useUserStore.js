import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const API_URL = "http://localhost:5000";

const useUserStore = create(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      error: null,

      // Загрузка данных пользователя
      fetchUser: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`${API_URL}/api/user/me`, {
            credentials: 'include'
          });

          if (!response.ok) {
            throw new Error("Не удалось загрузить данные пользователя");
          }

          const data = await response.json();
          set({ user: data, isLoading: false });
          return data;
        } catch (error) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      // Очистка данных пользователя
      clearUser: () => set({ user: null, error: null }),

      // Обновление данных пользователя
      updateUser: (userData) => set({ user: userData }),
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({ user: state.user })
    }
  )
);

export default useUserStore; 
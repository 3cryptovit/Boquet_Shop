import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUserStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isAdmin: false,
      isLoading: false,
      error: null,

      setUser: (user) => set({
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        error: null
      }),

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error }),

      initializeFromStorage: () => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          set({
            user,
            isAuthenticated: true,
            isAdmin: user.role === 'admin'
          });
        }
      },

      clearUser: () => {
        localStorage.removeItem('user');
        set({
          user: null,
          isAuthenticated: false,
          isAdmin: false,
          error: null
        });
      }
    }),
    {
      name: 'user-storage'
    }
  )
); 
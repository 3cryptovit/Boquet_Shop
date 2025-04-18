import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const API_URL = "http://localhost:5000";

const useFavoritesStore = create(
  persist(
    (set, get) => ({
      favorites: [],
      isLoading: false,
      error: null,

      // Загрузить избранное с сервера
      fetchFavorites: async () => {
        const token = localStorage.getItem("token");
        if (!token) {
          return;
        }

        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`${API_URL}/api/favorites`, {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          });

          if (!response.ok) {
            throw new Error("Не удалось загрузить избранное");
          }

          const data = await response.json();
          set({ favorites: data, isLoading: false });
        } catch (error) {
          set({ error: error.message, isLoading: false });
        }
      },

      // Добавить букет в избранное
      addToFavorites: async (bouquet) => {
        const token = localStorage.getItem("token");
        if (!token) return;

        // Обновляем локальное состояние для мгновенного отклика UI
        set(state => ({
          favorites: [...state.favorites.filter(item => item.id !== bouquet.id), bouquet],
          isLoading: true
        }));

        // Если пользователь авторизован, синхронизируем с сервером
        try {
          const response = await fetch(`${API_URL}/api/favorites`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ bouquetId: bouquet.id })
          });

          if (!response.ok) {
            throw new Error("Не удалось добавить в избранное");
          }

          // После успешного добавления, обновляем список с сервера
          get().fetchFavorites();
        } catch (error) {
          set({ error: error.message, isLoading: false });
        }
      },

      // Удалить букет из избранного
      removeFromFavorites: async (bouquetId) => {
        const token = localStorage.getItem("token");
        if (!token) return;

        // Обновляем локально для быстрого UI отклика
        set(state => ({
          favorites: state.favorites.filter(item => item.id !== bouquetId),
          isLoading: true
        }));

        // Если авторизован, удаляем на сервере
        try {
          const response = await fetch(`${API_URL}/api/favorites/${bouquetId}`, {
            method: "DELETE",
            headers: {
              "Authorization": `Bearer ${token}`
            }
          });

          if (!response.ok) {
            throw new Error("Не удалось удалить из избранного");
          }

          set({ isLoading: false });
        } catch (error) {
          set({ error: error.message, isLoading: false });
          // В случае ошибки восстанавливаем состояние с сервера
          get().fetchFavorites();
        }
      },

      // Проверить, есть ли букет в избранном
      isFavorite: (bouquetId) => {
        const { favorites } = get();
        return favorites.some(item => item.id === bouquetId || item.bouquet_id === bouquetId);
      },

      // Очистить избранное
      clearFavorites: () => set({ favorites: [], isLoading: false, error: null }),
    }),
    {
      name: 'bouquet-favorites-storage', // имя в localStorage
    }
  )
);

export default useFavoritesStore; 
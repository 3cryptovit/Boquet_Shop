import { create } from 'zustand';
import { getAllBouquets, getBouquetById, addToFavorites as addToFavoritesApi, removeFromFavorites as removeFromFavoritesApi, getFavorites } from './api';
import { mapBouquetFromAPI } from '../../entities/bouquet/bouquet.model';
import { useAuthStore } from '../auth/model';
import { api } from '../../shared/utils/apiClient';

export const useBouquetsStore = create((set, get) => ({
  // Состояние
  bouquets: [],
  currentBouquet: null,
  isLoading: false,
  error: null,

  // Действия
  fetchBouquets: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await getAllBouquets();

      // Преобразуем данные в формат модели
      const mappedBouquets = Array.isArray(data)
        ? data.map(bouquet => mapBouquetFromAPI(bouquet))
        : [];

      set({
        bouquets: mappedBouquets,
        isLoading: false
      });

      return mappedBouquets;
    } catch (error) {
      set({
        error: error.message || 'Ошибка загрузки букетов',
        isLoading: false
      });
      return [];
    }
  },

  fetchBouquetById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const data = await getBouquetById(id);
      const mappedBouquet = mapBouquetFromAPI(data);

      set({
        currentBouquet: mappedBouquet,
        isLoading: false
      });

      return mappedBouquet;
    } catch (error) {
      set({
        error: error.message || 'Ошибка загрузки букета',
        isLoading: false
      });
      return null;
    }
  },

  clearCurrentBouquet: () => {
    set({ currentBouquet: null });
  },

  resetError: () => {
    set({ error: null });
  }
}));

// Создаем отдельное хранилище для избранных букетов, работающее только на сервере
export const useFavoritesStore = create((set, get) => ({
  favorites: [],
  isLoading: false,
  error: null,

  // Загружает избранное с сервера
  fetchFavorites: async () => {
    // Если пользователь не авторизован, ничего не делаем
    if (!useAuthStore.getState().isAuth) {
      set({ favorites: [], isLoading: false });
      return [];
    }

    set({ isLoading: true });
    try {
      const data = await getFavorites();
      const favorites = Array.isArray(data) ? data.map(item => mapBouquetFromAPI(item)) : [];
      set({ favorites, isLoading: false });
      return favorites;
    } catch (error) {
      set({
        error: error.message || 'Ошибка при загрузке избранного',
        isLoading: false
      });
      return [];
    }
  },

  // Проверяет, находится ли букет в избранном
  isFavorite: (bouquetId) => {
    const { favorites } = get();
    return favorites.some(item =>
      item.id === bouquetId ||
      item.bouquet_id === bouquetId
    );
  },

  // Добавляет букет в избранное (на сервере)
  addToFavorites: async (bouquet) => {
    // Если пользователь не авторизован, показываем модальное окно
    if (!useAuthStore.getState().isAuth) {
      return Promise.reject(new Error('Требуется авторизация'));
    }

    try {
      // Добавляем на сервере
      await addToFavoritesApi(bouquet.id);

      // Обновляем локальное состояние
      const { favorites } = get();
      if (!get().isFavorite(bouquet.id)) {
        set({
          favorites: [...favorites, mapBouquetFromAPI(bouquet)]
        });
      }
    } catch (error) {
      set({ error: error.message || 'Ошибка при добавлении в избранное' });
      throw error;
    }
  },

  // Удаляет букет из избранного (на сервере)
  removeFromFavorites: async (bouquetId) => {
    // Если пользователь не авторизован, ничего не делаем
    if (!useAuthStore.getState().isAuth) {
      return Promise.reject(new Error('Требуется авторизация'));
    }

    try {
      // Удаляем на сервере
      await removeFromFavoritesApi(bouquetId);

      // Обновляем локальное состояние
      const { favorites } = get();
      set({
        favorites: favorites.filter(item =>
          item.id !== bouquetId &&
          item.bouquet_id !== bouquetId
        )
      });
    } catch (error) {
      set({ error: error.message || 'Ошибка при удалении из избранного' });
      throw error;
    }
  },

  // Очищает избранное
  clearFavorites: () => set({ favorites: [] }),
}));

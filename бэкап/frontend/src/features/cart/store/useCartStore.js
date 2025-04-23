import { create } from 'zustand';
import { apiClient } from '../../../shared/api/apiClient';
import { showSuccess, showError } from '../../../shared/utils/notifications';

export const useCartStore = create((set, get) => ({
  items: [],
  isLoading: false,
  error: null,

  setItems: (items) => set({ items }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  fetchCart: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await apiClient.get('/cart');
      set({ items: data.items, isLoading: false });
      return data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      showError('Ошибка при загрузке корзины');
      throw error;
    }
  },

  addItem: async (bouquetId, quantity = 1) => {
    set({ isLoading: true, error: null });
    try {
      const data = await apiClient.post('/cart/add', { bouquetId, quantity });
      set({ items: data.items, isLoading: false });
      showSuccess('Товар добавлен в корзину');
      return data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      showError('Ошибка при добавлении товара');
      throw error;
    }
  },

  removeItem: async (bouquetId) => {
    set({ isLoading: true, error: null });
    try {
      const data = await apiClient.post('/cart/remove', { bouquetId });
      set({ items: data.items, isLoading: false });
      showSuccess('Товар удален из корзины');
      return data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      showError('Ошибка при удалении товара');
      throw error;
    }
  },

  updateQuantity: async (bouquetId, quantity) => {
    set({ isLoading: true, error: null });
    try {
      const data = await apiClient.put('/cart/update', { bouquetId, quantity });
      set({ items: data.items, isLoading: false });
      return data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      showError('Ошибка при обновлении количества');
      throw error;
    }
  },

  clearCart: async () => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.post('/cart/clear');
      set({ items: [], isLoading: false });
      showSuccess('Корзина очищена');
    } catch (error) {
      set({ error: error.message, isLoading: false });
      showError('Ошибка при очистке корзины');
      throw error;
    }
  },

  getTotalItems: () => {
    const { items } = get();
    return items.reduce((total, item) => total + item.quantity, 0);
  },

  getTotalPrice: () => {
    const { items } = get();
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  }
}));

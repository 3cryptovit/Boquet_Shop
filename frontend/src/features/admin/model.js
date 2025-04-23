import { create } from 'zustand';
import * as adminApi from './api';

export const useAdminStore = create((set, get) => ({
  // Пользователи
  users: [],
  isLoadingUsers: false,
  userError: null,

  // Заказы
  orders: [],
  isLoadingOrders: false,
  orderError: null,

  // Букеты
  bouquets: [],
  isLoadingBouquets: false,
  bouquetError: null,

  // Загрузка и редактирование
  isSubmitting: false,
  submitError: null,

  // Действия с пользователями
  fetchUsers: async () => {
    try {
      set({ isLoadingUsers: true, userError: null });
      const users = await adminApi.getAllUsers();
      set({ users, isLoadingUsers: false });
    } catch (error) {
      set({
        isLoadingUsers: false,
        userError: error.response?.data?.message || 'Ошибка при загрузке пользователей'
      });
    }
  },

  changeUserRole: async (userId, role) => {
    try {
      set({ isSubmitting: true, submitError: null });
      const updatedUser = await adminApi.changeUserRole(userId, role);

      // Обновляем пользователя в списке
      set({
        users: get().users.map(user =>
          user.id === userId ? { ...user, role } : user
        ),
        isSubmitting: false
      });
      return updatedUser;
    } catch (error) {
      set({
        isSubmitting: false,
        submitError: error.response?.data?.message || 'Ошибка при изменении роли пользователя'
      });
      return null;
    }
  },

  // Действия с заказами
  fetchOrders: async () => {
    try {
      set({ isLoadingOrders: true, orderError: null });
      const orders = await adminApi.getAllOrders();
      set({ orders, isLoadingOrders: false });
    } catch (error) {
      set({
        isLoadingOrders: false,
        orderError: error.response?.data?.message || 'Ошибка при загрузке заказов'
      });
    }
  },

  updateOrderStatus: async (orderId, status) => {
    try {
      set({ isSubmitting: true, submitError: null });
      const updatedOrder = await adminApi.updateOrderStatus(orderId, status);

      // Обновляем заказ в списке
      set({
        orders: get().orders.map(order =>
          order.id === orderId ? { ...order, status } : order
        ),
        isSubmitting: false
      });
      return updatedOrder;
    } catch (error) {
      set({
        isSubmitting: false,
        submitError: error.response?.data?.message || 'Ошибка при обновлении статуса заказа'
      });
      return null;
    }
  },

  // Действия с букетами
  fetchBouquets: async () => {
    try {
      set({ isLoadingBouquets: true, bouquetError: null });
      const bouquets = await adminApi.getAllOrders();
      set({ bouquets, isLoadingBouquets: false });
    } catch (error) {
      set({
        isLoadingBouquets: false,
        bouquetError: error.response?.data?.message || 'Ошибка при загрузке букетов'
      });
    }
  },

  createBouquet: async (bouquetData) => {
    try {
      set({ isSubmitting: true, submitError: null });
      const newBouquet = await adminApi.createBouquet(bouquetData);

      // Добавляем букет в список
      set({
        bouquets: [...get().bouquets, newBouquet],
        isSubmitting: false
      });
      return newBouquet;
    } catch (error) {
      set({
        isSubmitting: false,
        submitError: error.response?.data?.message || 'Ошибка при создании букета'
      });
      return null;
    }
  },

  updateBouquet: async (bouquetId, bouquetData) => {
    try {
      set({ isSubmitting: true, submitError: null });
      const updatedBouquet = await adminApi.updateBouquet(bouquetId, bouquetData);

      // Обновляем букет в списке
      set({
        bouquets: get().bouquets.map(bouquet =>
          bouquet.id === bouquetId ? { ...bouquet, ...bouquetData } : bouquet
        ),
        isSubmitting: false
      });
      return updatedBouquet;
    } catch (error) {
      set({
        isSubmitting: false,
        submitError: error.response?.data?.message || 'Ошибка при обновлении букета'
      });
      return null;
    }
  },

  deleteBouquet: async (bouquetId) => {
    try {
      set({ isSubmitting: true, submitError: null });
      await adminApi.deleteBouquet(bouquetId);

      // Удаляем букет из списка
      set({
        bouquets: get().bouquets.filter(bouquet => bouquet.id !== bouquetId),
        isSubmitting: false
      });
      return true;
    } catch (error) {
      set({
        isSubmitting: false,
        submitError: error.response?.data?.message || 'Ошибка при удалении букета'
      });
      return false;
    }
  },

  // Сброс ошибок
  resetErrors: () => {
    set({
      userError: null,
      orderError: null,
      bouquetError: null,
      submitError: null
    });
  }
}));


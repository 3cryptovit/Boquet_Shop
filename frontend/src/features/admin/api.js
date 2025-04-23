import { api } from '../../shared/utils/apiClient';

/**
 * Получение списка всех пользователей (только для админов)
 * @returns {Promise<Array>} Список пользователей
 */
export const getAllUsers = async () => {
  const response = await api.get('/api/admin/users');
  return response.data;
};

/**
 * Изменение роли пользователя
 * @param {string} userId - ID пользователя
 * @param {string} role - Новая роль (admin/user)
 * @returns {Promise<Object>} Обновленный пользователь
 */
export const changeUserRole = async (userId, role) => {
  const response = await api.put(`/api/admin/users/${userId}/role`, { role });
  return response.data;
};

/**
 * Получение списка всех заказов
 * @returns {Promise<Array>} Список заказов
 */
export const getAllOrders = async () => {
  const response = await api.get('/api/admin/orders');
  return response.data;
};

/**
 * Обновление статуса заказа
 * @param {string} orderId - ID заказа
 * @param {string} status - Новый статус
 * @returns {Promise<Object>} Обновленный заказ
 */
export const updateOrderStatus = async (orderId, status) => {
  const response = await api.put(`/api/admin/orders/${orderId}/status`, { status });
  return response.data;
};

/**
 * Создание нового букета
 * @param {Object} bouquetData - Данные букета
 * @returns {Promise<Object>} Созданный букет
 */
export const createBouquet = async (bouquetData) => {
  const response = await api.post('/api/admin/bouquets', bouquetData);
  return response.data;
};

/**
 * Обновление букета
 * @param {string} bouquetId - ID букета
 * @param {Object} bouquetData - Данные букета
 * @returns {Promise<Object>} Обновленный букет
 */
export const updateBouquet = async (bouquetId, bouquetData) => {
  const response = await api.put(`/api/admin/bouquets/${bouquetId}`, bouquetData);
  return response.data;
};

/**
 * Удаление букета
 * @param {string} bouquetId - ID букета
 * @returns {Promise<void>}
 */
export const deleteBouquet = async (bouquetId) => {
  await api.delete(`/api/admin/bouquets/${bouquetId}`);
};

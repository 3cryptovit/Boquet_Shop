import { api } from '../../shared/utils/apiClient';

/**
 * Получить все букеты (публичный доступ)
 * @returns {Promise<Array>} Массив букетов
 */
export const getAllBouquets = () => {
  return api.get('/api/bouquets');
};

/**
 * Получить букет по ID
 * @param {string|number} id - ID букета
 * @returns {Promise<Object>} Данные букета
 */
export const getBouquetById = (id) => {
  return api.get(`/api/bouquets/${id}`);
};

/**
 * Получить все цветы для конструктора
 * @returns {Promise<Array>} Массив цветов
 */
export const getAllFlowers = () => {
  return api.get('/api/flowers');
};

/**
 * Добавить букет в избранное (требует авторизации)
 * @param {string|number} bouquetId - ID букета
 * @returns {Promise<Object>} Результат операции
 */
export const addToFavorites = (bouquetId) => {
  return api.post(`/api/favorites/${bouquetId}`);
};

/**
 * Удалить букет из избранного (требует авторизации)
 * @param {string|number} bouquetId - ID букета
 * @returns {Promise<Object>} Результат операции
 */
export const removeFromFavorites = (bouquetId) => {
  return api.delete(`/api/favorites/${bouquetId}`);
};

/**
 * Получить все избранные букеты пользователя (требует авторизации)
 * @returns {Promise<Array>} Массив избранных букетов
 */
export const getFavorites = () => {
  return api.get('/api/favorites');
};

/**
 * Добавить букет в корзину (требует авторизации)
 * @param {string|number} bouquetId - ID букета
 * @param {number} quantity - Количество
 * @returns {Promise<Object>} Результат операции
 */
export const addToCart = (bouquetId, quantity = 1) => {
  return api.post('/api/cart', { bouquetId, quantity });
};

/**
 * Добавить кастомный букет в корзину (требует авторизации)
 * @param {string|number} customBouquetId - ID кастомного букета
 * @param {number} quantity - Количество
 * @returns {Promise<Object>} Результат операции
 */
export const addCustomBouquetToCart = (customBouquetId, quantity = 1) => {
  return api.post('/api/cart', { customBouquetId, quantity });
};

/**
 * Сохранить кастомный букет
 * @param {Object} bouquetData - Данные кастомного букета
 * @returns {Promise<Object>} Результат операции
 */
export const saveCustomBouquet = (bouquetData) => {
  return api.post('/api/custom-bouquets', bouquetData);
};

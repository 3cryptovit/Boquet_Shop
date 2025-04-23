import { api } from '../../shared/utils/apiClient';

/**
 * Получить все цветы для конструктора
 * @returns {Promise<Array>} Массив цветов
 */
export const getAllFlowers = () => {
  return api.get('/api/flowers');
};

/**
 * Сохранить кастомный букет в базе данных
 * @param {Object} bouquetData - Данные букета
 * @param {string} bouquetData.name - Название букета
 * @param {string} bouquetData.description - Описание букета
 * @param {number} bouquetData.price - Цена букета
 * @param {Array} bouquetData.flowers - Массив цветов в букете с их расположением
 * @returns {Promise<Object>} Созданный букет
 */
export const saveCustomBouquet = (bouquetData) => {
  // Проверка авторизации перед отправкой запроса
  return api.requireAuth(() => {
    return api.post('/api/custom-bouquets', bouquetData);
  });
};

/**
 * Добавить кастомный букет в корзину
 * @param {string|number} customBouquetId - ID кастомного букета
 * @param {number} quantity - Количество
 * @returns {Promise<Object>} Результат операции
 */
export const addCustomBouquetToCart = (customBouquetId, quantity = 1) => {
  return api.requireAuth(() => {
    return api.post('/api/cart', { customBouquetId, quantity });
  });
};

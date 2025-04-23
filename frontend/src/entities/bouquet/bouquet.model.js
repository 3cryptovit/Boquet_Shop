/**
 * Модель букета
 * @typedef {Object} Bouquet
 * @property {string} id - ID букета
 * @property {string} name - Название букета
 * @property {number} price - Цена букета
 * @property {string} image - URL изображения
 * @property {string} description - Описание букета
 * @property {Array<string>} tags - Теги букета
 * @property {boolean} isCustom - Является ли букет кастомным
 * @property {Array<Flower>} [flowers] - Цветы в букете (опционально)
 * @property {string} [userId] - ID создателя кастомного букета (опционально)
 */

/**
 * Модель для цветка в букете
 * @typedef {Object} FlowerInBouquet
 * @property {string} id - ID цветка
 * @property {string} flowerId - ID типа цветка
 * @property {number} x - Координата X
 * @property {number} y - Координата Y
 * @property {number} layer - Слой отображения
 * @property {number} angle - Угол поворота в градусах
 */

/**
 * Вычисляет общую стоимость букета с учетом скидки
 * @param {Bouquet} bouquet - Объект букета
 * @param {number} [discount=0] - Скидка в процентах (0-100)
 * @returns {number} Стоимость букета с учетом скидки
 */
export const calculatePrice = (bouquet, discount = 0) => {
  if (!bouquet) return 0;
  if (discount < 0 || discount > 100) {
    throw new Error('Скидка должна быть от 0 до 100');
  }

  return bouquet.price * (1 - discount / 100);
};

/**
 * Преобразует данные букета с сервера в объект модели
 * @param {Object} data - Данные с сервера
 * @returns {Bouquet} Объект букета
 */
export const mapBouquetFromAPI = (data) => {
  return {
    id: data.id,
    name: data.name,
    price: data.price,
    image: data.image,
    description: data.description || '',
    tags: data.tags || [],
    isCustom: data.isCustom || false,
    flowers: data.flowers || [],
    userId: data.userId || null,
  };
};

/**
 * Проверяет, является ли букет избранным
 * @param {Bouquet} bouquet - Объект букета
 * @param {Array<string>} favoriteIds - Массив ID избранных букетов
 * @returns {boolean} true, если букет находится в избранном
 */
export const isFavorite = (bouquet, favoriteIds = []) => {
  return favoriteIds.includes(bouquet.id);
}; 
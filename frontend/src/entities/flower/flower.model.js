/**
 * Модель цветка
 * @typedef {Object} Flower
 * @property {string} id - ID цветка
 * @property {string} name - Название цветка
 * @property {number} price - Цена цветка
 * @property {string} image - URL изображения
 * @property {string} description - Описание цветка
 * @property {string} color - Цвет цветка
 * @property {string} type - Тип цветка
 * @property {number} [stock] - Количество в наличии (опционально)
 */

/**
 * Проверяет, доступен ли цветок для добавления в букет
 * @param {Flower} flower - Объект цветка
 * @returns {boolean} true, если цветок доступен
 */
export const isAvailable = (flower) => {
  return flower.stock === undefined || flower.stock > 0;
};

/**
 * Преобразует данные цветка с сервера в объект модели
 * @param {Object} data - Данные с сервера
 * @returns {Flower} Объект цветка
 */
export const mapFlowerFromAPI = (data) => {
  return {
    id: data.id,
    name: data.name,
    price: data.price,
    image: data.image,
    description: data.description || '',
    color: data.color,
    type: data.type,
    stock: data.stock,
  };
};

/**
 * Группирует цветы по типу
 * @param {Array<Flower>} flowers - Массив цветов
 * @returns {Object} Объект, где ключи - типы цветов, а значения - массивы цветов
 */
export const groupFlowersByType = (flowers) => {
  return flowers.reduce((acc, flower) => {
    if (!acc[flower.type]) {
      acc[flower.type] = [];
    }

    acc[flower.type].push(flower);
    return acc;
  }, {});
};

/**
 * Фильтрует цветы по заданным критериям
 * @param {Array<Flower>} flowers - Массив цветов
 * @param {Object} filters - Объект с фильтрами
 * @param {string[]} [filters.types] - Массив типов цветов
 * @param {string[]} [filters.colors] - Массив цветов
 * @param {number} [filters.maxPrice] - Максимальная цена
 * @returns {Array<Flower>} Отфильтрованный массив цветов
 */
export const filterFlowers = (flowers, filters = {}) => {
  return flowers.filter(flower => {
    // Фильтр по типу
    if (filters.types && filters.types.length > 0) {
      if (!filters.types.includes(flower.type)) {
        return false;
      }
    }

    // Фильтр по цвету
    if (filters.colors && filters.colors.length > 0) {
      if (!filters.colors.includes(flower.color)) {
        return false;
      }
    }

    // Фильтр по максимальной цене
    if (filters.maxPrice && flower.price > filters.maxPrice) {
      return false;
    }

    return true;
  });
}; 
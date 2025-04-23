/**
 * Утилиты для работы с localStorage
 */

/**
 * Получить данные из localStorage
 * @param {string} key - Ключ
 * @param {*} defaultValue - Значение по умолчанию, если данные не найдены
 * @returns {*} Данные из localStorage или defaultValue
 */
export const getItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Ошибка при получении данных из localStorage (${key}):`, error);
    return defaultValue;
  }
};

/**
 * Сохранить данные в localStorage
 * @param {string} key - Ключ
 * @param {*} value - Значение
 */
export const setItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Ошибка при сохранении данных в localStorage (${key}):`, error);
  }
};

/**
 * Удалить данные из localStorage
 * @param {string} key - Ключ
 */
export const removeItem = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Ошибка при удалении данных из localStorage (${key}):`, error);
  }
};

/**
 * Проверить наличие данных в localStorage
 * @param {string} key - Ключ
 * @returns {boolean} true, если данные существуют
 */
export const hasItem = (key) => {
  return localStorage.getItem(key) !== null;
};

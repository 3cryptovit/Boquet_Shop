const prisma = require('../prisma/client');

/**
 * Рассчитывает общую сумму корзины пользователя
 * с учётом обычных и кастомных букетов.
 *
 * @param {Array} cartItems - элементы корзины
 * @returns {number} общая сумма
 */
async function calculateCartTotal(cartItems) {
  let total = 0;

  for (const item of cartItems) {
    // Обычный букет
    if (item.bouquetId && item.bouquet) {
      total += item.bouquet.price * item.quantity;
    }

    // Кастомный букет
    else if (item.customBouquetId && item.customBouquet) {
      total += item.customBouquet.price * item.quantity;
    }

    // Подстраховка на случай повреждённого объекта
    else {
      console.warn('Неизвестный объект в корзине:', item);
    }
  }

  return total;
}

module.exports = calculateCartTotal;

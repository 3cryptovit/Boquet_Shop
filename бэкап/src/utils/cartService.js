import { fetchWithAuth } from './fetchWithAuth';

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Получить корзину пользователя
 */
export const getCart = async () => {
  const response = await fetchWithAuth(`${API_URL}/api/cart`);
  if (!response.ok) throw new Error('Ошибка получения корзины');
  return response.json();
};

/**
 * Добавить товар в корзину
 */
export const addToCart = async (itemData) => {
  const response = await fetchWithAuth(`${API_URL}/api/cart`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(itemData)
  });
  if (!response.ok) throw new Error('Ошибка добавления товара в корзину');
  return response.json();
};

/**
 * Обновить количество товара в корзине
 */
export const updateCartItem = async (itemId, quantity) => {
  const response = await fetchWithAuth(`${API_URL}/api/cart/${itemId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ quantity })
  });
  if (!response.ok) throw new Error('Ошибка обновления товара в корзине');
  return response.json();
};

/**
 * Удалить товар из корзины
 */
export const removeFromCart = async (itemId) => {
  const response = await fetchWithAuth(`${API_URL}/api/cart/${itemId}`, {
    method: 'DELETE'
  });
  if (!response.ok) throw new Error('Ошибка удаления товара из корзины');
  return response.json();
};

/**
 * Очистить корзину
 */
export const clearCart = async () => {
  const response = await fetchWithAuth(`${API_URL}/api/cart`, {
    method: 'DELETE'
  });
  if (!response.ok) throw new Error('Ошибка очистки корзины');
  return response.json();
}; 
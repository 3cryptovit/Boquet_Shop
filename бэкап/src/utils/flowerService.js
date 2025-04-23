import { fetchWithAuth } from './fetchWithAuth';

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Получить все цветы
 */
export const getAllFlowers = async () => {
  const response = await fetchWithAuth(`${API_URL}/api/flowers`);
  if (!response.ok) throw new Error('Ошибка получения цветов');
  return response.json();
};

/**
 * Создать новый цветок (только для админа)
 */
export const createFlower = async (flowerData) => {
  const response = await fetchWithAuth(`${API_URL}/api/admin/flowers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(flowerData)
  });
  if (!response.ok) throw new Error('Ошибка создания цветка');
  return response.json();
};

/**
 * Обновить цветок (только для админа)
 */
export const updateFlower = async (id, flowerData) => {
  const response = await fetchWithAuth(`${API_URL}/api/admin/flowers/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(flowerData)
  });
  if (!response.ok) throw new Error('Ошибка обновления цветка');
  return response.json();
};

/**
 * Удалить цветок (только для админа)
 */
export const deleteFlower = async (id) => {
  const response = await fetchWithAuth(`${API_URL}/api/admin/flowers/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) throw new Error('Ошибка удаления цветка');
  return response.json();
}; 
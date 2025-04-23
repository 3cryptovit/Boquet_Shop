import { fetchWithAuth } from './fetchWithAuth';

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Получить все публичные букеты
 */
export const getAllPublicBouquets = async () => {
  const response = await fetchWithAuth(`${API_URL}/api/bouquets`);
  if (!response.ok) throw new Error('Ошибка получения букетов');
  return response.json();
};

/**
 * Получить букет по ID
 */
export const getBouquetById = async (id) => {
  const response = await fetchWithAuth(`${API_URL}/api/bouquets/${id}`);
  if (!response.ok) throw new Error('Ошибка получения букета');
  return response.json();
};

/**
 * Создать новый букет (только для админа)
 */
export const createBouquet = async (bouquetData) => {
  const response = await fetchWithAuth(`${API_URL}/api/admin/bouquets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(bouquetData)
  });
  if (!response.ok) throw new Error('Ошибка создания букета');
  return response.json();
};

/**
 * Обновить букет (только для админа)
 */
export const updateBouquet = async (id, bouquetData) => {
  const response = await fetchWithAuth(`${API_URL}/api/admin/bouquets/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(bouquetData)
  });
  if (!response.ok) throw new Error('Ошибка обновления букета');
  return response.json();
};

/**
 * Удалить букет (только для админа)
 */
export const deleteBouquet = async (id) => {
  const response = await fetchWithAuth(`${API_URL}/api/admin/bouquets/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) throw new Error('Ошибка удаления букета');
  return response.json();
};

/**
 * Загрузить изображение букета (только для админа)
 */
export const uploadBouquetImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetchWithAuth(`${API_URL}/api/admin/uploads`, {
    method: 'POST',
    body: formData
  });
  if (!response.ok) throw new Error('Ошибка загрузки изображения');
  return response.json();
}; 
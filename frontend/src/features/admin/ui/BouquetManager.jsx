import React, { useEffect, useState } from 'react';
import { useAdminStore } from '../model';
import Button from '../../../shared/ui/Button';
import Modal from '../../../shared/ui/Modal';
import { formatImageUrl } from '../../../shared/utils/imageUrl';

const BouquetManager = () => {
  const {
    bouquets,
    isLoadingBouquets,
    bouquetError,
    isSubmitting,
    submitError,
    fetchBouquets,
    createBouquet,
    updateBouquet,
    deleteBouquet
  } = useAdminStore();

  const [selectedBouquet, setSelectedBouquet] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    composition: '',
    isCustom: false
  });

  useEffect(() => {
    fetchBouquets();
  }, [fetchBouquets]);

  // Обработчики действий
  const handleOpenCreateModal = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      image: '',
      composition: '',
      isCustom: false
    });
    setIsCreateModalOpen(true);
  };

  const handleOpenEditModal = (bouquet) => {
    setSelectedBouquet(bouquet);
    setFormData({
      name: bouquet.name,
      description: bouquet.description || '',
      price: bouquet.price,
      image: bouquet.image,
      composition: Array.isArray(bouquet.flowers)
        ? bouquet.flowers.map(f => `${f.name || f.type} - ${f.quantity || 1} шт.`).join(', ')
        : '',
      isCustom: bouquet.isCustom || false
    });
    setIsEditModalOpen(true);
  };

  const handleOpenDeleteModal = (bouquet) => {
    setSelectedBouquet(bouquet);
    setIsDeleteModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleCreateBouquet = async (e) => {
    e.preventDefault();

    // Подготавливаем данные для API
    const bouquetData = {
      ...formData,
      price: Number(formData.price),
      flowers: formData.composition ? parseComposition(formData.composition) : []
    };

    const result = await createBouquet(bouquetData);
    if (result) {
      setIsCreateModalOpen(false);
    }
  };

  const handleUpdateBouquet = async (e) => {
    e.preventDefault();
    if (!selectedBouquet) return;

    // Подготавливаем данные для API
    const bouquetData = {
      ...formData,
      price: Number(formData.price),
      flowers: formData.composition ? parseComposition(formData.composition) : []
    };

    const result = await updateBouquet(selectedBouquet.id, bouquetData);
    if (result) {
      setIsEditModalOpen(false);
    }
  };

  const handleDeleteBouquet = async () => {
    if (!selectedBouquet) return;

    const result = await deleteBouquet(selectedBouquet.id);
    if (result) {
      setIsDeleteModalOpen(false);
    }
  };

  // Вспомогательная функция для парсинга состава
  const parseComposition = (compositionString) => {
    return compositionString.split(',').map(item => {
      const [name, quantityStr] = item.split('-').map(s => s.trim());
      const quantity = parseInt(quantityStr) || 1;
      return { name, quantity };
    });
  };

  if (isLoadingBouquets) {
    return (
      <div className="p-6 text-center">
        <p>Загрузка букетов...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Управление букетами</h2>
        <Button onClick={handleOpenCreateModal}>Создать букет</Button>
      </div>

      {bouquetError && (
        <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
          {bouquetError}
        </div>
      )}

      {bouquets.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-gray-500">Нет доступных букетов</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bouquets.map(bouquet => (
            <div key={bouquet.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 overflow-hidden">
                <img
                  src={formatImageUrl(bouquet.image)}
                  alt={bouquet.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold">{bouquet.name}</h3>
                <p className="text-primary font-bold">{bouquet.price} ₽</p>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                  {bouquet.description || 'Без описания'}
                </p>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleOpenEditModal(bouquet)}
                  >
                    Изменить
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleOpenDeleteModal(bouquet)}
                  >
                    Удалить
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Модальное окно создания букета */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Создание букета"
        size="large"
      >
        <form onSubmit={handleCreateBouquet}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Название</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Описание</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              rows="3"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Цена (₽)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              min="0"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">URL изображения</label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Состав (формат: название - количество, ...)</label>
            <textarea
              name="composition"
              value={formData.composition}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              placeholder="Пример: Роза красная - 5, Гипсофила - 3"
              rows="2"
            />
          </div>

          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isCustom"
                checked={formData.isCustom}
                onChange={handleChange}
                className="mr-2"
              />
              <span>Пользовательский букет</span>
            </label>
          </div>

          {submitError && (
            <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
              {submitError}
            </div>
          )}

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Отмена
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Сохранение...' : 'Создать букет'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Модальное окно редактирования букета */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Редактирование букета"
        size="large"
      >
        <form onSubmit={handleUpdateBouquet}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Название</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Описание</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              rows="3"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Цена (₽)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              min="0"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">URL изображения</label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Состав (формат: название - количество, ...)</label>
            <textarea
              name="composition"
              value={formData.composition}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              placeholder="Пример: Роза красная - 5, Гипсофила - 3"
              rows="2"
            />
          </div>

          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isCustom"
                checked={formData.isCustom}
                onChange={handleChange}
                className="mr-2"
              />
              <span>Пользовательский букет</span>
            </label>
          </div>

          {submitError && (
            <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
              {submitError}
            </div>
          )}

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsEditModalOpen(false)}
            >
              Отмена
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Сохранение...' : 'Сохранить изменения'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Модальное окно удаления букета */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Удаление букета"
        size="small"
      >
        <p className="mb-6">
          Вы уверены, что хотите удалить букет "{selectedBouquet?.name}"? Это действие нельзя отменить.
        </p>

        {submitError && (
          <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
            {submitError}
          </div>
        )}

        <div className="flex justify-end gap-3">
          <Button
            variant="secondary"
            onClick={() => setIsDeleteModalOpen(false)}
          >
            Отмена
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteBouquet}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Удаление...' : 'Удалить'}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default BouquetManager;

import React, { useEffect, useState } from 'react';
import { useBouquetStore } from '../../catalog/store/useBouquetStore';
import { showSuccess, showError } from '../../../shared/utils/notifications';

export const AdminBouquetsPage = () => {
  const { bouquets, isLoading, error, fetchBouquets, createBouquet, updateBouquet, deleteBouquet } = useBouquetStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBouquet, setEditingBouquet] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    composition: []
  });

  useEffect(() => {
    fetchBouquets();
  }, [fetchBouquets]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBouquet) {
        await updateBouquet(editingBouquet.id, formData);
        showSuccess('Букет успешно обновлен');
      } else {
        await createBouquet(formData);
        showSuccess('Букет успешно создан');
      }
      setIsModalOpen(false);
      setEditingBouquet(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        image: '',
        composition: []
      });
    } catch (error) {
      showError('Не удалось сохранить букет');
    }
  };

  const handleEdit = (bouquet) => {
    setEditingBouquet(bouquet);
    setFormData({
      name: bouquet.name,
      description: bouquet.description,
      price: bouquet.price,
      category: bouquet.category,
      image: bouquet.image,
      composition: bouquet.composition
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить этот букет?')) {
      try {
        await deleteBouquet(id);
        showSuccess('Букет успешно удален');
      } catch (error) {
        showError('Не удалось удалить букет');
      }
    }
  };

  if (isLoading) {
    return <div className="loading">Загрузка...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="admin-bouquets-page">
      <h1>Управление букетами</h1>
      <button
        onClick={() => {
          setEditingBouquet(null);
          setFormData({
            name: '',
            description: '',
            price: '',
            category: '',
            image: '',
            composition: []
          });
          setIsModalOpen(true);
        }}
        className="btn btn-primary"
      >
        Добавить букет
      </button>

      <div className="bouquets-list">
        {bouquets.map(bouquet => (
          <div key={bouquet.id} className="bouquet-item">
            <img src={bouquet.image} alt={bouquet.name} />
            <div className="bouquet-info">
              <h3>{bouquet.name}</h3>
              <p>{bouquet.description}</p>
              <p className="price">{bouquet.price} ₽</p>
              <p className="category">Категория: {bouquet.category}</p>
            </div>
            <div className="bouquet-actions">
              <button
                onClick={() => handleEdit(bouquet)}
                className="btn btn-secondary"
              >
                Редактировать
              </button>
              <button
                onClick={() => handleDelete(bouquet.id)}
                className="btn btn-danger"
              >
                Удалить
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>{editingBouquet ? 'Редактировать букет' : 'Добавить букет'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Название</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Описание</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="price">Цена</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="category">Категория</label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="image">URL изображения</label>
                <input
                  type="text"
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  {editingBouquet ? 'Сохранить' : 'Создать'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-secondary"
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}; 
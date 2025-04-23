import React, { useState, useEffect } from 'react';
import { showError, showSuccess } from '../../../shared/utils/notifications';

export const AdminFlowersPage = () => {
  const [flowers, setFlowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newFlower, setNewFlower] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    stock: ''
  });

  useEffect(() => {
    fetchFlowers();
  }, []);

  const fetchFlowers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/flowers');
      if (!response.ok) {
        throw new Error('Ошибка при загрузке цветов');
      }
      const data = await response.json();
      setFlowers(data);
    } catch (error) {
      showError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFlower(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/flowers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newFlower),
      });

      if (!response.ok) {
        throw new Error('Ошибка при создании цветка');
      }

      showSuccess('Цветок успешно добавлен');
      fetchFlowers();
      setNewFlower({
        name: '',
        description: '',
        price: '',
        imageUrl: '',
        stock: ''
      });
    } catch (error) {
      showError(error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/flowers/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Ошибка при удалении цветка');
      }

      showSuccess('Цветок успешно удален');
      fetchFlowers();
    } catch (error) {
      showError(error.message);
    }
  };

  if (loading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="admin-flowers-page">
      <h1>Управление цветами</h1>

      <form onSubmit={handleSubmit} className="flower-form">
        <h2>Добавить новый цветок</h2>
        <div className="form-group">
          <label htmlFor="name">Название</label>
          <input
            type="text"
            id="name"
            name="name"
            value={newFlower.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Описание</label>
          <textarea
            id="description"
            name="description"
            value={newFlower.description}
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
            value={newFlower.price}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="imageUrl">URL изображения</label>
          <input
            type="url"
            id="imageUrl"
            name="imageUrl"
            value={newFlower.imageUrl}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="stock">Количество на складе</label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={newFlower.stock}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Добавить цветок
        </button>
      </form>

      <div className="flowers-list">
        <h2>Список цветов</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Название</th>
              <th>Цена</th>
              <th>На складе</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {flowers.map(flower => (
              <tr key={flower.id}>
                <td>{flower.id}</td>
                <td>{flower.name}</td>
                <td>{flower.price} ₽</td>
                <td>{flower.stock}</td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(flower.id)}
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}; 
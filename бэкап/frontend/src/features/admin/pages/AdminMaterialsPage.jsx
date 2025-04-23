import React, { useState, useEffect } from 'react';
import { showError, showSuccess } from '../../../shared/utils/notifications';

export const AdminMaterialsPage = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMaterial, setNewMaterial] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    stock: ''
  });

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/materials');
      if (!response.ok) {
        throw new Error('Ошибка при загрузке материалов');
      }
      const data = await response.json();
      setMaterials(data);
    } catch (error) {
      showError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMaterial(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/materials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMaterial),
      });

      if (!response.ok) {
        throw new Error('Ошибка при создании материала');
      }

      showSuccess('Материал успешно добавлен');
      fetchMaterials();
      setNewMaterial({
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
      const response = await fetch(`http://localhost:5000/api/materials/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Ошибка при удалении материала');
      }

      showSuccess('Материал успешно удален');
      fetchMaterials();
    } catch (error) {
      showError(error.message);
    }
  };

  if (loading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="admin-materials-page">
      <h1>Управление материалами</h1>

      <form onSubmit={handleSubmit} className="material-form">
        <h2>Добавить новый материал</h2>
        <div className="form-group">
          <label htmlFor="name">Название</label>
          <input
            type="text"
            id="name"
            name="name"
            value={newMaterial.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Описание</label>
          <textarea
            id="description"
            name="description"
            value={newMaterial.description}
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
            value={newMaterial.price}
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
            value={newMaterial.imageUrl}
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
            value={newMaterial.stock}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Добавить материал
        </button>
      </form>

      <div className="materials-list">
        <h2>Список материалов</h2>
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
            {materials.map(material => (
              <tr key={material.id}>
                <td>{material.id}</td>
                <td>{material.name}</td>
                <td>{material.price} ₽</td>
                <td>{material.stock}</td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(material.id)}
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
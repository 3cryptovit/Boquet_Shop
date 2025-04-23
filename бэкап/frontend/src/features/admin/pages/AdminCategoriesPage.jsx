import React, { useState, useEffect } from 'react';
import { showError, showSuccess } from '../../../shared/utils/notifications';

export const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/categories');
      if (!response.ok) {
        throw new Error('Ошибка при загрузке категорий');
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      showError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCategory(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCategory),
      });

      if (!response.ok) {
        throw new Error('Ошибка при создании категории');
      }

      showSuccess('Категория успешно создана');
      fetchCategories();
      setNewCategory({
        name: '',
        description: ''
      });
    } catch (error) {
      showError(error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/categories/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Ошибка при удалении категории');
      }

      showSuccess('Категория успешно удалена');
      fetchCategories();
    } catch (error) {
      showError(error.message);
    }
  };

  if (loading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="admin-categories-page">
      <h1>Управление категориями</h1>

      <form onSubmit={handleSubmit} className="category-form">
        <h2>Добавить новую категорию</h2>
        <div className="form-group">
          <label htmlFor="name">Название</label>
          <input
            type="text"
            id="name"
            name="name"
            value={newCategory.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Описание</label>
          <textarea
            id="description"
            name="description"
            value={newCategory.description}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Добавить категорию
        </button>
      </form>

      <div className="categories-list">
        <h2>Список категорий</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Название</th>
              <th>Описание</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(category => (
              <tr key={category.id}>
                <td>{category.id}</td>
                <td>{category.name}</td>
                <td>{category.description}</td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(category.id)}
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
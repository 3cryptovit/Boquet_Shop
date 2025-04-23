import React, { useState, useEffect } from 'react';
import { apiClient } from '../../../shared/utils/apiClient';

export const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await apiClient.get('/api/categories');
      setCategories(data);
    } catch (err) {
      setError('Failed to fetch categories');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="admin-categories">
      <h2>Управление категориями</h2>
      <div className="categories-list">
        {categories.map(category => (
          <div key={category.id} className="category-item">
            <h3>{category.name}</h3>
            <p>{category.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}; 
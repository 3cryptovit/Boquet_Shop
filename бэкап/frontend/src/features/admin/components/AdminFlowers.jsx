import React, { useState, useEffect } from 'react';
import { apiClient } from '../../../shared/utils/apiClient';

export const AdminFlowers = () => {
  const [flowers, setFlowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFlowers();
  }, []);

  const fetchFlowers = async () => {
    try {
      const data = await apiClient.get('/api/flowers');
      setFlowers(data);
    } catch (err) {
      setError('Failed to fetch flowers');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="admin-flowers">
      <h2>Управление цветами</h2>
      <div className="flowers-list">
        {flowers.map(flower => (
          <div key={flower.id} className="flower-item">
            <h3>{flower.name}</h3>
            <p>Цена: {flower.price} ₽</p>
            <p>Доступно: {flower.quantity} шт.</p>
          </div>
        ))}
      </div>
    </div>
  );
}; 
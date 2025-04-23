import React, { useState, useEffect } from 'react';
import { apiClient } from '../../../shared/utils/apiClient';

export const AdminMaterials = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const data = await apiClient.get('/api/materials');
      setMaterials(data);
    } catch (err) {
      setError('Failed to fetch materials');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="admin-materials">
      <h2>Управление материалами</h2>
      <div className="materials-list">
        {materials.map(material => (
          <div key={material.id} className="material-item">
            <h3>{material.name}</h3>
            <p>Цена: {material.price} ₽</p>
            <p>Доступно: {material.quantity} шт.</p>
          </div>
        ))}
      </div>
    </div>
  );
}; 
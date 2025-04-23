import React, { useState, useEffect } from 'react';
import { apiClient } from '../../../shared/utils/apiClient';

export const AdminSettings = () => {
  const [settings, setSettings] = useState({
    siteName: '',
    contactEmail: '',
    deliveryPrice: 0,
    minOrderAmount: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const data = await apiClient.get('/api/settings');
      setSettings(data);
    } catch (err) {
      setError('Failed to fetch settings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiClient.put('/api/settings', settings);
      alert('Настройки успешно обновлены');
    } catch (err) {
      setError('Failed to update settings');
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="admin-settings">
      <h2>Настройки сайта</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Название сайта</label>
          <input
            type="text"
            value={settings.siteName}
            onChange={e => setSettings({ ...settings, siteName: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Контактный email</label>
          <input
            type="email"
            value={settings.contactEmail}
            onChange={e => setSettings({ ...settings, contactEmail: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Стоимость доставки</label>
          <input
            type="number"
            value={settings.deliveryPrice}
            onChange={e => setSettings({ ...settings, deliveryPrice: Number(e.target.value) })}
          />
        </div>
        <div className="form-group">
          <label>Минимальная сумма заказа</label>
          <input
            type="number"
            value={settings.minOrderAmount}
            onChange={e => setSettings({ ...settings, minOrderAmount: Number(e.target.value) })}
          />
        </div>
        <button type="submit" className="btn btn-primary">Сохранить</button>
      </form>
    </div>
  );
}; 
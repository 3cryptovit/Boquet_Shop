import React, { useState, useEffect } from 'react';
import { showError, showSuccess } from '../../../shared/utils/notifications';

export const AdminSettingsPage = () => {
  const [settings, setSettings] = useState({
    siteName: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    workingHours: '',
    deliveryPrice: '',
    minOrderAmount: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/settings');
      if (!response.ok) {
        throw new Error('Ошибка при загрузке настроек');
      }
      const data = await response.json();
      setSettings(data);
    } catch (error) {
      showError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        throw new Error('Ошибка при сохранении настроек');
      }

      showSuccess('Настройки успешно сохранены');
    } catch (error) {
      showError(error.message);
    }
  };

  if (loading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="admin-settings-page">
      <h1>Настройки сайта</h1>

      <form onSubmit={handleSubmit} className="settings-form">
        <div className="form-group">
          <label htmlFor="siteName">Название сайта</label>
          <input
            type="text"
            id="siteName"
            name="siteName"
            value={settings.siteName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="contactEmail">Контактный email</label>
          <input
            type="email"
            id="contactEmail"
            name="contactEmail"
            value={settings.contactEmail}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="contactPhone">Контактный телефон</label>
          <input
            type="tel"
            id="contactPhone"
            name="contactPhone"
            value={settings.contactPhone}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="address">Адрес</label>
          <input
            type="text"
            id="address"
            name="address"
            value={settings.address}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="workingHours">Часы работы</label>
          <input
            type="text"
            id="workingHours"
            name="workingHours"
            value={settings.workingHours}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="deliveryPrice">Стоимость доставки</label>
          <input
            type="number"
            id="deliveryPrice"
            name="deliveryPrice"
            value={settings.deliveryPrice}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="minOrderAmount">Минимальная сумма заказа</label>
          <input
            type="number"
            id="minOrderAmount"
            name="minOrderAmount"
            value={settings.minOrderAmount}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Сохранить настройки
        </button>
      </form>
    </div>
  );
}; 
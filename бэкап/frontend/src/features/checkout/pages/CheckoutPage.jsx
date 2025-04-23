import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../../cart/store/useCartStore';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { ROUTES } from '../../../shared/constants/routes';
import { showSuccess, showError } from '../../../shared/utils/notifications';

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    comment: ''
  });

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
      // Здесь будет логика отправки заказа
      await clearCart();
      showSuccess('Заказ успешно оформлен');
      navigate(ROUTES.HOME);
    } catch (error) {
      showError('Не удалось оформить заказ');
    }
  };

  if (!items.length) {
    return (
      <div className="checkout-page">
        <div className="empty-cart">
          <h2>Корзина пуста</h2>
          <p>Добавьте товары в корзину для оформления заказа</p>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h1>Оформление заказа</h1>
      <div className="checkout-content">
        <form onSubmit={handleSubmit} className="checkout-form">
          <div className="form-group">
            <label htmlFor="name">Имя</label>
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
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Телефон</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="address">Адрес доставки</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="comment">Комментарий к заказу</label>
            <textarea
              id="comment"
              name="comment"
              value={formData.comment}
              onChange={handleInputChange}
            />
          </div>
          <div className="order-summary">
            <h3>Итого к оплате: {totalPrice} ₽</h3>
          </div>
          <button type="submit" className="btn btn-primary">
            Оформить заказ
          </button>
        </form>
      </div>
    </div>
  );
}; 
import React from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { ROUTES } from '../../../shared/constants/routes';
import { showError } from '../../../shared/utils/notifications';

export const CartSummary = () => {
  const { totalItems, totalPrice, clearCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  const handleClearCart = () => {
    if (!isAuthenticated) {
      showError('Для очистки корзины необходимо авторизоваться');
      return;
    }
    clearCart();
  };

  return (
    <div className="cart-summary">
      <div className="cart-summary-header">
        <h2>Итого</h2>
      </div>
      <div className="cart-summary-content">
        <div className="cart-summary-item">
          <span>Товаров в корзине:</span>
          <span>{totalItems}</span>
        </div>
        <div className="cart-summary-item">
          <span>Общая стоимость:</span>
          <span>{totalPrice} ₽</span>
        </div>
      </div>
      <div className="cart-summary-actions">
        <button
          onClick={handleClearCart}
          className="btn btn-secondary"
          disabled={!isAuthenticated}
        >
          Очистить корзину
        </button>
        {isAuthenticated ? (
          <Link to={ROUTES.CHECKOUT} className="btn btn-primary">
            Оформить заказ
          </Link>
        ) : (
          <Link to={ROUTES.LOGIN} className="btn btn-primary">
            Войти для оформления
          </Link>
        )}
      </div>
    </div>
  );
}; 
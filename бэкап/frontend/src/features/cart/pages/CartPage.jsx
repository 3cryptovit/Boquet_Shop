import React from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { CartList } from '../components/CartList';
import { CartSummary } from '../components/CartSummary';
import { ROUTES } from '../../../shared/constants/routes';

export const CartPage = () => {
  const { items, isLoading, error, fetchCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return (
      <div className="cart-page">
        <div className="auth-required">
          <h2>Для доступа к корзине необходимо авторизоваться</h2>
          <p>После авторизации вы сможете добавлять товары в корзину и оформлять заказы.</p>
          <div className="auth-actions">
            <Link to={ROUTES.LOGIN} className="btn btn-primary">
              Войти
            </Link>
            <Link to={ROUTES.REGISTER} className="btn btn-secondary">
              Зарегистрироваться
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <div className="loading">Загрузка...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="cart-page">
      <h1>Корзина</h1>
      <div className="cart-content">
        <CartList items={items} />
        <CartSummary />
      </div>
    </div>
  );
}; 
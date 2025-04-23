import React from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { ROUTES } from '../../../shared/constants/routes';
import { showError } from '../../../shared/utils/notifications';

export const CartItem = ({ item }) => {
  const { updateQuantity, removeItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  const handleQuantityChange = (e) => {
    if (!isAuthenticated) {
      showError('Для изменения количества необходимо авторизоваться');
      return;
    }

    const newQuantity = parseInt(e.target.value);
    if (newQuantity > 0) {
      updateQuantity(item.bouquetId, newQuantity);
    }
  };

  const handleRemove = () => {
    if (!isAuthenticated) {
      showError('Для удаления товара необходимо авторизоваться');
      return;
    }

    removeItem(item.bouquetId);
  };

  return (
    <div className="cart-item">
      <div className="cart-item-image">
        <img src={item.image} alt={item.name} />
      </div>
      <div className="cart-item-details">
        <Link to={`${ROUTES.BOUQUET_DETAILS}/${item.bouquetId}`}>
          <h3>{item.name}</h3>
        </Link>
        <p className="price">{item.price} ₽</p>
      </div>
      <div className="cart-item-quantity">
        <input
          type="number"
          min="1"
          value={item.quantity}
          onChange={handleQuantityChange}
          disabled={!isAuthenticated}
        />
      </div>
      <div className="cart-item-total">
        <p>{item.price * item.quantity} ₽</p>
      </div>
      <div className="cart-item-actions">
        <button
          onClick={handleRemove}
          className="btn btn-danger"
          disabled={!isAuthenticated}
        >
          Удалить
        </button>
      </div>
    </div>
  );
}; 
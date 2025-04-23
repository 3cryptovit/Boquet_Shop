import React from 'react';
import { CartItem } from './CartItem';

export const CartList = ({ items }) => {
  if (!items.length) {
    return (
      <div className="cart-empty">
        <p>Ваша корзина пуста</p>
      </div>
    );
  }

  return (
    <div className="cart-list">
      {items.map((item) => (
        <CartItem key={item.bouquetId} item={item} />
      ))}
    </div>
  );
}; 
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCartStore } from '../../cart/store/useCartStore';
import { showError, showSuccess } from '../../../shared/utils/notifications';

export const BouquetDetailsPage = () => {
  const { id } = useParams();
  const { addToCart } = useCartStore();
  const [bouquet, setBouquet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBouquet = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/bouquets/${id}`);
        if (!response.ok) {
          throw new Error('Букет не найден');
        }
        const data = await response.json();
        setBouquet(data);
      } catch (error) {
        showError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBouquet();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      await addToCart(bouquet.id);
      showSuccess('Букет добавлен в корзину');
    } catch (error) {
      showError('Ошибка при добавлении в корзину');
    }
  };

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (!bouquet) {
    return <div>Букет не найден</div>;
  }

  return (
    <div className="bouquet-details-page">
      <div className="bouquet-details-container">
        <div className="bouquet-image">
          <img src={bouquet.imageUrl} alt={bouquet.name} />
        </div>
        <div className="bouquet-info">
          <h1>{bouquet.name}</h1>
          <p className="price">{bouquet.price} ₽</p>
          <p className="description">{bouquet.description}</p>
          <button
            className="btn btn-primary"
            onClick={handleAddToCart}
          >
            Добавить в корзину
          </button>
        </div>
      </div>
    </div>
  );
}; 
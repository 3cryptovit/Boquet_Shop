import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../auth/model';
import { useFavoritesStore } from '../model';
import { addToCart } from '../api';
import formatImageUrl from '../../../shared/utils/imageUrl';
import Modal from '../../../shared/ui/Modal';
import Button from '../../../shared/ui/Button';

const BouquetCard = ({ bouquet }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [actionType, setActionType] = useState(null); // 'cart' или 'favorite'
  const navigate = useNavigate();
  const { isAuth } = useAuthStore();
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavoritesStore();

  // Проверяем, находится ли букет в избранном
  const isFavorited = isFavorite(bouquet.id);

  // Обработчик добавления в корзину
  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuth) {
      setActionType('cart');
      setShowAuthModal(true);
      return;
    }

    try {
      await addToCart(bouquet.id);
      alert('Букет добавлен в корзину!');
    } catch (error) {
      console.error('Ошибка добавления в корзину:', error);
      alert('Не удалось добавить букет в корзину');
    }
  };

  // Обработчик добавления/удаления из избранного
  const handleToggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuth) {
      setActionType('favorite');
      setShowAuthModal(true);
      return;
    }

    try {
      if (isFavorited) {
        removeFromFavorites(bouquet.id);
      } else {
        addToFavorites(bouquet);
      }
    } catch (error) {
      console.error('Ошибка при работе с избранным:', error);
    }
  };

  // Обработчик авторизации из модального окна
  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <>
      <div className="card fade-in hover:shadow-lg transition-all duration-300">
        <Link to={`/bouquet/${bouquet.id}`} className="block">
          <div className="relative overflow-hidden rounded-t-lg pb-[75%]">
            <img
              src={formatImageUrl(bouquet.image)}
              alt={bouquet.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
            <button
              onClick={handleToggleFavorite}
              className="absolute top-3 right-3 bg-white/90 rounded-full w-10 h-10 flex items-center justify-center shadow-md transition-transform hover:scale-110"
            >
              {isFavorited ? '❤️' : '🤍'}
            </button>
          </div>

          <div className="p-4">
            <h3 className="text-xl font-semibold mb-2 text-gray-800">{bouquet.name}</h3>

            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {bouquet.description || 'Прекрасный букет из свежих цветов'}
            </p>

            <div className="flex items-center justify-between">
              <span className="text-xl font-bold text-primary">
                {bouquet.price} ₽
              </span>

              <Button
                onClick={handleAddToCart}
                variant="primary"
                size="small"
              >
                В корзину
              </Button>
            </div>
          </div>
        </Link>
      </div>

      {/* Модальное окно для неавторизованных пользователей */}
      <Modal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        title="Требуется авторизация"
        size="small"
      >
        <p className="mb-4">
          {actionType === 'cart'
            ? 'Для добавления букетов в корзину необходимо авторизоваться.'
            : 'Для добавления букетов в избранное необходимо авторизоваться.'}
        </p>
        <div className="flex justify-end gap-3">
          <Button
            variant="secondary"
            onClick={() => setShowAuthModal(false)}
          >
            Отмена
          </Button>
          <Button
            variant="primary"
            onClick={handleLogin}
          >
            Войти
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default BouquetCard;

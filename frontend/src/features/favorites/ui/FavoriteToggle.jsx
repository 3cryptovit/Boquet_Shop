import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFavoritesStore } from '../model';
import { useAuthStore } from '../../auth/model';

/**
 * Компонент кнопки для добавления/удаления букета в избранное
 * @param {Object} props - Свойства компонента
 * @param {Object} props.bouquet - Букет
 * @param {string} [props.className] - Дополнительные CSS классы
 * @param {Function} [props.onBeforeAction] - Вызывается перед выполнением действия
 * @param {Function} [props.onSuccess] - Вызывается после успешного выполнения действия
 * @param {Function} [props.onError] - Вызывается при ошибке
 * @param {Function} [props.onUnauthorized] - Вызывается если пользователь не авторизован
 */
const FavoriteToggle = ({
  bouquet,
  className = '',
  onBeforeAction,
  onSuccess,
  onError,
  onUnauthorized
}) => {
  const navigate = useNavigate();
  const { isAuth } = useAuthStore();
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavoritesStore();

  // Проверяем, находится ли букет в избранном
  const isInFavorites = bouquet ? isFavorite(bouquet.id) : false;

  // Обработчик клика по кнопке
  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Если пользователь не авторизован
    if (!isAuth) {
      if (onUnauthorized) {
        onUnauthorized();
      } else {
        navigate('/login', { state: { from: window.location.pathname } });
      }
      return;
    }

    if (onBeforeAction) {
      onBeforeAction();
    }

    try {
      if (isInFavorites) {
        await removeFromFavorites(bouquet.id);
      } else {
        await addToFavorites(bouquet);
      }

      if (onSuccess) {
        onSuccess(isInFavorites ? 'removed' : 'added');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      if (onError) {
        onError(error);
      }
    }
  };

  if (!bouquet) {
    return null;
  }

  return (
    <button
      className={`w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-md transition-all hover:shadow-lg hover:scale-110 ${className}`}
      onClick={handleToggleFavorite}
      aria-label={isInFavorites ? 'Удалить из избранного' : 'Добавить в избранное'}
      title={isInFavorites ? 'Удалить из избранного' : 'Добавить в избранное'}
    >
      {isInFavorites ? '❤️' : '🤍'}
    </button>
  );
};

export default FavoriteToggle;

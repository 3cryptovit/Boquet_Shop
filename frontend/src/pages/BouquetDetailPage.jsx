import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useBouquetsStore, useFavoritesStore } from '../features/bouquets/model';
import { useAuthStore } from '../features/auth/model';
import { addToCart } from '../features/bouquets/api';
import formatImageUrl from '../shared/utils/imageUrl';
import Button from '../shared/ui/Button';
import Modal from '../shared/ui/Modal';

const BouquetDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { currentBouquet, isLoading, error, fetchBouquetById } = useBouquetsStore();
  const { isAuth } = useAuthStore();
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavoritesStore();

  // Загружаем данные букета при монтировании компонента
  useEffect(() => {
    fetchBouquetById(id);
  }, [id, fetchBouquetById]);

  // Проверяем, находится ли букет в избранном
  const isFavorited = currentBouquet ? isFavorite(currentBouquet.id) : false;

  // Обработчик добавления в корзину
  const handleAddToCart = async () => {
    if (!isAuth) {
      setShowLoginModal(true);
      return;
    }

    try {
      await addToCart(id);
      alert('Букет добавлен в корзину!');
    } catch (error) {
      console.error('Ошибка добавления в корзину:', error);
      alert('Не удалось добавить букет в корзину');
    }
  };

  // Обработчик добавления/удаления из избранного
  const handleToggleFavorite = () => {
    if (!currentBouquet) return;

    if (!isAuth) {
      setShowLoginModal(true);
      return;
    }

    if (isFavorited) {
      removeFromFavorites(currentBouquet.id);
    } else {
      addToFavorites(currentBouquet);
    }
  };

  // Состояние загрузки
  if (isLoading) {
    return (
      <div className="container mx-auto py-16 text-center">
        <div className="loader mx-auto mb-4"></div>
        <p>Загружаем информацию о букете...</p>
      </div>
    );
  }

  // Состояние ошибки
  if (error) {
    return (
      <div className="container mx-auto py-16 text-center">
        <h2 className="text-2xl text-red-600 mb-4">Произошла ошибка</h2>
        <p className="mb-6">{error}</p>
        <div className="flex gap-4 justify-center">
          <Button onClick={() => fetchBouquetById(id)}>Попробовать снова</Button>
          <Button variant="secondary" onClick={() => navigate('/catalog')}>
            Вернуться в каталог
          </Button>
        </div>
      </div>
    );
  }

  // Если букет не найден
  if (!currentBouquet) {
    return (
      <div className="container mx-auto py-16 text-center">
        <h2 className="text-2xl font-semibold mb-4">Букет не найден</h2>
        <p className="mb-6">К сожалению, букет с ID {id} не найден.</p>
        <Button variant="primary" onClick={() => navigate('/catalog')}>
          Вернуться в каталог
        </Button>
      </div>
    );
  }

  return (
    <div className="py-16">
      <div className="container mx-auto">
        {/* Кнопка назад */}
        <div className="mb-8">
          <Link
            to="/catalog"
            className="inline-flex items-center text-gray-600 hover:text-primary transition-colors"
          >
            ← Назад к каталогу
          </Link>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-lg shadow-md overflow-hidden">
          <div className="md:flex">
            {/* Изображение букета */}
            <div className="md:w-1/2">
              <div className="relative pb-[100%] md:pb-0 md:h-full">
                <img
                  src={formatImageUrl(currentBouquet.image)}
                  alt={currentBouquet.name}
                  className="absolute inset-0 w-full h-full object-cover md:absolute"
                />
              </div>
            </div>

            {/* Информация о букете */}
            <div className="md:w-1/2 p-6 md:p-8">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-3xl font-bold text-gray-800">
                  {currentBouquet.name}
                </h1>
                <button
                  onClick={handleToggleFavorite}
                  className="bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md transition-transform hover:scale-110"
                >
                  {isFavorited ? '❤️' : '🤍'}
                </button>
              </div>

              <div className="text-2xl font-bold text-primary mb-6">
                {currentBouquet.price} ₽
              </div>

              <div className="mb-6">
                <p className="text-gray-700 leading-relaxed">
                  {currentBouquet.description || 'Прекрасный букет из свежих цветов, который подойдет для любого случая.'}
                </p>
              </div>

              {/* Состав букета, если есть */}
              {currentBouquet.flowers && currentBouquet.flowers.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-2">Состав букета:</h3>
                  <ul className="list-disc list-inside text-gray-700">
                    {currentBouquet.flowers.map((flower, index) => (
                      <li key={index}>
                        {flower.name || flower.type} - {flower.color || 'разноцветный'}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Информация о кастомном букете */}
              {currentBouquet.isCustom && (
                <div className="mb-6 p-3 bg-blue-50 rounded-md text-blue-700">
                  <p>Это уникальный букет, созданный в нашем конструкторе.</p>
                </div>
              )}

              {/* Кнопки действий */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  variant="primary"
                  className="flex-1"
                  onClick={handleAddToCart}
                >
                  Добавить в корзину
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => navigate('/constructor')}
                >
                  Создать похожий букет
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Модальное окно для неавторизованных пользователей */}
      <Modal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        title="Требуется авторизация"
        size="small"
      >
        <p className="mb-4">
          Для добавления букетов в корзину или избранное необходимо авторизоваться.
        </p>
        <div className="flex justify-end gap-3">
          <Button
            variant="secondary"
            onClick={() => setShowLoginModal(false)}
          >
            Отмена
          </Button>
          <Button
            variant="primary"
            onClick={() => navigate('/login')}
          >
            Войти
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default BouquetDetailPage;

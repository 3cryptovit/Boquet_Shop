import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFavoritesStore } from '../features/bouquets/model';
import { useAuthStore } from '../features/auth/model';
import BouquetCard from '../features/bouquets/ui/BouquetCard';
import Button from '../shared/ui/Button';

const FavoritesPage = () => {
  const { favorites, isLoading, error, fetchFavorites } = useFavoritesStore();
  const { isAuth } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Перенаправляем неавторизованных пользователей на страницу входа
    if (!isAuth) {
      navigate('/login', { state: { from: '/favorites' } });
      return;
    }

    fetchFavorites();
  }, [fetchFavorites, isAuth, navigate]);

  if (!isAuth) {
    return null; // Не рендерим страницу для неавторизованных пользователей
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-16 text-center">
        <div className="loader mx-auto mb-4"></div>
        <p>Загрузка избранного...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-16 text-center">
        <h2 className="text-2xl text-red-600 mb-4">Произошла ошибка</h2>
        <p className="mb-6">{error}</p>
        <Button onClick={() => fetchFavorites()}>Попробовать снова</Button>
      </div>
    );
  }

  // Отображаем пустое избранное
  if (favorites.length === 0) {
    return (
      <div className="py-16 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl font-bold mb-6">Избранные букеты</h1>
          <p className="text-gray-600 mb-8">Вы пока не добавили ни одного букета в избранное</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/catalog"
              className="inline-block px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
            >
              Перейти в каталог
            </Link>
            <Link
              to="/constructor"
              className="inline-block px-6 py-3 bg-white text-primary border border-primary rounded-md hover:bg-gray-50 transition-colors"
            >
              Создать свой букет
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Отображаем список избранных букетов
  return (
    <div className="py-16 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Избранные букеты</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Ваша персональная коллекция любимых букетов
          </p>
        </header>

        {/* Сетка карточек избранных букетов */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map(bouquet => (
            <BouquetCard
              key={bouquet.id}
              bouquet={bouquet}
            />
          ))}
        </div>

        {/* Ссылка на каталог */}
        <div className="mt-16 text-center">
          <Link
            to="/catalog"
            className="inline-block px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
          >
            Вернуться в каталог
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FavoritesPage; 
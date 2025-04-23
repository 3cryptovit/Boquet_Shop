import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useBouquetsStore } from '../features/bouquets/model';
import BouquetCard from '../features/bouquets/ui/BouquetCard';
import Button from '../shared/ui/Button';

const CatalogPage = () => {
  const { bouquets, isLoading, error, fetchBouquets } = useBouquetsStore();

  // Загружаем данные при монтировании компонента
  useEffect(() => {
    fetchBouquets();
  }, [fetchBouquets]);

  // Отображаем загрузку
  if (isLoading && bouquets.length === 0) {
    return (
      <div className="container mx-auto py-16 text-center">
        <div className="loader mx-auto mb-4"></div>
        <p>Загружаем каталог букетов...</p>
      </div>
    );
  }

  // Отображаем ошибку
  if (error && bouquets.length === 0) {
    return (
      <div className="container mx-auto py-16 text-center">
        <h2 className="text-2xl text-red-600 mb-4">Произошла ошибка</h2>
        <p className="mb-6">{error}</p>
        <Button onClick={() => fetchBouquets()}>Попробовать снова</Button>
      </div>
    );
  }

  // Отображаем пустой каталог
  if (bouquets.length === 0) {
    return (
      <div className="container mx-auto py-16 text-center">
        <h2 className="text-2xl font-semibold mb-4">Каталог пуст</h2>
        <p className="mb-6">В данный момент букеты не добавлены в каталог.</p>
        <Link to="/constructor" className="btn btn-primary">
          Создать свой букет
        </Link>
      </div>
    );
  }

  // Отображаем каталог с букетами
  return (
    <div className="py-16 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Каталог букетов</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Выберите готовый букет из нашей коллекции или создайте свой уникальный букет в конструкторе
          </p>
        </header>

        {/* Сетка карточек букетов */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bouquets.map(bouquet => (
            <BouquetCard
              key={bouquet.id}
              bouquet={bouquet}
            />
          ))}
        </div>

        {/* Секция с призывом к созданию букета */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-semibold mb-4">Не нашли подходящий букет?</h2>
          <p className="mb-6">Создайте свой уникальный букет в нашем конструкторе</p>
          <Link to="/constructor" className="btn btn-primary">
            Создать свой букет
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CatalogPage;

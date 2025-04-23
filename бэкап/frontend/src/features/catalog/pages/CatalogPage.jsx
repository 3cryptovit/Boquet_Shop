import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useBouquetStore } from '../store/useBouquetStore';
import { ROUTES } from '../../../shared/constants/routes';
import { showError } from '../../../shared/utils/notifications';

export const CatalogPage = () => {
  const { bouquets, isLoading, error, fetchBouquets } = useBouquetStore();
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchBouquets();
  }, [fetchBouquets]);

  const filteredBouquets = selectedCategory === 'all'
    ? bouquets
    : bouquets.filter(bouquet => bouquet.category === selectedCategory);

  if (isLoading) {
    return <div className="catalog-loading">Загрузка...</div>;
  }

  if (error) {
    showError(error);
    return <div className="catalog-error">Ошибка загрузки каталога</div>;
  }

  return (
    <div className="catalog-page">
      <h1 className="catalog-title">Каталог букетов</h1>

      <div className="catalog-filters">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="category-select"
        >
          <option value="all">Все категории</option>
          <option value="wedding">Свадебные</option>
          <option value="birthday">День рождения</option>
          <option value="anniversary">Юбилей</option>
          <option value="holiday">Праздничные</option>
        </select>
      </div>

      <div className="catalog-grid">
        {filteredBouquets.map(bouquet => (
          <div key={bouquet.id} className="bouquet-card">
            <Link to={`${ROUTES.BOUQUET_DETAILS.replace(':id', bouquet.id)}`}>
              <div className="bouquet-image">
                <img src={bouquet.imageUrl} alt={bouquet.name} />
              </div>
              <div className="bouquet-info">
                <h3 className="bouquet-name">{bouquet.name}</h3>
                <p className="bouquet-price">{bouquet.price} ₽</p>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {filteredBouquets.length === 0 && (
        <div className="catalog-empty">
          <p>В данной категории букетов пока нет</p>
        </div>
      )}
    </div>
  );
}; 
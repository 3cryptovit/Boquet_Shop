import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../shared/constants/routes';

export const HomePage = () => {
  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>Добро пожаловать в наш цветочный магазин</h1>
        <p>Создаем красивые букеты для ваших особенных моментов</p>
        <Link to={ROUTES.CATALOG} className="btn btn-primary">
          Перейти в каталог
        </Link>
      </div>

      <div className="features-section">
        <div className="feature">
          <h3>Свежие цветы</h3>
          <p>Ежедневные поставки свежих цветов</p>
        </div>
        <div className="feature">
          <h3>Быстрая доставка</h3>
          <p>Доставка в день заказа</p>
        </div>
        <div className="feature">
          <h3>Гарантия качества</h3>
          <p>100% гарантия свежести</p>
        </div>
      </div>
    </div>
  );
}; 
import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../shared/constants/routes';

export const AdminDashboardPage = () => {
  return (
    <div className="admin-dashboard-page">
      <h1>Панель управления</h1>
      <div className="admin-menu">
        <Link to={ROUTES.ADMIN.ORDERS} className="admin-menu-item">
          <h3>Заказы</h3>
          <p>Управление заказами</p>
        </Link>
        <Link to={ROUTES.ADMIN.BOUQUETS} className="admin-menu-item">
          <h3>Букеты</h3>
          <p>Управление букетами</p>
        </Link>
        <Link to={ROUTES.ADMIN.CATEGORIES} className="admin-menu-item">
          <h3>Категории</h3>
          <p>Управление категориями</p>
        </Link>
        <Link to={ROUTES.ADMIN.FLOWERS} className="admin-menu-item">
          <h3>Цветы</h3>
          <p>Управление цветами</p>
        </Link>
        <Link to={ROUTES.ADMIN.MATERIALS} className="admin-menu-item">
          <h3>Материалы</h3>
          <p>Управление материалами</p>
        </Link>
        <Link to={ROUTES.ADMIN.SETTINGS} className="admin-menu-item">
          <h3>Настройки</h3>
          <p>Настройки магазина</p>
        </Link>
      </div>
    </div>
  );
}; 
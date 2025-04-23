import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

export const NotFound = () => {
  return (
    <div className="not-found">
      <h1>404</h1>
      <h2>Страница не найдена</h2>
      <p>К сожалению, запрашиваемая страница не существует.</p>
      <Link to={ROUTES.HOME} className="btn btn-primary">
        Вернуться на главную
      </Link>
    </div>
  );
};

export default NotFound; 
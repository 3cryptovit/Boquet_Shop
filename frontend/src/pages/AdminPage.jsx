import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../features/auth/model';
import Button from '../shared/ui/Button';

const AdminPage = () => {
  const navigate = useNavigate();
  const { user, isAuth } = useAuthStore();

  // Проверяем, является ли пользователь администратором
  const isAdmin = user?.role === 'admin';

  // Если пользователь не авторизован или не является админом - редирект на главную
  React.useEffect(() => {
    if (!isAuth || !isAdmin) {
      navigate('/');
    }
  }, [isAuth, isAdmin, navigate]);

  if (!isAuth || !isAdmin) {
    return (
      <div className="container mx-auto py-16 text-center">
        <h2 className="text-2xl font-semibold mb-4">Доступ запрещен</h2>
        <p className="mb-6">У вас нет прав для просмотра этой страницы</p>
        <Button onClick={() => navigate('/')}>Вернуться на главную</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-16">
      <h1 className="text-3xl font-bold mb-8">Панель администратора</h1>

      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Управление букетами</h2>
        <p className="mb-4">Здесь будет функционал для управления букетами.</p>
        <div className="flex gap-4">
          <Button>Добавить букет</Button>
          <Button variant="secondary">Список букетов</Button>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Управление заказами</h2>
        <p className="mb-4">Здесь будет функционал для управления заказами.</p>
        <Button>Просмотр заказов</Button>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Управление пользователями</h2>
        <p className="mb-4">Здесь будет функционал для управления пользователями.</p>
        <Button>Список пользователей</Button>
      </div>
    </div>
  );
};

export default AdminPage;

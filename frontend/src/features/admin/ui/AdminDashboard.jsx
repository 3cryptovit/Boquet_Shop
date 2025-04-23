import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminStore } from '../model';
import { useAuthStore } from '../../auth/model';
import Button from '../../../shared/ui/Button';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, isAuth } = useAuthStore();
  const {
    orders, users, bouquets,
    isLoadingOrders, isLoadingUsers, isLoadingBouquets,
    orderError, userError, bouquetError,
    fetchOrders, fetchUsers, fetchBouquets
  } = useAdminStore();

  // Проверяем, является ли пользователь администратором
  const isAdmin = user?.role === 'admin';

  // Загружаем данные при монтировании компонента
  useEffect(() => {
    if (isAuth && isAdmin) {
      fetchOrders();
      fetchUsers();
      fetchBouquets();
    }
  }, [isAuth, isAdmin, fetchOrders, fetchUsers, fetchBouquets]);

  // Если пользователь не авторизован или не является админом - редирект на главную
  useEffect(() => {
    if (!isAuth || !isAdmin) {
      navigate('/');
    }
  }, [isAuth, isAdmin, navigate]);

  if (!isAuth || !isAdmin) {
    return null; // Редирект будет осуществлен через useEffect
  }

  // Счетчики для дашборда
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const totalUsers = users.length;
  const totalBouquets = bouquets.length;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Панель управления</h2>

      {/* Карточки с метриками */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm font-medium">Всего заказов</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">
            {isLoadingOrders ? '...' : totalOrders}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm font-medium">Ожидающие заказы</h3>
          <p className="text-3xl font-bold text-primary mt-2">
            {isLoadingOrders ? '...' : pendingOrders}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm font-medium">Пользователи</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">
            {isLoadingUsers ? '...' : totalUsers}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm font-medium">Букеты в каталоге</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">
            {isLoadingBouquets ? '...' : totalBouquets}
          </p>
        </div>
      </div>

      {/* Быстрый доступ к разделам */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Заказы</h3>
          {orderError && (
            <p className="text-red-500 mb-4">{orderError}</p>
          )}
          <Button onClick={() => navigate('/admin/orders')} className="w-full">
            Управление заказами
          </Button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Букеты</h3>
          {bouquetError && (
            <p className="text-red-500 mb-4">{bouquetError}</p>
          )}
          <Button onClick={() => navigate('/admin/bouquets')} className="w-full">
            Управление букетами
          </Button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Пользователи</h3>
          {userError && (
            <p className="text-red-500 mb-4">{userError}</p>
          )}
          <Button onClick={() => navigate('/admin/users')} className="w-full">
            Управление пользователями
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../features/auth/model';
import formatImageUrl from '../shared/utils/imageUrl';
import { api } from '../shared/utils/apiClient';
import Button from '../shared/ui/Button';

// Функция для форматирования даты
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

// Функция для форматирования статуса заказа
const formatStatus = (status) => {
  const statusMap = {
    'new': 'Новый',
    'pending': 'В обработке',
    'processing': 'Готовится',
    'shipping': 'Доставляется',
    'completed': 'Выполнен',
    'cancelled': 'Отменен'
  };

  return statusMap[status] || status;
};

// Цвета для разных статусов заказа
const getStatusColor = (status) => {
  const colorMap = {
    'completed': 'text-green-600',
    'cancelled': 'text-red-600',
    'new': 'text-blue-600',
    'pending': 'text-orange-500',
    'processing': 'text-indigo-600',
    'shipping': 'text-purple-600'
  };

  return colorMap[status] || 'text-gray-600';
};

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const { isAuth } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Перенаправляем неавторизованных пользователей
    if (!isAuth) {
      navigate('/login');
      return;
    }

    // Загружаем список заказов
    fetchOrders();
  }, [isAuth, navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/orders');
      setOrders(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Не удалось загрузить заказы');
      setLoading(false);
      console.error('Ошибка загрузки заказов:', err);
    }
  };

  const fetchOrderDetails = async (orderId) => {
    try {
      setLoadingDetails(true);
      const response = await api.get(`/api/orders/${orderId}`);
      setSelectedOrderDetails(response.data);
      setLoadingDetails(false);
    } catch (err) {
      console.error('Ошибка загрузки деталей заказа:', err);
      alert('Не удалось загрузить детали заказа. Пожалуйста, попробуйте позже.');
      setLoadingDetails(false);
    }
  };

  const toggleOrderDetails = async (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
      setSelectedOrderDetails(null);
    } else {
      setExpandedOrder(orderId);
      await fetchOrderDetails(orderId);
    }
  };

  // Если пользователь не авторизован
  if (!isAuth) {
    return (
      <div className="container mx-auto py-16 text-center">
        <h1 className="text-3xl font-bold mb-6">История заказов</h1>
        <p className="mb-6">Для просмотра истории заказов необходимо авторизоваться</p>
        <Button onClick={() => navigate('/login')}>
          Войти в аккаунт
        </Button>
      </div>
    );
  }

  // Состояние загрузки
  if (loading) {
    return (
      <div className="container mx-auto py-16 text-center">
        <div className="loader mx-auto mb-4"></div>
        <p>Загружаем историю заказов...</p>
      </div>
    );
  }

  // Состояние ошибки
  if (error) {
    return (
      <div className="container mx-auto py-16">
        <h1 className="text-3xl font-bold text-center mb-6">История заказов</h1>
        <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
          {error}
        </div>
        <div className="text-center">
          <Button onClick={() => fetchOrders()}>
            Попробовать снова
          </Button>
        </div>
      </div>
    );
  }

  // Если у пользователя нет заказов
  if (orders.length === 0) {
    return (
      <div className="container mx-auto py-16">
        <h1 className="text-3xl font-bold text-center mb-6">История заказов</h1>
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="mb-6">У вас пока нет заказов</p>
          <Button
            onClick={() => navigate('/catalog')}
          >
            Перейти в каталог
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-16">
      <h1 className="text-3xl font-bold text-center mb-12">История заказов</h1>

      <div className="space-y-6">
        {orders.map(order => (
          <div
            key={order.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="p-6 flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-gray-100">
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Заказ №{order.id}
                </h3>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <span>{formatDate(order.created_at)}</span>
                  <span>•</span>
                  <span className={`font-medium ${getStatusColor(order.status)}`}>
                    {formatStatus(order.status)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <span className="text-xl font-bold">{order.total_price} ₽</span>
                <Button
                  variant={expandedOrder === order.id ? 'secondary' : 'primary'}
                  size="small"
                  onClick={() => toggleOrderDetails(order.id)}
                >
                  {expandedOrder === order.id ? 'Скрыть детали' : 'Показать детали'}
                </Button>
              </div>
            </div>

            {expandedOrder === order.id && (
              <div className="p-6 bg-gray-50">
                {loadingDetails ? (
                  <div className="text-center py-6">
                    <div className="loader mx-auto mb-4"></div>
                    <p>Загрузка деталей заказа...</p>
                  </div>
                ) : selectedOrderDetails ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Адрес доставки:</h4>
                        <p>{selectedOrderDetails.delivery_address}</p>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Способ оплаты:</h4>
                        <p>{selectedOrderDetails.payment_method === 'card' ? 'Банковская карта' : 'Наличные при получении'}</p>
                      </div>

                      {selectedOrderDetails.comment && (
                        <div className="md:col-span-2">
                          <h4 className="font-medium text-gray-700 mb-2">Комментарий:</h4>
                          <p>{selectedOrderDetails.comment}</p>
                        </div>
                      )}
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-700 mb-4">Состав заказа:</h4>
                      <div className="space-y-4">
                        {selectedOrderDetails.items.map(item => (
                          <div
                            key={item.id}
                            className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-lg border border-gray-200"
                          >
                            <div className="md:w-24 h-24 flex-shrink-0">
                              <img
                                src={formatImageUrl(item.image_url)}
                                alt={item.name}
                                className="w-full h-full object-cover rounded"
                              />
                            </div>

                            <div className="flex-grow flex flex-col">
                              <h5 className="font-medium mb-1">{item.name}</h5>
                              <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                              <div className="flex justify-between mt-auto">
                                <span className="text-gray-500">{item.quantity} шт.</span>
                                <span className="font-bold">{item.price * item.quantity} ₽</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200 flex justify-between">
                      <span className="font-medium">Итого:</span>
                      <span className="text-xl font-bold">{selectedOrderDetails.total_price} ₽</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-center py-4">Информация о заказе недоступна</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;

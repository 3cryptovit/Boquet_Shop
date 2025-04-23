import React, { useEffect, useState } from 'react';
import { useAdminStore } from '../model';
import Button from '../../../shared/ui/Button';
import Modal from '../../../shared/ui/Modal';

const OrderAdminTable = () => {
  const {
    orders,
    isLoadingOrders,
    orderError,
    isSubmitting,
    submitError,
    fetchOrders,
    updateOrderStatus
  } = useAdminStore();

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [statusValue, setStatusValue] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Статусы заказа
  const statuses = [
    { value: 'pending', label: 'Ожидает обработки', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'processing', label: 'В обработке', color: 'bg-blue-100 text-blue-800' },
    { value: 'shipped', label: 'Отправлен', color: 'bg-purple-100 text-purple-800' },
    { value: 'delivered', label: 'Доставлен', color: 'bg-green-100 text-green-800' },
    { value: 'canceled', label: 'Отменен', color: 'bg-red-100 text-red-800' }
  ];

  const getStatusLabel = (statusValue) => {
    const status = statuses.find(s => s.value === statusValue);
    return status ? status.label : 'Неизвестно';
  };

  const getStatusColor = (statusValue) => {
    const status = statuses.find(s => s.value === statusValue);
    return status ? status.color : 'bg-gray-100 text-gray-800';
  };

  // Форматирование даты
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

  // Обработчики действий
  const handleOpenEditModal = (order) => {
    setSelectedOrder(order);
    setStatusValue(order.status);
    setIsEditModalOpen(true);
  };

  const handleOpenDetailsModal = (order) => {
    setSelectedOrder(order);
    setIsDetailsModalOpen(true);
  };

  const handleStatusChange = (e) => {
    setStatusValue(e.target.value);
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;

    const result = await updateOrderStatus(selectedOrder.id, statusValue);
    if (result) {
      setIsEditModalOpen(false);
    }
  };

  // Расчет общей суммы заказа
  const calculateTotal = (items) => {
    return items.reduce((sum, item) => {
      const price = item.bouquet ? item.bouquet.price : 0;
      return sum + price * item.quantity;
    }, 0);
  };

  if (isLoadingOrders) {
    return (
      <div className="p-6 text-center">
        <p>Загрузка заказов...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Управление заказами</h2>
        <Button onClick={() => fetchOrders()}>Обновить</Button>
      </div>

      {orderError && (
        <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
          {orderError}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-gray-500">Нет заказов</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-md">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">ID</th>
                <th className="py-3 px-4 text-left">Дата</th>
                <th className="py-3 px-4 text-left">Клиент</th>
                <th className="py-3 px-4 text-left">Сумма</th>
                <th className="py-3 px-4 text-left">Статус</th>
                <th className="py-3 px-4 text-left">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">{order.id.slice(0, 8)}...</td>
                  <td className="py-3 px-4">{formatDate(order.createdAt)}</td>
                  <td className="py-3 px-4">{order.user.username}</td>
                  <td className="py-3 px-4">{calculateTotal(order.items)} ₽</td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => handleOpenDetailsModal(order)}
                        className="text-sm py-1 px-2"
                      >
                        Детали
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => handleOpenEditModal(order)}
                        className="text-sm py-1 px-2"
                      >
                        Статус
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Модальное окно изменения статуса */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Изменение статуса заказа"
        size="small"
      >
        <form onSubmit={handleUpdateStatus}>
          <div className="mb-4">
            <p className="mb-2">
              <span className="font-medium">ID заказа:</span> {selectedOrder?.id}
            </p>
            <p className="mb-4">
              <span className="font-medium">Текущий статус:</span>{" "}
              <span className={`inline-block px-2 py-1 rounded-full text-xs ${selectedOrder ? getStatusColor(selectedOrder.status) : ''}`}>
                {selectedOrder ? getStatusLabel(selectedOrder.status) : ''}
              </span>
            </p>

            <label className="block text-sm font-medium mb-1">Новый статус</label>
            <select
              value={statusValue}
              onChange={handleStatusChange}
              className="w-full p-2 border rounded-md"
            >
              {statuses.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          {submitError && (
            <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
              {submitError}
            </div>
          )}

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsEditModalOpen(false)}
            >
              Отмена
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || statusValue === selectedOrder?.status}
            >
              {isSubmitting ? 'Сохранение...' : 'Обновить статус'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Модальное окно деталей заказа */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        title="Детали заказа"
        size="large"
      >
        {selectedOrder && (
          <div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Информация о заказе</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm">
                    <span className="font-medium">ID заказа:</span> {selectedOrder.id}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Дата создания:</span> {formatDate(selectedOrder.createdAt)}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Статус:</span>{" "}
                    <span className={`inline-block px-2 py-1 rounded-full text-xs ${getStatusColor(selectedOrder.status)}`}>
                      {getStatusLabel(selectedOrder.status)}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-sm">
                    <span className="font-medium">Клиент:</span> {selectedOrder.user.username}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Email:</span> {selectedOrder.user.email}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Телефон:</span> {selectedOrder.phone || 'Не указан'}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Адрес доставки</h3>
              <p className="text-sm">{selectedOrder.address || 'Адрес не указан'}</p>
            </div>

            {selectedOrder.comment && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Комментарий к заказу</h3>
                <p className="text-sm italic">{selectedOrder.comment}</p>
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Способ оплаты</h3>
              <p className="text-sm">{selectedOrder.paymentMethod === 'card' ? 'Банковская карта' : 'Наличные'}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Состав заказа</h3>
              <table className="min-w-full border rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-2 px-4 text-left text-xs font-medium text-gray-500">Букет</th>
                    <th className="py-2 px-4 text-left text-xs font-medium text-gray-500">Кол-во</th>
                    <th className="py-2 px-4 text-left text-xs font-medium text-gray-500">Цена</th>
                    <th className="py-2 px-4 text-left text-xs font-medium text-gray-500">Сумма</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {selectedOrder.items.map((item, index) => (
                    <tr key={index}>
                      <td className="py-2 px-4">
                        {item.bouquet ? item.bouquet.name : 'Букет удален'}
                        {item.bouquet && item.bouquet.isCustom && ' (Кастомный)'}
                      </td>
                      <td className="py-2 px-4">{item.quantity}</td>
                      <td className="py-2 px-4">{item.bouquet ? `${item.bouquet.price} ₽` : '-'}</td>
                      <td className="py-2 px-4">{item.bouquet ? `${item.bouquet.price * item.quantity} ₽` : '-'}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan="3" className="py-2 px-4 text-right font-medium">Итого:</td>
                    <td className="py-2 px-4 font-bold">{calculateTotal(selectedOrder.items)} ₽</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="mt-6 flex justify-end">
              <Button
                variant="secondary"
                onClick={() => setIsDetailsModalOpen(false)}
              >
                Закрыть
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrderAdminTable;

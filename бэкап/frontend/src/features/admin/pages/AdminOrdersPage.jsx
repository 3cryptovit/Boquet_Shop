import React, { useState, useEffect } from 'react';
import { showError } from '../../../shared/utils/notifications';

export const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/orders');
        if (!response.ok) {
          throw new Error('Ошибка при загрузке заказов');
        }
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        showError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Ошибка при обновлении статуса');
      }

      setOrders(orders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (error) {
      showError(error.message);
    }
  };

  if (loading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="admin-orders-page">
      <h1>Управление заказами</h1>
      <div className="orders-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Клиент</th>
              <th>Сумма</th>
              <th>Статус</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.userName}</td>
                <td>{order.totalAmount} ₽</td>
                <td>{order.status}</td>
                <td>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  >
                    <option value="pending">В обработке</option>
                    <option value="processing">Обрабатывается</option>
                    <option value="shipped">Отправлен</option>
                    <option value="delivered">Доставлен</option>
                    <option value="cancelled">Отменен</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}; 
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import formatImageUrl from '../utils/imageUrl';
import { authenticatedFetch } from '../utils/authService';

function formatDate(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

function formatStatus(status) {
  const statusMap = {
    'new': 'Новый',
    'pending': 'В обработке',
    'processing': 'Готовится',
    'shipping': 'Доставляется',
    'completed': 'Выполнен',
    'cancelled': 'Отменен'
  };

  return statusMap[status] || status;
}

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await authenticatedFetch('http://localhost:5000/api/orders');

        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        } else {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Не удалось загрузить заказы');
        }
      } catch (err) {
        setError(err.message);
        console.error('Ошибка загрузки заказов:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const fetchOrderDetails = async (orderId) => {
    try {
      setLoadingDetails(true);
      const response = await authenticatedFetch(`http://localhost:5000/api/orders/${orderId}`);

      if (response.ok) {
        const data = await response.json();
        setSelectedOrderDetails(data);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Не удалось загрузить детали заказа');
      }
    } catch (err) {
      console.error('Ошибка загрузки деталей заказа:', err);
      alert('Не удалось загрузить детали заказа. Пожалуйста, попробуйте позже.');
    } finally {
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

  if (loading) {
    return <div className="container" style={{ padding: '40px 20px', textAlign: 'center' }}>Загрузка заказов...</div>;
  }

  if (error) {
    return (
      <div className="container" style={{ padding: '40px 20px' }}>
        <h2 style={{ marginBottom: '20px' }}>История заказов</h2>
        <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>
        <p>Возможно, вам необходимо <Link to="/login">войти в систему</Link> для просмотра заказов.</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container" style={{ padding: '40px 20px' }}>
        <h2 style={{ marginBottom: '20px' }}>История заказов</h2>
        <div className="card fade-in" style={{ padding: '20px', textAlign: 'center' }}>
          <p style={{ marginBottom: '20px' }}>У вас пока нет заказов</p>
          <Link
            to="/catalog"
            style={{
              backgroundColor: 'var(--primary-color)',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '5px',
              textDecoration: 'none',
              display: 'inline-block'
            }}
          >
            Перейти в каталог
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content" style={{
      padding: '60px 0',
      background: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(10px)',
      minHeight: 'calc(100vh - 80px)'
    }}>
      <div className="container">
        <h2 style={{
          fontSize: '36px',
          fontWeight: 'bold',
          color: '#333',
          marginBottom: '40px',
          textAlign: 'center'
        }}>
          История заказов
        </h2>

        <div className="orders-list" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {orders.map(order => (
            <div
              key={order.id}
              className="card fade-in"
              style={{
                padding: '20px',
                borderRadius: '10px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: expandedOrder === order.id ? '20px' : '0',
                padding: '10px 0',
                borderBottom: expandedOrder === order.id ? '1px solid #eee' : 'none'
              }}>
                <div>
                  <h3 style={{ marginBottom: '5px', fontSize: '18px' }}>
                    Заказ №{order.id}
                  </h3>
                  <div style={{ display: 'flex', gap: '15px', fontSize: '14px', color: '#666' }}>
                    <span>{formatDate(order.created_at)}</span>
                    <span>•</span>
                    <span style={{
                      fontWeight: 'bold',
                      color: order.status === 'completed' ? '#4caf50' :
                        order.status === 'cancelled' ? '#f44336' : '#ff9800'
                    }}>
                      {formatStatus(order.status)}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <span style={{ fontWeight: 'bold' }}>{order.total_price} ₽</span>
                  <button
                    onClick={() => toggleOrderDetails(order.id)}
                    style={{
                      background: 'none',
                      border: '1px solid #ddd',
                      borderRadius: '5px',
                      padding: '8px 16px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    {expandedOrder === order.id ? 'Скрыть детали' : 'Показать детали'}
                  </button>
                </div>
              </div>

              {expandedOrder === order.id && (
                <div className="order-details" style={{ marginTop: '20px' }}>
                  {loadingDetails ? (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                      Загрузка деталей заказа...
                    </div>
                  ) : selectedOrderDetails ? (
                    <>
                      <div style={{ marginBottom: '20px' }}>
                        <div style={{ display: 'flex', marginBottom: '10px' }}>
                          <div style={{ width: '200px', fontWeight: 'bold' }}>Адрес доставки:</div>
                          <div>{selectedOrderDetails.delivery_address}</div>
                        </div>

                        <div style={{ display: 'flex', marginBottom: '10px' }}>
                          <div style={{ width: '200px', fontWeight: 'bold' }}>Способ оплаты:</div>
                          <div>{selectedOrderDetails.payment_method === 'card' ? 'Банковская карта' : 'Наличные при получении'}</div>
                        </div>

                        {selectedOrderDetails.comment && (
                          <div style={{ display: 'flex', marginBottom: '10px' }}>
                            <div style={{ width: '200px', fontWeight: 'bold' }}>Комментарий:</div>
                            <div>{selectedOrderDetails.comment}</div>
                          </div>
                        )}
                      </div>

                      <h4 style={{ marginBottom: '15px', fontSize: '16px' }}>Состав заказа:</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {selectedOrderDetails.items.map(item => (
                          <div
                            key={item.id}
                            style={{
                              display: 'flex',
                              gap: '20px',
                              padding: '15px',
                              background: 'rgba(255, 255, 255, 0.5)',
                              borderRadius: '8px',
                              border: '1px solid #eee'
                            }}
                          >
                            <img
                              src={formatImageUrl(item.image_url, '/assets/default-bouquet.jpg')}
                              alt={item.name}
                              style={{
                                width: '80px',
                                height: '80px',
                                objectFit: 'cover',
                                borderRadius: '5px'
                              }}
                            />

                            <div style={{ flex: 1 }}>
                              <h5 style={{ marginBottom: '5px', fontSize: '16px' }}>{item.name}</h5>
                              <p style={{ marginBottom: '10px', fontSize: '13px', color: '#666' }}>
                                {item.description?.substring(0, 100) || 'Без описания'}
                              </p>

                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontSize: '14px' }}>
                                  {item.quantity} шт. × {item.price} ₽
                                </span>
                                <span style={{ fontWeight: 'bold' }}>
                                  {item.quantity * item.price} ₽
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>
                      Не удалось загрузить детали заказа
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Orders; 
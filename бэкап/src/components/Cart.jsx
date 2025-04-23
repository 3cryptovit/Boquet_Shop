import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import formatImageUrl from "../utils/imageUrl";
import { fetchWithAuth } from '../utils/fetchWithAuth';
import '../index.css';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [deliveryInfo, setDeliveryInfo] = useState({
    address: '',
    phone: '',
    comment: '',
    paymentMethod: 'card'
  });
  const [orderStep, setOrderStep] = useState(1); // 1 - корзина, 2 - данные для заказа

  useEffect(() => {
    // Получаем токен авторизации из localStorage
    const userToken = localStorage.getItem("token");
    const userIdFromStorage = localStorage.getItem("userId");

    // Проверяем, есть ли токен и userId
    if (!userToken || !userIdFromStorage) {
      setError("Для оформления заказа необходимо авторизоваться");
      setLoading(false);
      return;
    }

    setToken(userToken);
    setUserId(userIdFromStorage);

    console.log("Запрашиваем корзину для пользователя:", userIdFromStorage);

    // Запрашиваем содержимое корзины с сервера
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/cart', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Ошибка при загрузке корзины');
      }

      const data = await response.json();
      setCartItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      const response = await fetch(`http://localhost:5000/api/cart/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ quantity })
      });

      if (!response.ok) {
        throw new Error('Ошибка при обновлении количества');
      }

      fetchCart(); // Обновляем корзину после изменения
    } catch (err) {
      setError(err.message);
    }
  };

  const removeItem = async (itemId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/cart/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Ошибка при удалении из корзины');
      }

      fetchCart(); // Обновляем корзину после удаления
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCheckout = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          items: cartItems.map(item => ({
            cartItemId: item.id,
            quantity: item.quantity
          })),
          ...deliveryInfo
        })
      });

      if (!response.ok) {
        throw new Error('Ошибка при оформлении заказа');
      }

      setOrderPlaced(true);
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div style={styles.container}><p>Загрузка корзины...</p></div>;
  }

  if (error && !cartItems.length) {
    return (
      <div style={styles.container}>
        <h1 style={styles.title}>🛒 Корзина</h1>
        <p style={styles.error}>{error}</p>
        <button
          style={styles.loginButton}
          onClick={() => navigate('/login')}
        >
          Войти в аккаунт
        </button>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div style={styles.container}>
        <h1 style={styles.title}>🎉 Заказ оформлен!</h1>
        <p style={styles.successMessage}>Спасибо за покупку! Мы уже готовим ваш заказ.</p>
        <p>Вы будете перенаправлены на главную страницу через несколько секунд...</p>
      </div>
    );
  }

  // Считаем общую стоимость
  const total = cartItems.reduce((sum, item) => {
    const price = item.customBouquet ? item.customBouquet.price : item.bouquet.price;
    return sum + price * item.quantity;
  }, 0);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🛒 Корзина</h1>

      {cartItems.length === 0 ? (
        <div style={styles.emptyCart}>
          <p>Ваша корзина пуста</p>
          <button
            style={styles.catalogButton}
            onClick={() => navigate('/catalog')}
          >
            Перейти в каталог
          </button>
        </div>
      ) : (
        <div className="card fade-in">
          {orderStep === 1 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}>
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <img
                    src={formatImageUrl(
                      item.customBouquet ? item.customBouquet.image_url : item.bouquet.imageUrl,
                      '/assets/default-bouquet.jpg'
                    )}
                    alt={item.customBouquet ? item.customBouquet.name : item.bouquet.name}
                    className="cart-item-image"
                  />
                  <div className="cart-item-details">
                    <h3>{item.customBouquet ? item.customBouquet.name : item.bouquet.name}</h3>
                    <p>{item.customBouquet ? item.customBouquet.description : item.bouquet.description}</p>
                    <p className="price">
                      {(item.customBouquet ? item.customBouquet.price : item.bouquet.price) * item.quantity} ₽
                    </p>
                    <div className="quantity-controls">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="remove-button"
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              ))}

              <div style={styles.cartSummary}>
                <h3>Итого: {total} ₽</h3>
                <button
                  onClick={() => setOrderStep(2)}
                  className="primary-button"
                >
                  Оформить заказ
                </button>
              </div>
            </div>
          ) : (
            <div style={styles.orderForm}>
              <h3>Оформление заказа</h3>
              <input
                type="text"
                placeholder="Адрес доставки"
                value={deliveryInfo.address}
                onChange={(e) => setDeliveryInfo({ ...deliveryInfo, address: e.target.value })}
                style={styles.input}
              />
              <input
                type="tel"
                placeholder="Телефон"
                value={deliveryInfo.phone}
                onChange={(e) => setDeliveryInfo({ ...deliveryInfo, phone: e.target.value })}
                style={styles.input}
              />
              <textarea
                placeholder="Комментарий к заказу"
                value={deliveryInfo.comment}
                onChange={(e) => setDeliveryInfo({ ...deliveryInfo, comment: e.target.value })}
                style={styles.textarea}
              />
              <div style={styles.paymentMethods}>
                <label>
                  <input
                    type="radio"
                    value="card"
                    checked={deliveryInfo.paymentMethod === 'card'}
                    onChange={(e) => setDeliveryInfo({ ...deliveryInfo, paymentMethod: e.target.value })}
                  />
                  Оплата картой
                </label>
                <label>
                  <input
                    type="radio"
                    value="cash"
                    checked={deliveryInfo.paymentMethod === 'cash'}
                    onChange={(e) => setDeliveryInfo({ ...deliveryInfo, paymentMethod: e.target.value })}
                  />
                  Оплата наличными
                </label>
              </div>
              <div style={styles.orderButtons}>
                <button
                  onClick={() => setOrderStep(1)}
                  className="secondary-button"
                >
                  Назад
                </button>
                <button
                  onClick={handleCheckout}
                  className="primary-button"
                  disabled={!deliveryInfo.address || !deliveryInfo.phone}
                >
                  Подтвердить заказ
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '40px 20px'
  },
  title: {
    fontSize: '28px',
    marginBottom: '20px'
  },
  error: {
    color: '#d32f2f',
    marginBottom: '20px'
  },
  loginButton: {
    background: '#ff4081',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  successMessage: {
    color: '#43a047',
    fontSize: '18px',
    marginBottom: '20px'
  },
  quantityButton: {
    border: '1px solid #ddd',
    background: 'white',
    width: '30px',
    height: '30px',
    borderRadius: '5px',
    cursor: 'pointer',
    margin: '0 5px'
  },
  quantityValue: {
    padding: '0 10px'
  },
  removeButton: {
    background: 'none',
    border: 'none',
    color: '#999',
    cursor: 'pointer',
    fontSize: '18px',
    marginLeft: 'auto'
  },
  emptyCart: {
    textAlign: 'center',
    padding: '40px'
  },
  catalogButton: {
    background: 'var(--primary-color)',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  cartSummary: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px'
  },
  orderForm: {
    padding: '20px'
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    marginBottom: '15px'
  },
  textarea: {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    minHeight: '100px',
    marginBottom: '15px'
  },
  paymentMethods: {
    marginBottom: '15px'
  },
  orderButtons: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px'
  }
};

export default Cart;

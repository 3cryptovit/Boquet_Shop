import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../features/auth/model';
import formatImageUrl from '../shared/utils/imageUrl';
import Button from '../shared/ui/Button';
import { api } from '../shared/utils/apiClient';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const navigate = useNavigate();
  const { isAuth, user } = useAuthStore();
  const [deliveryInfo, setDeliveryInfo] = useState({
    address: '',
    phone: '',
    comment: '',
    paymentMethod: 'card'
  });
  const [orderStep, setOrderStep] = useState(1); // 1 - корзина, 2 - данные для заказа

  useEffect(() => {
    // Проверяем, авторизован ли пользователь
    if (!isAuth) {
      setError("Для оформления заказа необходимо авторизоваться");
      setLoading(false);
      return;
    }

    // Запрашиваем содержимое корзины
    fetchCart();
  }, [isAuth]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/cart');
      setCartItems(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Ошибка при загрузке корзины');
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      await api.put(`/api/cart/${itemId}`, { quantity });
      fetchCart(); // Обновляем корзину после изменения
    } catch (err) {
      setError(err.message || 'Ошибка при обновлении количества');
    }
  };

  const removeItem = async (itemId) => {
    try {
      await api.delete(`/api/cart/${itemId}`);
      fetchCart(); // Обновляем корзину после удаления
    } catch (err) {
      setError(err.message || 'Ошибка при удалении из корзины');
    }
  };

  const handleCheckout = async () => {
    try {
      await api.post('/api/orders', {
        items: cartItems.map(item => ({
          cartItemId: item.id,
          quantity: item.quantity
        })),
        ...deliveryInfo
      });

      // Очищаем корзину после успешного оформления заказа
      try {
        await api.delete('/api/cart');
      } catch (clearError) {
        console.error('Ошибка при очистке корзины:', clearError);
      }

      setOrderPlaced(true);
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (err) {
      setError(err.message || 'Ошибка при оформлении заказа');
    }
  };

  // Состояние загрузки
  if (loading) {
    return (
      <div className="container mx-auto py-16 text-center">
        <div className="loader mx-auto mb-4"></div>
        <p>Загружаем корзину...</p>
      </div>
    );
  }

  // Если пользователь не авторизован
  if (!isAuth) {
    return (
      <div className="container mx-auto py-16 text-center">
        <h1 className="text-3xl font-bold mb-6">🛒 Корзина</h1>
        <p className="mb-6">Для оформления заказа необходимо авторизоваться</p>
        <Button onClick={() => navigate('/login')}>
          Войти в аккаунт
        </Button>
      </div>
    );
  }

  // Заказ успешно оформлен
  if (orderPlaced) {
    return (
      <div className="container mx-auto py-16 text-center">
        <h1 className="text-3xl font-bold mb-6">🎉 Заказ оформлен!</h1>
        <p className="text-xl mb-4">Спасибо за покупку! Мы уже готовим ваш заказ.</p>
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
    <div className="container mx-auto py-16">
      <h1 className="text-3xl font-bold mb-8">🛒 Корзина</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <p className="mb-6 text-xl">Ваша корзина пуста</p>
          <Button onClick={() => navigate('/catalog')}>
            Перейти в каталог
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          {orderStep === 1 ? (
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex flex-col md:flex-row gap-6 p-4 border-b">
                  <div className="md:w-1/4">
                    <img
                      src={formatImageUrl(
                        item.customBouquet ? item.customBouquet.image : item.bouquet.image
                      )}
                      alt={item.customBouquet ? item.customBouquet.name : item.bouquet.name}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                  <div className="md:w-3/4 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        {item.customBouquet ? item.customBouquet.name : item.bouquet.name}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {item.customBouquet ? item.customBouquet.description : item.bouquet.description}
                      </p>
                      <p className="text-xl font-bold text-primary mb-4">
                        {(item.customBouquet ? item.customBouquet.price : item.bouquet.price) * item.quantity} ₽
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full disabled:opacity-50"
                        >
                          -
                        </button>
                        <span className="font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full"
                        >
                          +
                        </button>
                      </div>
                      <Button
                        variant="secondary"
                        onClick={() => removeItem(item.id)}
                      >
                        Удалить
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex flex-col md:flex-row justify-between items-center pt-6">
                <h3 className="text-2xl font-bold mb-4 md:mb-0">Итого: {total} ₽</h3>
                <Button onClick={() => setOrderStep(2)}>
                  Оформить заказ
                </Button>
              </div>
            </div>
          ) : (
            <div className="max-w-lg mx-auto">
              <h3 className="text-2xl font-semibold mb-6">Оформление заказа</h3>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-gray-700 mb-1">Адрес доставки</label>
                  <input
                    type="text"
                    placeholder="Укажите адрес доставки"
                    value={deliveryInfo.address}
                    onChange={(e) => setDeliveryInfo({ ...deliveryInfo, address: e.target.value })}
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-1">Телефон</label>
                  <input
                    type="text"
                    placeholder="Контактный телефон"
                    value={deliveryInfo.phone}
                    onChange={(e) => setDeliveryInfo({ ...deliveryInfo, phone: e.target.value })}
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-1">Комментарий к заказу</label>
                  <textarea
                    placeholder="Комментарий к заказу (необязательно)"
                    value={deliveryInfo.comment}
                    onChange={(e) => setDeliveryInfo({ ...deliveryInfo, comment: e.target.value })}
                    className="w-full border border-gray-300 rounded-md p-2 h-24"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-gray-700 mb-1">Способ оплаты</label>
                  <select
                    value={deliveryInfo.paymentMethod}
                    onChange={(e) => setDeliveryInfo({ ...deliveryInfo, paymentMethod: e.target.value })}
                    className="w-full border border-gray-300 rounded-md p-2"
                  >
                    <option value="card">Банковская карта</option>
                    <option value="cash">Наличными при получении</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-between">
                <Button
                  variant="secondary"
                  onClick={() => setOrderStep(1)}
                >
                  Назад
                </Button>
                <Button
                  disabled={!deliveryInfo.address || !deliveryInfo.phone}
                  onClick={handleCheckout}
                >
                  Подтвердить заказ
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CartPage;

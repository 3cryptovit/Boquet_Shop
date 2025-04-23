import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConstructorStore } from '../features/constructor/model';
import { useAuthStore } from '../features/auth/model';
import Button from '../shared/ui/Button';
import Modal from '../shared/ui/Modal';
import { formatImageUrl } from '../shared/utils/imageUrl';

const ConstructorPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const {
    flowers,
    selectedFlowers,
    bouquetName,
    bouquetDescription,
    bouquetPrice,
    isLoading,
    error,
    isSaving,
    saveError,
    fetchFlowers,
    addFlower,
    removeFlower,
    setBouquetName,
    setBouquetDescription,
    saveBouquet,
    addBouquetToCart,
    clearConstructor
  } = useConstructorStore();

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('construction'); // 'construction' или 'info'

  // Загружаем цветы при загрузке страницы
  useEffect(() => {
    fetchFlowers();
  }, [fetchFlowers]);

  // Обработчики действий
  const handleAddFlower = (flower) => {
    // Генерируем простую случайную позицию для цветка
    const position = {
      x: Math.floor(Math.random() * 400),
      y: Math.floor(Math.random() * 400),
      z: Math.floor(Math.random() * 10),
      rotation: Math.floor(Math.random() * 360)
    };
    addFlower(flower, position);
  };

  const handleSaveBouquet = async () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    if (selectedFlowers.length === 0) {
      alert('Пожалуйста, добавьте хотя бы один цветок в букет');
      return;
    }

    setIsSaveModalOpen(true);
  };

  const handleFinalizeSave = async () => {
    const result = await saveBouquet();
    if (result) {
      alert('Букет успешно сохранен!');
      setIsSaveModalOpen(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    const result = await addBouquetToCart();
    if (result) {
      alert('Букет успешно добавлен в корзину!');
      clearConstructor();
    }
  };

  const handleNameChange = (e) => {
    setBouquetName(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setBouquetDescription(e.target.value);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-2xl font-semibold">Загрузка цветов...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <p className="text-2xl font-semibold text-red-500">Ошибка: {error}</p>
        <Button onClick={fetchFlowers} className="mt-4">
          Попробовать снова
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Конструктор букетов</h1>

      {/* Вкладки */}
      <div className="flex mb-6 border-b">
        <button
          className={`px-4 py-2 mr-2 ${activeTab === 'construction' ? 'border-b-2 border-primary font-semibold' : ''}`}
          onClick={() => setActiveTab('construction')}
        >
          Выбор цветов
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'info' ? 'border-b-2 border-primary font-semibold' : ''}`}
          onClick={() => setActiveTab('info')}
        >
          Информация о букете
        </button>
      </div>

      {activeTab === 'construction' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Левая панель - доступные цветы */}
          <div className="md:col-span-1">
            <h2 className="text-xl font-semibold mb-4">Доступные цветы</h2>
            <div className="border rounded-lg p-4 max-h-96 overflow-y-auto">
              {flowers.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-4">
                  {flowers.map((flower) => (
                    <div key={flower.id} className="border rounded-lg p-2 flex items-center">
                      <img
                        src={formatImageUrl(flower.imageUrl)}
                        alt={flower.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="ml-2 flex-1">
                        <p className="font-medium">{flower.name}</p>
                        <p className="text-sm text-gray-600">{flower.price} ₽</p>
                      </div>
                      <Button
                        onClick={() => handleAddFlower(flower)}
                        className="ml-2 px-2 py-1"
                        variant="outline"
                      >
                        +
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p>Нет доступных цветов</p>
              )}
            </div>
          </div>

          {/* Центральная панель - композиция */}
          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Ваш букет</h2>
            <div className="border rounded-lg p-4 min-h-80 relative">
              {selectedFlowers.length > 0 ? (
                <div className="relative" style={{ height: '500px' }}>
                  {selectedFlowers.map((flower, index) => (
                    <div
                      key={index}
                      className="absolute cursor-move"
                      style={{
                        left: `${flower.position.x}px`,
                        top: `${flower.position.y}px`,
                        zIndex: flower.position.z,
                        transform: `rotate(${flower.position.rotation}deg)`
                      }}
                    >
                      <div className="relative">
                        <img
                          src={formatImageUrl(flower.imageUrl)}
                          alt={flower.name}
                          className="w-20 h-20 object-contain"
                        />
                        <button
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                          onClick={() => removeFlower(index)}
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-80">
                  <p className="text-gray-500 mb-4">Ваш букет пуст. Добавьте цветы из списка слева.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Информация о букете */}
          <div className="md:col-span-1">
            <h2 className="text-xl font-semibold mb-4">Детали букета</h2>
            <div className="border rounded-lg p-4">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Название букета</label>
                <input
                  type="text"
                  value={bouquetName}
                  onChange={handleNameChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="Введите название букета"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Описание</label>
                <textarea
                  value={bouquetDescription}
                  onChange={handleDescriptionChange}
                  className="w-full p-2 border rounded-md min-h-32"
                  placeholder="Введите описание букета"
                />
              </div>
            </div>
          </div>

          {/* Сводка по букету */}
          <div className="md:col-span-1">
            <h2 className="text-xl font-semibold mb-4">Состав букета</h2>
            <div className="border rounded-lg p-4">
              {selectedFlowers.length > 0 ? (
                <div className="mb-4">
                  <ul className="divide-y">
                    {selectedFlowers.reduce((acc, flower) => {
                      const existingFlower = acc.find(f => f.id === flower.id);
                      if (existingFlower) {
                        existingFlower.count += 1;
                      } else {
                        acc.push({ ...flower, count: 1 });
                      }
                      return acc;
                    }, []).map((flower) => (
                      <li key={flower.id} className="py-2 flex justify-between">
                        <span>{flower.name}</span>
                        <span className="text-gray-600">
                          {flower.count} шт. × {flower.price} ₽ = {flower.count * flower.price} ₽
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 pt-4 border-t flex justify-between font-semibold">
                    <span>Итого:</span>
                    <span>{bouquetPrice} ₽</span>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">Добавьте цветы, чтобы увидеть состав букета</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Кнопки действий */}
      <div className="mt-8 flex flex-wrap gap-4 justify-center">
        <Button onClick={() => clearConstructor()} variant="outline">
          Очистить
        </Button>
        <Button onClick={handleSaveBouquet} disabled={selectedFlowers.length === 0 || isSaving}>
          {isSaving ? 'Сохранение...' : 'Сохранить букет'}
        </Button>
        <Button onClick={handleAddToCart} disabled={selectedFlowers.length === 0 || isSaving}>
          Добавить в корзину
        </Button>
      </div>

      {/* Модальное окно авторизации */}
      <Modal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)}>
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-4">Необходима авторизация</h3>
          <p className="mb-6">Чтобы сохранить букет или добавить его в корзину, необходимо войти в аккаунт.</p>
          <div className="flex justify-end gap-4">
            <Button onClick={() => setIsAuthModalOpen(false)} variant="outline">
              Отмена
            </Button>
            <Button onClick={() => navigate('/login')}>
              Войти
            </Button>
          </div>
        </div>
      </Modal>

      {/* Модальное окно сохранения */}
      <Modal isOpen={isSaveModalOpen} onClose={() => setIsSaveModalOpen(false)}>
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-4">Сохранение букета</h3>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Название букета</label>
            <input
              type="text"
              value={bouquetName}
              onChange={handleNameChange}
              className="w-full p-2 border rounded-md"
              placeholder="Введите название букета"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Описание</label>
            <textarea
              value={bouquetDescription}
              onChange={handleDescriptionChange}
              className="w-full p-2 border rounded-md"
              placeholder="Введите описание букета"
            />
          </div>

          {saveError && (
            <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
              {saveError}
            </div>
          )}

          <div className="flex justify-end gap-4">
            <Button onClick={() => setIsSaveModalOpen(false)} variant="outline">
              Отмена
            </Button>
            <Button onClick={handleFinalizeSave} disabled={isSaving}>
              {isSaving ? 'Сохранение...' : 'Сохранить'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ConstructorPage;

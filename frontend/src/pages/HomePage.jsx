import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="main-content">
      <section className="hero">
        <div className="container">
          <h1>Boquet Shop</h1>
          <p>Создавайте букеты своей мечты или выбирайте из нашей коллекции</p>
          <div className="mt-10 flex gap-5 justify-center">
            <Link to="/catalog" className="btn btn-primary">
              Смотреть каталог
            </Link>
            <Link to="/constructor" className="btn btn-outline">
              Создать букет
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white bg-opacity-80 backdrop-blur-md">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card fade-in text-center p-8">
              <div className="text-4xl mb-5">🎨</div>
              <h3 className="text-xl mb-4 text-primary font-semibold">AI Конструктор</h3>
              <p className="text-gray-600">
                Создавайте уникальные букеты с помощью искусственного интеллекта
              </p>
            </div>

            <div className="card fade-in text-center p-8">
              <div className="text-4xl mb-5">🚚</div>
              <h3 className="text-xl mb-4 text-primary font-semibold">Быстрая доставка</h3>
              <p className="text-gray-600">
                Доставляем букеты в день заказа по всему городу
              </p>
            </div>

            <div className="card fade-in text-center p-8">
              <div className="text-4xl mb-5">💐</div>
              <h3 className="text-xl mb-4 text-primary font-semibold">Свежие цветы</h3>
              <p className="text-gray-600">
                Работаем только со свежими цветами от проверенных поставщиков
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary bg-opacity-10">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Почему выбирают нас</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-3">Индивидуальный подход</h3>
              <p className="text-gray-600">Создаем букеты под ваши предпочтения и пожелания</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-3">Гарантия качества</h3>
              <p className="text-gray-600">Гарантируем свежесть цветов до 7 дней</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-3">Быстрая доставка</h3>
              <p className="text-gray-600">Доставка в течение 2 часов по городу</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-3">Большой выбор</h3>
              <p className="text-gray-600">Более 100 видов цветов и готовых композиций</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

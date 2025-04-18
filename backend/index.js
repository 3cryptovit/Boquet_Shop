const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// 🚀 Импорт роутов
const authRoutes = require('./src/routes/auth.routes');
const flowerRoutes = require('./src/routes/flower.routes');
const bouquetRoutes = require('./src/routes/bouquet.routes');
const customBouquetRoutes = require('./src/routes/customBouquet.routes');
const cartRoutes = require('./src/routes/cart.routes');
const orderRoutes = require('./src/routes/order.routes');
const favoritesRoutes = require('./src/routes/favorites.routes');
const adminRoutes = require('./src/routes/admin.routes');

// 🔧 Загрузка переменных окружения
dotenv.config();

// 🏗️ Создание приложения
const app = express();

// 🔧 Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true // обязательно для работы с httpOnly куками
}));
app.use(express.json());
app.use(cookieParser());

// Отдаём папку public по маршруту /assets
app.use('/assets', express.static(path.join(__dirname, 'public')));

// 🚀 Routes
app.use('/api/auth', authRoutes);
app.use('/api/flowers', flowerRoutes);
app.use('/api/bouquets', bouquetRoutes);
app.use('/api/custom-bouquets', customBouquetRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/admin', adminRoutes);

// 🟢 Старт сервера
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
});

const prisma = require('../../prisma/client');

// Получить текущую корзину пользователя
exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cartItems = await prisma.cart.findMany({
      where: { userId },
      include: {
        bouquet: true,
        customBouquet: true
      }
    });

    res.json(cartItems);
  } catch (err) {
    console.error('Ошибка при получении корзины:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

// Добавить обычный букет в корзину
exports.addToCart = async (req, res) => {
  try {
    const { bouquetId } = req.body;
    const userId = req.user.id;

    if (!bouquetId) return res.status(400).json({ error: 'Не указан букет' });

    const item = await prisma.cart.upsert({
      where: { userId_bouquetId: { userId, bouquetId } },
      update: { quantity: { increment: 1 } },
      create: { userId, bouquetId, quantity: 1 }
    });

    res.status(201).json(item);
  } catch (err) {
    console.error('Ошибка при добавлении в корзину:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

// ✅ Добавить уже созданный кастомный букет в корзину
exports.addCustomToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { customBouquetId, quantity } = req.body;

    if (!customBouquetId || !quantity || quantity < 1) {
      return res.status(400).json({ error: 'Заполните все поля и укажите количество' });
    }

    const exists = await prisma.customBouquet.findUnique({ where: { id: customBouquetId } });

    if (!exists) {
      return res.status(404).json({ error: 'Кастомный букет не найден' });
    }

    const cartItem = await prisma.cart.create({
      data: {
        userId,
        customBouquetId,
        quantity
      }
    });

    res.status(201).json(cartItem);
  } catch (err) {
    console.error('Ошибка при добавлении кастомного букета в корзину:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

// Обновить количество
exports.updateQuantity = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const userId = req.user.id;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ error: 'Некорректное количество' });
    }

    const updated = await prisma.cart.updateMany({
      where: { id: Number(id), userId },
      data: { quantity }
    });

    if (updated.count === 0) return res.status(404).json({ error: 'Позиция не найдена' });

    res.json({ message: 'Обновлено' });
  } catch (err) {
    console.error('Ошибка обновления количества:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

// Удалить из корзины
exports.removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await prisma.cart.deleteMany({ where: { id: Number(id), userId } });

    res.json({ message: 'Удалено' });
  } catch (err) {
    console.error('Ошибка удаления из корзины:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

const prisma = require('../../prisma/client');

// ✅ Создание заказа (обычные и кастомные букеты)
exports.createOrder = async (req, res) => {
  const userId = req.user.id;

  try {
    const cartItems = await prisma.cart.findMany({
      where: { userId },
      include: {
        bouquet: true,
        customBouquet: true
      }
    });

    if (!cartItems.length) {
      return res.status(400).json({ error: 'Корзина пуста' });
    }

    const total = cartItems.reduce((sum, item) => {
      const price = item.bouquet?.price || item.customBouquet?.price || 0;
      return sum + price * item.quantity;
    }, 0);

    const order = await prisma.order.create({
      data: {
        userId,
        total,
        items: {
          create: cartItems.map(item => ({
            bouquetId: item.bouquetId ?? null,
            customBouquetId: item.customBouquetId ?? null,
            quantity: item.quantity
          }))
        }
      },
      include: {
        items: {
          include: {
            bouquet: true,
            customBouquet: true
          }
        }
      }
    });

    await prisma.cart.deleteMany({ where: { userId } });

    res.status(201).json(order);
  } catch (err) {
    console.error('Ошибка при оформлении заказа:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

// ✅ Получение всех заказов пользователя
exports.getOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            bouquet: true,
            customBouquet: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(orders);
  } catch (err) {
    console.error('Ошибка при получении заказов:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

// ✅ Получение конкретного заказа по ID
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const order = await prisma.order.findUnique({
      where: { id: Number(id) },
      include: {
        items: {
          include: {
            bouquet: true,
            customBouquet: true
          }
        }
      }
    });

    if (!order || order.userId !== userId) {
      return res.status(404).json({ error: 'Заказ не найден' });
    }

    res.json(order);
  } catch (err) {
    console.error('Ошибка при получении заказа:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

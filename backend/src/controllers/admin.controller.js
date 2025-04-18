const prisma = require('../../prisma/client');
const path = require('path');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(users);
  } catch (err) {
    console.error('Ошибка получения пользователей:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Недопустимая роль' });
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { role }
    });

    res.json(updated);
  } catch (err) {
    console.error('Ошибка обновления роли:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: true,
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
    console.error('Ошибка получения заказов:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        user: true,
        items: {
          include: {
            bouquet: true,
            customBouquet: true
          }
        }
      }
    });

    if (!order) return res.status(404).json({ error: 'Заказ не найден' });

    res.json(order);
  } catch (err) {
    console.error('Ошибка получения заказа:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

exports.createBouquet = async (req, res) => {
  try {
    const { name, description, price, userId } = req.body;
    const imageUrl = req.body.imageUrl || req.file?.path?.replace('public', '') || '';

    if (!name || !description || !price || !userId || !imageUrl) {
      return res.status(400).json({ error: 'Все поля обязательны' });
    }

    const bouquet = await prisma.bouquet.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        imageUrl,
        userId: Number(userId)
      }
    });

    res.status(201).json(bouquet);
  } catch (err) {
    console.error('Ошибка создания букета:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Файл не загружен' });
    }

    const filePath = '/assets/' + path.basename(req.file.path);
    res.status(201).json({ imageUrl: filePath });
  } catch (err) {
    console.error('Ошибка загрузки изображения:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

exports.deleteBouquet = async (req, res) => {
  const id = Number(req.params.id);
  try {
    await prisma.bouquet.delete({
      where: { id }
    });
    res.json({ message: 'Букет удалён' });
  } catch (err) {
    console.error('Ошибка удаления букета:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

exports.updateBouquet = async (req, res) => {
  const id = Number(req.params.id);
  const { name, description, price, imageUrl, isPublic } = req.body;

  try {
    const updated = await prisma.bouquet.update({
      where: { id },
      data: { name, description, price, imageUrl, isPublic }
    });
    res.json(updated);
  } catch (err) {
    console.error('Ошибка обновления букета:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

exports.getAllBouquets = async (req, res) => {
  try {
    const bouquets = await prisma.bouquet.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(bouquets);
  } catch (err) {
    console.error('Ошибка получения всех букетов:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;

    const validStatuses = ['pending', 'approved', 'cancelled', 'delivered'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Недопустимый статус' });
    }

    const updated = await prisma.order.update({
      where: { id },
      data: { status }
    });

    res.json(updated);
  } catch (err) {
    console.error('Ошибка обновления статуса заказа:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

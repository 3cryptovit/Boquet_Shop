const prisma = require('../../prisma/client');

// ✅ Получить все публичные букеты
exports.getAllPublicBouquets = async (req, res) => {
  try {
    const bouquets = await prisma.bouquet.findMany({
      where: { isPublic: true },
      include: {
        user: { select: { username: true } },
        favorites: true,
        cart: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(bouquets);
  } catch (err) {
    console.error('Ошибка при получении букетов:', err);
    res.status(500).json({ error: 'Не удалось получить букеты' });
  }
};

// ✅ Получить конкретный букет по ID
exports.getBouquetById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const bouquet = await prisma.bouquet.findUnique({
      where: { id },
      include: {
        flowers: {
          include: {
            flower: true
          }
        },
        cells: true
      }
    });

    if (!bouquet) return res.status(404).json({ error: 'Букет не найден' });

    res.json(bouquet);
  } catch (err) {
    console.error('Ошибка при получении букета:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

// ✅ Админ: создать букет и добавить в каталог
exports.createBouquet = async (req, res) => {
  try {
    const { name, description, imageUrl, userId, flowers, cells, price } = req.body;

    if (!name || !userId || !Array.isArray(flowers) || !Array.isArray(cells)) {
      return res.status(400).json({ error: 'Неверные данные для создания букета' });
    }

    const bouquet = await prisma.bouquet.create({
      data: {
        name,
        description,
        imageUrl,
        userId,
        price,
        flowers: {
          create: flowers.map(f => ({
            flowerId: f.flowerId,
            positionX: f.positionX,
            positionY: f.positionY,
            layer: f.layer,
            angle: f.angle,
            color: f.color,
            zIndex: f.zIndex
          }))
        },
        cells: {
          create: cells.map(c => ({
            flowerId: c.flowerId || null,
            positionX: c.positionX,
            positionY: c.positionY,
            angle: c.angle,
            layer: c.layer,
            zIndex: c.zIndex,
            position: c.position
          }))
        }
      }
    });

    res.status(201).json(bouquet);
  } catch (err) {
    console.error('Ошибка при создании букета:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

// ✅ Админ: удалить букет
exports.deleteBouquet = async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.bouquet.delete({
      where: { id }
    });

    res.json({ message: 'Букет удалён' });
  } catch (err) {
    console.error('Ошибка при удалении букета:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

const prisma = require('../../prisma/client');

// ✅ Создание кастомного букета пользователем
exports.createCustomBouquet = async (req, res) => {
  try {
    const { name, description, price, imageUrl, flowers } = req.body;

    if (!name || !description || !price || !Array.isArray(flowers) || flowers.length === 0) {
      return res.status(400).json({ error: 'Неверные данные: заполните все поля и укажите цветы' });
    }

    // Проверим структуру каждого цветка (например, position и flowerId)
    const isValid = flowers.every(f => typeof f === 'object' && 'position' in f && 'flowerId' in f);
    if (!isValid) {
      return res.status(400).json({ error: 'Некорректный формат цветов' });
    }

    const bouquet = await prisma.customBouquet.create({
      data: {
        name,
        description,
        price,
        imageUrl,
        flowers: JSON.stringify(flowers) // сохраняем макет как JSON строку
      }
    });

    res.status(201).json({
      id: bouquet.id,
      name: bouquet.name,
      description: bouquet.description,
      price: bouquet.price,
      imageUrl: bouquet.imageUrl,
      flowers // возвращаем как есть, не JSON строку
    });
  } catch (err) {
    console.error('❌ Ошибка при создании кастомного букета:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

// ✅ Получение кастомного букета по ID (например, для админки или заказа)
exports.getCustomBouquetById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const bouquet = await prisma.customBouquet.findUnique({
      where: { id }
    });

    if (!bouquet) {
      return res.status(404).json({ error: 'Букет не найден' });
    }

    let parsedFlowers = [];
    try {
      parsedFlowers = JSON.parse(bouquet.flowers);
    } catch (e) {
      console.warn('⚠️ Не удалось разобрать JSON цветов:', e);
    }

    res.json({
      id: bouquet.id,
      name: bouquet.name,
      description: bouquet.description,
      price: bouquet.price,
      imageUrl: bouquet.imageUrl,
      flowers: parsedFlowers
    });
  } catch (err) {
    console.error('❌ Ошибка при получении кастомного букета:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

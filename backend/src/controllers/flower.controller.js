// backend/controllers/flower.controller.js

const prisma = require('../../prisma/client');

// ✅ Получить список всех цветов (для конструктора)
exports.getAllFlowers = async (req, res) => {
  try {
    const flowers = await prisma.flower.findMany({
      orderBy: { id: 'asc' } // можно убрать или изменить на name
    });

    res.status(200).json(flowers);
  } catch (err) {
    console.error('Ошибка при получении цветов:', err);
    res.status(500).json({ error: 'Не удалось загрузить цветы' });
  }
};

// 🛠️ (опционально для админа) Добавить новый цвет
exports.createFlower = async (req, res) => {
  try {
    const { name, price, imageUrl } = req.body;

    if (!name || !price) {
      return res.status(400).json({ error: 'Название и цена обязательны' });
    }

    const flower = await prisma.flower.create({
      data: { name, price: Number(price), imageUrl }
    });

    res.status(201).json(flower);
  } catch (err) {
    console.error('Ошибка при добавлении цветка:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

// 🧼 (опционально для админа) Удалить цвет по ID
exports.deleteFlower = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.flower.delete({
      where: { id: Number(id) }
    });

    res.json({ message: 'Цветок удалён' });
  } catch (err) {
    console.error('Ошибка при удалении цветка:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

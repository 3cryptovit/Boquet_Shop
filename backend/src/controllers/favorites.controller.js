const favoriteService = require('../services/favorites.service');

// ✅ Получить все избранные букеты пользователя
exports.getFavorites = async (req, res) => {
  try {
    const userId = req.user.id;
    const favorites = await favoriteService.getFavoritesByUser(userId);
    res.json(favorites);
  } catch (err) {
    console.error('Ошибка при получении избранного:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

// ✅ Добавить букет в избранное
exports.addFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const bouquetId = Number(req.params.id);

    const exists = await favoriteService.isFavorite(userId, bouquetId);
    if (exists) {
      return res.status(400).json({ error: 'Уже в избранном' });
    }

    const favorite = await favoriteService.addToFavorites(userId, bouquetId);
    res.status(201).json(favorite);
  } catch (err) {
    console.error('Ошибка при добавлении в избранное:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

// ✅ Удалить букет из избранного
exports.removeFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const bouquetId = Number(req.params.id);

    await favoriteService.removeFromFavorites(userId, bouquetId);
    res.json({ message: 'Удалено из избранного' });
  } catch (err) {
    console.error('Ошибка при удалении из избранного:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

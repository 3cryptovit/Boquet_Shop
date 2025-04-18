const jwt = require('jsonwebtoken');
const prisma = require('../../prisma/client');

module.exports = async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Требуется авторизация' });
    }

    const token = authHeader.split(' ')[1];

    // Проверка валидности токена
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Дополнительно — проверка в "чёрном списке", если используется (опционально)
    const isRevoked = await prisma.revokedToken.findUnique({
      where: { token },
    });

    if (isRevoked) {
      return res.status(401).json({ message: 'Токен отозван. Войдите снова.' });
    }

    // Получаем пользователя
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    if (!user) {
      return res.status(401).json({ message: 'Пользователь не найден' });
    }

    req.user = user;
    next();

  } catch (err) {
    console.error('Auth error:', err.message);
    return res.status(401).json({ message: 'Недействительный токен' });
  }
};

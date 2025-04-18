const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../../prisma/client'); // путь к клиенту Prisma
const { setRefreshTokenCookie, clearRefreshTokenCookie } = require('../utils/cookies');

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

const ACCESS_EXPIRES_IN = '15m';
const REFRESH_EXPIRES_IN = '7d';

function generateAccessToken(user) {
  return jwt.sign(
    {
      userId: user.id,
      role: user.role
    },
    ACCESS_TOKEN_SECRET,
    { expiresIn: ACCESS_EXPIRES_IN }
  );
}

function generateRefreshToken(user) {
  return jwt.sign(
    { userId: user.id },
    REFRESH_TOKEN_SECRET,
    { expiresIn: REFRESH_EXPIRES_IN }
  );
}

exports.register = async (req, res) => {
  try {
    const { email, username, password, confirmPassword } = req.body;

    if (!email || !username || !password || !confirmPassword) {
      return res.status(400).json({ error: 'Заполните все поля' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Пароли не совпадают' });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }]
      }
    });

    if (existingUser) {
      return res.status(409).json({ error: 'Пользователь уже существует' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword
      }
    });

    res.status(201).json({ message: 'Пользователь зарегистрирован', user: { id: user.id, username: user.username } });
  } catch (err) {
    console.error('Ошибка при регистрации:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};


exports.login = async (req, res) => {
  try {
    const { loginOrEmail, password } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: loginOrEmail },
          { username: loginOrEmail }
        ]
      }
    });

    if (!user) {
      return res.status(401).json({ error: 'Неверный логин или пароль' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Неверный логин или пароль' });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Сохраняем refreshToken в БД
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 дней
      }
    });

    // Устанавливаем refresh token в cookie
    setRefreshTokenCookie(res, refreshToken);

    res.json({
      accessToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Ошибка при входе:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

exports.refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token отсутствует' });
    }

    // Проверяем refresh token в БД
    const tokenRecord = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true }
    });

    if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
      clearRefreshTokenCookie(res);
      return res.status(401).json({ error: 'Недействительный refresh token' });
    }

    // Генерируем новую пару токенов
    const accessToken = generateAccessToken(tokenRecord.user);
    const newRefreshToken = generateRefreshToken(tokenRecord.user);

    // Обновляем refresh token в БД
    await prisma.refreshToken.update({
      where: { id: tokenRecord.id },
      data: {
        token: newRefreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    });

    // Устанавливаем новый refresh token в cookie
    setRefreshTokenCookie(res, newRefreshToken);

    res.json({
      accessToken,
      user: {
        id: tokenRecord.user.id,
        username: tokenRecord.user.username,
        email: tokenRecord.user.email,
        role: tokenRecord.user.role
      }
    });
  } catch (err) {
    console.error('Ошибка при обновлении токена:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

exports.logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const accessToken = req.headers.authorization?.split(' ')[1]; // Access из заголовка

    if (refreshToken) {
      await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
      clearRefreshTokenCookie(res);
    }

    if (accessToken) {
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      await prisma.revokedToken.create({
        data: {
          token: accessToken,
          expiresAt: new Date(decoded.exp * 1000) // expiry из токена
        }
      });
    }

    res.json({ message: 'Выход выполнен' });
  } catch (err) {
    console.error('Ошибка при выходе:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    if (!user) return res.status(404).json({ error: 'Пользователь не найден' });

    res.json(user);
  } catch (err) {
    console.error('Ошибка получения пользователя:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

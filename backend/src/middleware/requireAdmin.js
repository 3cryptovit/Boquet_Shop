const jwt = require('jsonwebtoken');
// внутри requireAuth.js
const prisma = require('../../prisma/client');

module.exports = function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ message: 'Требуется авторизация' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Доступ только для админов' });
  }

  next();
};

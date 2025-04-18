// services/admin.service.js
const prisma = require('../prisma/client');

exports.getAllUsers = () => {
  return prisma.user.findMany({
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      createdAt: true
    }
  });
};

exports.updateUserRole = (id, newRole) => {
  return prisma.user.update({
    where: { id },
    data: { role: newRole }
  });
};

// Дополнительно:
exports.getAllOrders = () => {
  return prisma.order.findMany({
    include: {
      user: { select: { username: true } },
      items: {
        include: {
          bouquet: true,
          customBouquet: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
};

exports.getOrderById = (id) => {
  return prisma.order.findUnique({
    where: { id },
    include: {
      user: { select: { username: true } },
      items: {
        include: {
          bouquet: true,
          customBouquet: true
        }
      }
    }
  });
};

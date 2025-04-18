const prisma = require('../../prisma/client');

exports.getFavoritesByUser = async (userId) => {
  return prisma.favorite.findMany({
    where: { userId },
    include: {
      bouquet: true
    }
  });
};

exports.addToFavorites = async (userId, bouquetId) => {
  return prisma.favorite.create({
    data: {
      userId,
      bouquetId
    }
  });
};

exports.removeFromFavorites = async (userId, bouquetId) => {
  return prisma.favorite.deleteMany({
    where: {
      userId,
      bouquetId
    }
  });
};

exports.isFavorite = async (userId, bouquetId) => {
  return prisma.favorite.findUnique({
    where: {
      userId_bouquetId: {
        userId,
        bouquetId
      }
    }
  });
};

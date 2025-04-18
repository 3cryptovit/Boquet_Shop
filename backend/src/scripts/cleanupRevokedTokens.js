const prisma = require('../prisma/client');

async function clean() {
  const now = new Date();
  const result = await prisma.revokedToken.deleteMany({
    where: { expiresAt: { lt: now } }
  });

  console.log(`🧽 Очищено ${result.count} просроченных токенов`);
}

clean().finally(() => process.exit());

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function seedAdmin() {
  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'admin@boquetshop.com' }
  });

  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        email: 'admin@boquetshop.com',
        password: 'admin123', // 
        username: 'admin',
        role: 'admin',
      },
    });

    console.log('👑 Админ создан: admin@boquetshop.com / admin123');
  } else {
    console.log('👑 Админ уже существует');
  }
}

async function seedFlowers() {
  const flowerNames = [
    'Роза', 'Тюльпан', 'Пион', 'Гербера', 'Астра',
    'Хризантема', 'Орхидея', 'Лилия', 'Гвоздика', 'Альстромерия'
  ];

  for (const name of flowerNames) {
    const existing = await prisma.flower.findFirst({ where: { name } });
    if (!existing) {
      await prisma.flower.create({
        data: {
          name,
          price: Math.floor(90 + Math.random() * 60),
          imageUrl: `/assets/flowers/${name.toLowerCase()}.webp`,
        },
      });
    }
  }

  console.log('🌸 Цветы добавлены в базу данных!');
}

async function seedCatalogBouquets() {
  const admin = await prisma.user.findFirst({
    where: { role: 'admin' }
  });

  if (!admin) {
    console.error("⚠️ Админ не найден. Сначала создайте админа в seed.");
    return;
  }

  const prices = [790, 820, 910, 860, 945, 875, 995, 1020, 899, 1090];

  for (let i = 1; i <= 10; i++) {
    const existing = await prisma.bouquet.findFirst({
      where: { name: `Букет №${i}` }
    });

    if (!existing) {
      await prisma.bouquet.create({
        data: {
          name: `Букет №${i}`,
          description: `Описание для букета №${i}`,
          imageUrl: `/assets/boquet_${i}.webp`,
          price: prices[i - 1],
          userId: admin.id,
          isPublic: true
        }
      });
    }
  }

  console.log("💐 10 букетов добавлены в каталог!");
}

async function main() {
  await seedAdmin();
  await seedFlowers();
  await seedCatalogBouquets();
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

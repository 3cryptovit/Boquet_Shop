-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_bouquetId_fkey";

-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "customBouquetId" INTEGER,
ALTER COLUMN "bouquetId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_bouquetId_fkey" FOREIGN KEY ("bouquetId") REFERENCES "Bouquet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_customBouquetId_fkey" FOREIGN KEY ("customBouquetId") REFERENCES "CustomBouquet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

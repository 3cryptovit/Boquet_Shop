/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Flower` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Flower_name_key" ON "Flower"("name");

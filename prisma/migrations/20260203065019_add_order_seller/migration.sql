/*
  Warnings:

  - Added the required column `sellerId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "sellerId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Order_sellerId_idx" ON "Order"("sellerId");

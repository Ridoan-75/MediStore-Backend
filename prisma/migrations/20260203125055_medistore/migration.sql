/*
  Warnings:

  - You are about to drop the column `sellerId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `isBanned` on the `user` table. All the data in the column will be lost.
  - Added the required column `sellerId` to the `OrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_userId_fkey";

-- DropIndex
DROP INDEX "Order_sellerId_idx";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "sellerId";

-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "userId",
ADD COLUMN     "sellerId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "isBanned";

-- CreateIndex
CREATE INDEX "OrderItem_sellerId_idx" ON "OrderItem"("sellerId");

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

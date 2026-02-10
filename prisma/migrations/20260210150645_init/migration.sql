/*
  Warnings:

  - The values [ACTIVE,INACTIVE] on the enum `MedicineStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `expiresAt` on the `account` table. All the data in the column will be lost.
  - The primary key for the `category` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `description` on the `category` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `category` table. All the data in the column will be lost.
  - You are about to alter the column `name` on the `category` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - The primary key for the `medicine` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `imageUrl` on the `medicine` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `medicine` table. All the data in the column will be lost.
  - You are about to drop the column `manufacturer` on the `medicine` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `medicine` table. All the data in the column will be lost.
  - You are about to alter the column `name` on the `medicine` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - The primary key for the `order` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `customerId` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `total` on the `order` table. All the data in the column will be lost.
  - The primary key for the `order_item` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `order_item` table. All the data in the column will be lost.
  - You are about to drop the column `sellerId` on the `order_item` table. All the data in the column will be lost.
  - The primary key for the `review` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `comment` on the `review` table. All the data in the column will be lost.
  - You are about to drop the column `customerId` on the `review` table. All the data in the column will be lost.
  - You are about to alter the column `rating` on the `review` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `SmallInt`.
  - You are about to drop the column `isActive` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `user` table. All the data in the column will be lost.
  - The `role` column on the `user` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[slug]` on the table `category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `medicine` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `category` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `id` on the `category` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `brand` to the `medicine` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dosageForm` to the `medicine` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `medicine` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `medicine` table without a default value. This is not possible if the table is not empty.
  - Added the required column `strength` to the `medicine` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unit` to the `medicine` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `id` on the `medicine` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `categoryId` on the `medicine` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `totalAmount` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `order` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `id` on the `order` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `shippingAddress` on the `order` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `order_item` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `orderId` on the `order_item` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `medicineId` on the `order_item` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `content` to the `review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `review` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `id` on the `review` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `medicineId` on the `review` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `name` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "DosageForm" AS ENUM ('TABLET', 'CAPSULE', 'SYRUP', 'INJECTION', 'OINTMENT', 'DROPS', 'INHALER', 'PATCH', 'SUPPOSITORY', 'POWDER');

-- CreateEnum
CREATE TYPE "Unit" AS ENUM ('MG', 'ML', 'G', 'IU', 'MCG');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CREDIT_CARD', 'DEBIT_CARD', 'MOBILE_PAYMENT', 'CASH_ON_DELIVERY');

-- AlterEnum
BEGIN;
CREATE TYPE "MedicineStatus_new" AS ENUM ('AVAILABLE', 'OUT_OF_STOCK', 'DISCONTINUED');
ALTER TABLE "public"."medicine" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "medicine" ALTER COLUMN "status" TYPE "MedicineStatus_new" USING ("status"::text::"MedicineStatus_new");
ALTER TYPE "MedicineStatus" RENAME TO "MedicineStatus_old";
ALTER TYPE "MedicineStatus_new" RENAME TO "MedicineStatus";
DROP TYPE "public"."MedicineStatus_old";
ALTER TABLE "medicine" ALTER COLUMN "status" SET DEFAULT 'AVAILABLE';
COMMIT;

-- AlterEnum
ALTER TYPE "OrderStatus" ADD VALUE 'CONFIRMED';

-- DropForeignKey
ALTER TABLE "medicine" DROP CONSTRAINT "medicine_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "order" DROP CONSTRAINT "order_customerId_fkey";

-- DropForeignKey
ALTER TABLE "order_item" DROP CONSTRAINT "order_item_medicineId_fkey";

-- DropForeignKey
ALTER TABLE "order_item" DROP CONSTRAINT "order_item_orderId_fkey";

-- DropForeignKey
ALTER TABLE "order_item" DROP CONSTRAINT "order_item_sellerId_fkey";

-- DropForeignKey
ALTER TABLE "review" DROP CONSTRAINT "review_customerId_fkey";

-- DropForeignKey
ALTER TABLE "review" DROP CONSTRAINT "review_medicineId_fkey";

-- DropIndex
DROP INDEX "account_providerId_accountId_key";

-- DropIndex
DROP INDEX "category_name_key";

-- DropIndex
DROP INDEX "medicine_categoryId_idx";

-- DropIndex
DROP INDEX "medicine_isActive_idx";

-- DropIndex
DROP INDEX "medicine_sellerId_idx";

-- DropIndex
DROP INDEX "medicine_status_idx";

-- DropIndex
DROP INDEX "order_customerId_idx";

-- DropIndex
DROP INDEX "order_status_idx";

-- DropIndex
DROP INDEX "order_item_medicineId_idx";

-- DropIndex
DROP INDEX "order_item_orderId_idx";

-- DropIndex
DROP INDEX "order_item_sellerId_idx";

-- DropIndex
DROP INDEX "review_customerId_medicineId_key";

-- DropIndex
DROP INDEX "review_medicineId_idx";

-- DropIndex
DROP INDEX "verification_identifier_value_key";

-- AlterTable
ALTER TABLE "account" DROP COLUMN "expiresAt";

-- AlterTable
ALTER TABLE "category" DROP CONSTRAINT "category_pkey",
DROP COLUMN "description",
DROP COLUMN "imageUrl",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "slug" VARCHAR(255) NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ALTER COLUMN "name" SET DATA TYPE VARCHAR(255),
ADD CONSTRAINT "category_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "medicine" DROP CONSTRAINT "medicine_pkey",
DROP COLUMN "imageUrl",
DROP COLUMN "isActive",
DROP COLUMN "manufacturer",
DROP COLUMN "type",
ADD COLUMN     "brand" VARCHAR(255) NOT NULL,
ADD COLUMN     "dosageForm" "DosageForm" NOT NULL,
ADD COLUMN     "image" TEXT NOT NULL,
ADD COLUMN     "isOTCOnly" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "slug" VARCHAR(255) NOT NULL,
ADD COLUMN     "strength" VARCHAR(100) NOT NULL,
ADD COLUMN     "unit" "Unit" NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ALTER COLUMN "name" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "stock" DROP DEFAULT,
DROP COLUMN "categoryId",
ADD COLUMN     "categoryId" UUID NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'AVAILABLE',
ADD CONSTRAINT "medicine_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "order" DROP CONSTRAINT "order_pkey",
DROP COLUMN "customerId",
DROP COLUMN "phone",
DROP COLUMN "total",
ADD COLUMN     "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'CASH_ON_DELIVERY',
ADD COLUMN     "totalAmount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "shippingAddress",
ADD COLUMN     "shippingAddress" JSONB NOT NULL,
ADD CONSTRAINT "order_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "order_item" DROP CONSTRAINT "order_item_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "sellerId",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "orderId",
ADD COLUMN     "orderId" UUID NOT NULL,
DROP COLUMN "medicineId",
ADD COLUMN     "medicineId" UUID NOT NULL,
ADD CONSTRAINT "order_item_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "review" DROP CONSTRAINT "review_pkey",
DROP COLUMN "comment",
DROP COLUMN "customerId",
ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "medicineId",
ADD COLUMN     "medicineId" UUID NOT NULL,
ALTER COLUMN "rating" DROP DEFAULT,
ALTER COLUMN "rating" SET DATA TYPE SMALLINT,
ADD CONSTRAINT "review_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "user" DROP COLUMN "isActive",
DROP COLUMN "password",
ADD COLUMN     "banExpires" TIMESTAMP(3),
ADD COLUMN     "banReason" TEXT,
ADD COLUMN     "banned" BOOLEAN DEFAULT false,
ADD COLUMN     "dob" TIMESTAMP(3),
ALTER COLUMN "name" SET NOT NULL,
DROP COLUMN "role",
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'user',
ALTER COLUMN "phone" SET DEFAULT '',
ALTER COLUMN "address" SET DEFAULT '';

-- CreateTable
CREATE TABLE "cart" (
    "id" UUID NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cart_item" (
    "id" UUID NOT NULL,
    "cartId" UUID NOT NULL,
    "medicineId" UUID NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cart_item_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cart_userId_key" ON "cart"("userId");

-- CreateIndex
CREATE INDEX "cart_item_cartId_idx" ON "cart_item"("cartId");

-- CreateIndex
CREATE INDEX "cart_item_medicineId_idx" ON "cart_item"("medicineId");

-- CreateIndex
CREATE UNIQUE INDEX "category_slug_key" ON "category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "medicine_slug_key" ON "medicine"("slug");

-- CreateIndex
CREATE INDEX "medicine_sellerId_categoryId_idx" ON "medicine"("sellerId", "categoryId");

-- AddForeignKey
ALTER TABLE "cart" ADD CONSTRAINT "cart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_item" ADD CONSTRAINT "cart_item_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "cart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_item" ADD CONSTRAINT "cart_item_medicineId_fkey" FOREIGN KEY ("medicineId") REFERENCES "medicine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medicine" ADD CONSTRAINT "medicine_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_medicineId_fkey" FOREIGN KEY ("medicineId") REFERENCES "medicine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_medicineId_fkey" FOREIGN KEY ("medicineId") REFERENCES "medicine"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `ipAddress` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `userAgent` on the `Session` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Account_userId_idx";

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "ipAddress",
DROP COLUMN "userAgent";

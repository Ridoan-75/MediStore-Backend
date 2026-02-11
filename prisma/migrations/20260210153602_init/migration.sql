/*
  Warnings:

  - The `emailVerified` column on the `user` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `role` column on the `user` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "user" ALTER COLUMN "phone" DROP DEFAULT,
ALTER COLUMN "address" DROP DEFAULT,
DROP COLUMN "emailVerified",
ADD COLUMN     "emailVerified" TIMESTAMP(3),
DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'CUSTOMER';

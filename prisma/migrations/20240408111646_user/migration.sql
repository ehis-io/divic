/*
  Warnings:

  - You are about to drop the column `biomertricKey` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "biomertricKey",
ADD COLUMN     "biometricKey" TEXT DEFAULT '';

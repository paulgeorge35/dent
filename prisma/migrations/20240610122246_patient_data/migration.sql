/*
  Warnings:

  - You are about to drop the column `address` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `zipCode` on the `Patient` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "address",
DROP COLUMN "country",
DROP COLUMN "zipCode",
ADD COLUMN     "dob" TIMESTAMP(3),
ADD COLUMN     "gender" TEXT;

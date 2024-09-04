/*
  Warnings:

  - You are about to drop the column `toothNumber` on the `Treatment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Treatment" DROP COLUMN "toothNumber",
ADD COLUMN     "target" TEXT;

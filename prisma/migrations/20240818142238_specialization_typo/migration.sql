/*
  Warnings:

  - You are about to drop the column `specialityId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_specialityId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "specialityId",
ADD COLUMN     "specializationId" TEXT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_specializationId_fkey" FOREIGN KEY ("specializationId") REFERENCES "Specialization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

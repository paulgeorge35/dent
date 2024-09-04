/*
  Warnings:

  - Made the column `parentId` on table `RelatedService` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "RelatedService" DROP CONSTRAINT "RelatedService_parentId_fkey";

-- AlterTable
ALTER TABLE "RelatedService" ALTER COLUMN "parentId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "RelatedService" ADD CONSTRAINT "RelatedService_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

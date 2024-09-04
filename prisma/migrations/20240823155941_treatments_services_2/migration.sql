/*
  Warnings:

  - You are about to drop the column `childId` on the `RelatedService` table. All the data in the column will be lost.
  - You are about to drop the column `relatedServiceId` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `eventId` on the `Treatment` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `Visit` table. All the data in the column will be lost.
  - Added the required column `service` to the `RelatedService` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EventInitiator" AS ENUM ('PATIENT', 'USER', 'SYSTEM');

-- DropForeignKey
ALTER TABLE "RelatedService" DROP CONSTRAINT "RelatedService_childId_fkey";

-- DropForeignKey
ALTER TABLE "RelatedService" DROP CONSTRAINT "RelatedService_parentId_fkey";

-- DropForeignKey
ALTER TABLE "Service" DROP CONSTRAINT "Service_relatedServiceId_fkey";

-- DropForeignKey
ALTER TABLE "Treatment" DROP CONSTRAINT "Treatment_eventId_fkey";

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "initiator" "EventInitiator" NOT NULL DEFAULT 'SYSTEM';

-- AlterTable
ALTER TABLE "RelatedService" DROP COLUMN "childId",
ADD COLUMN     "numberOfVisits" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "service" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "Service" DROP COLUMN "relatedServiceId",
ALTER COLUMN "duration" SET DEFAULT 60,
ALTER COLUMN "tags" SET DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "Treatment" DROP COLUMN "eventId";

-- AlterTable
ALTER TABLE "Visit" DROP COLUMN "date",
ADD COLUMN     "eventId" TEXT;

-- AddForeignKey
ALTER TABLE "RelatedService" ADD CONSTRAINT "RelatedService_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Service"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Visit" ADD CONSTRAINT "Visit_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

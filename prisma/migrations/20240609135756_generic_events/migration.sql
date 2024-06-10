/*
  Warnings:

  - You are about to drop the column `appointmentId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `appointmentId` on the `ProposedTime` table. All the data in the column will be lost.
  - The `status` column on the `ProposedTime` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Appointment` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `eventId` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `eventId` to the `ProposedTime` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('CREATED', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'RESCHEDULED');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('APPOINTMENT');

-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_patientId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_appointmentId_fkey";

-- DropForeignKey
ALTER TABLE "ProposedTime" DROP CONSTRAINT "ProposedTime_appointmentId_fkey";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "appointmentId",
ADD COLUMN     "eventId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ProposedTime" DROP COLUMN "appointmentId",
ADD COLUMN     "eventId" TEXT NOT NULL,
ALTER COLUMN "start" DROP NOT NULL,
ALTER COLUMN "end" DROP NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "EventStatus" NOT NULL DEFAULT 'CREATED';

-- DropTable
DROP TABLE "Appointment";

-- DropEnum
DROP TYPE "AppointmentStatus";

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "start" TIMESTAMP(3),
    "end" TIMESTAMP(3),
    "allDay" BOOLEAN NOT NULL DEFAULT false,
    "type" "EventType" NOT NULL DEFAULT 'APPOINTMENT',
    "status" "EventStatus" NOT NULL DEFAULT 'CREATED',
    "patientId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Event_patientId_idx" ON "Event"("patientId");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProposedTime" ADD CONSTRAINT "ProposedTime_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

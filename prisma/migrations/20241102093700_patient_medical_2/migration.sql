/*
  Warnings:

  - You are about to drop the column `medical` on the `Patient` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "EventAction" ADD COLUMN     "message" TEXT;

-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "medical";

-- CreateTable
CREATE TABLE "PatientData" (
    "id" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "patientId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PatientData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PatientData_patientId_key" ON "PatientData"("patientId");

-- CreateIndex
CREATE INDEX "PatientData_patientId_idx" ON "PatientData"("patientId");

-- AddForeignKey
ALTER TABLE "PatientData" ADD CONSTRAINT "PatientData_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

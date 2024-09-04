/*
  Warnings:

  - Made the column `treatmentId` on table `Visit` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Visit" ALTER COLUMN "treatmentId" SET NOT NULL;

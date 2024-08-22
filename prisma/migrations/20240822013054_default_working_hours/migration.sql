/*
  Warnings:

  - Made the column `workingHours` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "workingHours" SET NOT NULL,
ALTER COLUMN "workingHours" SET DEFAULT '[]';

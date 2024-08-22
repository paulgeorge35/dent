-- CreateEnum
CREATE TYPE "ContractType" AS ENUM ('FIXED', 'HOURLY', 'PERCENTAGE');

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "title" TEXT DEFAULT 'Dr.';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "specialityId" TEXT,
ADD COLUMN     "workingHours" JSONB;

-- CreateTable
CREATE TABLE "Speciality" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Speciality_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_specialityId_fkey" FOREIGN KEY ("specialityId") REFERENCES "Speciality"("id") ON DELETE SET NULL ON UPDATE CASCADE;

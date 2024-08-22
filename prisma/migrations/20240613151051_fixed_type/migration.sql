/*
  Warnings:

  - You are about to drop the column `perferredTenantId` on the `Profile` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_perferredTenantId_fkey";

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "perferredTenantId",
ADD COLUMN     "preferredTenantId" TEXT;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_preferredTenantId_fkey" FOREIGN KEY ("preferredTenantId") REFERENCES "Tenant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

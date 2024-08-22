/*
  Warnings:

  - Made the column `stripeCustomerId` on table `Profile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `stripeSubscriptionId` on table `TenantProfile` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Profile" ALTER COLUMN "stripeCustomerId" SET NOT NULL;

-- AlterTable
ALTER TABLE "TenantProfile" ALTER COLUMN "stripeSubscriptionId" SET NOT NULL;

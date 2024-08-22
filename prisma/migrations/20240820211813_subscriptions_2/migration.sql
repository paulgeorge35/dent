/*
  Warnings:

  - You are about to drop the column `stripeSubscriptionId` on the `TenantProfile` table. All the data in the column will be lost.
  - You are about to drop the column `subscriptionCanceledAt` on the `TenantProfile` table. All the data in the column will be lost.
  - You are about to drop the column `subscriptionEndsAt` on the `TenantProfile` table. All the data in the column will be lost.
  - You are about to drop the column `subscriptionPausedAt` on the `TenantProfile` table. All the data in the column will be lost.
  - You are about to drop the column `subscriptionStartsAt` on the `TenantProfile` table. All the data in the column will be lost.
  - You are about to drop the column `subscriptionStatus` on the `TenantProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "TenantProfile" DROP COLUMN "stripeSubscriptionId",
DROP COLUMN "subscriptionCanceledAt",
DROP COLUMN "subscriptionEndsAt",
DROP COLUMN "subscriptionPausedAt",
DROP COLUMN "subscriptionStartsAt",
DROP COLUMN "subscriptionStatus",
ADD COLUMN     "activeSubscription" BOOLEAN NOT NULL DEFAULT false;

-- DropEnum
DROP TYPE "SubscriptionStatus";

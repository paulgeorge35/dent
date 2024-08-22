-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('incomplete', 'incomplete_expired', 'trialing', 'active', 'past_due', 'canceled', 'unpaid', 'paused');

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "stripeCustomerId" TEXT;

-- AlterTable
ALTER TABLE "TenantProfile" ADD COLUMN     "stripeSubscriptionId" TEXT,
ADD COLUMN     "subscriptionCanceledAt" TIMESTAMP(3),
ADD COLUMN     "subscriptionEndsAt" TIMESTAMP(3),
ADD COLUMN     "subscriptionPausedAt" TIMESTAMP(3),
ADD COLUMN     "subscriptionStartsAt" TIMESTAMP(3),
ADD COLUMN     "subscriptionStatus" "SubscriptionStatus" NOT NULL DEFAULT 'incomplete';

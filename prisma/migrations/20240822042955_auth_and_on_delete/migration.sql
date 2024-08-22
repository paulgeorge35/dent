-- DropForeignKey
ALTER TABLE "AccountAuth" DROP CONSTRAINT "AccountAuth_profileId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_profileId_fkey";

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "activatedAt" TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountAuth" ADD CONSTRAINT "AccountAuth_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `userId` on the `Token` table. All the data in the column will be lost.
  - You are about to drop the `AccountAuth` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AuthToken` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `profileId` to the `Token` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AccountAuth" DROP CONSTRAINT "AccountAuth_profileId_fkey";

-- DropForeignKey
ALTER TABLE "AuthToken" DROP CONSTRAINT "AuthToken_profileId_fkey";

-- DropForeignKey
ALTER TABLE "Token" DROP CONSTRAINT "Token_userId_fkey";

-- DropIndex
DROP INDEX "Token_userId_token_idx";

-- AlterTable
ALTER TABLE "Token" DROP COLUMN "userId",
ADD COLUMN     "profileId" TEXT NOT NULL;

-- DropTable
DROP TABLE "AccountAuth";

-- DropTable
DROP TABLE "AuthToken";

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "passwordHash" TEXT,
    "refreshToken" TEXT,
    "accessToken" TEXT,
    "expiresAt" TIMESTAMP(3),
    "refreshTokenExpiresIn" INTEGER,
    "tokenType" TEXT,
    "scope" TEXT,
    "idToken" TEXT,
    "sessionState" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "isDone" BOOLEAN NOT NULL DEFAULT false,
    "dueDate" TIMESTAMP(3),
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Account_profileId_idx" ON "Account"("profileId");

-- CreateIndex
CREATE INDEX "Token_profileId_token_idx" ON "Token"("profileId", "token");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

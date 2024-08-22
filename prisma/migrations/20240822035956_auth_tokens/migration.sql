-- CreateTable
CREATE TABLE "AuthToken" (
    "id" TEXT NOT NULL,
    "type" "TokenType" NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "profileId" TEXT NOT NULL,

    CONSTRAINT "AuthToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AuthToken_token_key" ON "AuthToken"("token");

-- CreateIndex
CREATE INDEX "AuthToken_profileId_token_idx" ON "AuthToken"("profileId", "token");

-- AddForeignKey
ALTER TABLE "AuthToken" ADD CONSTRAINT "AuthToken_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

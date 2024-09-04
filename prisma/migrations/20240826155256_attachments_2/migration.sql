/*
  Warnings:

  - A unique constraint covering the columns `[key]` on the table `Attachment` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Attachment" ADD COLUMN     "confirmed" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "Attachment_key_key" ON "Attachment"("key");

-- CreateIndex
CREATE INDEX "Attachment_key_idx" ON "Attachment"("key");

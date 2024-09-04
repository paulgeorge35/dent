/*
  Warnings:

  - A unique constraint covering the columns `[index]` on the table `Event` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
CREATE SEQUENCE event_index_seq;
ALTER TABLE "Event" ALTER COLUMN "index" SET DEFAULT nextval('event_index_seq');
ALTER SEQUENCE event_index_seq OWNED BY "Event"."index";

-- CreateIndex
CREATE UNIQUE INDEX "Event_index_key" ON "Event"("index");

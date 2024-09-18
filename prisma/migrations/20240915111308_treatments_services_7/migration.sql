/*
  Warnings:

  - The values [QUARTER,JAW,MOUTH] on the enum `ServiceUnit` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ServiceUnit_new" AS ENUM ('TOOTH', 'QUAD', 'ARCH', 'VISIT');
ALTER TABLE "Service" ALTER COLUMN "unit" TYPE "ServiceUnit_new" USING ("unit"::text::"ServiceUnit_new");
ALTER TYPE "ServiceUnit" RENAME TO "ServiceUnit_old";
ALTER TYPE "ServiceUnit_new" RENAME TO "ServiceUnit";
DROP TYPE "ServiceUnit_old";
COMMIT;

/*
  Warnings:

  - You are about to drop the column `numberOfVisits` on the `RelatedService` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Service` table. All the data in the column will be lost.
  - Added the required column `unit_price` to the `RelatedService` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unit_price` to the `Service` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Material" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "RelatedService" DROP COLUMN "numberOfVisits",
ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "unit_price" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Service" DROP COLUMN "price",
ADD COLUMN     "unit_price" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Visit" ALTER COLUMN "treatmentId" DROP NOT NULL;

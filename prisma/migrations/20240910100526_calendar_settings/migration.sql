-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "firstDayOfWeek" "DayOfWeek" NOT NULL DEFAULT 'MONDAY',
ADD COLUMN     "showWeekends" BOOLEAN NOT NULL DEFAULT true;

/*
  Warnings:

  - Changed the type of `period` on the `budgets` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."Period" AS ENUM ('WEEKLY', 'MONTHLY', 'YEARLY');

-- AlterTable
ALTER TABLE "public"."budgets" DROP COLUMN "period",
ADD COLUMN     "period" "public"."Period" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "budgets_userId_categoryId_period_key" ON "public"."budgets"("userId", "categoryId", "period");

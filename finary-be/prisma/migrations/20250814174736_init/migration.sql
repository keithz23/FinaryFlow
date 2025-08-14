/*
  Warnings:

  - A unique constraint covering the columns `[categoryId]` on the table `budgets` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."budgets_userId_categoryId_period_key";

-- CreateIndex
CREATE UNIQUE INDEX "budgets_categoryId_key" ON "public"."budgets"("categoryId");

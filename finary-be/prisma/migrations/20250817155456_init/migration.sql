/*
  Warnings:

  - You are about to drop the column `amount` on the `budgets` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."budgets" DROP COLUMN "amount",
ALTER COLUMN "allocated" DROP DEFAULT;

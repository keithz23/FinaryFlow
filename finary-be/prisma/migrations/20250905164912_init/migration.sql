/*
  Warnings:

  - Added the required column `type` to the `category` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."Type" AS ENUM ('expense', 'income', 'goal', 'budget');

-- AlterTable
ALTER TABLE "public"."category" ADD COLUMN     "type" "public"."Type" NOT NULL;

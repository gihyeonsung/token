/*
  Warnings:

  - Made the column `totalSupplyUpdatedAt` on table `Token` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Token" ALTER COLUMN "totalSupplyUpdatedAt" SET NOT NULL;

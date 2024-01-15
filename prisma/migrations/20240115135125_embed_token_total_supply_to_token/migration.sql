/*
  Warnings:

  - You are about to drop the `TokenTotalSupply` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TokenTotalSupply" DROP CONSTRAINT "TokenTotalSupply_tokenId_fkey";

-- AlterTable
ALTER TABLE "Token" ADD COLUMN     "totalSupply" BIGINT,
ADD COLUMN     "totalSupplyUpdatedAt" TIMESTAMP(3);

-- DropTable
DROP TABLE "TokenTotalSupply";

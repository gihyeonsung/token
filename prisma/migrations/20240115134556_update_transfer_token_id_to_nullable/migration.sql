-- DropForeignKey
ALTER TABLE "Transfer" DROP CONSTRAINT "Transfer_tokenId_fkey";

-- AlterTable
ALTER TABLE "Transfer" ALTER COLUMN "tokenId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Transfer" ADD CONSTRAINT "Transfer_tokenId_fkey" FOREIGN KEY ("tokenId") REFERENCES "Token"("id") ON DELETE SET NULL ON UPDATE CASCADE;

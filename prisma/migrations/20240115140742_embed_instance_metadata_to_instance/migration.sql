/*
  Warnings:

  - You are about to drop the `InstanceMetadata` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "InstanceMetadata" DROP CONSTRAINT "InstanceMetadata_instanceId_fkey";

-- AlterTable
ALTER TABLE "Instance" ADD COLUMN     "metadata" TEXT,
ADD COLUMN     "metadataUpdatedAt" TIMESTAMP(3),
ADD COLUMN     "uri" TEXT,
ADD COLUMN     "uriUpdatedAt" TIMESTAMP(3);

-- DropTable
DROP TABLE "InstanceMetadata";

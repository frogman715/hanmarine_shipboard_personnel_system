/*
  Warnings:

  - Added the required column `createdBy` to the `ApprovalHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `ApprovalHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ApprovalHistory" ADD COLUMN     "createdBy" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

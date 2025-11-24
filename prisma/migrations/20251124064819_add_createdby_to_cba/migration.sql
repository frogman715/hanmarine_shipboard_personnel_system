/*
  Warnings:

  - Added the required column `createdBy` to the `CollectiveBargainingAgreement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CollectiveBargainingAgreement" ADD COLUMN     "createdBy" TEXT NOT NULL;

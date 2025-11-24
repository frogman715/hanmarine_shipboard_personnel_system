/*
  Warnings:

  - Added the required column `createdBy` to the `SeafarerContract` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SeafarerContract" ADD COLUMN     "createdBy" TEXT NOT NULL;

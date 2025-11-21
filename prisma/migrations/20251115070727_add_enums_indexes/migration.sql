/*
  Warnings:

  - The `crewStatus` column on the `Crew` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `EmploymentApplication` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `FormSubmission` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "CrewStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'ON_LEAVE', 'ONBOARD', 'STANDBY', 'AVAILABLE');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('APPLIED', 'SHORTLISTED', 'INTERVIEW', 'APPROVED', 'OFFERED', 'ACCEPTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "Crew" DROP COLUMN "crewStatus",
ADD COLUMN     "crewStatus" "CrewStatus" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "EmploymentApplication" DROP COLUMN "status",
ADD COLUMN     "status" "ApplicationStatus" NOT NULL DEFAULT 'APPLIED';

-- AlterTable
ALTER TABLE "FormSubmission" DROP COLUMN "status",
ADD COLUMN     "status" "SubmissionStatus" NOT NULL DEFAULT 'DRAFT';

-- CreateIndex
CREATE INDEX "Certificate_crewId_idx" ON "Certificate"("crewId");

-- CreateIndex
CREATE INDEX "Certificate_expiryDate_idx" ON "Certificate"("expiryDate");

-- CreateIndex
CREATE INDEX "SeaServiceExperience_crewId_idx" ON "SeaServiceExperience"("crewId");

-- CreateIndex
CREATE INDEX "SeaServiceExperience_signOn_idx" ON "SeaServiceExperience"("signOn");

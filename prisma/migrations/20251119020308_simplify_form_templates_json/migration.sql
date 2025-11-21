/*
  Warnings:

  - You are about to drop the `FormField` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FormFieldValue` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[crewCode]` on the table `Crew` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `formData` to the `FormSubmission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fields` to the `FormTemplate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `FormTemplate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `FormTemplate` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('DIRECTOR', 'CREWING_MANAGER', 'EXPERT_STAFF', 'DOCUMENTATION_OFFICER', 'ACCOUNTING_OFFICER', 'TRAINING_OFFICER', 'OPERATIONAL_STAFF');

-- CreateEnum
CREATE TYPE "OnboardingStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'AWAITING_OWNER_APPROVAL', 'OWNER_REJECTED', 'COMPLETED', 'CANCELLED');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "CrewStatus" ADD VALUE 'APPLICANT';
ALTER TYPE "CrewStatus" ADD VALUE 'APPROVED';
ALTER TYPE "CrewStatus" ADD VALUE 'SIGN_OFF';
ALTER TYPE "CrewStatus" ADD VALUE 'VACATION';
ALTER TYPE "CrewStatus" ADD VALUE 'EX_CREW';
ALTER TYPE "CrewStatus" ADD VALUE 'BLACKLISTED';

-- DropForeignKey
ALTER TABLE "FormField" DROP CONSTRAINT "FormField_templateId_fkey";

-- DropForeignKey
ALTER TABLE "FormFieldValue" DROP CONSTRAINT "FormFieldValue_submissionId_fkey";

-- AlterTable
ALTER TABLE "Certificate" ADD COLUMN     "documentPath" TEXT;

-- AlterTable
ALTER TABLE "Crew" ADD COLUMN     "crewCode" TEXT,
ADD COLUMN     "inactiveReason" TEXT,
ADD COLUMN     "lastOffboardDate" TIMESTAMP(3),
ADD COLUMN     "offboardNotes" TEXT,
ADD COLUMN     "reportedToOffice" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "reportedToOfficeDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "DocumentChecklist" ADD COLUMN     "procedure" JSONB;

-- AlterTable
ALTER TABLE "EmploymentApplication" ADD COLUMN     "crewingManagerApproval" TEXT,
ADD COLUMN     "crewingManagerApprovalDate" TIMESTAMP(3),
ADD COLUMN     "crewingManagerComments" TEXT,
ADD COLUMN     "crewingManagerId" INTEGER,
ADD COLUMN     "currentApprovalLevel" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "directorApproval" TEXT,
ADD COLUMN     "directorApprovalDate" TIMESTAMP(3),
ADD COLUMN     "directorComments" TEXT,
ADD COLUMN     "directorId" INTEGER,
ADD COLUMN     "expertStaffApproval" TEXT,
ADD COLUMN     "expertStaffApprovalDate" TIMESTAMP(3),
ADD COLUMN     "expertStaffComments" TEXT,
ADD COLUMN     "expertStaffId" INTEGER,
ADD COLUMN     "principalApproval" TEXT,
ADD COLUMN     "principalApprovalDate" TIMESTAMP(3),
ADD COLUMN     "principalComments" TEXT;

-- AlterTable
ALTER TABLE "FormSubmission" ADD COLUMN     "formData" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "FormTemplate" ADD COLUMN     "category" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "fields" JSONB NOT NULL,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "version" TEXT NOT NULL DEFAULT '1.0';

-- AlterTable
ALTER TABLE "Vessel" ADD COLUMN     "hp" DOUBLE PRECISION,
ADD COLUMN     "inmarsatNo" TEXT,
ADD COLUMN     "ownerId" INTEGER,
ALTER COLUMN "grt" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "dwt" SET DATA TYPE DOUBLE PRECISION;

-- DropTable
DROP TABLE "FormField";

-- DropTable
DROP TABLE "FormFieldValue";

-- CreateTable
CREATE TABLE "Owner" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "country" TEXT,
    "contact" TEXT,
    "email" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Owner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SemesterReport" (
    "id" SERIAL NOT NULL,
    "period" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "totalJoining" INTEGER NOT NULL DEFAULT 0,
    "totalSignOff" INTEGER NOT NULL DEFAULT 0,
    "totalOnboard" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,

    CONSTRAINT "SemesterReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CrewMovement" (
    "id" SERIAL NOT NULL,
    "crewId" INTEGER NOT NULL,
    "vesselId" INTEGER,
    "assignmentId" INTEGER,
    "movementType" TEXT NOT NULL,
    "movementDate" TIMESTAMP(3) NOT NULL,
    "rank" TEXT,
    "vessel" TEXT,
    "remarks" TEXT,
    "reportId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CrewMovement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'OPERATIONAL_STAFF',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLogin" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApprovalHistory" (
    "id" SERIAL NOT NULL,
    "applicationId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "userRole" "UserRole" NOT NULL,
    "action" TEXT NOT NULL,
    "comments" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApprovalHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OnboardingProgress" (
    "id" SERIAL NOT NULL,
    "crewId" INTEGER NOT NULL,
    "step1_dataCollection" BOOLEAN NOT NULL DEFAULT false,
    "step1_completedAt" TIMESTAMP(3),
    "step1_notes" TEXT,
    "step2_documentScanning" BOOLEAN NOT NULL DEFAULT false,
    "step2_completedAt" TIMESTAMP(3),
    "step2_folderPath" TEXT,
    "step2_notes" TEXT,
    "step3_dataInput" BOOLEAN NOT NULL DEFAULT false,
    "step3_completedAt" TIMESTAMP(3),
    "step3_notes" TEXT,
    "step4_cvCreated" BOOLEAN NOT NULL DEFAULT false,
    "step4_completedAt" TIMESTAMP(3),
    "step4_cvFilePath" TEXT,
    "step4_flagType" TEXT,
    "step4_notes" TEXT,
    "step5_sentToOwner" BOOLEAN NOT NULL DEFAULT false,
    "step5_ownerName" TEXT,
    "step5_sentAt" TIMESTAMP(3),
    "step5_approved" BOOLEAN,
    "step5_approvedAt" TIMESTAMP(3),
    "step5_rejectionReason" TEXT,
    "step5_notes" TEXT,
    "step6_finalApproval" BOOLEAN NOT NULL DEFAULT false,
    "step6_completedAt" TIMESTAMP(3),
    "step6_docChecklist" BOOLEAN NOT NULL DEFAULT false,
    "step6_nextOfKind" BOOLEAN NOT NULL DEFAULT false,
    "step6_declaration" BOOLEAN NOT NULL DEFAULT false,
    "step6_trainingRecord" BOOLEAN NOT NULL DEFAULT false,
    "step6_notes" TEXT,
    "step7_onboard" BOOLEAN NOT NULL DEFAULT false,
    "step7_completedAt" TIMESTAMP(3),
    "step7_vesselName" TEXT,
    "step7_crpUpdated" BOOLEAN NOT NULL DEFAULT false,
    "step7_hublaUpdated" BOOLEAN NOT NULL DEFAULT false,
    "step7_notes" TEXT,
    "step8_finished" BOOLEAN NOT NULL DEFAULT false,
    "step8_completedAt" TIMESTAMP(3),
    "step8_rackLocation" TEXT,
    "step8_notes" TEXT,
    "currentStep" INTEGER NOT NULL DEFAULT 1,
    "overallStatus" "OnboardingStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OnboardingProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Owner_name_key" ON "Owner"("name");

-- CreateIndex
CREATE INDEX "Owner_name_idx" ON "Owner"("name");

-- CreateIndex
CREATE INDEX "SemesterReport_period_idx" ON "SemesterReport"("period");

-- CreateIndex
CREATE INDEX "SemesterReport_startDate_endDate_idx" ON "SemesterReport"("startDate", "endDate");

-- CreateIndex
CREATE INDEX "CrewMovement_crewId_idx" ON "CrewMovement"("crewId");

-- CreateIndex
CREATE INDEX "CrewMovement_movementDate_idx" ON "CrewMovement"("movementDate");

-- CreateIndex
CREATE INDEX "CrewMovement_movementType_idx" ON "CrewMovement"("movementType");

-- CreateIndex
CREATE INDEX "CrewMovement_reportId_idx" ON "CrewMovement"("reportId");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_username_idx" ON "User"("username");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "ApprovalHistory_applicationId_idx" ON "ApprovalHistory"("applicationId");

-- CreateIndex
CREATE INDEX "ApprovalHistory_userId_idx" ON "ApprovalHistory"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "OnboardingProgress_crewId_key" ON "OnboardingProgress"("crewId");

-- CreateIndex
CREATE INDEX "OnboardingProgress_crewId_idx" ON "OnboardingProgress"("crewId");

-- CreateIndex
CREATE INDEX "OnboardingProgress_currentStep_idx" ON "OnboardingProgress"("currentStep");

-- CreateIndex
CREATE INDEX "OnboardingProgress_overallStatus_idx" ON "OnboardingProgress"("overallStatus");

-- CreateIndex
CREATE UNIQUE INDEX "Crew_crewCode_key" ON "Crew"("crewCode");

-- CreateIndex
CREATE INDEX "EmploymentApplication_crewId_idx" ON "EmploymentApplication"("crewId");

-- CreateIndex
CREATE INDEX "EmploymentApplication_status_idx" ON "EmploymentApplication"("status");

-- CreateIndex
CREATE INDEX "EmploymentApplication_currentApprovalLevel_idx" ON "EmploymentApplication"("currentApprovalLevel");

-- CreateIndex
CREATE INDEX "FormSubmission_templateId_idx" ON "FormSubmission"("templateId");

-- CreateIndex
CREATE INDEX "FormSubmission_crewId_idx" ON "FormSubmission"("crewId");

-- CreateIndex
CREATE INDEX "FormSubmission_status_idx" ON "FormSubmission"("status");

-- CreateIndex
CREATE INDEX "FormTemplate_code_idx" ON "FormTemplate"("code");

-- CreateIndex
CREATE INDEX "FormTemplate_category_idx" ON "FormTemplate"("category");

-- CreateIndex
CREATE INDEX "Vessel_ownerId_idx" ON "Vessel"("ownerId");

-- CreateIndex
CREATE INDEX "Vessel_vesselType_idx" ON "Vessel"("vesselType");

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_vesselName_fkey" FOREIGN KEY ("vesselName") REFERENCES "Vessel"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vessel" ADD CONSTRAINT "Vessel_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Owner"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmploymentApplication" ADD CONSTRAINT "EmploymentApplication_crewingManagerId_fkey" FOREIGN KEY ("crewingManagerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmploymentApplication" ADD CONSTRAINT "EmploymentApplication_expertStaffId_fkey" FOREIGN KEY ("expertStaffId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmploymentApplication" ADD CONSTRAINT "EmploymentApplication_directorId_fkey" FOREIGN KEY ("directorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrewMovement" ADD CONSTRAINT "CrewMovement_crewId_fkey" FOREIGN KEY ("crewId") REFERENCES "Crew"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrewMovement" ADD CONSTRAINT "CrewMovement_vesselId_fkey" FOREIGN KEY ("vesselId") REFERENCES "Vessel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrewMovement" ADD CONSTRAINT "CrewMovement_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "Assignment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrewMovement" ADD CONSTRAINT "CrewMovement_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "SemesterReport"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApprovalHistory" ADD CONSTRAINT "ApprovalHistory_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "EmploymentApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OnboardingProgress" ADD CONSTRAINT "OnboardingProgress_crewId_fkey" FOREIGN KEY ("crewId") REFERENCES "Crew"("id") ON DELETE CASCADE ON UPDATE CASCADE;

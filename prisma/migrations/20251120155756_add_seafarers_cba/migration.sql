/*
  Warnings:

  - The values [STERN_WARNING,SUSPENSION_3_DAYS,SUSPENSION_7_DAYS,SUSPENSION_15_DAYS,SUSPENSION_30_DAYS,DISMISSAL] on the enum `DisciplinaryActionType` will be removed. If these variants are still used in the database, this will fail.
  - The values [PROBATION,RETIRED] on the enum `EmployeeStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [IN_PROGRESS] on the enum `TrainingStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "AppraisalRating" AS ENUM ('OUTSTANDING', 'EXCEEDS_EXPECTATIONS', 'MEETS_EXPECTATIONS', 'NEEDS_IMPROVEMENT', 'UNSATISFACTORY');

-- CreateEnum
CREATE TYPE "OffenseCategory" AS ENUM ('TARDINESS', 'ABSENCE', 'INSUBORDINATION', 'MISCONDUCT', 'POLICY_VIOLATION', 'SAFETY_VIOLATION', 'PERFORMANCE_ISSUE', 'OTHER');

-- CreateEnum
CREATE TYPE "CBAStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'UNDER_NEGOTIATION', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "ContractStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'TERMINATED', 'EXTENDED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PROCESSED', 'PAID', 'FAILED');

-- CreateEnum
CREATE TYPE "SeafarerLeaveType" AS ENUM ('ANNUAL_LEAVE', 'SHORE_LEAVE', 'MEDICAL_LEAVE', 'COMPASSIONATE_LEAVE', 'PAID_LEAVE');

-- CreateEnum
CREATE TYPE "GrievanceType" AS ENUM ('WAGE_DISPUTE', 'CONTRACT_VIOLATION', 'WORKING_CONDITIONS', 'HARASSMENT', 'DISCRIMINATION', 'HEALTH_SAFETY', 'REPATRIATION', 'LEAVE_ENTITLEMENT', 'OTHER');

-- CreateEnum
CREATE TYPE "GrievanceStatus" AS ENUM ('FILED', 'UNDER_INVESTIGATION', 'RESOLVED', 'ESCALATED', 'CLOSED');

-- AlterEnum
BEGIN;
CREATE TYPE "DisciplinaryActionType_new" AS ENUM ('VERBAL_WARNING', 'WRITTEN_WARNING', 'SUSPENSION', 'DEMOTION', 'TERMINATION');
ALTER TABLE "DisciplinaryAction" ALTER COLUMN "action" TYPE "DisciplinaryActionType_new" USING ("action"::text::"DisciplinaryActionType_new");
ALTER TYPE "DisciplinaryActionType" RENAME TO "DisciplinaryActionType_old";
ALTER TYPE "DisciplinaryActionType_new" RENAME TO "DisciplinaryActionType";
DROP TYPE "DisciplinaryActionType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "EmployeeStatus_new" AS ENUM ('ACTIVE', 'ON_LEAVE', 'SUSPENDED', 'RESIGNED', 'TERMINATED');
ALTER TABLE "Employee" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Employee" ALTER COLUMN "status" TYPE "EmployeeStatus_new" USING ("status"::text::"EmployeeStatus_new");
ALTER TYPE "EmployeeStatus" RENAME TO "EmployeeStatus_old";
ALTER TYPE "EmployeeStatus_new" RENAME TO "EmployeeStatus";
DROP TYPE "EmployeeStatus_old";
ALTER TABLE "Employee" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "TrainingStatus_new" AS ENUM ('SCHEDULED', 'COMPLETED', 'CANCELLED', 'EXPIRED');
ALTER TABLE "EmployeeTraining" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "EmployeeTraining" ALTER COLUMN "status" TYPE "TrainingStatus_new" USING ("status"::text::"TrainingStatus_new");
ALTER TYPE "TrainingStatus" RENAME TO "TrainingStatus_old";
ALTER TYPE "TrainingStatus_new" RENAME TO "TrainingStatus";
DROP TYPE "TrainingStatus_old";
ALTER TABLE "EmployeeTraining" ALTER COLUMN "status" SET DEFAULT 'SCHEDULED';
COMMIT;

-- CreateTable
CREATE TABLE "CollectiveBargainingAgreement" (
    "id" SERIAL NOT NULL,
    "cbaCode" TEXT NOT NULL,
    "cbaTitle" TEXT NOT NULL,
    "shipOwner" TEXT NOT NULL,
    "union" TEXT,
    "flagState" TEXT NOT NULL,
    "effectiveDate" TIMESTAMP(3) NOT NULL,
    "expirationDate" TIMESTAMP(3) NOT NULL,
    "minimumWage" DOUBLE PRECISION,
    "overtimeRate" DOUBLE PRECISION,
    "leaveEntitlement" INTEGER,
    "repatriationCoverage" TEXT,
    "mlcCompliant" BOOLEAN NOT NULL DEFAULT true,
    "mlcVersion" TEXT,
    "documentPath" TEXT,
    "status" "CBAStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CollectiveBargainingAgreement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeafarerContract" (
    "id" SERIAL NOT NULL,
    "contractNumber" TEXT NOT NULL,
    "crewId" INTEGER NOT NULL,
    "fullName" TEXT NOT NULL,
    "rank" TEXT NOT NULL,
    "nationality" TEXT NOT NULL,
    "vesselId" INTEGER,
    "vesselName" TEXT NOT NULL,
    "cbaId" INTEGER NOT NULL,
    "signOnDate" TIMESTAMP(3) NOT NULL,
    "signOffDate" TIMESTAMP(3) NOT NULL,
    "contractDuration" INTEGER NOT NULL,
    "basicWage" DOUBLE PRECISION NOT NULL,
    "fixedOvertime" DOUBLE PRECISION,
    "otherAllowances" TEXT,
    "totalWage" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "leavePerMonth" DOUBLE PRECISION NOT NULL DEFAULT 2.5,
    "accruedLeave" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "piClub" TEXT,
    "coverageAmount" DOUBLE PRECISION,
    "mlcCompliant" BOOLEAN NOT NULL DEFAULT true,
    "seaServiceBook" TEXT,
    "status" "ContractStatus" NOT NULL DEFAULT 'ACTIVE',
    "actualSignOffDate" TIMESTAMP(3),
    "signOffReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SeafarerContract_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeafarerWage" (
    "id" SERIAL NOT NULL,
    "contractId" INTEGER NOT NULL,
    "cbaId" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "basicWage" DOUBLE PRECISION NOT NULL,
    "fixedOvertime" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "additionalOT" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "allowances" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "bonuses" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "advances" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "allotments" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "otherDeductions" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "grossWage" DOUBLE PRECISION NOT NULL,
    "totalDeductions" DOUBLE PRECISION NOT NULL,
    "netWage" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "exchangeRate" DOUBLE PRECISION,
    "paymentDate" TIMESTAMP(3),
    "paymentMethod" TEXT,
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SeafarerWage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeafarerLeave" (
    "id" SERIAL NOT NULL,
    "contractId" INTEGER NOT NULL,
    "leaveType" "SeafarerLeaveType" NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "totalDays" DOUBLE PRECISION NOT NULL,
    "accruedBefore" DOUBLE PRECISION NOT NULL,
    "usedDays" DOUBLE PRECISION NOT NULL,
    "accruedAfter" DOUBLE PRECISION NOT NULL,
    "reason" TEXT,
    "approvedBy" TEXT,
    "status" "LeaveStatus" NOT NULL DEFAULT 'APPROVED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SeafarerLeave_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeafarerGrievance" (
    "id" SERIAL NOT NULL,
    "grievanceNumber" TEXT NOT NULL,
    "contractId" INTEGER NOT NULL,
    "seafarerName" TEXT NOT NULL,
    "vesselName" TEXT NOT NULL,
    "grievanceType" "GrievanceType" NOT NULL,
    "description" TEXT NOT NULL,
    "filedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "investigatedBy" TEXT,
    "investigationNotes" TEXT,
    "resolution" TEXT,
    "resolvedDate" TIMESTAMP(3),
    "status" "GrievanceStatus" NOT NULL DEFAULT 'FILED',
    "escalatedTo" TEXT,
    "escalationDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SeafarerGrievance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CollectiveBargainingAgreement_cbaCode_key" ON "CollectiveBargainingAgreement"("cbaCode");

-- CreateIndex
CREATE INDEX "CollectiveBargainingAgreement_status_idx" ON "CollectiveBargainingAgreement"("status");

-- CreateIndex
CREATE INDEX "CollectiveBargainingAgreement_expirationDate_idx" ON "CollectiveBargainingAgreement"("expirationDate");

-- CreateIndex
CREATE UNIQUE INDEX "SeafarerContract_contractNumber_key" ON "SeafarerContract"("contractNumber");

-- CreateIndex
CREATE INDEX "SeafarerContract_crewId_idx" ON "SeafarerContract"("crewId");

-- CreateIndex
CREATE INDEX "SeafarerContract_vesselId_idx" ON "SeafarerContract"("vesselId");

-- CreateIndex
CREATE INDEX "SeafarerContract_status_idx" ON "SeafarerContract"("status");

-- CreateIndex
CREATE INDEX "SeafarerWage_contractId_idx" ON "SeafarerWage"("contractId");

-- CreateIndex
CREATE INDEX "SeafarerWage_paymentStatus_idx" ON "SeafarerWage"("paymentStatus");

-- CreateIndex
CREATE INDEX "SeafarerLeave_contractId_idx" ON "SeafarerLeave"("contractId");

-- CreateIndex
CREATE UNIQUE INDEX "SeafarerGrievance_grievanceNumber_key" ON "SeafarerGrievance"("grievanceNumber");

-- CreateIndex
CREATE INDEX "SeafarerGrievance_contractId_idx" ON "SeafarerGrievance"("contractId");

-- CreateIndex
CREATE INDEX "SeafarerGrievance_status_idx" ON "SeafarerGrievance"("status");

-- AddForeignKey
ALTER TABLE "SeafarerContract" ADD CONSTRAINT "SeafarerContract_cbaId_fkey" FOREIGN KEY ("cbaId") REFERENCES "CollectiveBargainingAgreement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeafarerWage" ADD CONSTRAINT "SeafarerWage_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "SeafarerContract"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeafarerWage" ADD CONSTRAINT "SeafarerWage_cbaId_fkey" FOREIGN KEY ("cbaId") REFERENCES "CollectiveBargainingAgreement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeafarerLeave" ADD CONSTRAINT "SeafarerLeave_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "SeafarerContract"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeafarerGrievance" ADD CONSTRAINT "SeafarerGrievance_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "SeafarerContract"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('FORM', 'PROCEDURE', 'WORK_INSTRUCTION', 'RECORD', 'MANUAL', 'EXTERNAL', 'TEMPLATE');

-- CreateEnum
CREATE TYPE "DocumentStatus" AS ENUM ('DRAFT', 'REVIEW', 'PENDING_APPROVAL', 'APPROVED', 'OBSOLETE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ApproverRole" AS ENUM ('QMR', 'DIRECTOR', 'OWNER');

-- CreateEnum
CREATE TYPE "ApprovalAction" AS ENUM ('SUBMITTED', 'REVIEWED', 'APPROVED', 'REJECTED', 'REQUESTED_CHANGES');

-- CreateTable
CREATE TABLE "ManagedDocument" (
    "id" SERIAL NOT NULL,
    "documentCode" TEXT NOT NULL,
    "documentTitle" TEXT NOT NULL,
    "documentType" "DocumentType" NOT NULL,
    "category" TEXT NOT NULL,
    "currentRevision" INTEGER NOT NULL DEFAULT 0,
    "revisionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "effectiveDate" TIMESTAMP(3),
    "status" "DocumentStatus" NOT NULL DEFAULT 'DRAFT',
    "preparedBy" TEXT,
    "reviewedBy" TEXT,
    "approvedBy" TEXT,
    "filePath" TEXT NOT NULL,
    "fileSize" INTEGER,
    "fileType" TEXT,
    "description" TEXT,
    "remarks" TEXT,
    "retentionPeriod" INTEGER,
    "disposalDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ManagedDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentRevision" (
    "id" SERIAL NOT NULL,
    "documentId" INTEGER NOT NULL,
    "revisionNumber" INTEGER NOT NULL,
    "revisionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "changeSummary" TEXT NOT NULL,
    "reasonForChange" TEXT,
    "filePath" TEXT NOT NULL,
    "fileSize" INTEGER,
    "preparedBy" TEXT NOT NULL,
    "reviewedBy" TEXT,
    "approvedBy" TEXT,
    "status" "DocumentStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DocumentRevision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentApproval" (
    "id" SERIAL NOT NULL,
    "documentId" INTEGER NOT NULL,
    "revisionNumber" INTEGER,
    "approverRole" "ApproverRole" NOT NULL,
    "approverName" TEXT NOT NULL,
    "action" "ApprovalAction" NOT NULL,
    "comments" TEXT,
    "approvedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DocumentApproval_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentDistribution" (
    "id" SERIAL NOT NULL,
    "documentId" INTEGER NOT NULL,
    "distributedTo" TEXT NOT NULL,
    "distributionMethod" TEXT,
    "distributedBy" TEXT NOT NULL,
    "distributedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acknowledgedAt" TIMESTAMP(3),

    CONSTRAINT "DocumentDistribution_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ManagedDocument_documentCode_key" ON "ManagedDocument"("documentCode");

-- CreateIndex
CREATE INDEX "ManagedDocument_documentCode_idx" ON "ManagedDocument"("documentCode");

-- CreateIndex
CREATE INDEX "ManagedDocument_status_idx" ON "ManagedDocument"("status");

-- CreateIndex
CREATE INDEX "ManagedDocument_documentType_idx" ON "ManagedDocument"("documentType");

-- CreateIndex
CREATE INDEX "ManagedDocument_category_idx" ON "ManagedDocument"("category");

-- CreateIndex
CREATE INDEX "DocumentRevision_documentId_idx" ON "DocumentRevision"("documentId");

-- CreateIndex
CREATE INDEX "DocumentRevision_revisionNumber_idx" ON "DocumentRevision"("revisionNumber");

-- CreateIndex
CREATE INDEX "DocumentApproval_documentId_idx" ON "DocumentApproval"("documentId");

-- CreateIndex
CREATE INDEX "DocumentApproval_approverRole_idx" ON "DocumentApproval"("approverRole");

-- CreateIndex
CREATE INDEX "DocumentDistribution_documentId_idx" ON "DocumentDistribution"("documentId");

-- AddForeignKey
ALTER TABLE "DocumentRevision" ADD CONSTRAINT "DocumentRevision_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "ManagedDocument"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentApproval" ADD CONSTRAINT "DocumentApproval_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "ManagedDocument"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentDistribution" ADD CONSTRAINT "DocumentDistribution_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "ManagedDocument"("id") ON DELETE CASCADE ON UPDATE CASCADE;

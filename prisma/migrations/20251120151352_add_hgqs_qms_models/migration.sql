-- CreateEnum
CREATE TYPE "RiskType" AS ENUM ('RISK', 'OPPORTUNITY');

-- CreateEnum
CREATE TYPE "RiskLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "RiskStatus" AS ENUM ('IDENTIFIED', 'UNDER_TREATMENT', 'COMPLETED', 'MONITORING');

-- CreateEnum
CREATE TYPE "AuditType" AS ENUM ('INTERNAL', 'EXTERNAL', 'SURVEILLANCE', 'SPECIAL');

-- CreateEnum
CREATE TYPE "AuditStatus" AS ENUM ('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'REPORT_ISSUED', 'CLOSED');

-- CreateEnum
CREATE TYPE "CARSource" AS ENUM ('INTERNAL_AUDIT', 'EXTERNAL_AUDIT', 'CUSTOMER_COMPLAINT', 'CREW_COMPLAINT', 'MANAGEMENT_REVIEW', 'NONCONFORMING_PRODUCT', 'DATA_ANALYSIS', 'OTHER');

-- CreateEnum
CREATE TYPE "CARCategory" AS ENUM ('DOCUMENT_CONTROL', 'RECORD_KEEPING', 'TRAINING', 'COMPETENCE', 'COMMUNICATION', 'CUSTOMER_REQUIREMENTS', 'SUPPLIER_ISSUE', 'PROCESS_FAILURE', 'EQUIPMENT_FAILURE', 'OTHER');

-- CreateEnum
CREATE TYPE "CARStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'PENDING_VERIFICATION', 'VERIFIED_EFFECTIVE', 'VERIFIED_INEFFECTIVE', 'CLOSED');

-- CreateEnum
CREATE TYPE "SupplierType" AS ENUM ('TICKETING_AGENT', 'CREW_HANDLING_AGENT', 'MEDICAL_CLINIC', 'TRAINING_CENTER', 'UNIFORM_SUPPLIER', 'GOODS_SUPPLIER', 'VISA_AGENT', 'OTHER');

-- CreateEnum
CREATE TYPE "SupplierStatus" AS ENUM ('APPROVED', 'CONDITIONAL', 'SUSPENDED', 'BLACKLISTED');

-- CreateEnum
CREATE TYPE "POStatus" AS ENUM ('PENDING', 'APPROVED', 'ORDERED', 'DELIVERED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ComplainantType" AS ENUM ('CUSTOMER', 'SEAFARER', 'EMPLOYEE', 'MEDIA', 'AUTHORITY', 'PUBLIC', 'OTHER');

-- CreateEnum
CREATE TYPE "ComplaintCategory" AS ENUM ('SERVICE_QUALITY', 'DOCUMENT_DELAY', 'CREW_COMPETENCE', 'CREW_CONDUCT', 'COMMUNICATION', 'BILLING_PAYMENT', 'CONTRACT_DISPUTE', 'SAFETY_HEALTH', 'DISCRIMINATION', 'HARASSMENT', 'OTHER');

-- CreateEnum
CREATE TYPE "ComplaintStatus" AS ENUM ('RECEIVED', 'UNDER_INVESTIGATION', 'RESOLVED', 'CLOSED', 'ESCALATED');

-- CreateEnum
CREATE TYPE "EmploymentType" AS ENUM ('REGULAR', 'PROBATIONARY', 'CASUAL', 'CONTRACT');

-- CreateEnum
CREATE TYPE "EmployeeStatus" AS ENUM ('ACTIVE', 'PROBATION', 'RESIGNED', 'TERMINATED', 'RETIRED');

-- CreateEnum
CREATE TYPE "LeaveType" AS ENUM ('SICK_LEAVE', 'EMERGENCY_LEAVE', 'BEREAVEMENT_LEAVE', 'ANNUAL_LEAVE', 'UNPAID_LEAVE', 'MATERNITY_LEAVE', 'PATERNITY_LEAVE');

-- CreateEnum
CREATE TYPE "LeaveStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "DisciplinaryActionType" AS ENUM ('STERN_WARNING', 'WRITTEN_WARNING', 'SUSPENSION_3_DAYS', 'SUSPENSION_7_DAYS', 'SUSPENSION_15_DAYS', 'SUSPENSION_30_DAYS', 'DISMISSAL');

-- CreateEnum
CREATE TYPE "TrainingType" AS ENUM ('ISO_9001_AWARENESS', 'INTERNAL_AUDITOR', 'DOCUMENT_CONTROL', 'RECRUITMENT_PROCESS', 'MARITIME_LABOR_CONVENTION', 'SAFETY_TRAINING', 'COMPUTER_SKILLS', 'LANGUAGE_TRAINING', 'CUSTOMER_SERVICE', 'ON_THE_JOB', 'OTHER');

-- CreateEnum
CREATE TYPE "TrainingStatus" AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "RiskOpportunity" (
    "id" SERIAL NOT NULL,
    "type" "RiskType" NOT NULL,
    "source" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "likelihood" "RiskLevel",
    "impact" "RiskLevel",
    "riskScore" INTEGER,
    "actions" TEXT NOT NULL,
    "responsiblePerson" TEXT,
    "targetDate" TIMESTAMP(3),
    "status" "RiskStatus" NOT NULL DEFAULT 'IDENTIFIED',
    "residualRisk" TEXT,
    "effectivenessReview" TEXT,
    "reviewDate" TIMESTAMP(3),
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RiskOpportunity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InternalAudit" (
    "id" SERIAL NOT NULL,
    "auditNumber" TEXT NOT NULL,
    "auditDate" TIMESTAMP(3) NOT NULL,
    "auditType" "AuditType" NOT NULL,
    "auditScope" TEXT NOT NULL,
    "leadAuditor" TEXT NOT NULL,
    "auditors" TEXT[],
    "auditee" TEXT,
    "checklist" TEXT,
    "findings" TEXT,
    "status" "AuditStatus" NOT NULL DEFAULT 'PLANNED',
    "nonConformities" INTEGER DEFAULT 0,
    "summary" TEXT,
    "reportIssuedDate" TIMESTAMP(3),
    "reportPath" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InternalAudit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CorrectiveAction" (
    "id" SERIAL NOT NULL,
    "carNumber" TEXT NOT NULL,
    "source" "CARSource" NOT NULL,
    "sourceRef" TEXT,
    "problemDescription" TEXT NOT NULL,
    "detectedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "detectedBy" TEXT NOT NULL,
    "rootCauseAnalysis" TEXT,
    "category" "CARCategory",
    "proposedAction" TEXT,
    "responsiblePerson" TEXT,
    "targetDate" TIMESTAMP(3),
    "implementedDate" TIMESTAMP(3),
    "status" "CARStatus" NOT NULL DEFAULT 'OPEN',
    "effectivenessCheck" TEXT,
    "verifiedBy" TEXT,
    "verifiedDate" TIMESTAMP(3),
    "auditId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CorrectiveAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Supplier" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "SupplierType" NOT NULL,
    "address" TEXT,
    "contactPerson" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "productsServices" TEXT NOT NULL,
    "initialEvaluationScore" INTEGER,
    "initialEvaluationDate" TIMESTAMP(3),
    "status" "SupplierStatus" NOT NULL DEFAULT 'APPROVED',
    "remarks" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupplierEvaluation" (
    "id" SERIAL NOT NULL,
    "supplierId" INTEGER NOT NULL,
    "evaluationPeriod" TEXT NOT NULL,
    "evaluationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "qualityScore" INTEGER,
    "deliveryScore" INTEGER,
    "priceScore" INTEGER,
    "serviceScore" INTEGER,
    "totalScore" INTEGER NOT NULL,
    "remarks" TEXT,
    "evaluatedBy" TEXT NOT NULL,
    "approvedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SupplierEvaluation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PurchaseOrder" (
    "id" SERIAL NOT NULL,
    "poNumber" TEXT NOT NULL,
    "supplierId" INTEGER NOT NULL,
    "requestedBy" TEXT NOT NULL,
    "requestDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "items" TEXT NOT NULL,
    "totalAmount" DOUBLE PRECISION,
    "currency" TEXT DEFAULT 'IDR',
    "status" "POStatus" NOT NULL DEFAULT 'PENDING',
    "deliveryDate" TIMESTAMP(3),
    "receivedDate" TIMESTAMP(3),
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PurchaseOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Complaint" (
    "id" SERIAL NOT NULL,
    "complaintNumber" TEXT NOT NULL,
    "complainantType" "ComplainantType" NOT NULL,
    "complainantName" TEXT,
    "complainantContact" TEXT,
    "complaintDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "subject" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "ComplaintCategory",
    "relatedCrew" TEXT,
    "relatedVessel" TEXT,
    "status" "ComplaintStatus" NOT NULL DEFAULT 'RECEIVED',
    "investigatedBy" TEXT,
    "findings" TEXT,
    "actionTaken" TEXT,
    "resolvedDate" TIMESTAMP(3),
    "satisfactionRating" INTEGER,
    "followUpNotes" TEXT,
    "receivedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Complaint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employee" (
    "id" SERIAL NOT NULL,
    "employeeCode" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3),
    "placeOfBirth" TEXT,
    "gender" TEXT,
    "address" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "emergencyContact" TEXT,
    "position" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "hireDate" TIMESTAMP(3) NOT NULL,
    "employmentType" "EmploymentType" NOT NULL,
    "probationEndDate" TIMESTAMP(3),
    "status" "EmployeeStatus" NOT NULL DEFAULT 'ACTIVE',
    "terminationDate" TIMESTAMP(3),
    "terminationReason" TEXT,
    "passportNumber" TEXT,
    "idCardNumber" TEXT,
    "medicalCertDate" TIMESTAMP(3),
    "bankName" TEXT,
    "accountNumber" TEXT,
    "education" TEXT,
    "qualifications" TEXT,
    "supervisor" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PerformanceAppraisal" (
    "id" SERIAL NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "appraisalPeriod" TEXT NOT NULL,
    "appraisalDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "qualityOfWork" INTEGER,
    "productivity" INTEGER,
    "jobKnowledge" INTEGER,
    "reliability" INTEGER,
    "initiative" INTEGER,
    "teamwork" INTEGER,
    "overallScore" DOUBLE PRECISION,
    "overallRating" TEXT,
    "strengths" TEXT,
    "areasForImprovement" TEXT,
    "goals" TEXT,
    "evaluatedBy" TEXT NOT NULL,
    "reviewedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PerformanceAppraisal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Leave" (
    "id" SERIAL NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "leaveType" "LeaveType" NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "totalDays" INTEGER NOT NULL,
    "reason" TEXT,
    "status" "LeaveStatus" NOT NULL DEFAULT 'PENDING',
    "requestedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvedBy" TEXT,
    "approvedDate" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "medicalCertPath" TEXT,
    "deathCertPath" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Leave_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DisciplinaryAction" (
    "id" SERIAL NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "incidentDate" TIMESTAMP(3) NOT NULL,
    "offenseCode" TEXT,
    "offense" TEXT NOT NULL,
    "offenseCategory" TEXT,
    "action" "DisciplinaryActionType" NOT NULL,
    "penaltyDays" INTEGER,
    "reportedBy" TEXT NOT NULL,
    "investigatedBy" TEXT,
    "decidedBy" TEXT NOT NULL,
    "employeeStatement" TEXT,
    "findings" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ISSUED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DisciplinaryAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployeeTraining" (
    "id" SERIAL NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "trainingTitle" TEXT NOT NULL,
    "trainingType" "TrainingType" NOT NULL,
    "provider" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "duration" TEXT,
    "status" "TrainingStatus" NOT NULL DEFAULT 'SCHEDULED',
    "certificatePath" TEXT,
    "score" INTEGER,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmployeeTraining_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RiskOpportunity_type_idx" ON "RiskOpportunity"("type");

-- CreateIndex
CREATE INDEX "RiskOpportunity_status_idx" ON "RiskOpportunity"("status");

-- CreateIndex
CREATE UNIQUE INDEX "InternalAudit_auditNumber_key" ON "InternalAudit"("auditNumber");

-- CreateIndex
CREATE INDEX "InternalAudit_auditDate_idx" ON "InternalAudit"("auditDate");

-- CreateIndex
CREATE INDEX "InternalAudit_status_idx" ON "InternalAudit"("status");

-- CreateIndex
CREATE UNIQUE INDEX "CorrectiveAction_carNumber_key" ON "CorrectiveAction"("carNumber");

-- CreateIndex
CREATE INDEX "CorrectiveAction_status_idx" ON "CorrectiveAction"("status");

-- CreateIndex
CREATE INDEX "CorrectiveAction_auditId_idx" ON "CorrectiveAction"("auditId");

-- CreateIndex
CREATE INDEX "CorrectiveAction_category_idx" ON "CorrectiveAction"("category");

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_code_key" ON "Supplier"("code");

-- CreateIndex
CREATE INDEX "Supplier_status_idx" ON "Supplier"("status");

-- CreateIndex
CREATE INDEX "Supplier_type_idx" ON "Supplier"("type");

-- CreateIndex
CREATE INDEX "SupplierEvaluation_supplierId_idx" ON "SupplierEvaluation"("supplierId");

-- CreateIndex
CREATE INDEX "SupplierEvaluation_evaluationDate_idx" ON "SupplierEvaluation"("evaluationDate");

-- CreateIndex
CREATE UNIQUE INDEX "PurchaseOrder_poNumber_key" ON "PurchaseOrder"("poNumber");

-- CreateIndex
CREATE INDEX "PurchaseOrder_supplierId_idx" ON "PurchaseOrder"("supplierId");

-- CreateIndex
CREATE INDEX "PurchaseOrder_status_idx" ON "PurchaseOrder"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Complaint_complaintNumber_key" ON "Complaint"("complaintNumber");

-- CreateIndex
CREATE INDEX "Complaint_status_idx" ON "Complaint"("status");

-- CreateIndex
CREATE INDEX "Complaint_complainantType_idx" ON "Complaint"("complainantType");

-- CreateIndex
CREATE INDEX "Complaint_category_idx" ON "Complaint"("category");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_employeeCode_key" ON "Employee"("employeeCode");

-- CreateIndex
CREATE INDEX "Employee_status_idx" ON "Employee"("status");

-- CreateIndex
CREATE INDEX "Employee_department_idx" ON "Employee"("department");

-- CreateIndex
CREATE INDEX "PerformanceAppraisal_employeeId_idx" ON "PerformanceAppraisal"("employeeId");

-- CreateIndex
CREATE INDEX "PerformanceAppraisal_appraisalDate_idx" ON "PerformanceAppraisal"("appraisalDate");

-- CreateIndex
CREATE INDEX "Leave_employeeId_idx" ON "Leave"("employeeId");

-- CreateIndex
CREATE INDEX "Leave_status_idx" ON "Leave"("status");

-- CreateIndex
CREATE INDEX "Leave_leaveType_idx" ON "Leave"("leaveType");

-- CreateIndex
CREATE INDEX "DisciplinaryAction_employeeId_idx" ON "DisciplinaryAction"("employeeId");

-- CreateIndex
CREATE INDEX "DisciplinaryAction_incidentDate_idx" ON "DisciplinaryAction"("incidentDate");

-- CreateIndex
CREATE INDEX "EmployeeTraining_employeeId_idx" ON "EmployeeTraining"("employeeId");

-- CreateIndex
CREATE INDEX "EmployeeTraining_trainingType_idx" ON "EmployeeTraining"("trainingType");

-- AddForeignKey
ALTER TABLE "CorrectiveAction" ADD CONSTRAINT "CorrectiveAction_auditId_fkey" FOREIGN KEY ("auditId") REFERENCES "InternalAudit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplierEvaluation" ADD CONSTRAINT "SupplierEvaluation_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrder" ADD CONSTRAINT "PurchaseOrder_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerformanceAppraisal" ADD CONSTRAINT "PerformanceAppraisal_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Leave" ADD CONSTRAINT "Leave_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DisciplinaryAction" ADD CONSTRAINT "DisciplinaryAction_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeTraining" ADD CONSTRAINT "EmployeeTraining_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

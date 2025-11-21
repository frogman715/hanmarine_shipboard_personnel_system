-- AlterTable
ALTER TABLE "EmploymentApplication" ADD COLUMN     "acceptedDate" TIMESTAMP(3),
ADD COLUMN     "interviewDate" TIMESTAMP(3),
ADD COLUMN     "interviewNotes" TEXT,
ADD COLUMN     "offeredDate" TIMESTAMP(3),
ADD COLUMN     "rejectionReason" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'APPLIED';

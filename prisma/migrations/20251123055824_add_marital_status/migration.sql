-- AlterTable
ALTER TABLE "Crew" ADD COLUMN     "maritalStatus" TEXT;

-- AddForeignKey
ALTER TABLE "SeafarerContract" ADD CONSTRAINT "SeafarerContract_crewId_fkey" FOREIGN KEY ("crewId") REFERENCES "Crew"("id") ON DELETE CASCADE ON UPDATE CASCADE;

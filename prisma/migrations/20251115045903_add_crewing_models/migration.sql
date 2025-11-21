-- CreateTable
CREATE TABLE "Crew" (
    "id" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "rank" TEXT,
    "vessel" TEXT,
    "status" TEXT,
    "placeOfBirth" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "religion" TEXT,
    "lastSchool" TEXT,
    "totalFamily" INTEGER,
    "wifeName" TEXT,
    "familyNotes" TEXT,
    "eyeSight" TEXT,
    "bloodType" TEXT,
    "heightCm" INTEGER,
    "weightKg" INTEGER,
    "waistSize" TEXT,
    "shoeSize" TEXT,
    "address" TEXT,
    "phoneHome" TEXT,
    "phoneMobile" TEXT,
    "crewStatus" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Crew_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Certificate" (
    "id" SERIAL NOT NULL,
    "crewId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "issueDate" TIMESTAMP(3),
    "expiryDate" TIMESTAMP(3),
    "issuer" TEXT,
    "remarks" TEXT,

    CONSTRAINT "Certificate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Assignment" (
    "id" SERIAL NOT NULL,
    "crewId" INTEGER NOT NULL,
    "vesselName" TEXT NOT NULL,
    "rank" TEXT NOT NULL,
    "signOn" TIMESTAMP(3),
    "signOff" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'PLANNED',

    CONSTRAINT "Assignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmploymentApplication" (
    "id" SERIAL NOT NULL,
    "crewId" INTEGER NOT NULL,
    "appliedRank" TEXT,
    "applicationDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,

    CONSTRAINT "EmploymentApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentChecklist" (
    "id" SERIAL NOT NULL,
    "crewId" INTEGER NOT NULL,
    "applicationId" INTEGER,
    "passportOk" BOOLEAN,
    "seamanBookOk" BOOLEAN,
    "cocOk" BOOLEAN,
    "medicalOk" BOOLEAN,
    "visaOk" BOOLEAN,
    "vaccinationOk" BOOLEAN,
    "photoIdOk" BOOLEAN,
    "policeClearanceOk" BOOLEAN,
    "trainingCertsOk" BOOLEAN,
    "covidVaccineOk" BOOLEAN,
    "remarks" TEXT,

    CONSTRAINT "DocumentChecklist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeaServiceExperience" (
    "id" SERIAL NOT NULL,
    "crewId" INTEGER NOT NULL,
    "vesselName" TEXT,
    "rank" TEXT,
    "grt" INTEGER,
    "dwt" INTEGER,
    "engineType" TEXT,
    "bhp" INTEGER,
    "companyName" TEXT,
    "flag" TEXT,
    "signOn" TIMESTAMP(3),
    "signOff" TIMESTAMP(3),
    "remarks" TEXT,

    CONSTRAINT "SeaServiceExperience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JoiningInstruction" (
    "id" SERIAL NOT NULL,
    "crewId" INTEGER,
    "applicationId" INTEGER,
    "instructionText" TEXT NOT NULL,
    "travelDetails" TEXT,
    "issuedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "issuedBy" TEXT,

    CONSTRAINT "JoiningInstruction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CrewEvaluation" (
    "id" SERIAL NOT NULL,
    "crewId" INTEGER NOT NULL,
    "evaluator" TEXT,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rank" TEXT,
    "score" INTEGER,
    "comments" TEXT,

    CONSTRAINT "CrewEvaluation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Repatriation" (
    "id" SERIAL NOT NULL,
    "crewId" INTEGER NOT NULL,
    "repatriationDate" TIMESTAMP(3),
    "reason" TEXT,
    "finalAccount" DOUBLE PRECISION,
    "processedBy" TEXT,
    "remarks" TEXT,

    CONSTRAINT "Repatriation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IncidentReport" (
    "id" SERIAL NOT NULL,
    "crewId" INTEGER,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "vessel" TEXT,
    "incidentType" TEXT,
    "description" TEXT,
    "actionsTaken" TEXT,
    "reportedBy" TEXT,
    "severity" TEXT,

    CONSTRAINT "IncidentReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KpiSnapshot" (
    "id" SERIAL NOT NULL,
    "capturedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "docExpiryCompliance" DOUBLE PRECISION,
    "onTimeCrewChange" DOUBLE PRECISION,
    "trainingCompletion" DOUBLE PRECISION,
    "evaluationCompletion" DOUBLE PRECISION,
    "incidentsPerThousand" DOUBLE PRECISION,

    CONSTRAINT "KpiSnapshot_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Certificate" ADD CONSTRAINT "Certificate_crewId_fkey" FOREIGN KEY ("crewId") REFERENCES "Crew"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_crewId_fkey" FOREIGN KEY ("crewId") REFERENCES "Crew"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmploymentApplication" ADD CONSTRAINT "EmploymentApplication_crewId_fkey" FOREIGN KEY ("crewId") REFERENCES "Crew"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentChecklist" ADD CONSTRAINT "DocumentChecklist_crewId_fkey" FOREIGN KEY ("crewId") REFERENCES "Crew"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentChecklist" ADD CONSTRAINT "DocumentChecklist_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "EmploymentApplication"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeaServiceExperience" ADD CONSTRAINT "SeaServiceExperience_crewId_fkey" FOREIGN KEY ("crewId") REFERENCES "Crew"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JoiningInstruction" ADD CONSTRAINT "JoiningInstruction_crewId_fkey" FOREIGN KEY ("crewId") REFERENCES "Crew"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JoiningInstruction" ADD CONSTRAINT "JoiningInstruction_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "EmploymentApplication"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrewEvaluation" ADD CONSTRAINT "CrewEvaluation_crewId_fkey" FOREIGN KEY ("crewId") REFERENCES "Crew"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Repatriation" ADD CONSTRAINT "Repatriation_crewId_fkey" FOREIGN KEY ("crewId") REFERENCES "Crew"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncidentReport" ADD CONSTRAINT "IncidentReport_crewId_fkey" FOREIGN KEY ("crewId") REFERENCES "Crew"("id") ON DELETE CASCADE ON UPDATE CASCADE;

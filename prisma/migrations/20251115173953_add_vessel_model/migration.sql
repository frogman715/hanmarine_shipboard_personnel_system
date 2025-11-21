-- CreateTable
CREATE TABLE "Vessel" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "flag" TEXT NOT NULL,
    "vesselType" TEXT,
    "owner" TEXT,
    "grt" INTEGER,
    "dwt" INTEGER,
    "imo" TEXT,
    "callSign" TEXT,
    "registrationYear" INTEGER,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vessel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Vessel_name_key" ON "Vessel"("name");

-- CreateIndex
CREATE INDEX "Vessel_flag_idx" ON "Vessel"("flag");

-- CreateIndex
CREATE INDEX "Vessel_name_idx" ON "Vessel"("name");

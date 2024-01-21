-- CreateTable
CREATE TABLE "Registrant" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT,
    "surname" TEXT NOT NULL,
    "names" TEXT NOT NULL,
    "nationalIdOrPassport" TEXT,
    "preferredName" TEXT,
    "institution" TEXT,
    "email" TEXT NOT NULL,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT NOT NULL,
    "dietaryNeeds" TEXT,
    "healthAllergies" TEXT,
    "spouseName" TEXT,
    "spouseContact" TEXT,
    "nextOfKinName" TEXT NOT NULL,
    "nextOfKinPhone" TEXT NOT NULL,
    "nextOfKinEmail" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Delegate" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "registrantId" INTEGER NOT NULL,
    CONSTRAINT "Delegate_registrantId_fkey" FOREIGN KEY ("registrantId") REFERENCES "Registrant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Registrant_email_key" ON "Registrant"("email");

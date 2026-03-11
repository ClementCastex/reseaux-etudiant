-- CreateTable
CREATE TABLE "campuses" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "students" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "campusId" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "bio" TEXT,
    "phone" TEXT,
    "formation" TEXT,
    "interests" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "students_campusId_fkey" FOREIGN KEY ("campusId") REFERENCES "campuses" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "campusId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "events_campusId_fkey" FOREIGN KEY ("campusId") REFERENCES "campuses" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "events_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "students" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_EventParticipants" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_EventParticipants_A_fkey" FOREIGN KEY ("A") REFERENCES "events" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_EventParticipants_B_fkey" FOREIGN KEY ("B") REFERENCES "students" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "campuses_name_key" ON "campuses"("name");

-- CreateIndex
CREATE UNIQUE INDEX "students_email_key" ON "students"("email");

-- CreateIndex
CREATE INDEX "students_campusId_idx" ON "students"("campusId");

-- CreateIndex
CREATE INDEX "students_email_idx" ON "students"("email");

-- CreateIndex
CREATE INDEX "events_campusId_idx" ON "events"("campusId");

-- CreateIndex
CREATE INDEX "events_creatorId_idx" ON "events"("creatorId");

-- CreateIndex
CREATE INDEX "events_date_idx" ON "events"("date");

-- CreateIndex
CREATE UNIQUE INDEX "_EventParticipants_AB_unique" ON "_EventParticipants"("A", "B");

-- CreateIndex
CREATE INDEX "_EventParticipants_B_index" ON "_EventParticipants"("B");

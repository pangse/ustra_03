-- CreateTable
CREATE TABLE "MaterialHistory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "materialId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "handlerId" INTEGER NOT NULL,
    "memo" TEXT,
    CONSTRAINT "MaterialHistory_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Materials" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MaterialHistory_handlerId_fkey" FOREIGN KEY ("handlerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

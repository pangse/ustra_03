-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MaterialHistory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "materialId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "handlerId" INTEGER NOT NULL,
    "memo" TEXT,
    "trackingNumber" TEXT,
    "isUrgent" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "MaterialHistory_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Materials" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MaterialHistory_handlerId_fkey" FOREIGN KEY ("handlerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_MaterialHistory" ("date", "handlerId", "id", "materialId", "memo", "quantity", "type") SELECT "date", "handlerId", "id", "materialId", "memo", "quantity", "type" FROM "MaterialHistory";
DROP TABLE "MaterialHistory";
ALTER TABLE "new_MaterialHistory" RENAME TO "MaterialHistory";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

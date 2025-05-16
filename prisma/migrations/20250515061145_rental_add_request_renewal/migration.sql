-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Rental" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "materialId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "rentDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "returnDate" DATETIME,
    "memo" TEXT,
    "parentId" INTEGER,
    CONSTRAINT "Rental_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Materials" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Rental_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Rental_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Rental" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Rental" ("id", "materialId", "memo", "rentDate", "returnDate", "status", "userId") SELECT "id", "materialId", "memo", "rentDate", "returnDate", "status", "userId" FROM "Rental";
DROP TABLE "Rental";
ALTER TABLE "new_Rental" RENAME TO "Rental";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

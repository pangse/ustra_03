-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Materials" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "location" TEXT NOT NULL,
    "inout_type" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "handlerId" INTEGER NOT NULL,
    "rfid_tag" TEXT,
    "status" TEXT NOT NULL DEFAULT '정상',
    CONSTRAINT "Materials_handlerId_fkey" FOREIGN KEY ("handlerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Materials" ("category", "date", "handlerId", "id", "inout_type", "location", "name", "quantity", "rfid_tag") SELECT "category", "date", "handlerId", "id", "inout_type", "location", "name", "quantity", "rfid_tag" FROM "Materials";
DROP TABLE "Materials";
ALTER TABLE "new_Materials" RENAME TO "Materials";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

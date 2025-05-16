/*
  Warnings:

  - You are about to drop the column `category` on the `Materials` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `Materials` table. All the data in the column will be lost.
  - You are about to drop the column `inout_type` on the `Materials` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Materials` table. All the data in the column will be lost.
  - Added the required column `categoryId` to the `Materials` table without a default value. This is not possible if the table is not empty.
  - Added the required column `locationId` to the `Materials` table without a default value. This is not possible if the table is not empty.
  - Made the column `rfid_tag` on table `Materials` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Category" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "parentId" INTEGER,
    CONSTRAINT "Category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Category" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Materials" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "rfid_tag" TEXT NOT NULL,
    "locationId" INTEGER NOT NULL,
    "handlerId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "size" TEXT,
    "color" TEXT,
    "material" TEXT,
    "brand" TEXT,
    "gender" TEXT,
    "season" TEXT,
    "pattern" TEXT,
    "fit" TEXT,
    "origin" TEXT,
    "clothing_model" TEXT,
    "it_model" TEXT,
    "serial" TEXT,
    "os" TEXT,
    "cpu" TEXT,
    "ram" TEXT,
    "storage" TEXT,
    "screen_size" TEXT,
    "resolution" TEXT,
    "battery" TEXT,
    "purchase_date" DATETIME,
    "warranty" TEXT,
    "mac_address" TEXT,
    "etc" TEXT,
    "status" TEXT NOT NULL DEFAULT '정상',
    "parentId" INTEGER,
    CONSTRAINT "Materials_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Materials_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "MasterData" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Materials_handlerId_fkey" FOREIGN KEY ("handlerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Materials_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Materials" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Materials" ("handlerId", "id", "name", "quantity", "rfid_tag", "status") SELECT "handlerId", "id", "name", "quantity", "rfid_tag", "status" FROM "Materials";
DROP TABLE "Materials";
ALTER TABLE "new_Materials" RENAME TO "Materials";
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "password" TEXT NOT NULL
);
INSERT INTO "new_User" ("department", "email", "id", "name", "phone_number", "role") SELECT "department", "email", "id", "name", "phone_number", "role" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

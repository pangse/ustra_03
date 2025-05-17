-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "MasterData" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Category" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "parentId" INTEGER,
    "assetTypeId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Category" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Category_assetTypeId_fkey" FOREIGN KEY ("assetTypeId") REFERENCES "AssetType" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AssetType" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "typeCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "extension" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT
);

-- CreateTable
CREATE TABLE "Materials" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "assetTypeId" INTEGER,
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
    CONSTRAINT "Materials_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Materials" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Materials_handlerId_fkey" FOREIGN KEY ("handlerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Materials_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "MasterData" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Materials_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Materials_assetTypeId_fkey" FOREIGN KEY ("assetTypeId") REFERENCES "AssetType" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MaterialHistory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "materialId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "handlerId" INTEGER NOT NULL,
    "memo" TEXT,
    "trackingNumber" TEXT,
    "isUrgent" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "MaterialHistory_handlerId_fkey" FOREIGN KEY ("handlerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MaterialHistory_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Materials" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Rental" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "materialId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "rentDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "returnDate" DATETIME,
    "memo" TEXT,
    "parentId" INTEGER,
    "retrieveDate" DATETIME,
    CONSTRAINT "Rental_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Rental" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Rental_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Rental_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Materials" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "rental_requests" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "materialId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "purpose" TEXT NOT NULL,
    "request" TEXT,
    "arrivalDate" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "rental_requests_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Materials" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "rental_requests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Return" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "rentalRequestId" INTEGER NOT NULL,
    "materialId" INTEGER NOT NULL,
    "returnLocation" TEXT NOT NULL,
    "returnDate" DATETIME NOT NULL,
    "status" TEXT NOT NULL,
    "statusDescription" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Return_rentalRequestId_fkey" FOREIGN KEY ("rentalRequestId") REFERENCES "rental_requests" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Return_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Materials" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RfidTag" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tag" TEXT NOT NULL,
    "materialId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "RfidTag_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Materials" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RfidHistory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "rfidTag" TEXT NOT NULL,
    "materialId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "AssetType_typeCode_key" ON "AssetType"("typeCode");

-- CreateIndex
CREATE INDEX "Return_rentalRequestId_idx" ON "Return"("rentalRequestId");

-- CreateIndex
CREATE INDEX "Return_materialId_idx" ON "Return"("materialId");

-- CreateIndex
CREATE UNIQUE INDEX "RfidTag_tag_key" ON "RfidTag"("tag");

-- CreateIndex
CREATE INDEX "RfidTag_materialId_idx" ON "RfidTag"("materialId");

-- CreateIndex
CREATE INDEX "RfidHistory_rfidTag_idx" ON "RfidHistory"("rfidTag");

-- CreateIndex
CREATE INDEX "RfidHistory_materialId_idx" ON "RfidHistory"("materialId");

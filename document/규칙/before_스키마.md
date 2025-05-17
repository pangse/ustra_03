generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:./prisma/dev.db"
}

model User {
  id                Int               @id @default(autoincrement())
  name              String
  email             String            @unique
  role              String
  department        String
  phone_number      String
  password          String
  createdAt         DateTime          @default(now())
  updatedAt         DateTime          @default(now()) @updatedAt
  materialHistories MaterialHistory[] @relation("UserMaterialHistories")
  materials         Materials[]       @relation("UserMaterials")
  rentals           Rental[]
  rentalRequests    RentalRequest[]
}

model MasterData {
  id          Int         @id @default(autoincrement())
  type        String
  name        String
  description String?
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @default(now()) @updatedAt
  materials   Materials[] @relation("LocationMaterials")
}

model Category {
  id          Int         @id @default(autoincrement())
  name        String
  description String?
  parentId    Int?
  assetTypeId Int?
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @default(now()) @updatedAt
  parent      Category?   @relation("CategoryParent", fields: [parentId], references: [id])
  children    Category[]  @relation("CategoryParent")
  materials   Materials[]
  assetType   AssetType?  @relation(fields: [assetTypeId], references: [id])
}

model AssetType {
  id           Int         @id @default(autoincrement())
  typeCode     String      @unique
  name         String
  description  String?
  extension    String?
  isActive     Boolean     @default(true)
  createdAt    DateTime    @default(now())
  createdBy    String?
  materials    Materials[]
  categories   Category[]  // Added opposite relation
}

model Materials {
  id                Int               @id @default(autoincrement())
  name              String
  assetTypeId       Int?              // 자산유형 연동
  categoryId        Int
  rfid_tag          String
  locationId        Int
  handlerId         Int
  quantity          Int
  size              String?
  color             String?
  material          String?
  brand             String?
  gender            String?
  season            String?
  pattern           String?
  fit               String?
  origin            String?
  clothing_model    String?
  it_model          String?
  serial            String?
  os                String?
  cpu               String?
  ram               String?
  storage           String?
  screen_size       String?
  resolution        String?
  battery           String?
  purchase_date     DateTime?
  warranty          String?
  mac_address       String?
  etc               String?
  status            String            @default("정상")
  parentId          Int?
  materialHistories MaterialHistory[] @relation("MaterialMaterialHistories")
  parent            Materials?        @relation("MaterialParent", fields: [parentId], references: [id])
  children          Materials[]       @relation("MaterialParent")
  handler           User              @relation("UserMaterials", fields: [handlerId], references: [id])
  location          MasterData        @relation("LocationMaterials", fields: [locationId], references: [id])
  category          Category          @relation(fields: [categoryId], references: [id])
  rentals           Rental[]
  rentalRequests    RentalRequest[]
  assetType         AssetType?        @relation(fields: [assetTypeId], references: [id])
  returns           Return[]
  rfidTags          RfidTag[]         // Added opposite relation
}

model MaterialHistory {
  id             Int       @id @default(autoincrement())
  materialId     Int
  type           String
  quantity       Int
  date           DateTime  @default(now())
  handlerId      Int
  memo           String?
  trackingNumber String?
  isUrgent       Boolean   @default(false)
  handler        User      @relation("UserMaterialHistories", fields: [handlerId], references: [id])
  material       Materials @relation("MaterialMaterialHistories", fields: [materialId], references: [id])
}

model Rental {
  id           Int       @id @default(autoincrement())
  materialId   Int
  userId       Int
  status       String
  rentDate     DateTime  @default(now())
  returnDate   DateTime?
  memo         String?
  parentId     Int?
  retrieveDate DateTime?
  parent       Rental?   @relation("RentalParent", fields: [parentId], references: [id])
  children     Rental[]  @relation("RentalParent")
  user         User      @relation(fields: [userId], references: [id])
  material     Materials @relation(fields: [materialId], references: [id])
}

model RentalRequest {
  id          Int      @id @default(autoincrement())
  materialId  Int
  userId      Int
  startDate   DateTime
  endDate     DateTime
  purpose     String
  request     String?
  arrivalDate DateTime
  status      String   @default("PENDING")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  material    Materials @relation(fields: [materialId], references: [id])
  user        User      @relation(fields: [userId], references: [id])

  returns     Return[]

  @@map("rental_requests")
}

model Return {
  id                Int           @id @default(autoincrement())
  rentalRequestId   Int
  materialId        Int
  returnLocation    String
  returnDate        DateTime
  status            String        // NORMAL, REPAIR, DAMAGED
  statusDescription String?
  createdAt         DateTime      @default(now())
  updatedAt         DateTime      @updatedAt

  rentalRequest     RentalRequest @relation(fields: [rentalRequestId], references: [id])
  material          Materials     @relation(fields: [materialId], references: [id])

  @@index([rentalRequestId])
  @@index([materialId])
}

model RfidTag {
  id         String   @id @default(cuid())
  tag        String   @unique
  materialId Int
  material   Materials @relation(fields: [materialId], references: [id])
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@index([materialId])
}

model RfidHistory {
  id         String   @id @default(cuid())
  rfidTag    String
  materialId Int
  type       String   // 'SCAN' or 'REGISTER'
  timestamp  DateTime @default(now())

  @@index([rfidTag])
  @@index([materialId])
}

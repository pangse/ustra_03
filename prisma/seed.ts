import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // 1. 카테고리, 위치, 핸들러 유저 등 필수 관계 데이터 생성
  const category = await prisma.category.create({
    data: {
      name: "노트북",
      description: "노트북 카테고리"
    }
  });
  const location = await prisma.masterData.create({
    data: {
      type: "위치",
      name: "서울 본사",
    }
  });
  const user = await prisma.user.create({
    data: {
      name: "테스트유저",
      email: "test@example.com",
      role: "user",
      department: "IT",
      phone_number: "010-1234-5678",
      password: "hashedpassword",
    }
  });

  // 2. 자산(Materials) 생성
  const material1 = await prisma.materials.create({
    data: {
      name: "노트북1",
      categoryId: category.id,
      rfid_tag: "RFID123",
      locationId: location.id,
      handlerId: user.id,
      quantity: 1,
      status: "정상",
    }
  });
  const material2 = await prisma.materials.create({
    data: {
      name: "노트북2",
      categoryId: category.id,
      rfid_tag: "RFID124",
      locationId: location.id,
      handlerId: user.id,
      quantity: 1,
      status: "정상",
    }
  });

  // 3. 알림(Notification) 생성
  await prisma.notification.createMany({
    data: [
      {
        userId: user.id,
        type: "RENTAL_EXPIRE",
        title: "대여 만료 예정",
        message: "대여하신 자산의 반납 예정일이 5일 남았습니다.",
        assetId: material1.id,
        read: false,
        notificationMethod: "SMS",
        createdAt: new Date(Date.now() - 1000 * 60 * 5),
      },
      {
        userId: user.id,
        type: "RENTAL_OVERDUE",
        title: "미반납 알림",
        message: "반납 예정일이 지났습니다. 즉시 반납해 주시기 바랍니다.",
        assetId: material2.id,
        read: false,
        notificationMethod: "SMS",
        createdAt: new Date(Date.now() - 1000 * 60 * 60),
      },
      {
        userId: user.id,
        type: "SETTINGS_CHANGE",
        title: "알림 설정 변경",
        message: "알림 수신 설정이 변경되었습니다.",
        assetId: null,
        read: true,
        notificationMethod: "EMAIL",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
      },
    ]
  });

  console.log("테스트 데이터 생성 완료");
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(() => {
  prisma.$disconnect();
}); 
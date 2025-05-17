const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const prisma = new PrismaClient();

async function main() {
  // 기존 데이터 삭제 (참조 순서대로)
  await prisma.return.deleteMany();
  await prisma.rental.deleteMany();
  await prisma.materialHistory.deleteMany();
  await prisma.rentalRequest.deleteMany();
  await prisma.materials.deleteMany();
  await prisma.user.deleteMany();
  await prisma.category.deleteMany();
  await prisma.masterData.deleteMany();
  await prisma.assetType.deleteMany();
  console.log('Existing data deleted successfully');

  // 테스트 사용자 생성
  const hashedPassword = await bcrypt.hash('password123', 10);
  const testUsers = await Promise.all([
    // 관리자
    prisma.user.create({
      data: {
        name: '김관리',
        email: 'admin@example.com',
        role: 'ADMIN',
        department: '관리팀',
        phone_number: '010-1234-5678',
        password: hashedPassword,
      },
    }),
    // 방송팀
    prisma.user.create({
      data: {
        name: '이방송',
        email: 'broadcast1@example.com',
        role: 'USER',
        department: '방송팀',
        phone_number: '010-2345-6789',
        password: hashedPassword,
      },
    }),
    prisma.user.create({
      data: {
        name: '박카메라',
        email: 'camera1@example.com',
        role: 'USER',
        department: '방송팀',
        phone_number: '010-3456-7890',
        password: hashedPassword,
      },
    }),
    prisma.user.create({
      data: {
        name: '최영상',
        email: 'video1@example.com',
        role: 'USER',
        department: '방송팀',
        phone_number: '010-4567-8901',
        password: hashedPassword,
      },
    }),
    // IT팀
    prisma.user.create({
      data: {
        name: '정개발',
        email: 'dev1@example.com',
        role: 'USER',
        department: 'IT팀',
        phone_number: '010-5678-9012',
        password: hashedPassword,
      },
    }),
    prisma.user.create({
      data: {
        name: '강시스템',
        email: 'sys1@example.com',
        role: 'USER',
        department: 'IT팀',
        phone_number: '010-6789-0123',
        password: hashedPassword,
      },
    }),
    // 음향팀
    prisma.user.create({
      data: {
        name: '윤음향',
        email: 'audio1@example.com',
        role: 'USER',
        department: '음향팀',
        phone_number: '010-7890-1234',
        password: hashedPassword,
      },
    }),
    prisma.user.create({
      data: {
        name: '장믹서',
        email: 'mixer1@example.com',
        role: 'USER',
        department: '음향팀',
        phone_number: '010-8901-2345',
        password: hashedPassword,
      },
    }),
    // 조명팀
    prisma.user.create({
      data: {
        name: '임조명',
        email: 'light1@example.com',
        role: 'USER',
        department: '조명팀',
        phone_number: '010-9012-3456',
        password: hashedPassword,
      },
    }),
    prisma.user.create({
      data: {
        name: '한라이트',
        email: 'light2@example.com',
        role: 'USER',
        department: '조명팀',
        phone_number: '010-0123-4567',
        password: hashedPassword,
      },
    }),
    // 의상팀
    prisma.user.create({
      data: {
        name: '서의상',
        email: 'costume1@example.com',
        role: 'USER',
        department: '의상팀',
        phone_number: '010-1234-5679',
        password: hashedPassword,
      },
    }),
    prisma.user.create({
      data: {
        name: '신스타일',
        email: 'style1@example.com',
        role: 'USER',
        department: '의상팀',
        phone_number: '010-2345-6780',
        password: hashedPassword,
      },
    }),
  ]);
  console.log('Created test users');

  // 카테고리 생성
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: '의상',
        description: '의류 및 신발',
      },
    }),
    prisma.category.create({
      data: {
        name: '신발',
        description: '신발류',
      },
    }),
    prisma.category.create({
      data: {
        name: '방송장비',
        description: '방송 및 촬영 장비',
      },
    }),
    prisma.category.create({
      data: {
        name: 'IT장비',
        description: '컴퓨터 및 IT 장비',
      },
    }),
    prisma.category.create({
      data: {
        name: '음향장비',
        description: '음향 및 오디오 장비',
      },
    }),
    prisma.category.create({
      data: {
        name: '조명장비',
        description: '조명 및 라이팅 장비',
      },
    }),
  ]);
  console.log('Created categories');

  // 자산 유형 생성
  const assetTypes = await Promise.all([
    prisma.assetType.create({
      data: {
        typeCode: 'IT',
        name: 'IT장비',
        description: '컴퓨터 및 IT 장비',
      },
    }),
    prisma.assetType.create({
      data: {
        typeCode: 'BROADCAST',
        name: '방송장비',
        description: '방송 및 촬영 장비',
      },
    }),
    prisma.assetType.create({
      data: {
        typeCode: 'AUDIO',
        name: '음향장비',
        description: '음향 및 오디오 장비',
      },
    }),
    prisma.assetType.create({
      data: {
        typeCode: 'LIGHTING',
        name: '조명장비',
        description: '조명 및 라이팅 장비',
      },
    }),
  ]);
  console.log('Created asset types');

  // 위치 생성
  const locations = await Promise.all([
    prisma.masterData.create({
      data: {
        type: 'LOCATION',
        name: '의상실',
        description: '의상 보관실',
      },
    }),
    prisma.masterData.create({
      data: {
        type: 'LOCATION',
        name: '신발장',
        description: '신발 보관장',
      },
    }),
    prisma.masterData.create({
      data: {
        type: 'LOCATION',
        name: '장비실',
        description: '방송장비 보관실',
      },
    }),
    prisma.masterData.create({
      data: {
        type: 'LOCATION',
        name: 'IT장비실',
        description: 'IT장비 보관실',
      },
    }),
  ]);
  console.log('Created locations');

  // 자재 생성
  const materials = await Promise.all([
    // 기존 의상 데이터
    prisma.materials.create({
      data: {
        name: '검은색 정장',
        categoryId: categories[0].id,
        locationId: locations[0].id,
        handlerId: testUsers[0].id,
        quantity: 5,
        rfid_tag: 'RFID001',
      },
    }),
    prisma.materials.create({
      data: {
        name: '흰색 셔츠',
        categoryId: categories[0].id,
        locationId: locations[0].id,
        handlerId: testUsers[0].id,
        quantity: 10,
        rfid_tag: 'RFID002',
      },
    }),
    prisma.materials.create({
      data: {
        name: '검은색 구두',
        categoryId: categories[1].id,
        locationId: locations[1].id,
        handlerId: testUsers[0].id,
        quantity: 8,
        rfid_tag: 'RFID003',
      },
    }),
    // 방송장비
    prisma.materials.create({
      data: {
        name: 'Sony A7III 카메라',
        categoryId: categories[2].id,
        locationId: locations[2].id,
        handlerId: testUsers[0].id,
        quantity: 3,
        rfid_tag: 'RFID004',
        assetTypeId: assetTypes[1].id,
        brand: 'Sony',
        it_model: 'A7III',
        serial: 'SN123456',
        resolution: '4K',
        etc: '24-70mm 렌즈 포함',
      },
    }),
    prisma.materials.create({
      data: {
        name: 'DJI RS3 Pro 짐벌',
        categoryId: categories[2].id,
        locationId: locations[2].id,
        handlerId: testUsers[0].id,
        quantity: 2,
        rfid_tag: 'RFID005',
        assetTypeId: assetTypes[1].id,
        brand: 'DJI',
        it_model: 'RS3 Pro',
        serial: 'DJI789012',
        etc: '배터리 2개 포함',
      },
    }),
    // IT장비
    prisma.materials.create({
      data: {
        name: 'MacBook Pro 16"',
        categoryId: categories[3].id,
        locationId: locations[3].id,
        handlerId: testUsers[0].id,
        quantity: 4,
        rfid_tag: 'RFID006',
        assetTypeId: assetTypes[0].id,
        brand: 'Apple',
        it_model: 'MacBook Pro 16"',
        serial: 'MBP2023',
        os: 'macOS',
        cpu: 'M2 Pro',
        ram: '32GB',
        storage: '1TB SSD',
        screen_size: '16"',
        mac_address: '00:11:22:33:44:55',
      },
    }),
    prisma.materials.create({
      data: {
        name: 'iPad Pro 12.9"',
        categoryId: categories[3].id,
        locationId: locations[3].id,
        handlerId: testUsers[0].id,
        quantity: 5,
        rfid_tag: 'RFID007',
        assetTypeId: assetTypes[0].id,
        brand: 'Apple',
        it_model: 'iPad Pro 12.9"',
        serial: 'IPAD2023',
        os: 'iPadOS',
        storage: '256GB',
        screen_size: '12.9"',
        etc: 'Apple Pencil 2세대 포함',
      },
    }),
    // 음향장비
    prisma.materials.create({
      data: {
        name: 'Shure SM7B 마이크',
        categoryId: categories[4].id,
        locationId: locations[2].id,
        handlerId: testUsers[0].id,
        quantity: 3,
        rfid_tag: 'RFID008',
        assetTypeId: assetTypes[2].id,
        brand: 'Shure',
        it_model: 'SM7B',
        serial: 'SH789012',
        etc: '마이크 스탠드 포함',
      },
    }),
    prisma.materials.create({
      data: {
        name: 'Focusrite Scarlett 2i2 오디오 인터페이스',
        categoryId: categories[4].id,
        locationId: locations[2].id,
        handlerId: testUsers[0].id,
        quantity: 2,
        rfid_tag: 'RFID009',
        assetTypeId: assetTypes[2].id,
        brand: 'Focusrite',
        it_model: 'Scarlett 2i2',
        serial: 'FS456789',
        etc: 'USB 케이블 포함',
      },
    }),
    // 조명장비
    prisma.materials.create({
      data: {
        name: 'Aputure 300D Mark II LED 조명',
        categoryId: categories[5].id,
        locationId: locations[2].id,
        handlerId: testUsers[0].id,
        quantity: 2,
        rfid_tag: 'RFID010',
        assetTypeId: assetTypes[3].id,
        brand: 'Aputure',
        it_model: '300D Mark II',
        serial: 'AP123456',
        etc: '소프트박스 포함',
      },
    }),
    prisma.materials.create({
      data: {
        name: 'Godox SL-60W LED 조명',
        categoryId: categories[5].id,
        locationId: locations[2].id,
        handlerId: testUsers[0].id,
        quantity: 4,
        rfid_tag: 'RFID011',
        assetTypeId: assetTypes[3].id,
        brand: 'Godox',
        it_model: 'SL-60W',
        serial: 'GD789012',
        etc: '조명 스탠드 포함',
      },
    }),
    // 추가 방송장비
    prisma.materials.create({
      data: {
        name: 'Sony FX3 카메라',
        categoryId: categories[2].id,
        locationId: locations[2].id,
        handlerId: testUsers[0].id,
        quantity: 2,
        rfid_tag: 'RFID012',
        assetTypeId: assetTypes[1].id,
        brand: 'Sony',
        it_model: 'FX3',
        serial: 'SN789012',
        resolution: '4K',
        etc: '16-35mm 렌즈 포함',
      },
    }),
    prisma.materials.create({
      data: {
        name: 'Canon EOS R5 카메라',
        categoryId: categories[2].id,
        locationId: locations[2].id,
        handlerId: testUsers[0].id,
        quantity: 2,
        rfid_tag: 'RFID013',
        assetTypeId: assetTypes[1].id,
        brand: 'Canon',
        it_model: 'EOS R5',
        serial: 'CN123456',
        resolution: '8K',
        etc: '24-105mm 렌즈 포함',
      },
    }),
    prisma.materials.create({
      data: {
        name: 'DJI Mini 3 Pro 드론',
        categoryId: categories[2].id,
        locationId: locations[2].id,
        handlerId: testUsers[0].id,
        quantity: 3,
        rfid_tag: 'RFID014',
        assetTypeId: assetTypes[1].id,
        brand: 'DJI',
        it_model: 'Mini 3 Pro',
        serial: 'DJI345678',
        etc: '배터리 3개, 충전기 포함',
      },
    }),
    prisma.materials.create({
      data: {
        name: 'DJI Ronin-SC 짐벌',
        categoryId: categories[2].id,
        locationId: locations[2].id,
        handlerId: testUsers[0].id,
        quantity: 2,
        rfid_tag: 'RFID015',
        assetTypeId: assetTypes[1].id,
        brand: 'DJI',
        it_model: 'Ronin-SC',
        serial: 'DJI567890',
        etc: '배터리 2개 포함',
      },
    }),
    // 추가 IT장비
    prisma.materials.create({
      data: {
        name: 'MacBook Air M2',
        categoryId: categories[3].id,
        locationId: locations[3].id,
        handlerId: testUsers[0].id,
        quantity: 3,
        rfid_tag: 'RFID016',
        assetTypeId: assetTypes[0].id,
        brand: 'Apple',
        it_model: 'MacBook Air M2',
        serial: 'MBA2023',
        os: 'macOS',
        cpu: 'M2',
        ram: '16GB',
        storage: '512GB SSD',
        screen_size: '13.6"',
        mac_address: '00:11:22:33:44:56',
      },
    }),
    prisma.materials.create({
      data: {
        name: 'iPad Air 5세대',
        categoryId: categories[3].id,
        locationId: locations[3].id,
        handlerId: testUsers[0].id,
        quantity: 4,
        rfid_tag: 'RFID017',
        assetTypeId: assetTypes[0].id,
        brand: 'Apple',
        it_model: 'iPad Air 5',
        serial: 'IPA2023',
        os: 'iPadOS',
        storage: '256GB',
        screen_size: '10.9"',
        etc: 'Apple Pencil 2세대 포함',
      },
    }),
    prisma.materials.create({
      data: {
        name: 'Dell XPS 15',
        categoryId: categories[3].id,
        locationId: locations[3].id,
        handlerId: testUsers[0].id,
        quantity: 2,
        rfid_tag: 'RFID018',
        assetTypeId: assetTypes[0].id,
        brand: 'Dell',
        it_model: 'XPS 15',
        serial: 'DXPS2023',
        os: 'Windows 11',
        cpu: 'Intel i9',
        ram: '32GB',
        storage: '1TB SSD',
        screen_size: '15.6"',
        etc: 'NVIDIA RTX 3050 Ti 포함',
      },
    }),
    prisma.materials.create({
      data: {
        name: 'Microsoft Surface Pro 9',
        categoryId: categories[3].id,
        locationId: locations[3].id,
        handlerId: testUsers[0].id,
        quantity: 3,
        rfid_tag: 'RFID019',
        assetTypeId: assetTypes[0].id,
        brand: 'Microsoft',
        it_model: 'Surface Pro 9',
        serial: 'SP92023',
        os: 'Windows 11',
        cpu: 'Intel i7',
        ram: '16GB',
        storage: '512GB SSD',
        screen_size: '13"',
        etc: 'Surface Pen 포함',
      },
    }),
    // 추가 음향장비
    prisma.materials.create({
      data: {
        name: 'Rode NT-USB 마이크',
        categoryId: categories[4].id,
        locationId: locations[2].id,
        handlerId: testUsers[0].id,
        quantity: 4,
        rfid_tag: 'RFID020',
        assetTypeId: assetTypes[2].id,
        brand: 'Rode',
        it_model: 'NT-USB',
        serial: 'RD123456',
        etc: 'USB 케이블, 마이크 스탠드 포함',
      },
    }),
    prisma.materials.create({
      data: {
        name: 'Audio-Technica ATH-M50x 헤드폰',
        categoryId: categories[4].id,
        locationId: locations[2].id,
        handlerId: testUsers[0].id,
        quantity: 5,
        rfid_tag: 'RFID021',
        assetTypeId: assetTypes[2].id,
        brand: 'Audio-Technica',
        it_model: 'ATH-M50x',
        serial: 'AT789012',
        etc: '케이스 포함',
      },
    }),
    prisma.materials.create({
      data: {
        name: 'Yamaha MG10XU 믹서',
        categoryId: categories[4].id,
        locationId: locations[2].id,
        handlerId: testUsers[0].id,
        quantity: 2,
        rfid_tag: 'RFID022',
        assetTypeId: assetTypes[2].id,
        brand: 'Yamaha',
        it_model: 'MG10XU',
        serial: 'YM123456',
        etc: 'USB 케이블, 전원 어댑터 포함',
      },
    }),
    prisma.materials.create({
      data: {
        name: 'KRK Rokit 5 G4 모니터 스피커',
        categoryId: categories[4].id,
        locationId: locations[2].id,
        handlerId: testUsers[0].id,
        quantity: 3,
        rfid_tag: 'RFID023',
        assetTypeId: assetTypes[2].id,
        brand: 'KRK',
        it_model: 'Rokit 5 G4',
        serial: 'KRK789012',
        etc: '스피커 스탠드 포함',
      },
    }),
    // 추가 조명장비
    prisma.materials.create({
      data: {
        name: 'Godox SL-200W LED 조명',
        categoryId: categories[5].id,
        locationId: locations[2].id,
        handlerId: testUsers[0].id,
        quantity: 2,
        rfid_tag: 'RFID024',
        assetTypeId: assetTypes[3].id,
        brand: 'Godox',
        it_model: 'SL-200W',
        serial: 'GD345678',
        etc: '소프트박스, 조명 스탠드 포함',
      },
    }),
    prisma.materials.create({
      data: {
        name: 'Aputure MC LED 조명',
        categoryId: categories[5].id,
        locationId: locations[2].id,
        handlerId: testUsers[0].id,
        quantity: 4,
        rfid_tag: 'RFID025',
        assetTypeId: assetTypes[3].id,
        brand: 'Aputure',
        it_model: 'MC',
        serial: 'AP567890',
        etc: '배터리 2개, 충전기 포함',
      },
    }),
    prisma.materials.create({
      data: {
        name: 'Nanlite Forza 300 LED 조명',
        categoryId: categories[5].id,
        locationId: locations[2].id,
        handlerId: testUsers[0].id,
        quantity: 2,
        rfid_tag: 'RFID026',
        assetTypeId: assetTypes[3].id,
        brand: 'Nanlite',
        it_model: 'Forza 300',
        serial: 'NL123456',
        etc: '소프트박스, 조명 스탠드 포함',
      },
    }),
    prisma.materials.create({
      data: {
        name: 'Godox VL300 LED 조명',
        categoryId: categories[5].id,
        locationId: locations[2].id,
        handlerId: testUsers[0].id,
        quantity: 2,
        rfid_tag: 'RFID027',
        assetTypeId: assetTypes[3].id,
        brand: 'Godox',
        it_model: 'VL300',
        serial: 'GD789012',
        etc: '소프트박스, 조명 스탠드 포함',
      },
    }),
    // 추가 의상
    prisma.materials.create({
      data: {
        name: '회색 정장',
        categoryId: categories[0].id,
        locationId: locations[0].id,
        handlerId: testUsers[0].id,
        quantity: 4,
        rfid_tag: 'RFID028',
        size: 'L',
        color: '회색',
      },
    }),
    prisma.materials.create({
      data: {
        name: '네이비 정장',
        categoryId: categories[0].id,
        locationId: locations[0].id,
        handlerId: testUsers[0].id,
        quantity: 3,
        rfid_tag: 'RFID029',
        size: 'M',
        color: '네이비',
      },
    }),
    prisma.materials.create({
      data: {
        name: '검은색 구두',
        categoryId: categories[1].id,
        locationId: locations[1].id,
        handlerId: testUsers[0].id,
        quantity: 6,
        rfid_tag: 'RFID030',
        size: '270',
        color: '검정',
      },
    }),
    prisma.materials.create({
      data: {
        name: '갈색 구두',
        categoryId: categories[1].id,
        locationId: locations[1].id,
        handlerId: testUsers[0].id,
        quantity: 4,
        rfid_tag: 'RFID031',
        size: '260',
        color: '갈색',
      },
    }),
  ]);
  console.log('Created materials');

  // 대여 요청 생성 (모두 대여 중 상태로 생성)
  const rentalRequests = await Promise.all([
    prisma.rentalRequest.create({
      data: {
        materialId: materials[3].id, // Sony A7III 카메라
        userId: testUsers[1].id, // 이방송
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        purpose: '뉴스 촬영',
        request: '메모리카드 포함해주세요',
        arrivalDate: new Date(),
        status: 'ACTIVE', // 바로 대여 중 상태로 설정
      },
    }),
    prisma.rentalRequest.create({
      data: {
        materialId: materials[4].id, // DJI RS3 Pro 짐벌
        userId: testUsers[2].id, // 박카메라
        startDate: new Date(),
        endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        purpose: '인터뷰 촬영',
        request: '배터리 추가로 필요합니다',
        arrivalDate: new Date(),
        status: 'ACTIVE', // 바로 대여 중 상태로 설정
      },
    }),
    prisma.rentalRequest.create({
      data: {
        materialId: materials[5].id, // MacBook Pro
        userId: testUsers[4].id, // 정개발
        startDate: new Date(),
        endDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000),
        purpose: '개발 작업',
        request: '최신 버전으로 준비해주세요',
        arrivalDate: new Date(),
        status: 'ACTIVE', // 바로 대여 중 상태로 설정
      },
    }),
    prisma.rentalRequest.create({
      data: {
        materialId: materials[6].id, // iPad Pro
        userId: testUsers[5].id, // 강시스템
        startDate: new Date(),
        endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        purpose: '시스템 점검',
        request: 'Apple Pencil 필요합니다',
        arrivalDate: new Date(),
        status: 'ACTIVE', // 바로 대여 중 상태로 설정
      },
    }),
    prisma.rentalRequest.create({
      data: {
        materialId: materials[7].id, // Shure SM7B 마이크
        userId: testUsers[6].id, // 윤음향
        startDate: new Date(),
        endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        purpose: '팟캐스트 녹음',
        request: '팝필터 포함해주세요',
        arrivalDate: new Date(),
        status: 'ACTIVE', // 바로 대여 중 상태로 설정
      },
    }),
  ]);
  console.log('Created rental requests');

  // 대여 이력 생성 (모든 대여 요청에 대해)
  const rentals = await Promise.all([
    prisma.rental.create({
      data: {
        materialId: materials[3].id,
        userId: testUsers[1].id,
        status: 'ACTIVE',
        rentDate: new Date(),
        memo: '뉴스 촬영용',
      },
    }),
    prisma.rental.create({
      data: {
        materialId: materials[4].id,
        userId: testUsers[2].id,
        status: 'ACTIVE',
        rentDate: new Date(),
        memo: '인터뷰 촬영용',
      },
    }),
    prisma.rental.create({
      data: {
        materialId: materials[5].id,
        userId: testUsers[4].id,
        status: 'ACTIVE',
        rentDate: new Date(),
        memo: '개발 작업용',
      },
    }),
    prisma.rental.create({
      data: {
        materialId: materials[6].id,
        userId: testUsers[5].id,
        status: 'ACTIVE',
        rentDate: new Date(),
        memo: '시스템 점검용',
      },
    }),
    prisma.rental.create({
      data: {
        materialId: materials[7].id,
        userId: testUsers[6].id,
        status: 'ACTIVE',
        rentDate: new Date(),
        memo: '팟캐스트 녹음용',
      },
    }),
  ]);
  console.log('Created rentals');

  // 반납 내역 생성 (완료된 대여에 대해서만)
  const returns = await Promise.all([
    prisma.return.create({
      data: {
        rentalRequestId: rentalRequests[2].id,
        materialId: materials[5].id,
        returnLocation: 'IT장비실',
        returnDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        status: 'NORMAL',
        statusDescription: '정상 반납',
      },
    }),
    prisma.return.create({
      data: {
        rentalRequestId: rentalRequests[3].id,
        materialId: materials[6].id,
        returnLocation: 'IT장비실',
        returnDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        status: 'NORMAL',
        statusDescription: '정상 반납',
      },
    }),
  ]);
  console.log('Created returns');

  console.log('Seed process completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 
const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed process...');
  
  // 1. 기존 데이터 삭제 (참조 순서 역순)
  console.log('Deleting existing data...');
  await prisma.materialHistory.deleteMany({});
  await prisma.rental.deleteMany({});
  await prisma.materials.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.masterData.deleteMany({});
  console.log('Existing data deleted successfully');

  // 2. 카테고리(Category) 생성
  console.log('Creating categories...');
  const categoryNames = [
    '음향', '믹서', '스피커', '앰프', '이펙터', '무대', '트러스', '무대판', '계단', '일반소모품',
    '의상', '드레스', '수트', '신발', '액세서리', '소품', '가구', '장식', '핸드소품', 'IT',
    '노트북', '데스크탑', '태블릿', '프린터', '조명', '악기', '카메라', '마이크', '케이블', '배터리', '기타',
    'LED월', '조명콘솔', '무선시스템', '방송장비'
  ];
  await prisma.category.createMany({ data: categoryNames.map(name => ({ name })) });
  const categoryRows = await prisma.category.findMany();
  const categoryMap = {};
  categoryRows.forEach(row => { categoryMap[row.name] = row.id; });
  console.log(`Created ${categoryRows.length} categories`);

  // 3. 위치(MasterData) 생성
  console.log('Creating master data...');
  const locationNames = [
    '창고1', '창고2', '사무실', '무대 뒤', '의상실', '소품실', '장비실', '외부보관', '메인홀', '리허설룸'
  ];
  // 3-1. 부서, 역할, 기타 마스터데이터
  const departmentNames = [
    '프로덕션', '관리팀', 'IT팀', '음향팀', '조명팀', '연출팀', '의상팀', '소품팀'
  ];
  const roleNames = [
    '관리자', '담당자', '일반', '게스트', '팀장', '매니저', '실장', '감독'
  ];
  const inoutTypeNames = [
    'IN', 'OUT', '이동', '검품', '수선', '보관', '임시입고', '분실', '폐기', '이관'
  ];
  const assetStatusNames = [
    '정상', '검수중', '수선중', '보관중', '임시보관', '분실신고', '폐기완료', '이관'
  ];
  const userStatusNames = [
    '재직', '휴직', '퇴사', '외부'
  ];
  const alarmTypeNames = [
    '정기점검', '수리필요', '입출고알림', '재고부족', '기타'
  ];
  await prisma.masterData.createMany({
    data: [
      ...locationNames.map(name => ({ type: '위치', name })),
      ...departmentNames.map(name => ({ type: '부서', name })),
      ...roleNames.map(name => ({ type: '역할', name })),
      ...inoutTypeNames.map(name => ({ type: '입출고유형', name })),
      ...assetStatusNames.map(name => ({ type: '자산상태', name })),
      ...userStatusNames.map(name => ({ type: '사용자상태', name })),
      ...alarmTypeNames.map(name => ({ type: '알림유형', name })),
    ]
  });
  const locationRows = await prisma.masterData.findMany({ where: { type: '위치' } });
  const locationMap = {};
  locationRows.forEach(row => { locationMap[row.name] = row.id; });
  console.log(`Created master data entries`);

  // 4. 사용자(User) 생성
  console.log('Creating users...');
  const roles = ['관리자', '담당자', '일반', '게스트', '팀장', '매니저', '실장', '감독'];
  const departments = ['프로덕션', '관리팀', 'IT팀', '음향팀', '조명팀', '연출팀', '의상팀', '소품팀'];
  const celebrityNames = [
    'BTS RM', 'BTS 진', 'BTS 슈가', 'BTS 제이홉', 'BTS 지민', 'BTS 뷔', 'BTS 정국',
    '아이유', '태연', '백현', '수호', '찬열', '디오', '카이', '세훈',
    '지드래곤', '태양', '탑', '대성', '승리',
    '박보검', '송중기', '이민호', '김수현', '박서준', '현빈', '공유', '이종석',
    '수지', '설현', '아이린', '슬기', '조이', '웬디', '예리',
    '정은지', '손나은', '박초롱', '김남주', '윤보미', '오하영',
    '유재석', '강호동', '신동엽', '이경규', '김구라', '박명수', '정형돈', '하하',
    '장도연', '박나래', '이국주', '김숙', '송은이', '안영미',
    '이효리', '엄정화', '보아', '선미', '청하', '화사', '솔라', '문별', '휘인', '쯔위',
    '나연', '정연', '모모', '사나', '미나', '다현', '채영', '쯔위',
    '제니', '지수', '로제', '리사',
    '유나', '리아', '류진', '채령', '예지',
    '장원영', '안유진', '리즈', '가을', '이서',
    '민현', '아론', '백호', 'JR', '렌',
    '강다니엘', '박지훈', '이대휘', '김재환', '옹성우', '박우진', '배진영', '하성운', '윤지성',
    '김세정', '강미나', '최유정', '김도연', '임나영', '유연정', '정채연', '김청하', '최예나',
    '송강', '이도현', '김영대', '차은우', '로운', '서강준', '박형식', '도경수', '이준호', '임시완',
    '한지민', '김태리', '신혜선', '박은빈', '김지원', '서현진', '정유미', '김고은', '수현', '한효주'
  ];
  const users = [];
  for (let i = 1; i <= 120; i++) {
    users.push({
      name: celebrityNames[(i - 1) % celebrityNames.length],
      email: `user${i}@company.com`,
      role: roles[i % roles.length],
      department: departments[i % departments.length],
      phone_number: `010-${(1000 + i).toString().padStart(4, '0')}-${(2000 + i).toString().padStart(4, '0')}`,
      password: '1111'
    });
  }
  await prisma.user.createMany({ data: users });
  const userRows = await prisma.user.findMany();
  const userIds = userRows.map(u => u.id);
  console.log(`Created ${userRows.length} users`);

  // 5. 자산(Materials) 생성
  console.log('Creating materials...');
  const categoriesForMaterial = [
    '음향', '조명', 'IT', '의상', '소품', '가구', '악기', '카메라', '프린터', '배터리', 'LED월', '조명콘솔', '무선시스템', '방송장비'
  ];
  const locationsForMaterial = [
    '창고1', '창고2', '사무실', '무대 뒤', '의상실', '소품실', '장비실', '외부보관', '메인홀', '리허설룸'
  ];
  const materialNames = [
    "무선 마이크", "유선 마이크", "메인 믹서", "서브 믹서",
    "메인 스피커", "모니터 스피커", "파워 앰프", "이펙터",
    "무대 조명", "무빙라이트", "LED 바", "팔로우 스팟",
    "트러스", "무대판", "계단", "소모품 세트",
    "의상 세트1", "의상 세트2", "드레스1", "드레스2",
    "수트1", "수트2", "신발1", "신발2",
    "액세서리1", "액세서리2", "소품1", "소품2",
    "가구1", "가구2", "장식1", "장식2",
    "핸드소품1", "핸드소품2", "IT 노트북", "IT 태블릿",
    "프린터", "카메라", "마이크 케이블", "배터리",
    // 엔터테인먼트 실 자산 예시 추가
    "콘서트용 LED 월", "방송용 카메라", "조명 콘솔", "무선 인이어 시스템", "드럼 세트", "베이스 기타", "일렉 기타", "키보드 신디사이저", "댄스 의상 세트", "공연용 헤드셋 마이크", "스모그 머신", "레이저 조명", "이동식 무대", "방송용 믹서", "무대 커튼", "프로젝터", "이동식 스크린", "방송용 삼각대", "조명 스탠드", "무대 트러스", "공연용 스피커", "무대 모니터", "방송용 인이어 리시버", "무대용 무선 송수신기", "공연용 조명 제어기", "무대용 케이블 세트", "공연용 의상 세트", "방송용 조명 세트", "공연용 마이크 스탠드", "무대용 장식 소품"
  ];
  let skipped = 0;
  const materials = [];
  for (let i = 0; i < 130; i++) {
    const categoryId = categoryMap[categoriesForMaterial[i % categoriesForMaterial.length]];
    const locationId = locationMap[locationsForMaterial[i % locationsForMaterial.length]];
    const handlerId = userIds[i % userIds.length];
    if (!categoryId || !locationId || !handlerId) {
      skipped++;
      continue;
    }
    materials.push({
      name: materialNames[i % materialNames.length],
      categoryId,
      quantity: (i % 20) + 1,
      locationId,
      handlerId,
      rfid_tag: `RFID${String(i + 1).padStart(3, "0")}`
    });
  }
  await prisma.materials.createMany({ data: materials });
  console.log(`Created ${materials.length} materials, SKIPPED: ${skipped}`);

  // 6. 입출고 이력 생성
  console.log('Creating material histories...');
  const materialRows = await prisma.materials.findMany({ select: { id: true } });
  const materialIds = materialRows.map(m => m.id);
  const histories = [];
  for (let i = 0; i < 20; i++) {
    const materialId = materialIds[i % materialIds.length];
    if (!materialId) continue;
    histories.push({
      materialId,
      type: i % 3 === 0 ? 'IN' : (i % 3 === 1 ? 'OUT' : '이동'),
      quantity: Math.floor(Math.random() * 10) + 1,
      handlerId: userIds[i % userIds.length],
      memo: `테스트 이력 ${i + 1}`,
      date: new Date(Date.now() - i * 86400000),
    });
  }
  await prisma.materialHistory.createMany({ data: histories });
  console.log(`Created ${histories.length} material histories`);

  console.log('Seed process completed successfully!');
}

main()
  .catch(e => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(() => {
    console.log('Disconnecting from database...');
    prisma.$disconnect();
  }); 
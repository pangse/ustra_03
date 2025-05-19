const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed process...');
  
  // 1. 기존 데이터 삭제 (참조 순서 역순)
  console.log('Deleting existing data...');
  await prisma.rfidHistory.deleteMany({});
  await prisma.materialHistory.deleteMany({});
  await prisma.return.deleteMany({});
  await prisma.rental.deleteMany({});
  await prisma.rentalRequest.deleteMany({});
  await prisma.rfidTag.deleteMany({});
  await prisma.materials.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.masterData.deleteMany({});
  await prisma.assetType.deleteMany({});
  console.log('Existing data deleted successfully');

  // 2. 마스터 데이터 생성
  console.log('Creating master data...');
  
  // 위치 데이터 생성
  console.log('Creating location master data...');
  const locations = await Promise.all([
    prisma.masterData.create({
      data: { 
        type: '위치',
        name: 'IT장비실',
        description: 'IT 장비 보관실'
      }
    }),
    prisma.masterData.create({
      data: { 
        type: '위치',
        name: '방송장비실',
        description: '방송 장비 보관실'
      }
    }),
    prisma.masterData.create({
      data: { 
        type: '위치',
        name: '음향장비실',
        description: '음향 장비 보관실'
      }
    }),
    prisma.masterData.create({
      data: { 
        type: '위치',
        name: '음악실',
        description: '음악 장비 보관실'
      }
    }),
    prisma.masterData.create({
      data: { 
        type: '위치',
        name: '조명장비실',
        description: '조명 장비 보관실'
      }
    }),
    prisma.masterData.create({
      data: { 
        type: '위치',
        name: '의상실',
        description: '의상 보관실'
      }
    }),
    prisma.masterData.create({
      data: { 
        type: '위치',
        name: '소품실',
        description: '소품 보관실'
      }
    }),
    prisma.masterData.create({
      data: { 
        type: '위치',
        name: '무대실',
        description: '무대 장비 보관실'
      }
    }),
    prisma.masterData.create({
      data: { 
        type: '위치',
        name: '연습실',
        description: '연습 장비 보관실'
      }
    }),
    prisma.masterData.create({
      data: { 
        type: '위치',
        name: '보관창고',
        description: '일반 보관 창고'
      }
    }),
    prisma.masterData.create({
      data: { 
        type: '위치',
        name: '임시보관실',
        description: '임시 보관 공간'
      }
    }),
    prisma.masterData.create({
      data: { 
        type: '위치',
        name: '수리실',
        description: '장비 수리 공간'
      }
    })
  ]);
  console.log(`Created ${locations.length} location entries`);

  // 부서 데이터 생성
  console.log('Creating department master data...');
  const departments = await Promise.all([
    prisma.masterData.create({
      data: { 
        type: '부서',
        name: '프로덕션',
        description: '프로덕션 총괄'
      }
    }),
    prisma.masterData.create({
      data: { 
        type: '부서',
        name: '관리팀',
        description: '시스템 관리'
      }
    }),
    prisma.masterData.create({
      data: { 
        type: '부서',
        name: 'IT팀',
        description: 'IT 시스템 운영'
      }
    }),
    prisma.masterData.create({
      data: { 
        type: '부서',
        name: '방송팀',
        description: '방송 제작'
      }
    }),
    prisma.masterData.create({
      data: { 
        type: '부서',
        name: '음향팀',
        description: '음향 시스템 운영'
      }
    }),
    prisma.masterData.create({
      data: { 
        type: '부서',
        name: '조명팀',
        description: '조명 시스템 운영'
      }
    }),
    prisma.masterData.create({
      data: { 
        type: '부서',
        name: '의상팀',
        description: '의상 관리'
      }
    }),
    prisma.masterData.create({
      data: { 
        type: '부서',
        name: '소품팀',
        description: '소품 관리'
      }
    }),
    prisma.masterData.create({
      data: { 
        type: '부서',
        name: '무대팀',
        description: '무대 운영'
      }
    }),
    prisma.masterData.create({
      data: { 
        type: '부서',
        name: '기획팀',
        description: '프로그램 기획'
      }
    }),
    prisma.masterData.create({
      data: { 
        type: '부서',
        name: '편집팀',
        description: '영상 편집'
      }
    }),
    prisma.masterData.create({
      data: { 
        type: '부서',
        name: '기술팀',
        description: '기술 지원'
      }
    })
  ]);
  console.log(`Created ${departments.length} department entries`);

  // 역할 데이터 생성
  console.log('Creating role master data...');
  const roles = await Promise.all([
    prisma.masterData.create({
      data: { 
        type: '역할',
        name: '관리자',
        description: '시스템 관리자'
      }
    }),
    prisma.masterData.create({
      data: { 
        type: '역할',
        name: '담당자',
        description: '장비 담당자'
      }
    }),
    prisma.masterData.create({
      data: { 
        type: '역할',
        name: '일반',
        description: '일반 사용자'
      }
    }),
    prisma.masterData.create({
      data: { 
        type: '역할',
        name: '팀장',
        description: '팀 관리자'
      }
    }),
    prisma.masterData.create({
      data: { 
        type: '역할',
        name: '매니저',
        description: '프로젝트 매니저'
      }
    }),
    prisma.masterData.create({
      data: { 
        type: '역할',
        name: '실장',
        description: '실무 책임자'
      }
    }),
    prisma.masterData.create({
      data: { 
        type: '역할',
        name: '감독',
        description: '프로덕션 감독'
      }
    }),
    prisma.masterData.create({
      data: { 
        type: '역할',
        name: '수퍼바이저',
        description: '기술 감독'
      }
    }),
    prisma.masterData.create({
      data: { 
        type: '역할',
        name: '코디네이터',
        description: '업무 조율자'
      }
    }),
    prisma.masterData.create({
      data: { 
        type: '역할',
        name: '어시스턴트',
        description: '보조 담당자'
      }
    }),
    prisma.masterData.create({
      data: { 
        type: '역할',
        name: '인턴',
        description: '인턴십'
      }
    }),
    prisma.masterData.create({
      data: { 
        type: '역할',
        name: '외부협력자',
        description: '외부 협력자'
      }
    })
  ]);
  console.log(`Created ${roles.length} role entries`);

  // 자산상태 데이터 생성
  console.log('Creating asset status master data...');
  const assetStatuses = await Promise.all([
    prisma.masterData.create({
      data: { 
        type: '자산상태',
        name: '정상',
        description: '정상 사용 가능'
      }
    }),
    prisma.masterData.create({
      data: { 
        type: '자산상태',
        name: '검수중',
        description: '검수 진행 중'
      }
    }),
    prisma.masterData.create({
      data: { 
        type: '자산상태',
        name: '수선중',
        description: '수리 진행 중'
      }
    }),
    prisma.masterData.create({
      data: { 
        type: '자산상태',
        name: '보관중',
        description: '보관 상태'
      }
    }),
    prisma.masterData.create({
      data: { 
        type: '자산상태',
        name: '임시보관',
        description: '임시 보관 상태'
      }
    }),
    prisma.masterData.create({
      data: { 
        type: '자산상태',
        name: '분실신고',
        description: '분실 신고됨'
      }
    }),
    prisma.masterData.create({
      data: { 
        type: '자산상태',
        name: '폐기완료',
        description: '폐기 처리됨'
      }
    }),
    prisma.masterData.create({
      data: { 
        type: '자산상태',
        name: '이관',
        description: '다른 위치로 이관'
      }
    }),
    prisma.masterData.create({
      data: { 
        type: '자산상태',
        name: '대여중',
        description: '현재 대여 중'
      }
    }),
    prisma.masterData.create({
      data: { 
        type: '자산상태',
        name: '예약중',
        description: '대여 예약됨'
      }
    }),
    prisma.masterData.create({
      data: { 
        type: '자산상태',
        name: '점검중',
        description: '정기 점검 중'
      }
    }),
    prisma.masterData.create({
      data: { 
        type: '자산상태',
        name: '교체예정',
        description: '교체 예정'
      }
    })
  ]);
  console.log(`Created ${assetStatuses.length} asset status entries`);

  // 사용자상태 데이터 생성
  console.log('Creating user status master data...');
  const userStatuses = await Promise.all([
    prisma.masterData.create({
      data: { 
        type: '사용자상태',
        name: '재직',
        description: '현재 재직 중'
      }
    }),
    prisma.masterData.create({
      data: { 
        type: '사용자상태',
        name: '휴직',
        description: '휴직 중'
      }
    }),
    prisma.masterData.create({
      data: { 
        type: '사용자상태',
        name: '퇴사',
        description: '퇴사 처리됨'
      }
    }),
    prisma.masterData.create({
      data: { 
        type: '사용자상태',
        name: '외부',
        description: '외부 협력자'
      }
    }),
    prisma.masterData.create({
      data: { 
        type: '사용자상태',
        name: '인턴',
        description: '인턴십 중'
      }
    }),
    prisma.masterData.create({
      data: { 
        type: '사용자상태',
        name: '계약직',
        description: '계약직 근무'
      }
    }),
    prisma.masterData.create({
      data: { 
        type: '사용자상태',
        name: '파견',
        description: '파견 근무 중'
      }
    }),
    prisma.masterData.create({
      data: { 
        type: '사용자상태',
        name: '교육중',
        description: '교육 참여 중'
      }
    }),
    prisma.masterData.create({
      data: { 
        type: '사용자상태',
        name: '휴가중',
        description: '휴가 사용 중'
      }
    }),
    prisma.masterData.create({
      data: { 
        type: '사용자상태',
        name: '출장중',
        description: '출장 중'
      }
    }),
    prisma.masterData.create({
      data: { 
        type: '사용자상태',
        name: '병가',
        description: '병가 중'
      }
    }),
    prisma.masterData.create({
      data: { 
        type: '사용자상태',
        name: '훈련중',
        description: '직무 훈련 중'
      }
    })
  ]);
  console.log(`Created ${userStatuses.length} user status entries`);

  console.log('Master data creation completed');

  // 3. 자산 유형(AssetType) 생성
  console.log('Creating asset types...');
  const assetTypes = await Promise.all([
    // IT 장비 유형
    prisma.assetType.create({
      data: {
        typeCode: 'IT_COMPUTER',
        name: '컴퓨터',
        description: '데스크탑, 노트북, 워크스테이션 등 컴퓨터 장비',
      },
    }),
    prisma.assetType.create({
      data: {
        typeCode: 'IT_NETWORK',
        name: '네트워크',
        description: '라우터, 스위치, 서버 등 네트워크 장비',
      },
    }),
    prisma.assetType.create({
      data: {
        typeCode: 'IT_MOBILE',
        name: '모바일',
        description: '태블릿, 스마트폰 등 모바일 장비',
      },
    }),
    prisma.assetType.create({
      data: {
        typeCode: 'IT_PERIPHERAL',
        name: '주변장치',
        description: '프린터, 스캐너, 모니터 등 주변장치',
      },
    }),
    prisma.assetType.create({
      data: {
        typeCode: 'IT_STORAGE',
        name: '저장장치',
        description: '외장하드, NAS, USB 등 저장장치',
      },
    }),
    prisma.assetType.create({
      data: {
        typeCode: 'IT_SERVER',
        name: '서버',
        description: '서버 장비, 랙마운트 서버 등',
      },
    }),
    prisma.assetType.create({
      data: {
        typeCode: 'IT_SECURITY',
        name: '보안장비',
        description: '방화벽, 보안장비 등',
      },
    }),

    // 방송 장비 유형
    prisma.assetType.create({
      data: {
        typeCode: 'BROADCAST_CAMERA',
        name: '카메라',
        description: '방송용 카메라, 캠코더 등 촬영 장비',
      },
    }),
    prisma.assetType.create({
      data: {
        typeCode: 'BROADCAST_LENS',
        name: '렌즈',
        description: '카메라 렌즈, 어댑터 등',
      },
    }),
    prisma.assetType.create({
      data: {
        typeCode: 'BROADCAST_DRONE',
        name: '드론',
        description: '촬영용 드론, 짐벌 등',
      },
    }),
    prisma.assetType.create({
      data: {
        typeCode: 'BROADCAST_MONITOR',
        name: '모니터링',
        description: '필드 모니터, 뷰파인더 등',
      },
    }),
    prisma.assetType.create({
      data: {
        typeCode: 'BROADCAST_ACCESSORY',
        name: '부가장비',
        description: '카메라 액세서리, 배터리 등',
      },
    }),
    prisma.assetType.create({
      data: {
        typeCode: 'BROADCAST_LIGHT',
        name: '촬영조명',
        description: '촬영용 조명장비',
      },
    }),
    prisma.assetType.create({
      data: {
        typeCode: 'BROADCAST_AUDIO',
        name: '촬영음향',
        description: '촬영용 마이크, 오디오 장비',
      },
    }),

    // 음향 장비 유형
    prisma.assetType.create({
      data: {
        typeCode: 'AUDIO_MIC',
        name: '마이크',
        description: '다양한 종류의 마이크 및 액세서리',
      },
    }),
    prisma.assetType.create({
      data: {
        typeCode: 'AUDIO_MIXER',
        name: '믹서',
        description: '오디오 믹서, 콘솔 등',
      },
    }),
    prisma.assetType.create({
      data: {
        typeCode: 'AUDIO_SPEAKER',
        name: '스피커',
        description: '스피커, 모니터, PA 시스템 등',
      },
    }),
    prisma.assetType.create({
      data: {
        typeCode: 'AUDIO_INTERFACE',
        name: '인터페이스',
        description: '오디오 인터페이스, 컨버터 등',
      },
    }),
    prisma.assetType.create({
      data: {
        typeCode: 'AUDIO_PROCESSOR',
        name: '프로세서',
        description: '이펙터, 프로세서, 컴프레서 등',
      },
    }),
    prisma.assetType.create({
      data: {
        typeCode: 'AUDIO_WIRELESS',
        name: '무선장비',
        description: '무선 마이크, 이어모니터 등',
      },
    }),
    prisma.assetType.create({
      data: {
        typeCode: 'AUDIO_RECORDER',
        name: '녹음장비',
        description: '녹음기, 멀티트랙 레코더 등',
      },
    }),

    // 조명 장비 유형
    prisma.assetType.create({
      data: {
        typeCode: 'LIGHT_LED',
        name: 'LED조명',
        description: 'LED 조명, 패널 등',
      },
    }),
    prisma.assetType.create({
      data: {
        typeCode: 'LIGHT_STUDIO',
        name: '스튜디오조명',
        description: '스튜디오 조명, 스트로보 등',
      },
    }),
    prisma.assetType.create({
      data: {
        typeCode: 'LIGHT_CONTROL',
        name: '조명제어',
        description: '조명 콘솔, 디머 등',
      },
    }),
    prisma.assetType.create({
      data: {
        typeCode: 'LIGHT_ACCESSORY',
        name: '조명부가장비',
        description: '소프트박스, 반사판 등',
      },
    }),
    prisma.assetType.create({
      data: {
        typeCode: 'LIGHT_STAND',
        name: '조명스탠드',
        description: '조명 스탠드, 마운트 등',
      },
    }),
    prisma.assetType.create({
      data: {
        typeCode: 'LIGHT_EFFECT',
        name: '효과조명',
        description: '효과 조명, 무대 조명 등',
      },
    }),
    prisma.assetType.create({
      data: {
        typeCode: 'LIGHT_POWER',
        name: '전원장비',
        description: '조명 전원, 디머팩 등',
      },
    }),

    // 의상 유형
    prisma.assetType.create({
      data: {
        typeCode: 'COSTUME_TOP',
        name: '상의',
        description: '상의류 의상',
      },
    }),
    prisma.assetType.create({
      data: {
        typeCode: 'COSTUME_BOTTOM',
        name: '하의',
        description: '하의류 의상',
      },
    }),
    prisma.assetType.create({
      data: {
        typeCode: 'COSTUME_OUTER',
        name: '외투',
        description: '외투류 의상',
      },
    }),
    prisma.assetType.create({
      data: {
        typeCode: 'COSTUME_SHOES',
        name: '신발',
        description: '신발류',
      },
    }),
    prisma.assetType.create({
      data: {
        typeCode: 'COSTUME_ACCESSORY',
        name: '의상소품',
        description: '의상 액세서리, 장신구 등',
      },
    }),
    prisma.assetType.create({
      data: {
        typeCode: 'COSTUME_UNIFORM',
        name: '유니폼',
        description: '제복, 유니폼 등',
      },
    }),
    prisma.assetType.create({
      data: {
        typeCode: 'COSTUME_PERFORMANCE',
        name: '공연의상',
        description: '공연용 의상, 무대의상 등',
      },
    }),

    // 소품 유형
    prisma.assetType.create({
      data: {
        typeCode: 'PROP_FURNITURE',
        name: '가구',
        description: '의자, 테이블, 소파 등 가구류',
      },
    }),
    prisma.assetType.create({
      data: {
        typeCode: 'PROP_DECORATION',
        name: '장식',
        description: '장식품, 소품 등',
      },
    }),
    prisma.assetType.create({
      data: {
        typeCode: 'PROP_ELECTRIC',
        name: '전기소품',
        description: '전기 소품, 조명 소품 등',
      },
    }),
    prisma.assetType.create({
      data: {
        typeCode: 'PROP_SAFETY',
        name: '안전장비',
        description: '안전 장비, 보호장비 등',
      },
    }),
    prisma.assetType.create({
      data: {
        typeCode: 'PROP_TOOL',
        name: '공구',
        description: '공구류, 도구 등',
      },
    }),
    prisma.assetType.create({
      data: {
        typeCode: 'PROP_STAGE',
        name: '무대소품',
        description: '무대 소품, 세트 소품 등',
      },
    }),
    prisma.assetType.create({
      data: {
        typeCode: 'PROP_SPECIAL',
        name: '특수소품',
        description: '특수 효과 소품, 특수 장비 등',
      },
    }),

    // 추가 IT 장비 유형
    prisma.assetType.create({
      data: {
        typeCode: 'IT_DISPLAY',
        name: '디스플레이',
        description: '대형 디스플레이, 프로젝터 등',
      },
    }),
    prisma.assetType.create({
      data: {
        typeCode: 'IT_CONFERENCING',
        name: '화상회의',
        description: '화상회의 시스템, 카메라 등',
      },
    }),
    prisma.assetType.create({
      data: {
        typeCode: 'IT_ACCESSORY',
        name: 'IT부가장비',
        description: '케이블, 어댑터, 충전기 등',
      },
    }),

    // 추가 방송 장비 유형
    prisma.assetType.create({
      data: {
        typeCode: 'BROADCAST_TRANSMISSION',
        name: '전송장비',
        description: '방송 전송 장비, 인코더 등',
      },
    }),
    prisma.assetType.create({
      data: {
        typeCode: 'BROADCAST_RECORDING',
        name: '녹화장비',
        description: '녹화 장비, 레코더 등',
      },
    }),
    prisma.assetType.create({
      data: {
        typeCode: 'BROADCAST_SPECIAL',
        name: '특수촬영',
        description: '특수 촬영 장비, 고속카메라 등',
      },
    }),

    // 추가 음향 장비 유형
    prisma.assetType.create({
      data: {
        typeCode: 'AUDIO_AMPLIFIER',
        name: '앰프',
        description: '오디오 앰프, 파워앰프 등',
      },
    }),
    prisma.assetType.create({
      data: {
        typeCode: 'AUDIO_MONITOR',
        name: '모니터링',
        description: '모니터링 시스템, 이어폰 등',
      },
    }),
    prisma.assetType.create({
      data: {
        typeCode: 'AUDIO_SPECIAL',
        name: '특수음향',
        description: '특수 음향 장비, 효과음 장비 등',
      },
    }),

    // 추가 조명 장비 유형
    prisma.assetType.create({
      data: {
        typeCode: 'LIGHT_SPECIAL',
        name: '특수조명',
        description: '특수 조명, 레이저 등',
      },
    }),
    prisma.assetType.create({
      data: {
        typeCode: 'LIGHT_MOVING',
        name: '무빙라이트',
        description: '무빙라이트, 스캐너 등',
      },
    }),
    prisma.assetType.create({
      data: {
        typeCode: 'LIGHT_ARCHITECTURAL',
        name: '건축조명',
        description: '건축 조명, 외부 조명 등',
      },
    }),
  ]);
  console.log('Created asset types:', assetTypes.length);

  // 4. 카테고리(Category) 생성
  console.log('Creating categories...');
  const categories = await Promise.all([
    // IT 장비 카테고리
    prisma.category.create({
      data: {
        name: '컴퓨터',
        description: '데스크탑, 노트북 등',
        assetTypeId: assetTypes.find(type => type.typeCode === 'IT_COMPUTER')?.id,
      },
    }),
    prisma.category.create({
      data: {
        name: '네트워크 장비',
        description: '라우터, 스위치 등',
        assetTypeId: assetTypes.find(type => type.typeCode === 'IT_NETWORK')?.id,
      },
    }),
    // 방송 장비 카테고리
    prisma.category.create({
      data: {
        name: '카메라',
        description: '촬영용 카메라',
        assetTypeId: assetTypes.find(type => type.typeCode === 'BROADCAST_CAMERA')?.id,
      },
    }),
    // 오디오 장비 카테고리
    prisma.category.create({
      data: {
        name: '마이크',
        description: '마이크 시스템',
        assetTypeId: assetTypes.find(type => type.typeCode === 'AUDIO_MIC')?.id,
      },
    }),
    // 조명 장비 카테고리
    prisma.category.create({
      data: {
        name: 'LED조명',
        description: 'LED 조명 장비',
        assetTypeId: assetTypes.find(type => type.typeCode === 'LIGHT_LED')?.id,
      },
    }),
    // 의상 카테고리
    prisma.category.create({
      data: {
        name: '정장',
        description: '정장류',
        assetTypeId: assetTypes.find(type => type.typeCode === 'COSTUME_TOP')?.id,
      },
    }),
    // 소품 카테고리
    prisma.category.create({
      data: {
        name: '가구',
        description: '무대 가구',
        assetTypeId: assetTypes.find(type => type.typeCode === 'PROP_FURNITURE')?.id,
      },
    }),
  ]);
  console.log(`Created ${categories.length} categories`);

  // 5. 사용자(User) 생성
  console.log('Creating users...');
  const testUsers = [];
  
  // 김관리 upsert
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: '김관리',
      email: 'admin@example.com',
      role: roles.find(r => r.name === '관리자')?.name,
      department: departments.find(d => d.name === '관리팀')?.name,
      phone_number: '010-1234-5678',
      password: '1111'
    }
  });
  testUsers.push(adminUser);

  // IT팀
  const itTeamLead = await prisma.user.create({
    data: {
      name: '이IT',
      email: 'it@example.com',
      role: roles.find(r => r.name === '팀장')?.name,
      department: departments.find(d => d.name === 'IT팀')?.name,
      phone_number: '010-2345-6789',
      password: '1111'
    },
  });
  testUsers.push(itTeamLead);

  const itDev = await prisma.user.create({
    data: {
      name: '박개발',
      email: 'dev@example.com',
      role: roles.find(r => r.name === '담당자')?.name,
      department: departments.find(d => d.name === 'IT팀')?.name,
      phone_number: '010-3456-7890',
      password: '1111'
    },
  });
  testUsers.push(itDev);

  // 방송팀
  const broadcastLead = await prisma.user.create({
    data: {
      name: '최방송',
      email: 'broadcast@example.com',
      role: roles.find(r => r.name === '팀장')?.name,
      department: departments.find(d => d.name === '방송팀')?.name,
      phone_number: '010-4567-8901',
      password: '1111'
    },
  });
  testUsers.push(broadcastLead);

  const cameraManager = await prisma.user.create({
    data: {
      name: '정카메라',
      email: 'camera@example.com',
      role: roles.find(r => r.name === '담당자')?.name,
      department: departments.find(d => d.name === '방송팀')?.name,
      phone_number: '010-5678-9012',
      password: '1111'
    },
  });
  testUsers.push(cameraManager);

  // 음향팀
  const audioLead = await prisma.user.create({
    data: {
      name: '강음향',
      email: 'audio@example.com',
      role: roles.find(r => r.name === '팀장')?.name,
      department: departments.find(d => d.name === '음향팀')?.name,
      phone_number: '010-6789-0123',
      password: '1111'
    },
  });
  testUsers.push(audioLead);

  const mixerManager = await prisma.user.create({
    data: {
      name: '윤믹서',
      email: 'mixer@example.com',
      role: roles.find(r => r.name === '담당자')?.name,
      department: departments.find(d => d.name === '음향팀')?.name,
      phone_number: '010-7890-1234',
      password: '1111'
    },
  });
  testUsers.push(mixerManager);

  // 조명팀
  const lightLead = await prisma.user.create({
    data: {
      name: '임조명',
      email: 'light@example.com',
      role: roles.find(r => r.name === '팀장')?.name,
      department: departments.find(d => d.name === '조명팀')?.name,
      phone_number: '010-8901-2345',
      password: '1111'
    },
  });
  testUsers.push(lightLead);

  const lightManager = await prisma.user.create({
    data: {
      name: '한라이트',
      email: 'light2@example.com',
      role: roles.find(r => r.name === '담당자')?.name,
      department: departments.find(d => d.name === '조명팀')?.name,
      phone_number: '010-9012-3456',
      password: '1111'
    },
  });
  testUsers.push(lightManager);

  // 의상팀
  const costumeLead = await prisma.user.create({
    data: {
      name: '서의상',
      email: 'costume@example.com',
      role: roles.find(r => r.name === '팀장')?.name,
      department: departments.find(d => d.name === '의상팀')?.name,
      phone_number: '010-0123-4567',
      password: '1111'
    },
  });
  testUsers.push(costumeLead);

  const styleManager = await prisma.user.create({
    data: {
      name: '신스타일',
      email: 'style@example.com',
      role: roles.find(r => r.name === '담당자')?.name,
      department: departments.find(d => d.name === '의상팀')?.name,
      phone_number: '010-1234-5679',
      password: '1111'
    },
  });
  testUsers.push(styleManager);

  // 소품팀
  const propLead = await prisma.user.create({
    data: {
      name: '장소품',
      email: 'prop@example.com',
      role: roles.find(r => r.name === '팀장')?.name,
      department: departments.find(d => d.name === '소품팀')?.name,
      phone_number: '010-2345-6780',
      password: '1111'
    },
  });
  testUsers.push(propLead);

  const designManager = await prisma.user.create({
    data: {
      name: '전디자인',
      email: 'design@example.com',
      role: roles.find(r => r.name === '담당자')?.name,
      department: departments.find(d => d.name === '소품팀')?.name,
      phone_number: '010-3456-7891',
      password: '1111'
    },
  });
  testUsers.push(designManager);

  console.log(`Created ${testUsers.length} test users`);

  // 6. 자산(Materials) 및 RFID 태그 생성
  console.log('Creating materials and RFID tags...');
  const materialSeedData = [
    {
      name: 'MacBook Pro 16"',
      categoryName: '컴퓨터',
      locationId: locations[0].id,
      handlerId: testUsers[1].id,
      quantity: 100,
      rfid_tag: 'RFID001',
      status: assetStatuses.find(s => s.name === '정상')?.name,
      assetTypeCode: 'IT_COMPUTER',
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
    {
      name: 'MacBook Air M2',
      categoryName: '컴퓨터',
      locationId: locations[0].id,
      handlerId: testUsers[1].id,
      quantity: 100,
      rfid_tag: 'RFID002',
      status: assetStatuses.find(s => s.name === '정상')?.name,
      assetTypeCode: 'IT_COMPUTER',
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
    {
      name: 'iPad Pro 12.9"',
      categoryName: '컴퓨터',
      locationId: locations[0].id,
      handlerId: testUsers[1].id,
      quantity: 100,
      rfid_tag: 'RFID003',
      status: assetStatuses.find(s => s.name === '정상')?.name,
      assetTypeCode: 'IT_MOBILE',
      brand: 'Apple',
      it_model: 'iPad Pro 12.9"',
      serial: 'IPAD2023',
      os: 'iPadOS',
      storage: '256GB',
      screen_size: '12.9"',
      etc: 'Apple Pencil 2세대 포함',
    },
    {
      name: 'Sony A7III 카메라',
      categoryName: '카메라',
      locationId: locations[1].id,
      handlerId: testUsers[3].id,
      quantity: 100,
      rfid_tag: 'RFID004',
      status: assetStatuses.find(s => s.name === '정상')?.name,
      assetTypeCode: 'BROADCAST_CAMERA',
      brand: 'Sony',
      it_model: 'A7III',
      serial: 'SN123456',
      resolution: '4K',
      etc: '24-70mm 렌즈 포함',
    },
    {
      name: 'DJI RS3 Pro 짐벌',
      categoryName: '카메라',
      locationId: locations[1].id,
      handlerId: testUsers[3].id,
      quantity: 100,
      rfid_tag: 'RFID005',
      status: assetStatuses.find(s => s.name === '정상')?.name,
      assetTypeCode: 'BROADCAST_ACCESSORY',
      brand: 'DJI',
      it_model: 'RS3 Pro',
      serial: 'DJI789012',
      etc: '배터리 2개 포함',
    },
    {
      name: 'DJI Mini 3 Pro 드론',
      categoryName: '카메라',
      locationId: locations[1].id,
      handlerId: testUsers[3].id,
      quantity: 100,
      rfid_tag: 'RFID006',
      status: assetStatuses.find(s => s.name === '정상')?.name,
      assetTypeCode: 'BROADCAST_DRONE',
      brand: 'DJI',
      it_model: 'Mini 3 Pro',
      serial: 'DJI345678',
      etc: '배터리 3개, 충전기 포함',
    },
    {
      name: 'Shure SM7B 마이크',
      categoryName: '마이크',
      locationId: locations[2].id,
      handlerId: testUsers[5].id,
      quantity: 100,
      rfid_tag: 'RFID007',
      status: assetStatuses.find(s => s.name === '정상')?.name,
      assetTypeCode: 'AUDIO_MIC',
      brand: 'Shure',
      it_model: 'SM7B',
      serial: 'SH789012',
      etc: '마이크 스탠드 포함',
    },
    {
      name: 'Yamaha MG10XU 믹서',
      categoryName: '마이크',
      locationId: locations[2].id,
      handlerId: testUsers[5].id,
      quantity: 100,
      rfid_tag: 'RFID008',
      status: assetStatuses.find(s => s.name === '정상')?.name,
      assetTypeCode: 'AUDIO_MIXER',
      brand: 'Yamaha',
      it_model: 'MG10XU',
      serial: 'YM123456',
      etc: 'USB 케이블, 전원 어댑터 포함',
    },
    {
      name: 'KRK Rokit 5 G4 모니터 스피커',
      categoryName: '마이크',
      locationId: locations[2].id,
      handlerId: testUsers[5].id,
      quantity: 100,
      rfid_tag: 'RFID009',
      status: assetStatuses.find(s => s.name === '정상')?.name,
      assetTypeCode: 'AUDIO_SPEAKER',
      brand: 'KRK',
      it_model: 'Rokit 5 G4',
      serial: 'KRK789012',
      etc: '스피커 스탠드 포함',
    },
    {
      name: 'Aputure 300D Mark II LED 조명',
      categoryName: 'LED조명',
      locationId: locations[3].id,
      handlerId: testUsers[7].id,
      quantity: 100,
      rfid_tag: 'RFID010',
      status: assetStatuses.find(s => s.name === '정상')?.name,
      assetTypeCode: 'LIGHT_LED',
      brand: 'Aputure',
      it_model: '300D Mark II',
      serial: 'AP123456',
      etc: '소프트박스 포함',
    },
    {
      name: 'Godox SL-60W LED 조명',
      categoryName: 'LED조명',
      locationId: locations[3].id,
      handlerId: testUsers[7].id,
      quantity: 100,
      rfid_tag: 'RFID011',
      status: assetStatuses.find(s => s.name === '정상')?.name,
      assetTypeCode: 'LIGHT_LED',
      brand: 'Godox',
      it_model: 'SL-60W',
      serial: 'GD789012',
      etc: '조명 스탠드 포함',
    },
    {
      name: '검은색 정장',
      categoryName: '정장',
      locationId: locations[4].id,
      handlerId: testUsers[9].id,
      quantity: 100,
      rfid_tag: 'RFID012',
      status: assetStatuses.find(s => s.name === '정상')?.name,
      assetTypeCode: 'COSTUME_TOP',
      size: 'L',
      color: '검정',
    },
    {
      name: '흰색 셔츠',
      categoryName: '정장',
      locationId: locations[4].id,
      handlerId: testUsers[9].id,
      quantity: 100,
      rfid_tag: 'RFID013',
      status: assetStatuses.find(s => s.name === '정상')?.name,
      assetTypeCode: 'COSTUME_TOP',
      size: 'M',
      color: '흰색',
    },
    {
      name: '검은색 구두',
      categoryName: '신발',
      locationId: locations[4].id,
      handlerId: testUsers[9].id,
      quantity: 100,
      rfid_tag: 'RFID014',
      status: assetStatuses.find(s => s.name === '정상')?.name,
      assetTypeCode: 'COSTUME_SHOES',
      size: '270',
      color: '검정',
    },
    {
      name: '무대 의자',
      categoryName: '가구',
      locationId: locations[5].id,
      handlerId: testUsers[11].id,
      quantity: 100,
      rfid_tag: 'RFID015',
      status: assetStatuses.find(s => s.name === '정상')?.name,
      assetTypeCode: 'PROP_FURNITURE',
      etc: '접이식 의자',
    },
    {
      name: '무대 테이블',
      categoryName: '가구',
      locationId: locations[5].id,
      handlerId: testUsers[11].id,
      quantity: 100,
      rfid_tag: 'RFID016',
      status: assetStatuses.find(s => s.name === '정상')?.name,
      assetTypeCode: 'PROP_FURNITURE',
      etc: '접이식 테이블',
    },
  ];

  // materialSeedData만 사용하여 자산 및 RFID 태그 생성
  const materials = [];
  const rfidTags = [];
  for (let idx = 0; idx < materialSeedData.length; idx++) {
    const data = materialSeedData[idx];
    const serialValue = data.serial ? `${data.serial}-${idx+1}` : `AUTO-SERIAL-${idx+1}`;
    const rfidTagValue = data.rfid_tag ? `${data.rfid_tag}-${idx+1}` : `RFID-TAG-${idx+1}`;
    const macAddressValue = data.mac_address ? `${data.mac_address}-${idx+1}` : `AUTO-MAC-${idx+1}`;

    // 카테고리와 자산 유형 찾기
    const category = categories.find(cat => cat.name === data.categoryName);
    const assetType = assetTypes.find(type => type.typeCode === data.assetTypeCode);

    if (!category) {
      console.error(`Category not found for material: ${data.name}`);
      continue;
    }

    if (!assetType) {
      console.error(`Asset type not found for material: ${data.name}`);
      continue;
    }

    const material = await prisma.materials.create({
      data: {
        name: data.name,
        category: {
          connect: {
            id: category.id
          }
        },
        location: {
          connect: {
            id: data.locationId
          }
        },
        handler: {
          connect: {
            id: data.handlerId
          }
        },
        quantity: data.quantity,
        rfid_tag: rfidTagValue,
        status: data.status,
        assetType: {
          connect: {
            id: assetType.id
          }
        },
        brand: data.brand,
        it_model: data.it_model,
        serial: serialValue,
        os: data.os,
        cpu: data.cpu,
        ram: data.ram,
        storage: data.storage,
        screen_size: data.screen_size,
        mac_address: macAddressValue,
        resolution: data.resolution,
        size: data.size,
        color: data.color,
        etc: data.etc
      }
    });
    materials.push(material);
    // RfidTag 1:1 생성
    const rfidTag = await prisma.rfidTag.create({
      data: {
        tag: rfidTagValue,
        material: {
          connect: {
            id: material.id
          }
        }
      }
    });
    rfidTags.push(rfidTag);
  }
  console.log(`Created ${materials.length} materials and ${rfidTags.length} RFID tags`);

  // 7. 대여 요청, 대여, 반납, 자산이력, RFID 이력 생성
  for (const [idx, material] of materials.entries()) {
    const now = new Date();
    const end = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    const user = testUsers[material.handlerId-1] || testUsers[0];
    
    // RentalRequest
    const request = await prisma.rentalRequest.create({
      data: {
        materialId: material.id,
        userId: user.id,
        startDate: now,
        endDate: end,
        arrivalDate: now,
        purpose: '테스트 대여',
        request: '자동 생성',
        status: 'APPROVED',
      }
    });
    
    // Rental
    const rental = await prisma.rental.create({
      data: {
        materialId: material.id,
        userId: user.id,
        status: 'RENTED',
        rentDate: now,
        returnDate: end,
        memo: '자동 생성',
      }
    });
    
    // Return
    const ret = await prisma.return.create({
      data: {
        rentalRequestId: request.id,
        materialId: material.id,
        returnLocation: locations[0].name,
        returnDate: end,
        status: 'NORMAL',
        statusDescription: '테스트 반납',
      }
    });
    
    // MaterialHistory 입고/출고
    await prisma.materialHistory.create({
      data: {
        materialId: material.id,
        handlerId: user.id,
        type: '입고',
        quantity: 1,
        memo: `[대여 rentalId:${rental.id}] 자동 대여 입고`,
        date: now,
      }
    });
    
    await prisma.materialHistory.create({
      data: {
        materialId: material.id,
        handlerId: user.id,
        type: '출고',
        quantity: 1,
        memo: `[반납 returnId:${ret.id}] 자동 반납 출고`,
        date: end,
      }
    });
    
    // RFID 이력
    await prisma.rfidHistory.create({
      data: {
        rfidTag: rfidTags[idx].tag,
        materialId: material.id,
        type: 'REGISTER',
        timestamp: now,
      }
    });
    
    await prisma.rfidHistory.create({
      data: {
        rfidTag: rfidTags[idx].tag,
        materialId: material.id,
        type: 'SCAN',
        timestamp: end,
      }
    });
  }

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
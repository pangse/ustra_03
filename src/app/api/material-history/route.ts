import { NextRequest, NextResponse } from 'next/server';

// GET: 전체 입출고 이력 조회 (페이징 지원)
export async function GET(req: NextRequest) {
  // MOCK DATA: 입출고 이력 목록 및 전체 개수 (10건)
  const histories = [
    {
      id: 1,
      material: {
        name: '무대 테이블',
        rfid_tag: 'RFID016',
        category: { name: '가구' },
        location: { name: '서울 본사' },
        handler: { name: '홍지은' },
        assetType: { typeCode: 'PROP_FURNITURE' },
      },
      handler: { name: '홍지은' },
      type: '입고',
      quantity: 1,
      memo: '테스트 입고',
      date: new Date().toISOString(),
    },
    {
      id: 2,
      material: {
        name: 'LED 조명',
        rfid_tag: 'RFID017',
        category: { name: '조명' },
        location: { name: '부산 지사' },
        handler: { name: '김현수' },
        assetType: { typeCode: 'PROP_LIGHT' },
      },
      handler: { name: '김현수' },
      type: '출고',
      quantity: 2,
      memo: '테스트 출고',
      date: new Date().toISOString(),
    },
    {
      id: 3,
      material: {
        name: '음향 믹서',
        rfid_tag: 'RFID018',
        category: { name: '음향' },
        location: { name: '서울 본사' },
        handler: { name: '박지수' },
        assetType: { typeCode: 'PROP_AUDIO' },
      },
      handler: { name: '박지수' },
      type: '입고',
      quantity: 1,
      memo: '정기 점검 입고',
      date: new Date().toISOString(),
    },
    {
      id: 4,
      material: {
        name: '마이크',
        rfid_tag: 'RFID019',
        category: { name: '음향' },
        location: { name: '부산 지사' },
        handler: { name: '이수민' },
        assetType: { typeCode: 'PROP_AUDIO' },
      },
      handler: { name: '이수민' },
      type: '출고',
      quantity: 3,
      memo: '행사 출고',
      date: new Date().toISOString(),
    },
    {
      id: 5,
      material: {
        name: '프로젝터',
        rfid_tag: 'RFID020',
        category: { name: '영상' },
        location: { name: '서울 본사' },
        handler: { name: '최민호' },
        assetType: { typeCode: 'PROP_VIDEO' },
      },
      handler: { name: '최민호' },
      type: '입고',
      quantity: 1,
      memo: '신규 구매 입고',
      date: new Date().toISOString(),
    },
    {
      id: 6,
      material: {
        name: '스피커',
        rfid_tag: 'RFID021',
        category: { name: '음향' },
        location: { name: '부산 지사' },
        handler: { name: '김현수' },
        assetType: { typeCode: 'PROP_AUDIO' },
      },
      handler: { name: '김현수' },
      type: '출고',
      quantity: 2,
      memo: '대여 출고',
      date: new Date().toISOString(),
    },
    {
      id: 7,
      material: {
        name: '조명 스탠드',
        rfid_tag: 'RFID022',
        category: { name: '조명' },
        location: { name: '서울 본사' },
        handler: { name: '홍지은' },
        assetType: { typeCode: 'PROP_LIGHT' },
      },
      handler: { name: '홍지은' },
      type: '입고',
      quantity: 4,
      memo: '정비 입고',
      date: new Date().toISOString(),
    },
    {
      id: 8,
      material: {
        name: '카메라',
        rfid_tag: 'RFID023',
        category: { name: '영상' },
        location: { name: '부산 지사' },
        handler: { name: '이수민' },
        assetType: { typeCode: 'PROP_VIDEO' },
      },
      handler: { name: '이수민' },
      type: '출고',
      quantity: 1,
      memo: '촬영 출고',
      date: new Date().toISOString(),
    },
    {
      id: 9,
      material: {
        name: '노트북',
        rfid_tag: 'RFID024',
        category: { name: 'IT' },
        location: { name: '서울 본사' },
        handler: { name: '최민호' },
        assetType: { typeCode: 'PROP_IT' },
      },
      handler: { name: '최민호' },
      type: '입고',
      quantity: 2,
      memo: '업데이트 입고',
      date: new Date().toISOString(),
    },
    {
      id: 10,
      material: {
        name: '태블릿',
        rfid_tag: 'RFID025',
        category: { name: 'IT' },
        location: { name: '부산 지사' },
        handler: { name: '박지수' },
        assetType: { typeCode: 'PROP_IT' },
      },
      handler: { name: '박지수' },
      type: '출고',
      quantity: 1,
      memo: '출장 출고',
      date: new Date().toISOString(),
    },
  ];
  const total = 10; // mock 전체 개수
  const hasMore = false;

  return NextResponse.json({
    histories,
    total,
    hasMore,
  });
}

// POST: 입출고 이력 등록 (실제 DB 저장은 생략, 성공 응답만 반환)
export async function POST(req: NextRequest) {
  return NextResponse.json({ success: true }, { status: 201 });
} 
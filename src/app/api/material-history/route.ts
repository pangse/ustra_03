import { NextRequest, NextResponse } from 'next/server';

// 월별 입출고 이력 mock data (MonthlySalesChart.tsx와 동일)
const monthlyCounts = [10, 15, 20, 18, 25, 30, 28, 22, 19, 24, 27, 21];

// GET: 전체 입출고 이력 조회 (페이징 지원)
export async function GET(req: NextRequest) {
  // 235건 mock 이력 생성 (월별 데이터 순환)
  const histories = Array.from({ length: 235 }, (_, idx) => {
    const monthIdx = idx % 12;
    return {
      id: idx + 1,
      material: {
        name: `자산${monthIdx + 1}`,
        rfid_tag: `RFID${100 + monthIdx}`,
        category: { name: '기타' },
        location: { name: monthIdx % 2 === 0 ? '서울 본사' : '부산 지사' },
        handler: { name: monthIdx % 2 === 0 ? '홍지은' : '김현수' },
        assetType: { typeCode: 'PROP_ETC' },
      },
      handler: { name: monthIdx % 2 === 0 ? '홍지은' : '김현수' },
      type: monthIdx % 2 === 0 ? '입고' : '출고',
      quantity: monthlyCounts[monthIdx],
      memo: `${monthIdx + 1}월 입출고`,
      date: new Date(2024, monthIdx, 1).toISOString(),
    };
  });
  const total = 235;
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
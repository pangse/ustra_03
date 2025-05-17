import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 테스트용 사용자 ID
const TEST_USER_ID = 2;

export async function GET() {
  try {
    const returns = await prisma.return.findMany({
      where: {
        rentalRequest: {
          userId: TEST_USER_ID
        }
      },
      include: {
        material: {
          select: {
            name: true,
            category: true,
            assetType: true,
          },
        },
        rentalRequest: {
          select: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        returnDate: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: returns
    });
  } catch (error) {
    console.error("[RETURNS_GET]", error);
    return NextResponse.json(
      { 
        error: "반납 목록 조회에 실패했습니다.",
        details: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다."
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // 요청에서 반납 항목을 파싱
    const { items } = await request.json();
    if (!items || !Array.isArray(items)) {
      return NextResponse.json({ error: '반납 항목이 없습니다.' }, { status: 400 });
    }

    for (const item of items) {
      // rentalRequest 상태를 COMPLETED로 변경
      await prisma.rentalRequest.update({
        where: { id: item.id },
        data: { status: 'COMPLETED' }
      });
      // 필요하다면 rentals 테이블도 같이 업데이트 가능
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[RETURNS_POST]', error);
    return NextResponse.json(
      { error: '반납 처리에 실패했습니다.', details: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 
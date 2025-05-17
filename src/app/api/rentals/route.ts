import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 테스트용 사용자 ID
const TEST_USER_ID = 2;

export async function GET() {
  try {
    const rentals = await prisma.rental.findMany({
      where: {
        userId: TEST_USER_ID
      },
      include: {
        material: {
          select: {
            name: true,
            category: true,
            assetType: true,
          },
        },
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        rentDate: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: rentals
    });
  } catch (error) {
    console.error("[RENTALS_GET]", error);
    return NextResponse.json(
      { 
        error: "대여 목록 조회에 실패했습니다.",
        details: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다."
      },
      { status: 500 }
    );
  }
} 
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const TEST_USER_ID = 2;

export async function GET() {
  try {
    const requests = await prisma.rentalRequest.findMany({
      where: { userId: TEST_USER_ID },
      include: {
        material: {
          select: {
            id: true,
            name: true,
            category: { select: { name: true } },
            location: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ requests });
  } catch (error) {
    return NextResponse.json({ error: "대여 내역 조회 실패" }, { status: 500 });
  }
} 
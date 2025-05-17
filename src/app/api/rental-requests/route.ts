import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 테스트용 사용자 ID
const TEST_USER_ID = 2;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { materialId, startDate, endDate, purpose, request: requestNote, arrivalDate } = body;

    // Validate required fields
    if (!materialId || !startDate || !endDate || !purpose) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const numericMaterialId = parseInt(materialId);
    const startDateTime = new Date(startDate);
    const endDateTime = new Date(endDate);
    const arrivalDateTime = arrivalDate ? new Date(arrivalDate) : startDateTime;

    // Check if material exists
    const material = await prisma.materials.findUnique({
      where: { id: numericMaterialId },
      include: {
        category: true,
        location: true,
        handler: true,
      },
    });

    if (!material) {
      return NextResponse.json(
        { error: "Material not found", details: `Material with ID ${numericMaterialId} does not exist` },
        { status: 404 }
      );
    }

    // Create rental request and rental in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create rental request
      const rentalRequest = await tx.rentalRequest.create({
        data: {
          userId: TEST_USER_ID,
          materialId: material.id,
          startDate: startDateTime,
          endDate: endDateTime,
          purpose: purpose.trim(),
          request: requestNote?.trim() || null,
          arrivalDate: arrivalDateTime,
          status: "APPROVED",
        },
        include: {
          material: {
            include: {
              category: true,
              location: true,
              handler: true,
            },
          },
          user: true,
        },
      });

      // Create rental
      const rental = await tx.rental.create({
        data: {
          userId: TEST_USER_ID,
          materialId: material.id,
          status: "ACTIVE",
        },
        include: {
          material: {
            include: {
              category: true,
              location: true,
              handler: true,
            },
          },
          user: true,
        },
      });

      return { rentalRequest, rental };
    });

    return NextResponse.json({ 
      success: true, 
      data: result,
      message: "대여가 성공적으로 처리되었습니다."
    });
  } catch (error) {
    console.error("Error creating rental:", error);
    return NextResponse.json(
      { 
        error: "Failed to create rental", 
        details: error instanceof Error ? error.message : "Unknown error",
        code: error instanceof Error && "code" in error ? (error as any).code : undefined
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const requests = await prisma.rentalRequest.findMany({
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
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: requests
    });
  } catch (error) {
    console.error("[RENTAL_REQUESTS_GET]", error);
    return NextResponse.json(
      { 
        error: "대여 요청 목록 조회에 실패했습니다.",
        details: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다."
      },
      { status: 500 }
    );
  }
} 
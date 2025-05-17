import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 테스트용 사용자 ID
const TEST_USER_ID = 2;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { materialId, startDate, endDate, purpose, request: requestNote } = body;

    // Validate required fields
    if (!materialId || !startDate || !endDate || !purpose) {
      return NextResponse.json(
        { error: 'Missing required fields', details: 'materialId, startDate, endDate, and purpose are required' },
        { status: 400 }
      );
    }

    // Convert materialId to number and validate
    const numericMaterialId = Number(materialId);
    if (isNaN(numericMaterialId)) {
      return NextResponse.json(
        { error: 'Invalid materialId', details: 'materialId must be a valid number' },
        { status: 400 }
      );
    }

    const startDateTime = new Date(startDate);
    const endDateTime = new Date(endDate);

    // Check if material exists and has sufficient quantity
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
        { error: 'Material not found', details: `Material with ID ${numericMaterialId} does not exist` },
        { status: 404 }
      );
    }

    if (material.quantity < 1) {
      return NextResponse.json(
        { error: 'Insufficient quantity', details: 'Material is not available for rental' },
        { status: 400 }
      );
    }

    // Check for existing rental requests
    const existingRequest = await prisma.rentalRequest.findFirst({
      where: {
        materialId: numericMaterialId,
        status: 'PENDING',
        OR: [
          {
            AND: [
              { startDate: { lte: startDateTime } },
              { endDate: { gte: startDateTime } },
            ],
          },
          {
            AND: [
              { startDate: { lte: endDateTime } },
              { endDate: { gte: endDateTime } },
            ],
          },
        ],
      },
    });

    if (existingRequest) {
      return NextResponse.json(
        { error: 'Date conflict', details: 'There is already a pending rental request for this material during the selected period' },
        { status: 400 }
      );
    }

    // Create rental request
    const rentalRequest = await prisma.rentalRequest.create({
      data: {
        userId: TEST_USER_ID,
        materialId: numericMaterialId,
        startDate: startDateTime,
        endDate: endDateTime,
        arrivalDate: startDateTime,
        purpose: purpose.trim(),
        request: requestNote?.trim() || null,
        status: 'APPROVED',
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

    // Update material quantity
    await prisma.materials.update({
      where: { id: numericMaterialId },
      data: { quantity: material.quantity - 1 },
    });

    return NextResponse.json({ 
      success: true, 
      data: rentalRequest,
      message: '대여 요청이 성공적으로 생성되었습니다.'
    });
  } catch (error) {
    console.error('Error creating rental request:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create rental request', 
        details: error instanceof Error ? error.message : 'Unknown error',
        code: error instanceof Error && 'code' in error ? (error as any).code : undefined
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
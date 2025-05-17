import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { rfidTag, materialId } = await request.json();

    if (!rfidTag || !materialId) {
      return NextResponse.json(
        { error: 'RFID 태그와 자산 ID는 필수입니다.' },
        { status: 400 }
      );
    }

    // Check if material exists
    const material = await prisma.materials.findUnique({
      where: { id: Number(materialId) },
    });

    if (!material) {
      return NextResponse.json(
        { error: '존재하지 않는 자산입니다.' },
        { status: 404 }
      );
    }

    // Check if RFID tag is already registered
    const existingRfid = await prisma.rfidTag.findUnique({
      where: { tag: rfidTag },
    });

    if (existingRfid) {
      return NextResponse.json(
        { error: '이미 등록된 RFID 태그입니다.' },
        { status: 400 }
      );
    }

    // Register RFID tag
    const rfid = await prisma.rfidTag.create({
      data: {
        tag: rfidTag,
        materialId: Number(materialId),
      },
    });

    // Create RFID history record
    await prisma.rfidHistory.create({
      data: {
        rfidTag: rfidTag,
        materialId: Number(materialId),
        type: 'REGISTER',
      },
    });

    return NextResponse.json({
      message: 'RFID 태그가 성공적으로 등록되었습니다.',
      rfid,
    });
  } catch (error) {
    console.error('Error registering RFID tag:', error);
    return NextResponse.json(
      { error: 'RFID 태그 등록에 실패했습니다.' },
      { status: 500 }
    );
  }
} 
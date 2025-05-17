import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    // In a real implementation, this would receive the RFID tag from the scanner
    // For now, we'll simulate a scan by using a query parameter
    const { searchParams } = new URL(request.url);
    const rfidTag = searchParams.get('tag');

    if (!rfidTag) {
      return NextResponse.json(
        { error: 'RFID 태그가 필요합니다.' },
        { status: 400 }
      );
    }

    // Find the RFID tag
    const rfid = await prisma.rfidTag.findUnique({
      where: { tag: rfidTag },
      include: {
        material: true,
      },
    });

    if (!rfid) {
      return NextResponse.json(
        { error: '등록되지 않은 RFID 태그입니다.' },
        { status: 404 }
      );
    }

    // Create scan history record
    await prisma.rfidHistory.create({
      data: {
        rfidTag: rfidTag,
        materialId: rfid.materialId,
        type: 'SCAN',
      },
    });

    return NextResponse.json({
      rfidTag: rfid.tag,
      materialId: rfid.materialId,
      materialName: rfid.material.name,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error scanning RFID tag:', error);
    return NextResponse.json(
      { error: 'RFID 스캔에 실패했습니다.' },
      { status: 500 }
    );
  }
} 
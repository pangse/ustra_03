import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const [history, total] = await Promise.all([
      prisma.rfidHistory.findMany({
        skip,
        take: limit,
        orderBy: {
          timestamp: 'desc',
        },
        include: {
          material: {
            select: {
              name: true,
            },
          },
        },
      }),
      prisma.rfidHistory.count(),
    ]);

    return NextResponse.json({
      history: history.map(item => ({
        id: item.id,
        rfidTag: item.rfidTag,
        materialId: item.materialId,
        materialName: item.material.name,
        timestamp: item.timestamp,
        type: item.type,
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Error fetching RFID history:', error);
    return NextResponse.json(
      { error: 'RFID 이력을 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
} 
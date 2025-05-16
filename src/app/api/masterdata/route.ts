import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: 전체 기준데이터 목록 조회
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get('page') || 1);
    const limit = Number(searchParams.get('limit') || 20);
    const skip = (page - 1) * limit;

    console.log('Fetching masterdata with params:', { page, limit, skip });

    const [data, total] = await Promise.all([
      prisma.masterData.findMany({
        orderBy: { id: 'desc' },
        skip,
        take: limit,
      }),
      prisma.masterData.count()
    ]);

    console.log('Found masterdata:', data.length);

    return NextResponse.json({
      data,
      total,
      hasMore: skip + data.length < total
    });
  } catch (error) {
    console.error('Error in GET /api/masterdata:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : 'Unknown Error'
    }, { status: 500 });
  }
}

// POST: 기준데이터 등록
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, name, description } = body;
    const created = await prisma.masterData.create({
      data: { type, name, description },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/masterdata:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 
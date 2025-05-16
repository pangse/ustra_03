import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: 전체 입출고 이력 조회 (페이징 지원)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get('page') || 1);
    const limit = Number(searchParams.get('limit') || 20);
    const skip = (page - 1) * limit;

    console.log('Fetching material histories with params:', { page, limit, skip });

    const [histories, total] = await Promise.all([
      prisma.materialHistory.findMany({
        include: {
          material: {
            include: {
              category: true,
              location: true,
              handler: true
            }
          },
          handler: true,
        },
        orderBy: { date: 'desc' },
        skip,
        take: limit,
      }),
      prisma.materialHistory.count()
    ]);

    console.log(`Found ${histories.length} material histories`);

    return NextResponse.json({
      histories,
      total,
      hasMore: skip + histories.length < total
    });
  } catch (error) {
    console.error('Error in GET /api/material-history:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

// POST: 입출고 이력 등록
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { materialId, type, quantity, handlerId, memo, date } = body;

    if (!materialId || !type || !quantity || !handlerId) {
      return NextResponse.json({ 
        error: 'Missing required fields' 
      }, { status: 400 });
    }

    console.log('Creating material history with data:', { materialId, type, quantity, handlerId, memo, date });

    const created = await prisma.materialHistory.create({
      data: { 
        materialId, 
        type, 
        quantity, 
        handlerId, 
        memo, 
        date: date ? new Date(date) : new Date() 
      },
      include: {
        material: {
          include: {
            category: true,
            location: true,
            handler: true
          }
        },
        handler: true,
      },
    });

    console.log('Created material history:', created);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/material-history:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 
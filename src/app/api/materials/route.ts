import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: 전체 자산 목록 조회 (페이징 지원)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get('page') || 1);
    const limit = Number(searchParams.get('limit') || 20);
    const skip = (page - 1) * limit;

    console.log('Fetching materials with params:', { page, limit, skip });

    const [materials, total] = await Promise.all([
      prisma.materials.findMany({
        include: { 
          handler: true, 
          category: true, 
          location: true 
        },
        skip,
        take: limit,
        orderBy: {
          id: 'desc'
        }
      }),
      prisma.materials.count()
    ]);

    console.log('Found materials:', materials.length);

    return NextResponse.json({
      materials,
      total,
      hasMore: skip + materials.length < total
    });
  } catch (error) {
    console.error('Error in GET /api/materials:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : 'Unknown Error'
    }, { status: 500 });
  }
}

// POST: 자산 등록
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name, categoryId, quantity, locationId, handlerId, rfid_tag,
      size, color, material, brand, serial, os, cpu, ram, storage, 
      screen_size, battery, purchase_date, warranty, mac_address, etc
    } = body;

    if (!rfid_tag) {
      return NextResponse.json({ error: 'RFID 태그는 필수입니다.' }, { status: 400 });
    }
    if (!categoryId) {
      return NextResponse.json({ error: '카테고리 선택은 필수입니다.' }, { status: 400 });
    }

    const created = await prisma.materials.create({
      data: {
        name, categoryId, quantity, locationId, handlerId, rfid_tag,
        size, color, material, brand, serial, os, cpu, ram, storage, 
        screen_size, battery, purchase_date: purchase_date ? new Date(purchase_date) : undefined, 
        warranty, mac_address, etc
      },
      include: { category: true, handler: true, location: true },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/materials:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

// PUT: 자산 정보 업데이트
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;
    const {
      name, categoryId, quantity, locationId, handlerId, rfid_tag,
      size, color, material, brand, serial, os, cpu, ram, storage, 
      screen_size, battery, purchase_date, warranty, mac_address, etc
    } = body;

    const updated = await prisma.materials.update({
      where: { id: Number(id) },
      data: {
        name, categoryId, quantity, locationId, handlerId, rfid_tag,
        size, color, material, brand, serial, os, cpu, ram, storage, 
        screen_size, battery, purchase_date: purchase_date ? new Date(purchase_date) : undefined, 
        warranty, mac_address, etc
      },
      include: { category: true, handler: true, location: true },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error in PUT /api/materials:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 
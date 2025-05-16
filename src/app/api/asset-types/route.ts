import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: 자산유형 목록 조회 (검색/필터 지원)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || '';
  const isActive = searchParams.get('isActive');
  const where: any = {};
  if (q) {
    where.OR = [
      { typeCode: { contains: q } },
      { name: { contains: q } },
      { extension: { contains: q } },
    ];
  }
  if (isActive === 'true') where.isActive = true;
  if (isActive === 'false') where.isActive = false;
  const assetTypes = await prisma.assetType.findMany({
    where,
    orderBy: { id: 'desc' },
  });
  return NextResponse.json(assetTypes);
}

// POST: 자산유형 신규 등록
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { typeCode, name, description, extension, isActive, createdBy } = body;
    const created = await prisma.assetType.create({
      data: { typeCode, name, description, extension, isActive, createdBy },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
} 
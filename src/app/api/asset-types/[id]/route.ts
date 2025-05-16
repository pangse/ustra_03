import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: 자산유형 단건 조회
export async function GET(req: NextRequest, context: { params: { id: string } }) {
  const { id: idParam } = context.params;
  const id = Number(idParam);
  if (!idParam || isNaN(id) || id.toString() !== idParam) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  const assetType = await prisma.assetType.findUnique({ where: { id } });
  if (!assetType) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(assetType);
}

// PUT: 자산유형 수정
export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  const { id: idParam } = context.params;
  const id = Number(idParam);
  if (!idParam || isNaN(id) || id.toString() !== idParam) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  const body = await req.json();
  const { name, description, extension, isActive } = body;
  const updated = await prisma.assetType.update({
    where: { id },
    data: { name, description, extension, isActive },
  });
  return NextResponse.json(updated);
}

// DELETE: 자산유형 삭제
export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
  const { id: idParam } = context.params;
  const id = Number(idParam);
  if (!idParam || isNaN(id) || id.toString() !== idParam) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  await prisma.assetType.delete({ where: { id } });
  return NextResponse.json({ ok: true });
} 
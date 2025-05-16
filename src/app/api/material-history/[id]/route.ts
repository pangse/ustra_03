import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: 이력 단건 조회
export async function GET(req: NextRequest, context: { params: { id: string } }) {
  const { id: idParam } = context.params;
  const id = Number(idParam);
  if (!idParam || isNaN(id) || id.toString() !== idParam) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  const history = await prisma.materialHistory.findUnique({
    where: { id },
    include: { material: true, handler: true },
  });
  if (!history) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(history);
}

// PUT: 이력 수정
export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  const { id: idParam } = context.params;
  const id = Number(idParam);
  if (!idParam || isNaN(id) || id.toString() !== idParam) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  const body = await req.json();
  const { materialId, type, quantity, handlerId, memo, date } = body;
  const updated = await prisma.materialHistory.update({
    where: { id },
    data: { materialId, type, quantity, handlerId, memo, date },
  });
  return NextResponse.json(updated);
}

// DELETE: 이력 삭제
export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
  const { id: idParam } = context.params;
  const id = Number(idParam);
  if (!idParam || isNaN(id) || id.toString() !== idParam) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  await prisma.materialHistory.delete({ where: { id } });
  return NextResponse.json({ ok: true });
} 
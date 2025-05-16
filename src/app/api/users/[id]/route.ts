import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// GET: 사용자 단건 조회
export async function GET(req: NextRequest, context: { params: { id: string } }) {
  const { id: idParam } = context.params;
  const id = Number(idParam);
  if (!idParam || isNaN(id) || id.toString() !== idParam) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(user);
}

// PUT: 사용자 수정
export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  const { id: idParam } = context.params;
  const id = Number(idParam);
  if (!idParam || isNaN(id) || id.toString() !== idParam) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  const body = await req.json();
  const { name, email, role, department, phone_number, password } = body;
  const updateData: Prisma.UserUpdateInput = { name, email, role, department, phone_number };
  if (password) {
    updateData.password = password;
  }
  const updated = await prisma.user.update({
    where: { id },
    data: updateData,
  });
  return NextResponse.json(updated);
}

// DELETE: 사용자 삭제
export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
  const { id: idParam } = context.params;
  const id = Number(idParam);
  if (!idParam || isNaN(id) || id.toString() !== idParam) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  await prisma.user.delete({ where: { id } });
  return NextResponse.json({ ok: true });
} 
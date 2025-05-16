import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: 전체 사용자 목록 조회 (페이징 지원)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get('page') || 1);
  const limit = Number(searchParams.get('limit') || 20);
  const skip = (page - 1) * limit;
  const users = await prisma.user.findMany({
    skip,
    take: limit,
  });
  return NextResponse.json(users);
}

// POST: 사용자 등록
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, role, department, phone_number, password } = body;
  if (!password) {
    return NextResponse.json({ error: '비밀번호는 필수입니다.' }, { status: 400 });
  }
  const created = await prisma.user.create({
    data: { name, email, role, department, phone_number, password },
  });
  return NextResponse.json(created, { status: 201 });
} 
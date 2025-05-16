import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  // 이번 달 대여 건수
  const rentCount = await prisma.materialHistory.count({
    where: {
      type: '대여',
      date: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
    },
  });

  // 이번 달 회수 건수
  const returnCount = await prisma.materialHistory.count({
    where: {
      type: '회수',
      date: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
    },
  });

  // 회수율 계산
  const returnRate = rentCount === 0 ? 0 : (returnCount / rentCount) * 100;

  return NextResponse.json({
    rentCount,
    returnCount,
    returnRate: Math.round(returnRate * 100) / 100, // 소수점 2자리
  });
} 
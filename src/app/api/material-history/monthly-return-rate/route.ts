import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  // MOCK DATA: 월간 대여/회수 건수 및 회수율
  const rentCount = 40; // 이번 달 대여 건수 (예시)
  const returnCount = 32; // 이번 달 회수 건수 (예시)
  const returnRate = Math.round((returnCount / rentCount) * 10000) / 100; // 소수점 2자리

  return NextResponse.json({
    rentCount,
    returnCount,
    returnRate,
  });
} 
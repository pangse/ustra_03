import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const count = await prisma.materials.count();
  return NextResponse.json({ count });
} 
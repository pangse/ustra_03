import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: 자산 단건 조회
export async function GET(req: NextRequest, context: { params: { id: string } }) {
  const { id: idParam } = context.params;
  const id = Number(idParam);
  if (!idParam || isNaN(id) || id.toString() !== idParam) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  try {
    const material = await prisma.materials.findUnique({
      where: { id },
      include: { handler: true, category: true, location: true },
    });
    if (!material) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(material);
  } catch (error) {
    console.error('Error fetching material:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

// PUT: 자산 수정
export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  const { id: idParam } = context.params;
  const id = Number(idParam);
  if (!idParam || isNaN(id) || id.toString() !== idParam) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  try {
    const body = await req.json();
    const {
      name, categoryId, quantity, locationId, handlerId, rfid_tag,
      size, color, material, brand, model, serial, os, cpu, ram, storage, screen_size, battery, purchase_date, warranty, mac_address, etc
    } = body;

    if (!rfid_tag) {
      return NextResponse.json({ error: 'RFID 태그는 필수입니다.' }, { status: 400 });
    }
    if (!categoryId) {
      return NextResponse.json({ error: '카테고리 선택은 필수입니다.' }, { status: 400 });
    }

    const updated = await prisma.materials.update({
      where: { id },
      data: {
        name, categoryId, quantity, locationId, handlerId, rfid_tag,
        size, color, material, brand, serial, os, cpu, ram, storage, screen_size, battery, purchase_date: purchase_date ? new Date(purchase_date) : undefined, warranty, mac_address, etc
      },
      include: { category: true, handler: true, location: true },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating material:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

// DELETE: 자산 삭제
export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
  const { id: idParam } = context.params;
  const id = Number(idParam);
  if (!idParam || isNaN(id) || id.toString() !== idParam) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  try {
    await prisma.materials.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error deleting material:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 
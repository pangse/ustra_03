import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TEST_USER_ID } from "@/lib/constants";

export async function GET() {
  try {
    const rentals = await prisma.rental.findMany({
      where: {
        userId: TEST_USER_ID
      },
      include: {
        material: {
          select: {
            name: true,
            category: true,
            assetType: true,
            location: true,
          },
        },
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(rentals);
  } catch (error) {
    console.error("[MY_RENTALS_GET]", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
} 
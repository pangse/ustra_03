import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TEST_USER_ID } from "@/lib/constants";

export async function GET() {
  try {
    const returns = await prisma.return.findMany({
      where: {
        rentalRequest: {
          userId: TEST_USER_ID
        }
      },
      include: {
        rentalRequest: {
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
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(returns);
  } catch (error) {
    console.error("[MY_RETURNS_GET]", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
} 
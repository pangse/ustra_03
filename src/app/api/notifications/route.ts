import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const method = searchParams.get("method");
    const read = searchParams.get("read");
    const search = searchParams.get("search");
    const userId = searchParams.get("userId");

    const where: any = {};

    if (type) {
      where.type = type;
    }

    if (method) {
      where.notificationMethod = method;
    }

    if (read !== null) {
      where.read = read === "true";
    }

    if (userId) {
      where.userId = parseInt(userId);
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { message: { contains: search } },
        { user: { name: { contains: search } } },
        { user: { email: { contains: search } } },
      ];
    }

    const notifications = await prisma.notification.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        asset: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 
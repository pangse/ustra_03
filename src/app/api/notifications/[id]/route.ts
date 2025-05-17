import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const notification = await prisma.notification.findUnique({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      include: {
        asset: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!notification) {
      return new NextResponse("Notification not found", { status: 404 });
    }

    return NextResponse.json(notification);
  } catch (error) {
    console.error("알림 조회 실패:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 
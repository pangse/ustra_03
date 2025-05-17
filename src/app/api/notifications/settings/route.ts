import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const settings = await prisma.notification.findMany({
      where: {
        userId: parseInt(userId),
        type: "SETTINGS_CHANGE",
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 1,
    });

    return NextResponse.json(settings[0] || null);
  } catch (error) {
    console.error("Error fetching notification settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch notification settings" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { userId, settings } = body;

    if (!userId || !settings) {
      return NextResponse.json(
        { error: "User ID and settings are required" },
        { status: 400 }
      );
    }

    const notification = await prisma.notification.create({
      data: {
        userId: parseInt(userId),
        type: "SETTINGS_CHANGE",
        title: "알림 설정 변경",
        message: JSON.stringify(settings),
        notificationMethod: "SYSTEM",
        read: false,
      },
    });

    return NextResponse.json(notification);
  } catch (error) {
    console.error("Error updating notification settings:", error);
    return NextResponse.json(
      { error: "Failed to update notification settings" },
      { status: 500 }
    );
  }
} 
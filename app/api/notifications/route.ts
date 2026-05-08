// app/api/notifications/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const userId = req.headers.get("x-user-id")!;
  const { searchParams } = new URL(req.url);
  const unreadOnly = searchParams.get("unread") === "true";

  const notifications = await prisma.notification.findMany({
    where: { userId, ...(unreadOnly && { isRead: false }) },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  const unreadCount = await prisma.notification.count({ where: { userId, isRead: false } });
  return NextResponse.json({ notifications, unreadCount });
}

export async function PATCH(req: NextRequest) {
  const userId = req.headers.get("x-user-id")!;
  const { ids, all } = await req.json();

  if (all) {
    await prisma.notification.updateMany({ where: { userId }, data: { isRead: true, readAt: new Date() } });
  } else if (ids?.length) {
    await prisma.notification.updateMany({ where: { id: { in: ids }, userId }, data: { isRead: true, readAt: new Date() } });
  }
  return NextResponse.json({ message: "Marked as read" });
}

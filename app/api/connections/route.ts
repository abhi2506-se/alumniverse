// ════════════════════════════════════════════════════════════════════════════
//  app/api/connections/route.ts
// ════════════════════════════════════════════════════════════════════════════
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id")!;
    const { receiverId, message } = await req.json();

    if (userId === receiverId) return NextResponse.json({ error: "Cannot connect with yourself" }, { status: 400 });

    const existing = await prisma.connection.findFirst({
      where: { OR: [{ senderId: userId, receiverId }, { senderId: receiverId, receiverId: userId }] },
    });
    if (existing) return NextResponse.json({ error: "Connection already exists", status: existing.status }, { status: 409 });

    const connection = await prisma.connection.create({ data: { senderId: userId, receiverId, message, status: "PENDING" } });

    await prisma.notification.create({
      data: { userId: receiverId, type: "CONNECTION_REQUEST", title: "New Connection Request", body: message || "Someone wants to connect with you", data: { connectionId: connection.id } },
    });

    const receiver = await prisma.user.findUnique({ where: { id: receiverId } });
    if (receiver) {
      await sendEmail({ to: receiver.email, subject: "New Connection Request — AlumniVerse", template: "connection-request", data: { message } });
    }

    return NextResponse.json({ connection }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to send connection" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const userId = req.headers.get("x-user-id")!;
  const connections = await prisma.connection.findMany({
    where: { OR: [{ senderId: userId }, { receiverId: userId }] },
    include: {
      sender: { select: { id: true, role: true, studentProfile: { select: { firstName: true, lastName: true, avatarUrl: true } }, alumniProfile: { select: { firstName: true, lastName: true, avatarUrl: true, slug: true } } } },
      receiver: { select: { id: true, role: true, studentProfile: { select: { firstName: true, lastName: true, avatarUrl: true } }, alumniProfile: { select: { firstName: true, lastName: true, avatarUrl: true, slug: true } } } },
      chatRoom: true,
    },
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json({ connections });
}

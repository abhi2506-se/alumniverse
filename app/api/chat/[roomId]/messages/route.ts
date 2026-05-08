import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { roomId: string } }) {
  try {
    const userId = req.headers.get("x-user-id")!;
    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor");
    const limit = Math.min(50, parseInt(searchParams.get("limit") || "30"));

    // Verify membership
    const member = await prisma.chatRoomMember.findUnique({
      where: { chatRoomId_userId: { chatRoomId: params.roomId, userId } },
    });
    if (!member) return NextResponse.json({ error: "Not a member of this room" }, { status: 403 });

    const messages = await prisma.message.findMany({
      where: { chatRoomId: params.roomId },
      orderBy: { createdAt: "desc" },
      take: limit,
      ...(cursor && { cursor: { id: cursor }, skip: 1 }),
      include: {
        sender: {
          select: {
            id: true, role: true,
            studentProfile: { select: { firstName: true, lastName: true, avatarUrl: true } },
            alumniProfile: { select: { firstName: true, lastName: true, avatarUrl: true } },
          },
        },
        reactions: true,
      },
    });

    // Mark as read
    await prisma.chatRoomMember.update({
      where: { chatRoomId_userId: { chatRoomId: params.roomId, userId } },
      data: { lastReadAt: new Date() },
    });

    return NextResponse.json({
      messages: messages.reverse(),
      nextCursor: messages.length === limit ? messages[0]?.id : null,
    });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}

// REST fallback for sending messages (Socket.IO preferred)
export async function POST(req: NextRequest, { params }: { params: { roomId: string } }) {
  try {
    const userId = req.headers.get("x-user-id")!;
    const { content, type = "TEXT", mediaUrl } = await req.json();

    const member = await prisma.chatRoomMember.findUnique({
      where: { chatRoomId_userId: { chatRoomId: params.roomId, userId } },
    });
    if (!member) return NextResponse.json({ error: "Not a member" }, { status: 403 });

    const message = await prisma.message.create({
      data: { chatRoomId: params.roomId, senderId: userId, content, type: type as any, mediaUrl },
      include: {
        sender: {
          select: {
            id: true,
            studentProfile: { select: { firstName: true, lastName: true, avatarUrl: true } },
            alumniProfile: { select: { firstName: true, lastName: true, avatarUrl: true } },
          },
        },
      },
    });

    return NextResponse.json({ message }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}

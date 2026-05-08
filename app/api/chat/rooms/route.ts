// app/api/chat/rooms/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id")!;

    const memberships = await prisma.chatRoomMember.findMany({
      where: { userId },
      include: {
        chatRoom: {
          include: {
            members: {
              include: {
                user: {
                  select: {
                    id: true, role: true,
                    studentProfile: { select: { firstName: true, lastName: true, avatarUrl: true } },
                    alumniProfile: { select: { firstName: true, lastName: true, avatarUrl: true, slug: true } },
                  },
                },
              },
            },
            messages: { orderBy: { createdAt: "desc" }, take: 1 },
          },
        },
      },
      orderBy: { chatRoom: { updatedAt: "desc" } },
    });

    type MembershipItem = (typeof memberships)[number];
    const rooms = memberships
      .filter((m: MembershipItem) => m.chatRoom.isActive)
      .map((m: MembershipItem) => ({
        ...m.chatRoom,
        lastMessage: m.chatRoom.messages[0] || null,
        isPinned: m.isPinned,
        lastReadAt: m.lastReadAt,
      }));

    return NextResponse.json({ rooms });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch chat rooms" }, { status: 500 });
  }
}

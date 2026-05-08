import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = req.headers.get("x-user-id")!;
    const { action } = await req.json(); // "accept" | "reject"

    const connection = await prisma.connection.findUnique({
      where: { id: params.id },
      include: { sender: true, receiver: true },
    });

    if (!connection) return NextResponse.json({ error: "Connection not found" }, { status: 404 });
    if (connection.receiverId !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    if (action === "accept") {
      await prisma.$transaction(async (tx) => {
        const updated = await tx.connection.update({
          where: { id: params.id },
          data: { status: "ACCEPTED" },
        });
        const room = await tx.chatRoom.create({
          data: { connectionId: updated.id, isActive: true },
        });
        await tx.chatRoomMember.createMany({
          data: [
            { chatRoomId: room.id, userId: connection.senderId },
            { chatRoomId: room.id, userId: connection.receiverId },
          ],
        });
      });

      await prisma.notification.createMany({
        data: [
          { userId: connection.senderId, type: "CONNECTION_ACCEPTED", title: "Connection Accepted!", body: "Your connection request was accepted. Start chatting now." },
          { userId: connection.receiverId, type: "CONNECTION_ACCEPTED", title: "Connection Confirmed", body: "You are now connected. Say hi!" },
        ],
      });

      await Promise.all([
        sendEmail({ to: connection.sender.email, subject: "Connection Accepted! — AlumniVerse", template: "connection-accepted", data: {} }),
        sendEmail({ to: connection.receiver.email, subject: "Connection Confirmed! — AlumniVerse", template: "connection-accepted", data: {} }),
      ]);
    } else {
      await prisma.connection.update({ where: { id: params.id }, data: { status: "REJECTED" } });
    }

    return NextResponse.json({ message: `Connection ${action}ed` });
  } catch (err) {
    console.error("[PATCH /api/connections/[id]]", err);
    return NextResponse.json({ error: "Failed to update connection" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = req.headers.get("x-user-id")!;
    const connection = await prisma.connection.findUnique({
      where: { id: params.id },
      include: { chatRoom: true },
    });
    if (!connection) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (connection.senderId !== userId && connection.receiverId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (connection.chatRoom) {
      await prisma.chatRoom.update({ where: { id: connection.chatRoom.id }, data: { isActive: false } });
    }
    await prisma.connection.update({ where: { id: params.id }, data: { status: "BLOCKED" } });
    return NextResponse.json({ message: "Unfriended. Chat room deactivated." });
  } catch (err) {
    return NextResponse.json({ error: "Failed to remove connection" }, { status: 500 });
  }
}

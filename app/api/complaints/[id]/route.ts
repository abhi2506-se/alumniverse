import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import { sendEmail } from "@/lib/email";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const adminId = req.headers.get("x-user-id")!;
    const role = req.headers.get("x-user-role")!;
    if (!["ADMIN", "DEVELOPER"].includes(role)) return NextResponse.json({ error: "Admin only" }, { status: 403 });

    const { status, remarks } = await req.json();
    const old = await prisma.complaint.findUnique({ where: { id: id } });
    if (!old) return NextResponse.json({ error: "Complaint not found" }, { status: 404 });

    const updated = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const c = await tx.complaint.update({
        where: { id: id },
        data: {
          status, remarks,
          resolvedAt: ["RESOLVED", "REJECTED"].includes(status) ? new Date() : undefined,
          resolvedBy: adminId,
        },
        include: { filer: true },
      });
      await tx.complaintUpdate.create({
        data: { complaintId: id, updatedBy: adminId, oldStatus: old.status, newStatus: status, remark: remarks },
      });
      return c;
    });

    await prisma.notification.create({
      data: {
        userId: updated.filerId, type: "COMPLAINT_UPDATE",
        title: "Complaint Status Updated",
        body: `Your complaint ${updated.complaintId} is now: ${status}`,
      },
    });
    await sendEmail({
      to: updated.filer.email,
      subject: `Complaint Update: ${updated.complaintId}`,
      template: "complaint-update",
      data: { complaintId: updated.complaintId, status, remarks },
    });

    return NextResponse.json({ complaint: updated });
  } catch (err) {
    return NextResponse.json({ error: "Failed to update complaint" }, { status: 500 });
  }
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const complaint = await prisma.complaint.findUnique({
    where: { id: id },
    include: {
      filer: { select: { email: true, studentProfile: { select: { firstName: true, lastName: true } }, alumniProfile: { select: { firstName: true, lastName: true } } } },
      updates: { orderBy: { createdAt: "asc" } },
    },
  });
  if (!complaint) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ complaint });
}

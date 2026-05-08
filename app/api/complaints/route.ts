import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { generateComplaintId } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id")!;
    const { againstId, category, subject, description, proofUrls } = await req.json();

    const count = await prisma.complaint.count();
    const complaintId = generateComplaintId(count);

    const complaint = await prisma.complaint.create({
      data: { complaintId, filerId: userId, againstId: againstId || null, category, subject, description, proofUrls: proofUrls || [] },
      include: { filer: true },
    });

    await sendEmail({
      to: complaint.filer.email,
      subject: `Complaint Registered: ${complaintId} — AlumniVerse`,
      template: "complaint-registered",
      data: { complaintId, subject },
    });

    const admins = await prisma.user.findMany({ where: { role: { in: ["ADMIN", "DEVELOPER"] } } });
    if (admins.length) {
      await prisma.notification.createMany({
        data: admins.map((a: { id: string }) => ({
          userId: a.id, type: "COMPLAINT_UPDATE" as any,
          title: "New Complaint Filed",
          body: `${complaintId}: ${subject}`,
          data: { complaintId: complaint.id },
        })),
      });
    }

    return NextResponse.json({ complaint, complaintId }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to file complaint" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const userId = req.headers.get("x-user-id")!;
  const role = req.headers.get("x-user-role")!;

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  if (["ADMIN", "DEVELOPER"].includes(role)) {
    const complaints = await prisma.complaint.findMany({
      where: status ? { status: status as any } : {},
      orderBy: { createdAt: "desc" },
      include: {
        filer: { select: { email: true, studentProfile: { select: { firstName: true, lastName: true } }, alumniProfile: { select: { firstName: true, lastName: true } } } },
        updates: { orderBy: { createdAt: "desc" }, take: 1 },
      },
    });
    return NextResponse.json({ complaints });
  }

  const complaints = await prisma.complaint.findMany({
    where: { filerId: userId },
    orderBy: { createdAt: "desc" },
    include: { updates: { orderBy: { createdAt: "desc" } } },
  });
  return NextResponse.json({ complaints });
}

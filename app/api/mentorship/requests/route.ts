// app/api/mentorship/requests/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id")!;
    const { mentorId, message, goals } = await req.json();

    const student = await prisma.studentProfile.findUnique({ where: { userId } });
    if (!student) return NextResponse.json({ error: "Student profile not found" }, { status: 404 });

    const mentor = await prisma.alumniProfile.findUnique({ where: { id: mentorId } });
    if (!mentor?.isMentor) return NextResponse.json({ error: "This alumni is not accepting mentorship" }, { status: 400 });

    const existing = await prisma.mentorshipRequest.findUnique({
      where: { studentId_mentorId: { studentId: student.id, mentorId } },
    });
    if (existing) return NextResponse.json({ error: "You already sent a request to this mentor", status: existing.status }, { status: 409 });

    const activeMentorships = await prisma.mentorshipRequest.count({
      where: { mentorId, status: "accepted" },
    });
    if (activeMentorships >= mentor.mentorCapacity) {
      return NextResponse.json({ error: "This mentor has reached their capacity" }, { status: 400 });
    }

    const request = await prisma.mentorshipRequest.create({
      data: { studentId: student.id, mentorId, message, goals: goals || [] },
    });

    await prisma.notification.create({
      data: {
        userId: mentor.userId, type: "MENTORSHIP_REQUEST",
        title: "New Mentorship Request",
        body: `${student.firstName} ${student.lastName} wants you as their mentor`,
        data: { requestId: request.id },
      },
    });

    return NextResponse.json({ request }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to send mentorship request" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const userId = req.headers.get("x-user-id")!;
  const role = req.headers.get("x-user-role")!;

  let requests;
  if (role === "ALUMNI") {
    const alumni = await prisma.alumniProfile.findUnique({ where: { userId } });
    requests = alumni
      ? await prisma.mentorshipRequest.findMany({
          where: { mentorId: alumni.id },
          include: { student: { select: { firstName: true, lastName: true, avatarUrl: true, branch: true, year: true, skills: true } } },
          orderBy: { createdAt: "desc" },
        })
      : [];
  } else {
    const student = await prisma.studentProfile.findUnique({ where: { userId } });
    requests = student
      ? await prisma.mentorshipRequest.findMany({
          where: { studentId: student.id },
          include: { mentor: { select: { firstName: true, lastName: true, avatarUrl: true, currentCompany: true, currentRole: true, slug: true } } },
          orderBy: { createdAt: "desc" },
        })
      : [];
  }
  return NextResponse.json({ requests });
}

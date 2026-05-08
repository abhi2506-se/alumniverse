import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { generateMeetingRoomId, generateJitsiLink } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id")!;
    const { mentorshipRequestId, title, description, scheduledAt, durationMinutes = 60 } = await req.json();

    const alumni = await prisma.alumniProfile.findUnique({ where: { userId } });
    if (!alumni) return NextResponse.json({ error: "Only alumni can create meetings" }, { status: 403 });

    const mentorshipReq = await prisma.mentorshipRequest.findUnique({
      where: { id: mentorshipRequestId },
      include: {
        student: { include: { user: true } },
        mentor: { include: { user: true } },
      },
    });

    if (!mentorshipReq || mentorshipReq.mentorId !== alumni.id) {
      return NextResponse.json({ error: "Mentorship request not found or unauthorized" }, { status: 404 });
    }

    const roomId = generateMeetingRoomId();
    const meetingLink = generateJitsiLink(roomId);

    const meeting = await prisma.meeting.create({
      data: {
        mentorshipRequestId,
        hostId: alumni.id,
        title,
        description,
        scheduledAt: new Date(scheduledAt),
        durationMinutes,
        roomId,
        meetingLink,
        status: "SCHEDULED",
      },
    });

    const formattedDate = new Date(scheduledAt).toLocaleString("en-IN", {
      weekday: "long", year: "numeric", month: "long", day: "numeric",
      hour: "2-digit", minute: "2-digit",
    });

    await Promise.all([
      sendEmail({
        to: mentorshipReq.student.user.email,
        subject: `Meeting Scheduled: ${title}`,
        template: "meeting-confirmation",
        data: { name: mentorshipReq.student.firstName, title, meetingLink, scheduledAt: formattedDate, duration: durationMinutes },
      }),
      sendEmail({
        to: mentorshipReq.mentor.user.email,
        subject: `Meeting Scheduled: ${title}`,
        template: "meeting-confirmation",
        data: { name: mentorshipReq.mentor.firstName, title, meetingLink, scheduledAt: formattedDate, duration: durationMinutes },
      }),
    ]);

    await prisma.notification.createMany({
      data: [
        { userId: mentorshipReq.student.userId, type: "MEETING_SCHEDULED", title: "Meeting Scheduled!", body: `${title} on ${formattedDate}`, data: { meetingLink, meetingId: meeting.id } },
        { userId: mentorshipReq.mentor.userId, type: "MEETING_SCHEDULED", title: "Meeting Confirmed", body: `${title} on ${formattedDate}`, data: { meetingLink, meetingId: meeting.id } },
      ],
    });

    return NextResponse.json({ meeting, meetingLink }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/mentorship/meetings]", err);
    return NextResponse.json({ error: "Failed to create meeting" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const userId = req.headers.get("x-user-id")!;
  const role = req.headers.get("x-user-role")!;

  const alumni = role === "ALUMNI" ? await prisma.alumniProfile.findUnique({ where: { userId } }) : null;
  const student = role === "STUDENT" ? await prisma.studentProfile.findUnique({ where: { userId } }) : null;

  const meetings = alumni
    ? await prisma.meeting.findMany({
        where: { hostId: alumni.id },
        orderBy: { scheduledAt: "asc" },
        include: { mentorshipRequest: { include: { student: true } } },
      })
    : student
    ? await prisma.meeting.findMany({
        where: { mentorshipRequest: { studentId: student.id } },
        orderBy: { scheduledAt: "asc" },
        include: { host: { select: { firstName: true, lastName: true, currentCompany: true, avatarUrl: true } } },
      })
    : [];

  return NextResponse.json({ meetings });
}

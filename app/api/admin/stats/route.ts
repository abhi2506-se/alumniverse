import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const role = req.headers.get("x-user-role")!;
  if (!["ADMIN", "DEVELOPER"].includes(role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const [
      totalStudents, totalAlumni, activeJobs, upcomingEvents,
      openComplaints, completedMeetings, pendingApprovals,
      totalConnections, totalMessages,
    ] = await Promise.all([
      prisma.studentProfile.count(),
      prisma.alumniProfile.count(),
      prisma.job.count({ where: { isActive: true } }),
      prisma.event.count({ where: { status: "UPCOMING" } }),
      prisma.complaint.count({ where: { status: { notIn: ["RESOLVED", "REJECTED"] } } }),
      prisma.meeting.count({ where: { status: "COMPLETED" } }),
      prisma.user.count({ where: { status: "PENDING" } }),
      prisma.connection.count({ where: { status: "ACCEPTED" } }),
      prisma.message.count(),
    ]);

    // Monthly user signups (last 8 months)
    const months = Array.from({ length: 8 }, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - (7 - i));
      return { label: d.toLocaleString("default", { month: "short" }), start: new Date(d.getFullYear(), d.getMonth(), 1), end: new Date(d.getFullYear(), d.getMonth() + 1, 0) };
    });

    const activityData = await Promise.all(
      months.map(async (m) => ({
        month: m.label,
        users: await prisma.user.count({ where: { createdAt: { gte: m.start, lte: m.end } } }),
        placements: await prisma.job.count({ where: { createdAt: { gte: m.start, lte: m.end } } }),
      }))
    );

    // Pending users
    const pendingUsers = await prisma.user.findMany({
      where: { status: "PENDING" },
      select: {
        id: true, email: true, role: true, createdAt: true,
        studentProfile: { select: { firstName: true, lastName: true, branch: true, admissionYear: true } },
        alumniProfile: { select: { firstName: true, lastName: true, branch: true, passingYear: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    return NextResponse.json({
      stats: { totalStudents, totalAlumni, activeJobs, upcomingEvents, openComplaints, completedMeetings, pendingApprovals, totalConnections, totalMessages },
      activityData,
      pendingUsers,
    });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}

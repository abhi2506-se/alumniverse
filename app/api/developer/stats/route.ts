import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  if (req.headers.get("x-user-role") !== "DEVELOPER") {
    return NextResponse.json({ error: "Developer access only" }, { status: 403 });
  }

  try {
    const [totalUsers, totalMessages, totalConnections, totalMeetings, recentLogs] = await Promise.all([
      prisma.user.count(),
      prisma.message.count(),
      prisma.connection.count(),
      prisma.meeting.count(),
      prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 30 }),
    ]);

    const usersByRole = await prisma.user.groupBy({ by: ["role"], _count: { id: true } });
    const usersByStatus = await prisma.user.groupBy({ by: ["status"], _count: { id: true } });

    const dbTableCounts = {
      users: totalUsers,
      messages: totalMessages,
      connections: totalConnections,
      meetings: totalMeetings,
      complaints: await prisma.complaint.count(),
      blogs: await prisma.blog.count(),
      jobs: await prisma.job.count(),
      events: await prisma.event.count(),
      notifications: await prisma.notification.count(),
    };

    return NextResponse.json({
      serverInfo: {
        nodeVersion: process.version,
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        platform: process.platform,
        timestamp: new Date().toISOString(),
      },
      dbTableCounts,
      usersByRole,
      usersByStatus,
      recentAuditLogs: recentLogs,
    });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch dev stats" }, { status: 500 });
  }
}

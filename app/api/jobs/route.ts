// app/api/jobs/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, parseInt(searchParams.get("limit") || "10"));
    const type = searchParams.get("type");
    const search = searchParams.get("search") || "";
    const branch = searchParams.get("branch") || "";

    const where: any = {
      isActive: true,
      OR: [{ deadline: null }, { deadline: { gt: new Date() } }],
      ...(type && { type }),
      ...(branch && { branches: { hasSome: [branch] } }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { company: { contains: search, mode: "insensitive" } },
          { skills: { hasSome: [search] } },
        ],
      }),
    };

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where, skip: (page - 1) * limit, take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          alumniProfile: { select: { firstName: true, lastName: true, avatarUrl: true, slug: true } },
          _count: { select: { savedBy: true } },
        },
      }),
      prisma.job.count({ where }),
    ]);

    return NextResponse.json({ jobs, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id")!;
    const role = req.headers.get("x-user-role")!;
    if (!["ALUMNI", "ADMIN", "DEVELOPER"].includes(role)) {
      return NextResponse.json({ error: "Only alumni can post jobs" }, { status: 403 });
    }

    const alumni = await prisma.alumniProfile.findUnique({ where: { userId } });
    const body = await req.json();

    const job = await prisma.job.create({
      data: { ...body, alumniProfileId: alumni?.id || null },
    });

    // Notify matching students
    const matching = await prisma.studentProfile.findMany({
      where: { branch: { in: body.branches || [] }, user: { status: "ACTIVE" } },
      include: { user: true }, take: 100,
    });

    if (matching.length > 0) {
      await prisma.notification.createMany({
        data: matching.map((s: { id: string; userId: string }) => ({
          userId: s.userId,
          type: "JOB_POSTED" as any,
          title: "New Job Opportunity",
          body: `${job.title} at ${job.company} — ${job.package || "Package not disclosed"}`,
          data: { jobId: job.id },
        })),
      });

      // Email top 20 matching students
      for (const s of matching.slice(0, 20)) {
        sendEmail({
          to: s.user.email, subject: `🚨 New Placement: ${job.title} at ${job.company}`,
          template: "placement-alert",
          data: { title: job.title, company: job.company, package: job.package, deadline: job.deadline?.toLocaleDateString() || "Open" },
        }).catch(() => {});
      }
    }

    return NextResponse.json({ job }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to post job" }, { status: 500 });
  }
}

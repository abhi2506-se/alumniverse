// app/api/events/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "UPCOMING";
    const events = await prisma.event.findMany({
      where: { isPublic: true, ...(status !== "all" && { status: status as any }) },
      orderBy: { startDate: "asc" },
      include: { _count: { select: { registrations: true } } },
    });
    return NextResponse.json({ events });
  } catch {
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const role = req.headers.get("x-user-role")!;
  if (!["ADMIN", "DEVELOPER"].includes(role)) return NextResponse.json({ error: "Admin only" }, { status: 403 });
  const body = await req.json();
  const event = await prisma.event.create({ data: body });
  return NextResponse.json({ event }, { status: 201 });
}

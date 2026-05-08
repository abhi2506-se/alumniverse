// app/api/alumni/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, parseInt(searchParams.get("limit") || "12"));
    const search = searchParams.get("search") || "";
    const company = searchParams.get("company") || "";
    const branch = searchParams.get("branch") || "";
    const isMentor = searchParams.get("isMentor");

    const where: any = {
      user: { status: "ACTIVE" },
      ...(search && {
        OR: [
          { firstName: { contains: search, mode: "insensitive" } },
          { lastName: { contains: search, mode: "insensitive" } },
          { currentCompany: { contains: search, mode: "insensitive" } },
          { currentRole: { contains: search, mode: "insensitive" } },
          { skills: { hasSome: [search] } },
        ],
      }),
      ...(company && { currentCompany: { contains: company, mode: "insensitive" } }),
      ...(branch && { branch }),
      ...(isMentor === "true" && { isMentor: true }),
    };

    const [alumni, total] = await Promise.all([
      prisma.alumniProfile.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: [{ isVerified: "desc" }, { profileViews: "desc" }, { createdAt: "desc" }],
        select: {
          id: true, slug: true, firstName: true, lastName: true,
          avatarUrl: true, tagline: true, currentCompany: true,
          currentRole: true, currentLocation: true, branch: true,
          passingYear: true, skills: true, domains: true, isMentor: true,
          mentorRating: true, isVerified: true, experienceYears: true,
          user: { select: { status: true } },
        },
      }),
      prisma.alumniProfile.count({ where }),
    ]);

    return NextResponse.json({ alumni, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (err) {
    console.error("[GET /api/alumni]", err);
    return NextResponse.json({ error: "Failed to fetch alumni" }, { status: 500 });
  }
}

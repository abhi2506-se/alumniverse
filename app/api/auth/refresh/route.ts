// app/api/auth/refresh/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signAccessToken, verifyRefreshToken } from "@/lib/jwt";

export async function POST(req: NextRequest) {
  try {
    const { refreshToken } = await req.json();
    if (!refreshToken) return NextResponse.json({ error: "No refresh token" }, { status: 400 });

    const payload = verifyRefreshToken(refreshToken) as any;

    const stored = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
    if (!stored || stored.used || stored.expiresAt < new Date()) {
      return NextResponse.json({ error: "Refresh token expired or already used" }, { status: 401 });
    }

    // Rotate: mark old as used, issue new
    await prisma.refreshToken.update({ where: { id: stored.id }, data: { used: true } });

    const newRefresh = (await import("@/lib/jwt")).signRefreshToken({ userId: payload.userId, role: payload.role });
    await prisma.refreshToken.create({
      data: { userId: payload.userId, token: newRefresh, expiresAt: new Date(Date.now() + 7 * 86400000) },
    });

    const accessToken = signAccessToken({ userId: payload.userId, role: payload.role });
    return NextResponse.json({ accessToken, refreshToken: newRefresh });
  } catch {
    return NextResponse.json({ error: "Invalid refresh token" }, { status: 401 });
  }
}

// ════════════════════════════════════════════════════════════════════════════
//  app/api/auth/verify-otp/route.ts
// ════════════════════════════════════════════════════════════════════════════
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signAccessToken, signRefreshToken } from "@/lib/jwt";
import { rateLimiter } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  try {
    const { userId, code, type } = await req.json();
    const ip = req.headers.get("x-forwarded-for") || "unknown";

    await rateLimiter(`otp:${userId}`, 5, 300); // 5 attempts per 5 min

    const otp = await prisma.oTP.findFirst({
      where: { userId, code, type, used: false, expiresAt: { gt: new Date() } },
    });

    if (!otp) {
      return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
    }

    await prisma.oTP.update({ where: { id: otp.id }, data: { used: true } });

    if (type === "email_verify") {
      await prisma.user.update({ where: { id: userId }, data: { emailVerified: true } });
      return NextResponse.json({ message: "Email verified. Awaiting admin approval." });
    }

    if (type === "reset_password") {
      return NextResponse.json({ message: "OTP verified. Proceed to reset password.", verified: true });
    }

    // Login OTP
    const user = await prisma.user.update({
      where: { id: userId },
      data: { loginAttempts: 0, lockedUntil: null, lastLoginAt: new Date(), lastLoginIp: ip },
      include: {
        studentProfile: true,
        alumniProfile: true,
        adminProfile: true,
      },
    });

    await prisma.loginHistory.create({ data: { userId, ipAddress: ip, status: "success" } });

    const payload = { userId: user.id, role: user.role };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    await prisma.refreshToken.create({
      data: { userId, token: refreshToken, expiresAt: new Date(Date.now() + 7 * 86400000) },
    });

    const profile = user.studentProfile || user.alumniProfile || user.adminProfile;

    return NextResponse.json({
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email, role: user.role, status: user.status, profile },
    });
  } catch (err: any) {
    if (err.statusCode === 429) return NextResponse.json({ error: "Too many OTP attempts. Wait 5 minutes." }, { status: 429 });
    console.error("[verify-otp]", err);
    return NextResponse.json({ error: "OTP verification failed" }, { status: 500 });
  }
}

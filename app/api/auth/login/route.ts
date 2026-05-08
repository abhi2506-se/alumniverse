import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { sendEmail, generateOTP } from "@/lib/email";
import { rateLimiter } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const ua = req.headers.get("user-agent") || "unknown";

    await rateLimiter(`login:${ip}`, 10, 900);

    const user = await prisma.user.findUnique({
      where: { email },
      include: { studentProfile: true, alumniProfile: true, adminProfile: true },
    });

    if (!user) {
      await new Promise((r) => setTimeout(r, 300)); // timing attack mitigation
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    if (user.lockedUntil && user.lockedUntil > new Date()) {
      return NextResponse.json({ error: `Account locked. Try after ${user.lockedUntil.toLocaleTimeString()}` }, { status: 423 });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      const newAttempts = user.loginAttempts + 1;
      await prisma.user.update({
        where: { id: user.id },
        data: {
          loginAttempts: newAttempts,
          lockedUntil: newAttempts >= 10 ? new Date(Date.now() + 30 * 60000) : undefined,
        },
      });
      await prisma.loginHistory.create({ data: { userId: user.id, ipAddress: ip, device: ua, status: "failed" } });
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    if (!user.emailVerified) {
      return NextResponse.json({ error: "Please verify your email first", code: "EMAIL_UNVERIFIED", userId: user.id }, { status: 403 });
    }

    if (user.status === "PENDING") {
      return NextResponse.json({ error: "Your account is pending admin approval", code: "PENDING_APPROVAL" }, { status: 403 });
    }

    if (user.status === "BANNED" || user.status === "SUSPENDED") {
      return NextResponse.json({ error: "Your account has been suspended" }, { status: 403 });
    }

    // Suspicious login detection
    const lastSuccess = await prisma.loginHistory.findFirst({
      where: { userId: user.id, status: "success" },
      orderBy: { createdAt: "desc" },
    });

    if (lastSuccess && lastSuccess.ipAddress && lastSuccess.ipAddress !== ip) {
      const profileName =
        user.studentProfile?.firstName || user.alumniProfile?.firstName || user.adminProfile?.firstName || "User";
      await sendEmail({
        to: email,
        subject: "⚠️ Suspicious Login Detected — AlumniVerse",
        template: "security-alert",
        data: { name: profileName, ip, device: ua, time: new Date().toISOString() },
      });
      await prisma.notification.create({
        data: { userId: user.id, type: "SECURITY_ALERT", title: "Suspicious Login", body: `New login from IP: ${ip}` },
      });
    }

    // Generate and store OTP
    const otpCode = generateOTP();
    await prisma.oTP.deleteMany({ where: { userId: user.id, type: "login", used: false } });
    await prisma.oTP.create({
      data: { userId: user.id, code: otpCode, type: "login", expiresAt: new Date(Date.now() + 10 * 60000) },
    });

    const profileName =
      user.studentProfile?.firstName || user.alumniProfile?.firstName || user.adminProfile?.firstName || "User";
    await sendEmail({ to: email, subject: "Your AlumniVerse Login OTP", template: "otp", data: { name: profileName, otp: otpCode } });

    return NextResponse.json({ message: "OTP sent to your email", userId: user.id, requiresOtp: true });
  } catch (err: any) {
    if (err.statusCode === 429) return NextResponse.json({ error: "Too many attempts. Try again in 15 minutes." }, { status: 429 });
    console.error("[login]", err);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}

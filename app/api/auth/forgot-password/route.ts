import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail, generateOTP } from "@/lib/email";
import { rateLimiter } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    await rateLimiter(`forgot:${ip}`, 5, 900);

    const user = await prisma.user.findUnique({ where: { email } });
    // Always return success to prevent email enumeration
    if (!user) return NextResponse.json({ message: "If that email exists, a reset OTP has been sent." });

    const otpCode = generateOTP();
    await prisma.oTP.deleteMany({ where: { userId: user.id, type: "reset_password" } });
    await prisma.oTP.create({
      data: { userId: user.id, code: otpCode, type: "reset_password", expiresAt: new Date(Date.now() + 10 * 60000) },
    });

    await sendEmail({ to: email, subject: "Reset your AlumniVerse password", template: "otp", data: { name: "User", otp: otpCode } });
    return NextResponse.json({ message: "OTP sent.", userId: user.id });
  } catch (err: any) {
    if (err.statusCode === 429) return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    return NextResponse.json({ message: "If that email exists, a reset OTP has been sent." });
  }
}

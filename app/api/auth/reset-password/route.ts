import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { userId, code, newPassword } = await req.json();
    const otp = await prisma.oTP.findFirst({ where: { userId, code, type: "reset_password", used: false, expiresAt: { gt: new Date() } } });
    if (!otp) return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await prisma.$transaction([
      prisma.user.update({ where: { id: userId }, data: { passwordHash, loginAttempts: 0, lockedUntil: null } }),
      prisma.oTP.update({ where: { id: otp.id }, data: { used: true } }),
      prisma.refreshToken.updateMany({ where: { userId }, data: { used: true } }),
    ]);

    return NextResponse.json({ message: "Password reset successfully" });
  } catch {
    return NextResponse.json({ error: "Reset failed" }, { status: 500 });
  }
}

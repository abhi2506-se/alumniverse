// app/api/auth/logout/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id");
    const { refreshToken } = await req.json().catch(() => ({}));
    if (refreshToken) {
      await prisma.refreshToken.updateMany({ where: { token: refreshToken }, data: { used: true } }).catch(() => {});
    }
    if (userId) {
      await prisma.session.deleteMany({ where: { userId } }).catch(() => {});
    }
    const res = NextResponse.json({ message: "Logged out" });
    res.cookies.delete("access_token");
    return res;
  } catch {
    return NextResponse.json({ message: "Logged out" });
  }
}

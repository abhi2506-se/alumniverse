// app/api/admin/users/[id]/approve/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const role = req.headers.get("x-user-role")!;
  if (!["ADMIN", "DEVELOPER"].includes(role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const { action } = await req.json(); // "approve" | "reject" | "ban" | "suspend"
    const statusMap: Record<string, string> = { approve: "ACTIVE", reject: "BANNED", ban: "BANNED", suspend: "SUSPENDED" };

    const user = await prisma.user.update({
      where: { id: params.id },
      data: { status: statusMap[action] as any },
    });

    await sendEmail({
      to: user.email,
      subject: action === "approve" ? "🎉 Your AlumniVerse account is approved!" : "AlumniVerse Account Update",
      template: action === "approve" ? "account-approved" : "account-rejected",
      data: {},
    });

    await prisma.notification.create({
      data: {
        userId: user.id,
        type: "ACCOUNT_APPROVED",
        title: action === "approve" ? "Account Approved! 🎉" : "Account Status Updated",
        body: action === "approve" ? "Welcome to AlumniVerse! You can now sign in." : "Your account status has been updated.",
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: req.headers.get("x-user-id") || undefined,
        action: `user.${action}`,
        entity: "User",
        entityId: params.id,
        newValue: { status: statusMap[action] },
      },
    });

    return NextResponse.json({ user, message: `User ${action}ed successfully` });
  } catch (err) {
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

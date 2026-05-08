// ════════════════════════════════════════════════════════════════════════════
//  app/api/auth/register/route.ts
// ════════════════════════════════════════════════════════════════════════════
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { sendEmail, generateOTP } from "@/lib/email";
import { rateLimiter } from "@/lib/rateLimit";
import { generateSlug } from "@/lib/utils";
import { RegisterStudentSchema, RegisterAlumniSchema } from "@/lib/validations/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const ip = req.headers.get("x-forwarded-for") || "unknown";

    await rateLimiter(`register:${ip}`, 5, 3600);

    const existing = await prisma.user.findUnique({ where: { email: body.email } });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const schema = body.role === "alumni" ? RegisterAlumniSchema : RegisterStudentSchema;
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 400 });
    }

    const { email, password, role, ...profileData } = parsed.data;
    const passwordHash = await bcrypt.hash(password, Number(process.env.BCRYPT_ROUNDS) || 12);

    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: { email, passwordHash, role: role.toUpperCase() as any, status: "PENDING" },
      });

      if (role === "student") {
        const sd = profileData as any;
        await tx.studentProfile.create({
          data: {
            userId: newUser.id,
            rollNumber: sd.rollNumber,
            firstName: sd.firstName,
            lastName: sd.lastName,
            gender: sd.gender,
            branch: sd.branch,
            course: sd.course,
            year: sd.year,
            section: sd.section,
            admissionYear: sd.admissionYear,
            skills: sd.skills || [],
            interests: sd.interests || [],
            languages: ["English"],
            linkedinUrl: sd.linkedinUrl || null,
            githubUrl: sd.githubUrl || null,
            bio: sd.bio || null,
            city: sd.city || null,
            state: sd.state || null,
          },
        });
      } else if (role === "alumni") {
        const ad = profileData as any;
        const slug = generateSlug(ad.firstName, ad.lastName);
        await tx.alumniProfile.create({
          data: {
            userId: newUser.id,
            slug,
            firstName: ad.firstName,
            lastName: ad.lastName,
            branch: ad.branch,
            course: ad.course,
            passingYear: ad.passingYear,
            currentCompany: ad.currentCompany || null,
            currentRole: ad.currentRole || null,
            currentLocation: ad.currentLocation || null,
            skills: ad.skills || [],
            domains: ad.domains || [],
            isMentor: ad.isMentor || false,
            linkedinUrl: ad.linkedinUrl || null,
            githubUrl: ad.githubUrl || null,
            bio: ad.bio || null,
          },
        });
      }

      return newUser;
    });

    // Send email-verification OTP
    const otpCode = generateOTP();
    await prisma.oTP.create({
      data: { userId: user.id, code: otpCode, type: "email_verify", expiresAt: new Date(Date.now() + 10 * 60000) },
    });

    const firstName = (profileData as any).firstName || "User";
    await sendEmail({ to: email, subject: "Verify your AlumniVerse account", template: "email-verify", data: { name: firstName, otp: otpCode } });

    // Notify admins
    const admins = await prisma.user.findMany({ where: { role: "ADMIN" } });
    if (admins.length) {
      await prisma.notification.createMany({
        data: admins.map((a) => ({
          userId: a.id,
          type: "ACCOUNT_APPROVED" as any,
          title: "New Registration",
          body: `${firstName} registered as ${role}. Awaiting approval.`,
        })),
      });
    }

    return NextResponse.json({ message: "Account created. Check your email for the OTP.", userId: user.id }, { status: 201 });
  } catch (err: any) {
    if (err.statusCode === 429) return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 });
    console.error("[register]", err);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}

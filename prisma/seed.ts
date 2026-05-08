import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding AlumniVerse database...");

  const hash = await bcrypt.hash("Admin@123", 12);

  // ── Branches & Courses ────────────────────────────────────────────────────
  const branchData = [
    {
      name: "Computer Science & Engineering", code: "CSE",
      courses: [
        { name: "B.Tech CSE", code: "BTECH_CSE", duration: 4 },
        { name: "B.Tech CSE (AI & ML)", code: "BTECH_CSAIML", duration: 4 },
        { name: "B.Tech CSE (Data Science)", code: "BTECH_CSDS", duration: 4 },
      ],
    },
    {
      name: "Electronics & Communication", code: "ECE",
      courses: [
        { name: "B.Tech ECE", code: "BTECH_ECE", duration: 4 },
        { name: "B.Tech ECE (VLSI)", code: "BTECH_ECVLSI", duration: 4 },
      ],
    },
    {
      name: "Business Administration", code: "MBA",
      courses: [
        { name: "MBA General", code: "MBA_GEN", duration: 2 },
        { name: "MBA Finance", code: "MBA_FIN", duration: 2 },
        { name: "MBA Marketing", code: "MBA_MKT", duration: 2 },
      ],
    },
    {
      name: "Computer Applications", code: "BCA",
      courses: [{ name: "BCA", code: "BCA_GEN", duration: 3 }],
    },
    {
      name: "Mechanical Engineering", code: "MECH",
      courses: [{ name: "B.Tech Mechanical", code: "BTECH_MECH", duration: 4 }],
    },
  ];

  for (const branch of branchData) {
    const b = await prisma.branch.upsert({
      where: { code: branch.code },
      update: {},
      create: { name: branch.name, code: branch.code },
    });
    for (const course of branch.courses) {
      await prisma.course.upsert({
        where: { code_branchId: { code: course.code, branchId: b.id } },
        update: {},
        create: { ...course, branchId: b.id },
      });
    }
  }

  // ── Developer User ────────────────────────────────────────────────────────
  await prisma.user.upsert({
    where: { email: "developer@alumniverse.app" },
    update: {},
    create: {
      email: "developer@alumniverse.app",
      passwordHash: hash,
      role: "DEVELOPER",
      status: "ACTIVE",
      emailVerified: true,
    },
  });

  // ── Admin User ────────────────────────────────────────────────────────────
  await prisma.user.upsert({
    where: { email: "admin@alumniverse.app" },
    update: {},
    create: {
      email: "admin@alumniverse.app",
      passwordHash: hash,
      role: "ADMIN",
      status: "ACTIVE",
      emailVerified: true,
      adminProfile: {
        create: {
          firstName: "System",
          lastName: "Admin",
          department: "Administration",
          permissions: ["all"],
        },
      },
    },
  });

  // ── Alumni Users ──────────────────────────────────────────────────────────
  const alumniSeeds = [
    {
      email: "arjun.mehta@example.com",
      firstName: "Arjun", lastName: "Mehta",
      slug: "arjun-mehta",
      company: "Google", role: "Senior Software Engineer",
      branch: "CSE", course: "B.Tech CSE", year: 2019,
      skills: ["React", "Python", "Machine Learning", "System Design"],
      domains: ["Software Engineering", "AI/ML"],
      tagline: "Building the future at Google 🚀",
      bio: "Passionate engineer who loves building scalable systems. 5 years at Google working on Search infrastructure.",
    },
    {
      email: "priya.sharma@example.com",
      firstName: "Priya", lastName: "Sharma",
      slug: "priya-sharma",
      company: "Microsoft", role: "Senior Product Manager",
      branch: "CSE", course: "B.Tech CSE", year: 2020,
      skills: ["Product Strategy", "Data Analysis", "Agile", "User Research"],
      domains: ["Product Management", "SaaS"],
      tagline: "Turning ideas into products users love 💡",
      bio: "PM at Microsoft Azure. Previously at Flipkart. I love mentoring aspiring PMs.",
    },
    {
      email: "rohan.verma@example.com",
      firstName: "Rohan", lastName: "Verma",
      slug: "rohan-verma",
      company: "Stripe", role: "Backend Engineer",
      branch: "CSE", course: "B.Tech CSE", year: 2018,
      skills: ["Node.js", "Go", "PostgreSQL", "AWS", "Distributed Systems"],
      domains: ["Fintech", "Backend Engineering"],
      tagline: "Scaling payments for millions 💳",
      bio: "Backend engineer at Stripe. Love distributed systems and open source.",
    },
    {
      email: "ananya.rao@example.com",
      firstName: "Ananya", lastName: "Rao",
      slug: "ananya-rao",
      company: "Figma", role: "Senior Product Designer",
      branch: "CSE", course: "B.Tech CSE", year: 2021,
      skills: ["UI/UX", "Figma", "Design Systems", "Prototyping", "Branding"],
      domains: ["Design", "Product"],
      tagline: "Designing delightful experiences ✨",
      bio: "Designer at Figma. I turn complex problems into elegant, user-friendly solutions.",
    },
  ];

  for (const a of alumniSeeds) {
    await prisma.user.upsert({
      where: { email: a.email },
      update: {},
      create: {
        email: a.email,
        passwordHash: hash,
        role: "ALUMNI",
        status: "ACTIVE",
        emailVerified: true,
        alumniProfile: {
          create: {
            slug: a.slug,
            firstName: a.firstName,
            lastName: a.lastName,
            branch: a.branch,
            course: a.course,
            passingYear: a.year,
            currentCompany: a.company,
            currentRole: a.role,
            currentLocation: "Bangalore, India",
            experienceYears: 2024 - a.year,
            skills: a.skills,
            domains: a.domains,
            tagline: a.tagline,
            bio: a.bio,
            isMentor: true,
            isVerified: true,
            verifiedAt: new Date(),
            mentorCapacity: 5,
            mentoringAreas: a.domains,
            mentorRating: 4.8 + Math.random() * 0.2,
            linkedinUrl: `https://linkedin.com/in/${a.slug}`,
            githubUrl: `https://github.com/${a.slug}`,
          },
        },
      },
    });
  }

  // ── Student Users ─────────────────────────────────────────────────────────
  const studentSeeds = [
    {
      email: "rahul.singh@student.alumniverse.app",
      firstName: "Rahul", lastName: "Singh",
      roll: "CS2025001", branch: "CSE", course: "B.Tech CSE", year: 3,
      skills: ["React", "Node.js", "Python"], interests: ["Web Dev", "AI/ML"],
    },
    {
      email: "sneha.patel@student.alumniverse.app",
      firstName: "Sneha", lastName: "Patel",
      roll: "CS2025002", branch: "CSE", course: "B.Tech CSE", year: 2,
      skills: ["Java", "Spring Boot", "MySQL"], interests: ["Backend", "Cloud"],
    },
  ];

  for (const s of studentSeeds) {
    await prisma.user.upsert({
      where: { email: s.email },
      update: {},
      create: {
        email: s.email,
        passwordHash: hash,
        role: "STUDENT",
        status: "ACTIVE",
        emailVerified: true,
        studentProfile: {
          create: {
            rollNumber: s.roll,
            firstName: s.firstName,
            lastName: s.lastName,
            branch: s.branch,
            course: s.course,
            year: s.year,
            admissionYear: 2025 - s.year,
            skills: s.skills,
            interests: s.interests,
            languages: ["English", "Hindi"],
            profileScore: 65,
          },
        },
      },
    });
  }

  // ── Sample Jobs ───────────────────────────────────────────────────────────
  const arjunAlumni = await prisma.alumniProfile.findUnique({ where: { slug: "arjun-mehta" } });
  if (arjunAlumni) {
    await prisma.job.createMany({
      data: [
        {
          alumniProfileId: arjunAlumni.id,
          title: "Frontend Developer Intern",
          company: "Google",
          description: "Join Google's frontend team and build products used by billions.",
          requirements: ["React", "TypeScript", "REST APIs"],
          skills: ["React", "TypeScript", "CSS"],
          location: "Bangalore / Remote",
          isRemote: true,
          type: "INTERNSHIP",
          package: "₹80,000/month",
          deadline: new Date(Date.now() + 30 * 86400000),
          isActive: true,
          branches: ["CSE", "ECE"],
          years: [3, 4],
          minCgpa: 7.0,
        },
        {
          alumniProfileId: arjunAlumni.id,
          title: "SDE-1 (Full Stack)",
          company: "Google",
          description: "Full-time Software Engineer role at Google Hyderabad.",
          requirements: ["DSA", "System Design", "React or Angular"],
          skills: ["React", "Node.js", "Python"],
          location: "Hyderabad",
          isRemote: false,
          type: "FULL_TIME",
          package: "₹28-35 LPA",
          deadline: new Date(Date.now() + 45 * 86400000),
          isActive: true,
          branches: ["CSE"],
          years: [],
          minCgpa: 7.5,
        },
      ],
      skipDuplicates: true,
    });
  }

  // ── Sample Events ─────────────────────────────────────────────────────────
  await prisma.event.createMany({
    data: [
      {
        title: "Annual Alumni Meetup 2025",
        description: "Join us for the biggest alumni gathering. Network, share stories, and inspire the next generation.",
        type: "OFFLINE",
        status: "UPCOMING",
        venue: "Main Auditorium, Campus",
        startDate: new Date(Date.now() + 15 * 86400000),
        endDate: new Date(Date.now() + 15 * 86400000 + 8 * 3600000),
        maxAttendees: 500,
        tags: ["Networking", "Alumni", "Annual"],
        isPublic: true,
      },
      {
        title: "AI & ML Career Panel",
        description: "Industry experts from Google, Microsoft & OpenAI discuss careers in AI.",
        type: "ONLINE",
        status: "UPCOMING",
        meetingLink: "https://meet.jit.si/alumniverse-ai-panel-2025",
        startDate: new Date(Date.now() + 22 * 86400000),
        endDate: new Date(Date.now() + 22 * 86400000 + 3 * 3600000),
        maxAttendees: 1000,
        tags: ["AI", "ML", "Career", "Panel"],
        isPublic: true,
      },
      {
        title: "Startup Pitch Competition",
        description: "Present your startup idea to a panel of investors and alumni entrepreneurs.",
        type: "HYBRID",
        status: "UPCOMING",
        venue: "Innovation Hub, Block C",
        meetingLink: "https://meet.jit.si/alumniverse-startup-pitch",
        startDate: new Date(Date.now() + 35 * 86400000),
        endDate: new Date(Date.now() + 35 * 86400000 + 6 * 3600000),
        maxAttendees: 200,
        tags: ["Startup", "Entrepreneurship", "Pitch"],
        isPublic: true,
      },
      {
        title: "Resume & Interview Masterclass",
        description: "Get your resume reviewed by top alumni and practice interview skills.",
        type: "ONLINE",
        status: "UPCOMING",
        meetingLink: "https://meet.jit.si/alumniverse-resume-workshop",
        startDate: new Date(Date.now() + 42 * 86400000),
        endDate: new Date(Date.now() + 42 * 86400000 + 4 * 3600000),
        maxAttendees: 300,
        tags: ["Resume", "Interview", "Career"],
        isPublic: true,
      },
    ],
    skipDuplicates: true,
  });

  // ── Announcements ─────────────────────────────────────────────────────────
  await prisma.announcement.createMany({
    data: [
      {
        title: "🎉 Annual Alumni Meet 2025 — Registration Now Open!",
        content: "Register for the most anticipated alumni event of the year. Early bird registrations get exclusive merchandise.",
        isPinned: true,
        isPublished: true,
        targetRoles: ["STUDENT", "ALUMNI"],
      },
      {
        title: "📢 New Placement Drive: Top MNCs Visiting Campus",
        content: "Google, Microsoft, Amazon, and Flipkart are visiting campus next month. Ensure your profiles are complete.",
        isPinned: true,
        isPublished: true,
        targetRoles: ["STUDENT"],
      },
      {
        title: "🤝 Mentor Program — Season 2 Now Live",
        content: "55 new mentors have joined! Students can now request mentorship from industry experts.",
        isPinned: false,
        isPublished: true,
        targetRoles: ["STUDENT", "ALUMNI"],
      },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Database seeded successfully!");
  console.log("\n📋 Test Credentials:");
  console.log("  Developer : developer@alumniverse.app / Admin@123");
  console.log("  Admin     : admin@alumniverse.app / Admin@123");
  console.log("  Alumni    : arjun.mehta@example.com / Admin@123");
  console.log("  Alumni    : priya.sharma@example.com / Admin@123");
  console.log("  Student   : rahul.singh@student.alumniverse.app / Admin@123");
}

main().catch(console.error).finally(() => prisma.$disconnect());

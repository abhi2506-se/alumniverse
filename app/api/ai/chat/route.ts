import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimiter } from "@/lib/rateLimit";

const AI_RESPONSES: Record<string, string> = {
  mentor: "Based on your skills, I recommend connecting with Arjun Mehta (Google) or Priya Sharma (Microsoft). They have 95%+ compatibility with your profile. 🎯",
  job: "I found 3 hot opportunities matching your profile: Frontend Dev Intern at Google (₹80K/mo), SDE-1 at Razorpay (₹18 LPA), and Data Analyst at CRED (₹12 LPA). All have deadlines within 30 days!",
  event: "Upcoming events tailored for you: AI & ML Career Panel (Jun 22, Online), Resume Masterclass (Jul 12, Online), and Annual Alumni Meet (Jun 15, Offline). All are open for registration!",
  profile: "Your profile score is 78%. To reach 90%+, add a bio (+15pts), upload your resume (+20pts), and connect your LinkedIn (+10pts). This unlocks priority mentor matching!",
  default: "Great question! Let me pull the most relevant data from the platform for you. Based on current trends and your profile, I'd suggest focusing on building connections with alumni in your target domain first. Shall I find the best matches?",
};

function getResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("mentor") || lower.includes("mentorship")) return AI_RESPONSES.mentor;
  if (lower.includes("job") || lower.includes("placement") || lower.includes("intern")) return AI_RESPONSES.job;
  if (lower.includes("event") || lower.includes("upcoming")) return AI_RESPONSES.event;
  if (lower.includes("profile") || lower.includes("score") || lower.includes("improve")) return AI_RESPONSES.profile;
  return AI_RESPONSES.default;
}

export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id") || "anonymous";
    await rateLimiter(`ai:${userId}`, 30, 3600);

    const { message } = await req.json();
    if (!message?.trim()) return NextResponse.json({ error: "Message required" }, { status: 400 });

    // Simulate AI processing delay
    await new Promise((r) => setTimeout(r, 400));

    const reply = getResponse(message);
    return NextResponse.json({ reply });
  } catch (err: any) {
    if (err.statusCode === 429) return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    return NextResponse.json({ reply: "I'm having a moment. Please try again shortly!" });
  }
}

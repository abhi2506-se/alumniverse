import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateComplaintId(count: number): string {
  return `CMP-${String(count + 1).padStart(4, "0")}`;
}

export function generateMeetingRoomId(): string {
  return `av-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function generateJitsiLink(roomId: string): string {
  const domain = process.env.NEXT_PUBLIC_JITSI_DOMAIN || "meet.jit.si";
  return `https://${domain}/${roomId}`;
}

export function generateSlug(firstName: string, lastName: string): string {
  return `${firstName}-${lastName}-${Date.now().toString(36)}`
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
}

export function formatTimeAgo(date: Date | string): string {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(date);
}

export function getInitials(name: string): string {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  return `${local.slice(0, 2)}***@${domain}`;
}

export function calculateProfileScore(profile: {
  bio?: string | null;
  avatarUrl?: string | null;
  resumeUrl?: string | null;
  linkedinUrl?: string | null;
  githubUrl?: string | null;
  skills: string[];
  interests?: string[];
}): number {
  let score = 0;
  if (profile.bio) score += 15;
  if (profile.avatarUrl) score += 20;
  if (profile.resumeUrl) score += 20;
  if (profile.linkedinUrl) score += 10;
  if (profile.githubUrl) score += 10;
  if (profile.skills.length >= 3) score += 15;
  if (profile.skills.length >= 6) score += 5;
  if ((profile.interests?.length ?? 0) >= 2) score += 5;
  return Math.min(score, 100);
}

export const ROLE_COLORS: Record<string, string> = {
  STUDENT: "#06b6d4",
  ALUMNI: "#8b5cf6",
  ADMIN: "#10b981",
  DEVELOPER: "#f43f5e",
};

export const ROLE_LABELS: Record<string, string> = {
  STUDENT: "Student",
  ALUMNI: "Alumni",
  ADMIN: "Admin",
  DEVELOPER: "Developer",
};

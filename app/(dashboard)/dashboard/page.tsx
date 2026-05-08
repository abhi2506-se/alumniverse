// app/(dashboard)/dashboard/page.tsx
"use client";
import { useAuthStore } from "@/store/useAuthStore";
import StudentDashboard from "@/components/dashboard/StudentDashboard";
import AlumniDashboard from "@/components/dashboard/AlumniDashboard";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import DevDashboard from "@/components/dashboard/DevDashboard";

export default function DashboardPage() {
  const { user } = useAuthStore();
  if (!user) return null;
  if (user.role === "ALUMNI") return <AlumniDashboard />;
  if (user.role === "ADMIN") return <AdminDashboard />;
  if (user.role === "DEVELOPER") return <DevDashboard />;
  return <StudentDashboard />;
}

"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useThemeStore } from "@/store/useThemeStore";
import { useSocket } from "@/hooks/useSocket";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import AIAssistant from "@/components/common/AIAssistant";
import { useUIStore } from "@/store/stores";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore();
  const router = useRouter();
  const { theme } = useThemeStore();
  const { showAIAssistant, toggleAI } = useUIStore();
  useSocket();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.classList.toggle("light", theme === "light");
  }, [theme]);

  useEffect(() => {
    if (!user) router.push("/login");
  }, [user, router]);

  if (!user) return null;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)", transition: "background 0.3s" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
        <TopBar />
        <main style={{ flex: 1, overflowY: "auto" }}>{children}</main>
      </div>
      <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 999 }}>
        {showAIAssistant && <AIAssistant onClose={toggleAI} />}
        <button onClick={toggleAI} className="animate-pulse-glow" style={{ width: 56, height: 56, borderRadius: "50%", border: "none", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "white", fontSize: 22, cursor: "pointer", boxShadow: "0 8px 32px rgba(99,102,241,0.5)", display: "flex", alignItems: "center", justifyContent: "center", transition: "transform 0.2s" }} onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.transform = "scale(1.1)")} onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.transform = "scale(1)")}>
          {showAIAssistant ? "✕" : "✦"}
        </button>
      </div>
    </div>
  );
}

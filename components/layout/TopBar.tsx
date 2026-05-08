"use client";
import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useUIStore } from "@/store/stores";
import { useNotificationStore } from "@/store/stores";
import { useAuth } from "@/hooks/useAuth";
import ThemeToggle from "@/components/common/ThemeToggle";
import { formatTimeAgo, ROLE_COLORS } from "@/lib/utils";

const SECTION_TITLES: Record<string, string> = {
  dashboard: "Dashboard", alumni: "Alumni Network", chat: "Messages",
  mentorship: "Mentorship", events: "Events", jobs: "Placements & Jobs",
  complaints: "Complaints", notifications: "Notifications",
  profile: "My Profile", settings: "Settings",
};

const NOTIF_ICONS: Record<string, string> = {
  CONNECTION_REQUEST: "🤝", CONNECTION_ACCEPTED: "🎉",
  MENTORSHIP_REQUEST: "⚡", MEETING_SCHEDULED: "📅",
  JOB_POSTED: "💼", COMPLAINT_UPDATE: "🛡️",
  ANNOUNCEMENT: "📢", MESSAGE_RECEIVED: "💬",
  ACCOUNT_APPROVED: "✅", SECURITY_ALERT: "⚠️",
};

export default function TopBar() {
  const { user, accessToken } = useAuthStore();
  const { activeSection, setSection } = useUIStore();
  const { notifications, unreadCount, markRead, markAllRead } = useNotificationStore();
  const { logout } = useAuth();
  const [showNotifs, setShowNotifs] = useState(false);
  const [search, setSearch] = useState("");

  const color = ROLE_COLORS[user?.role || "STUDENT"] || "#6366f1";
  const profileName = user?.profile
    ? `${user.profile.firstName} ${user.profile.lastName}`
    : user?.email || "";
  const initials = user?.profile
    ? `${user.profile.firstName[0]}${user.profile.lastName[0]}`.toUpperCase()
    : (user?.email || "U?").slice(0, 2).toUpperCase();

  const handleMarkAll = async () => {
    markAllRead();
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ all: true }),
      });
    } catch {}
  };

  return (
    <header style={{
      height: 64,
      display: "flex", alignItems: "center",
      justifyContent: "space-between",
      padding: "0 24px",
      background: "var(--topbar-bg)",
      backdropFilter: "blur(40px)",
      borderBottom: "1px solid var(--border)",
      position: "sticky", top: 0, zIndex: 30,
      transition: "background 0.3s",
    }}>
      {/* Title */}
      <div>
        <h1 className="font-display" style={{ fontSize: 19, fontWeight: 700, color: "var(--text)", lineHeight: 1.2 }}>
          {SECTION_TITLES[activeSection] || "Dashboard"}
        </h1>
        <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "capitalize", marginTop: 2 }}>
          {user?.role?.toLowerCase()} · AlumniVerse
        </div>
      </div>

      {/* Right controls */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {/* Search */}
        <div style={{ position: "relative" }}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search alumni, events, jobs…"
            style={{
              width: 220, height: 36,
              background: "var(--input-bg)",
              border: "1px solid var(--input-border)",
              borderRadius: 10, padding: "0 12px 0 36px",
              fontSize: 13, color: "var(--text)", outline: "none",
              fontFamily: "Space Grotesk, sans-serif",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--input-border)")}
          />
          <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--muted)", fontSize: 14 }}>
            🔍
          </span>
        </div>

        {/* ── Theme Toggle ─────────────────────────────────────────────── */}
        <ThemeToggle size={36} />

        {/* Notifications */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            style={{
              width: 36, height: 36,
              background: "var(--surface)", border: "1px solid var(--border)",
              borderRadius: 10, cursor: "pointer", color: "var(--text)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 17, position: "relative", transition: "all 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-hover)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "var(--surface)")}
          >
            🔔
            {unreadCount > 0 && (
              <span style={{
                position: "absolute", top: -4, right: -4,
                minWidth: 16, height: 16, padding: "0 4px",
                borderRadius: 8, background: "#f43f5e", color: "#fff",
                fontSize: 9, fontWeight: 700,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          {showNotifs && (
            <div
              className="animate-scale-in"
              style={{
                position: "absolute", top: "calc(100% + 8px)", right: 0, width: 360,
                background: "var(--sidebar-bg)", backdropFilter: "blur(40px)",
                border: "1px solid var(--border)", borderRadius: 16,
                padding: "16px 18px", zIndex: 100,
                boxShadow: "var(--shadow)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <span className="font-display" style={{ fontWeight: 700, fontSize: 15, color: "var(--text)" }}>
                  Notifications
                </span>
                {unreadCount > 0 && (
                  <span onClick={handleMarkAll} style={{ fontSize: 12, color: "var(--accent)", cursor: "pointer" }}>
                    Mark all read
                  </span>
                )}
              </div>

              <div style={{ maxHeight: 360, overflowY: "auto", display: "flex", flexDirection: "column", gap: 2 }}>
                {notifications.length === 0 && (
                  <div style={{ textAlign: "center", color: "var(--muted)", padding: "24px 0", fontSize: 14 }}>
                    All caught up! 🎉
                  </div>
                )}
                {notifications.slice(0, 12).map((n) => (
                  <div
                    key={n.id}
                    onClick={() => { markRead([n.id]); setShowNotifs(false); }}
                    style={{
                      display: "flex", gap: 10, padding: "9px 7px", borderRadius: 10,
                      cursor: "pointer",
                      background: n.isRead ? "transparent" : "rgba(99,102,241,0.06)",
                      border: n.isRead ? "none" : "1px solid rgba(99,102,241,0.12)",
                      opacity: n.isRead ? 0.62 : 1, transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-hover)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = n.isRead ? "transparent" : "rgba(99,102,241,0.06)")}
                  >
                    <div style={{ width: 34, height: 34, borderRadius: 9, background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0 }}>
                      {NOTIF_ICONS[n.type] || "📩"}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, color: "var(--text)", fontWeight: 500, lineHeight: 1.4 }}>{n.title}</div>
                      <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{n.body}</div>
                      <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 3 }}>{formatTimeAgo(n.createdAt)}</div>
                    </div>
                    {!n.isRead && (
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", marginTop: 6, flexShrink: 0 }} />
                    )}
                  </div>
                ))}
              </div>

              <div
                onClick={() => { setSection("notifications"); setShowNotifs(false); }}
                style={{ textAlign: "center", paddingTop: 12, fontSize: 13, color: "var(--accent)", cursor: "pointer" }}
              >
                View all →
              </div>
            </div>
          )}
        </div>

        {/* Avatar */}
        <div onClick={() => setSection("profile")} style={{ display: "flex", alignItems: "center", gap: 9, cursor: "pointer" }}>
          {user?.profile?.avatarUrl ? (
            <img src={user.profile.avatarUrl} alt="" style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover", border: `2px solid ${color}40` }} />
          ) : (
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg,${color},${color}88)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff", boxShadow: `0 0 0 2px ${color}30` }}>
              {initials}
            </div>
          )}
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", lineHeight: 1 }}>
              {profileName}
            </div>
            <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "capitalize", marginTop: 2 }}>
              {user?.role?.toLowerCase()}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

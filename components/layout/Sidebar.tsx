"use client";
import { useAuthStore } from "@/store/useAuthStore";
import { useUIStore } from "@/store/stores";
import { useNotificationStore } from "@/store/stores";
import { useAuth } from "@/hooks/useAuth";
import { ROLE_COLORS } from "@/lib/utils";
import { cn } from "@/lib/utils";

const Icons: Record<string, string> = {
  home: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
  users: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75 M9 11a4 4 0 100-8 4 4 0 000 8z",
  chat: "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z",
  zap: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  map: "M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4 M8 2v16 M16 6v16",
  briefcase: "M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 100 6 3 3 0 000-6z",
  bell: "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 01-3.46 0",
  award: "M12 15a7 7 0 100-14 7 7 0 000 14z M8.21 13.89L7 23l5-3 5 3-1.21-9.12",
  book: "M4 19.5A2.5 2.5 0 016.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z",
  trend: "M23 6l-9.5 9.5-5-5L1 18 M17 6h6v6",
  settings: "M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z",
  activity: "M22 12h-4l-3 9L9 3l-3 9H2",
  code: "M16 18l6-6-6-6 M8 6l-6 6 6 6",
  db: "M12 2a9 3 0 100 6A9 3 0 0012 2z M3 5v4a9 3 0 0018 0V5 M3 9v4a9 3 0 0018 0V9 M3 13v4a9 3 0 0018 0v-4",
  logout: "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9",
  menu: "M3 12h18 M3 6h18 M3 18h18",
  cpu: "M18 4h2a2 2 0 012 2v2 M18 20h2a2 2 0 002-2v-2 M6 4H4a2 2 0 00-2 2v2 M6 20H4a2 2 0 01-2-2v-2 M9 9h6v6H9z M9 1v3 M15 1v3 M9 20v3 M15 20v3 M20 9h3 M20 14h3 M1 9h3 M1 14h3",
};

const SvgIcon = ({ d, size = 18 }: { d: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    {d.split(" M").map((segment, i) => (
      <path key={i} d={i === 0 ? segment : "M" + segment} />
    ))}
  </svg>
);

const navLinks: Record<string, Array<{ id: string; label: string; icon: string; badge?: boolean }>> = {
  STUDENT: [
    { id: "dashboard", label: "Dashboard", icon: "home" },
    { id: "alumni", label: "Alumni Network", icon: "users" },
    { id: "chat", label: "Messages", icon: "chat", badge: true },
    { id: "mentorship", label: "Mentorship", icon: "zap" },
    { id: "events", label: "Events", icon: "map" },
    { id: "jobs", label: "Placements", icon: "briefcase" },
    { id: "complaints", label: "Complaints", icon: "shield" },
    { id: "notifications", label: "Notifications", icon: "bell", badge: true },
    { id: "profile", label: "My Profile", icon: "eye" },
  ],
  ALUMNI: [
    { id: "dashboard", label: "Dashboard", icon: "home" },
    { id: "alumni", label: "Network", icon: "users" },
    { id: "chat", label: "Messages", icon: "chat", badge: true },
    { id: "mentorship", label: "Mentees", icon: "zap" },
    { id: "jobs", label: "Post Jobs", icon: "briefcase" },
    { id: "events", label: "Events", icon: "map" },
    { id: "notifications", label: "Notifications", icon: "bell", badge: true },
    { id: "profile", label: "My Portfolio", icon: "award" },
  ],
  ADMIN: [
    { id: "dashboard", label: "Overview", icon: "home" },
    { id: "alumni", label: "User Management", icon: "users" },
    { id: "complaints", label: "Complaints", icon: "shield", badge: true },
    { id: "events", label: "Events", icon: "map" },
    { id: "jobs", label: "Placements", icon: "briefcase" },
    { id: "notifications", label: "Broadcast", icon: "bell" },
    { id: "settings", label: "Settings", icon: "settings" },
  ],
  DEVELOPER: [
    { id: "dashboard", label: "System Overview", icon: "cpu" },
    { id: "alumni", label: "All Users", icon: "users" },
    { id: "complaints", label: "Complaints", icon: "shield" },
    { id: "jobs", label: "Jobs", icon: "briefcase" },
    { id: "notifications", label: "Logs", icon: "activity" },
    { id: "settings", label: "System Config", icon: "settings" },
  ],
};

export default function Sidebar() {
  const { user } = useAuthStore();
  const { sidebarCollapsed, toggleSidebar, activeSection, setSection } = useUIStore();
  const { unreadCount } = useNotificationStore();
  const { logout } = useAuth();

  if (!user) return null;

  const links = navLinks[user.role] || navLinks.STUDENT;
  const color = ROLE_COLORS[user.role] || "#6366f1";
  const profileName = user.profile ? `${user.profile.firstName} ${user.profile.lastName}` : user.email;
  const initials = user.profile ? `${user.profile.firstName[0]}${user.profile.lastName[0]}` : user.email.slice(0, 2).toUpperCase();

  return (
    <aside style={{
      width: sidebarCollapsed ? 64 : 240,
      minHeight: "100vh",
      background: "rgba(5,5,16,0.97)",
      borderRight: "1px solid rgba(255,255,255,0.06)",
      display: "flex",
      flexDirection: "column",
      transition: "width 0.3s cubic-bezier(0.16,1,0.3,1)",
      flexShrink: 0,
      position: "sticky",
      top: 0,
      zIndex: 40,
    }}>
      {/* Logo */}
      <div style={{ padding: sidebarCollapsed ? "18px 14px" : "18px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${color}, ${color}88)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: `0 0 20px ${color}40` }}>
          <span style={{ fontSize: 18, color: "white" }}>⚡</span>
        </div>
        {!sidebarCollapsed && <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 16, background: "linear-gradient(135deg,#6366f1,#06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>AlumniVerse</span>}
        <button onClick={toggleSidebar} style={{ marginLeft: "auto", width: 28, height: 28, borderRadius: 8, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#64748b", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <SvgIcon d={Icons.menu} size={14} />
        </button>
      </div>

      {/* Role badge */}
      {!sidebarCollapsed && (
        <div style={{ padding: "10px 14px" }}>
          <div style={{ padding: "7px 12px", borderRadius: 10, background: `${color}15`, border: `1px solid ${color}30`, display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: color }} />
            <span style={{ fontSize: 12, fontWeight: 600, color, textTransform: "capitalize" }}>{user.role.toLowerCase()} Mode</span>
          </div>
        </div>
      )}

      {/* Nav links */}
      <nav style={{ padding: "6px 10px", flex: 1, overflowY: "auto" }}>
        {links.map((link) => {
          const isActive = activeSection === link.id;
          const hasBadge = link.badge && unreadCount > 0;
          return (
            <div
              key={link.id}
              onClick={() => setSection(link.id)}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: sidebarCollapsed ? 10 : "10px 14px",
                borderRadius: 12, marginBottom: 2, cursor: "pointer",
                justifyContent: sidebarCollapsed ? "center" : "flex-start",
                background: isActive ? `${color}18` : "transparent",
                border: isActive ? `1px solid ${color}30` : "1px solid transparent",
                color: isActive ? color : "#64748b",
                transition: "all 0.2s",
                fontSize: 14, fontWeight: 500,
                position: "relative",
              }}
              onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.04)"; }}
              onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}
            >
              <span style={{ flexShrink: 0 }}><SvgIcon d={Icons[link.icon]} size={18} /></span>
              {!sidebarCollapsed && <span>{link.label}</span>}
              {!sidebarCollapsed && hasBadge && (
                <span style={{ marginLeft: "auto", minWidth: 18, height: 18, padding: "0 5px", borderRadius: 9, background: "#f43f5e", color: "white", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
              {sidebarCollapsed && hasBadge && (
                <div style={{ position: "absolute", top: 4, right: 4, width: 8, height: 8, borderRadius: "50%", background: "#f43f5e" }} />
              )}
            </div>
          );
        })}
      </nav>

      {/* Profile + Logout */}
      <div style={{ padding: "10px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        {!sidebarCollapsed && (
          <div style={{ display: "flex", gap: 10, alignItems: "center", padding: "10px 12px", borderRadius: 12, background: "rgba(255,255,255,0.03)", marginBottom: 6 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg,${color},${color}88)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "white", flexShrink: 0 }}>
              {initials}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{profileName}</div>
              <div style={{ fontSize: 11, color: "#64748b", textTransform: "capitalize" }}>{user.role.toLowerCase()}</div>
            </div>
          </div>
        )}
        <div
          onClick={logout}
          style={{ display: "flex", alignItems: "center", gap: 10, padding: sidebarCollapsed ? 10 : "10px 14px", borderRadius: 12, cursor: "pointer", color: "#f43f5e", justifyContent: sidebarCollapsed ? "center" : "flex-start", fontSize: 14, fontWeight: 500, transition: "background 0.2s" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = "rgba(244,63,94,0.08)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}
        >
          <SvgIcon d={Icons.logout} size={18} />
          {!sidebarCollapsed && <span>Sign Out</span>}
        </div>
      </div>
    </aside>
  );
}

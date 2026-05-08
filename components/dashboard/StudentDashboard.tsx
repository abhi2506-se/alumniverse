"use client";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useUIStore } from "@/store/stores";
import StatCard from "@/components/common/StatCard";
import { AreaChart, Area, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

const activityData = [
  { m: "Jan", v: 820 }, { m: "Feb", v: 1200 }, { m: "Mar", v: 980 },
  { m: "Apr", v: 1450 }, { m: "May", v: 1800 }, { m: "Jun", v: 2200 },
  { m: "Jul", v: 2600 }, { m: "Aug", v: 2900 },
];

const ALUMNI_SPOTLIGHT = [
  { name: "Arjun Mehta", company: "Google", role: "Sr. SWE", color: "#6366f1", skills: ["React", "ML"] },
  { name: "Priya Sharma", company: "Microsoft", role: "PM", color: "#8b5cf6", skills: ["Product", "Strategy"] },
  { name: "Rohan Verma", company: "Stripe", role: "Backend Eng.", color: "#06b6d4", skills: ["Node.js", "Go"] },
  { name: "Ananya Rao", company: "Figma", role: "Sr. Designer", color: "#f59e0b", skills: ["UI/UX", "Figma"] },
];

const EVENTS = [
  { title: "Annual Alumni Meetup", date: "Jun 15", type: "Offline", color: "#6366f1", attendees: 234 },
  { title: "AI & ML Career Panel", date: "Jun 22", type: "Online", color: "#06b6d4", attendees: 512 },
  { title: "Startup Pitch Competition", date: "Jul 5", type: "Hybrid", color: "#8b5cf6", attendees: 89 },
];

const JOBS = [
  { title: "Frontend Dev Intern", company: "Google", pkg: "₹80K/mo", color: "#10b981" },
  { title: "Data Analyst", company: "CRED", pkg: "₹12 LPA", color: "#06b6d4" },
  { title: "Product Manager", company: "Meesho", pkg: "₹22 LPA", color: "#8b5cf6" },
];

const CHART_TOOLTIP_STYLE = {
  background: "var(--sidebar-bg)", border: "1px solid var(--border)",
  borderRadius: 10, color: "var(--text)", fontSize: 12,
};

export default function StudentDashboard() {
  const { user } = useAuthStore();
  const { setSection } = useUIStore();

  const firstName = user?.profile?.firstName || "Student";

  return (
    <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Welcome Banner */}
      <div style={{
        borderRadius: 20, padding: "28px 32px",
        background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.08))",
        border: "1px solid rgba(99,102,241,0.22)",
        display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16,
      }}>
        <div>
          <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 4 }}>Good morning 👋</div>
          <h2 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: "var(--text)", marginBottom: 6 }}>
            Welcome back, <span className="grad-text">{firstName}</span>
          </h2>
          <p style={{ fontSize: 14, color: "var(--muted)" }}>
            Your profile score is <strong style={{ color: "#f59e0b" }}>78%</strong> — add more skills to unlock better matches!
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button onClick={() => setSection("alumni")} style={{ padding: "10px 22px", borderRadius: 12, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "Space Grotesk,sans-serif" }}>
            🔍 Find Mentors
          </button>
          <button onClick={() => setSection("jobs")} style={{ padding: "10px 22px", borderRadius: 12, background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)", fontWeight: 600, fontSize: 14, cursor: "pointer", fontFamily: "Space Grotesk,sans-serif" }}>
            💼 Browse Jobs
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px,1fr))", gap: 14 }}>
        <StatCard label="Profile Score" value={78} suffix="%" icon="⭐" color="#f59e0b" delta={5} delay={0} />
        <StatCard label="Connections" value={24} icon="🤝" color="#6366f1" delta={3} delay={0.08} />
        <StatCard label="Interviews Booked" value={6} icon="📅" color="#06b6d4" delta={1} delay={0.16} />
        <StatCard label="Saved Jobs" value={14} icon="💼" color="#10b981" delay={0.24} />
      </div>

      {/* Charts Row */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
        {/* Activity Chart */}
        <div className="glass" style={{ borderRadius: 16, padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div>
              <div className="font-display" style={{ fontWeight: 700, color: "var(--text)" }}>Platform Activity</div>
              <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 3 }}>User registrations over time</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {["1M","3M","1Y"].map((p) => (
                <button key={p} style={{ padding: "4px 10px", borderRadius: 8, background: "var(--surface)", border: "1px solid var(--border)", color: "var(--muted)", fontSize: 11, cursor: "pointer" }}>{p}</button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={activityData}>
              <defs>
                <linearGradient id="gA" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="m" stroke="transparent" tick={{ fill: "var(--muted)", fontSize: 11 }} />
              <YAxis stroke="transparent" tick={{ fill: "var(--muted)", fontSize: 11 }} />
              <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
              <Area type="monotone" dataKey="v" stroke="#6366f1" strokeWidth={2} fill="url(#gA)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Profile Progress */}
        <div className="glass" style={{ borderRadius: 16, padding: 24 }}>
          <div className="font-display" style={{ fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>Profile Strength</div>
          <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 20 }}>Complete to unlock full access</div>
          {[
            { label: "Basic Info", done: true, pct: 100 },
            { label: "Skills Added", done: true, pct: 100 },
            { label: "Photo Uploaded", done: true, pct: 100 },
            { label: "Resume Uploaded", done: false, pct: 0 },
            { label: "LinkedIn Connected", done: false, pct: 0 },
            { label: "GitHub Connected", done: false, pct: 0 },
          ].map((item) => (
            <div key={item.label} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 5 }}>
                <span style={{ color: item.done ? "var(--text)" : "var(--muted)" }}>{item.done ? "✅" : "⬜"} {item.label}</span>
                {!item.done && <span onClick={() => setSection("profile")} style={{ color: "var(--accent)", cursor: "pointer" }}>Add →</span>}
              </div>
              <div style={{ height: 3, borderRadius: 2, background: "var(--border)" }}>
                <div style={{ height: "100%", borderRadius: 2, width: `${item.pct}%`, background: item.done ? "linear-gradient(90deg,#10b981,#06b6d4)" : "transparent", transition: "width 1s ease" }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lower Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 16 }}>
        {/* Alumni Spotlight */}
        <div className="glass" style={{ borderRadius: 16, padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <span className="font-display" style={{ fontWeight: 700, fontSize: 16, color: "var(--text)" }}>Alumni Spotlight</span>
            <span onClick={() => setSection("alumni")} style={{ fontSize: 12, color: "var(--accent)", cursor: "pointer" }}>View All →</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {ALUMNI_SPOTLIGHT.map((a, i) => (
              <div key={i} className="card-hover" style={{ display: "flex", gap: 12, alignItems: "center", padding: "10px 12px", borderRadius: 12, background: "var(--card-bg)", border: "1px solid var(--border)" }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: `linear-gradient(135deg,${a.color},${a.color}88)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                  {a.name.slice(0, 2).toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: "var(--text)" }}>{a.name}</div>
                  <div style={{ fontSize: 12, color: "var(--muted)" }}>{a.role} @ {a.company}</div>
                  <div style={{ display: "flex", gap: 4, marginTop: 4 }}>
                    {a.skills.map((s) => <span key={s} style={{ fontSize: 10, padding: "2px 7px", borderRadius: 100, background: `${a.color}15`, color: a.color, border: `1px solid ${a.color}25` }}>{s}</span>)}
                  </div>
                </div>
                <button onClick={() => setSection("alumni")} style={{ padding: "5px 12px", borderRadius: 8, background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)", fontSize: 12, cursor: "pointer" }}>Connect</button>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="glass" style={{ borderRadius: 16, padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <span className="font-display" style={{ fontWeight: 700, fontSize: 16, color: "var(--text)" }}>Upcoming Events</span>
            <span onClick={() => setSection("events")} style={{ fontSize: 12, color: "var(--accent)", cursor: "pointer" }}>All Events →</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {EVENTS.map((ev, i) => (
              <div key={i} className="card-hover" style={{ display: "flex", gap: 12, alignItems: "center", padding: "10px 12px", borderRadius: 12, background: "var(--card-bg)", border: "1px solid var(--border)" }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: `${ev.color}20`, border: `1px solid ${ev.color}30`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: ev.color, lineHeight: 1 }}>{ev.date.split(" ")[1]}</div>
                  <div style={{ fontSize: 9, color: ev.color, opacity: 0.7 }}>{ev.date.split(" ")[0]}</div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ev.title}</div>
                  <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 3 }}>{ev.attendees} attending · {ev.type}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hot Placements */}
        <div className="glass" style={{ borderRadius: 16, padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <span className="font-display" style={{ fontWeight: 700, fontSize: 16, color: "var(--text)" }}>Hot Placements</span>
            <span onClick={() => setSection("jobs")} style={{ fontSize: 12, color: "var(--accent)", cursor: "pointer" }}>View All →</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {JOBS.map((j, i) => (
              <div key={i} style={{ padding: "12px 14px", borderRadius: 12, background: "var(--card-bg)", border: `1px solid ${j.color}20` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: "var(--text)" }}>{j.title}</div>
                    <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{j.company}</div>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: j.color }}>{j.pkg}</div>
                </div>
                <button style={{ width: "100%", padding: "7px", borderRadius: 9, background: `${j.color}18`, border: `1px solid ${j.color}30`, color: j.color, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "Space Grotesk,sans-serif" }}>
                  Apply Now →
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

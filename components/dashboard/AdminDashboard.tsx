"use client";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useUIStore } from "@/store/stores";
import StatCard from "@/components/common/StatCard";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

const CHART_STYLE = { background:"var(--sidebar-bg)", border:"1px solid var(--border)", borderRadius:10, color:"var(--text)", fontSize:12 };

const barData = [
  {m:"Jan",s:42,a:18},{m:"Feb",s:68,a:24},{m:"Mar",s:55,a:15},{m:"Apr",s:90,a:32},
  {m:"May",s:120,a:45},{m:"Jun",s:145,a:52},{m:"Jul",s:180,a:60},{m:"Aug",s:210,a:74},
];

const PENDING = [
  { name:"Rahul Singh", role:"Student", branch:"CSE", year:2025, color:"#06b6d4" },
  { name:"Meera Patel", role:"Alumni", branch:"CSE", year:2022, color:"#8b5cf6" },
  { name:"Vikram Shah", role:"Student", branch:"ECE", year:2025, color:"#6366f1" },
  { name:"Shruti Jain", role:"Alumni", branch:"MBA", year:2021, color:"#f59e0b" },
];

export default function AdminDashboard() {
  const { user, accessToken } = useAuthStore();
  const { setSection } = useUIStore();
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch("/api/admin/stats", { headers: { Authorization: `Bearer ${accessToken}` } })
      .then(r => r.json())
      .then(d => setStats(d.stats))
      .catch(() => {});
  }, []);

  return (
    <div style={{ padding:24, display:"flex", flexDirection:"column", gap:24 }}>
      <div style={{ borderRadius:20, padding:"28px 32px", background:"linear-gradient(135deg,rgba(16,185,129,0.12),rgba(6,182,212,0.07))", border:"1px solid rgba(16,185,129,0.22)", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:16 }}>
        <div>
          <div style={{ fontSize:13, color:"var(--muted)", marginBottom:4 }}>Admin Panel 🛡️</div>
          <h2 className="font-display" style={{ fontSize:26, fontWeight:800, color:"var(--text)" }}>Platform Overview</h2>
          <p style={{ fontSize:14, color:"var(--muted)", marginTop:6 }}>Manage users, complaints, events, and announcements.</p>
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={()=>setSection("alumni")} style={{ padding:"10px 22px", borderRadius:12, background:"linear-gradient(135deg,#10b981,#06b6d4)", border:"none", color:"#fff", fontWeight:700, fontSize:14, cursor:"pointer" }}>👥 Manage Users</button>
          <button onClick={()=>setSection("notifications")} style={{ padding:"10px 22px", borderRadius:12, background:"var(--surface)", border:"1px solid var(--border)", color:"var(--text)", fontWeight:600, fontSize:14, cursor:"pointer" }}>📢 Broadcast</button>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:14 }}>
        <StatCard label="Total Students" value={stats?.totalStudents ?? 12400} icon="🎓" color="#06b6d4" delta={8} delay={0} />
        <StatCard label="Total Alumni" value={stats?.totalAlumni ?? 8200} icon="👔" color="#8b5cf6" delta={12} delay={0.08} />
        <StatCard label="Active Jobs" value={stats?.activeJobs ?? 47} icon="💼" color="#10b981" delta={5} delay={0.16} />
        <StatCard label="Pending Approvals" value={stats?.pendingApprovals ?? 18} icon="⏳" color="#f59e0b" delay={0.24} />
        <StatCard label="Open Complaints" value={stats?.openComplaints ?? 7} icon="🛡️" color="#f43f5e" delay={0.32} />
        <StatCard label="Meetings Completed" value={stats?.completedMeetings ?? 234} icon="📅" color="#6366f1" delta={23} delay={0.40} />
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"3fr 2fr", gap:16 }}>
        <div className="glass" style={{ borderRadius:16, padding:24 }}>
          <div className="font-display" style={{ fontWeight:700, color:"var(--text)", marginBottom:4 }}>Monthly Registrations</div>
          <div style={{ fontSize:13, color:"var(--muted)", marginBottom:20 }}>Students vs Alumni sign-ups per month</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData}>
              <XAxis dataKey="m" stroke="transparent" tick={{fill:"var(--muted)",fontSize:11}}/>
              <YAxis stroke="transparent" tick={{fill:"var(--muted)",fontSize:11}}/>
              <Tooltip contentStyle={CHART_STYLE}/>
              <Bar dataKey="s" fill="#06b6d4" radius={[5,5,0,0]} name="Students"/>
              <Bar dataKey="a" fill="#8b5cf6" radius={[5,5,0,0]} name="Alumni"/>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass" style={{ borderRadius:16, padding:24 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <div className="font-display" style={{ fontWeight:700, color:"var(--text)" }}>Pending Approvals</div>
            <span style={{ fontSize: 12, color:"var(--accent)", cursor:"pointer" }} onClick={()=>setSection("alumni")}>View All →</span>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {PENDING.map((u,i)=>(
              <div key={i} style={{ display:"flex", gap:10, alignItems:"center", padding:"10px 12px", borderRadius:12, background:"var(--card-bg)", border:"1px solid var(--border)" }}>
                <div style={{ width:36, height:36, borderRadius:"50%", background:`linear-gradient(135deg,${u.color},${u.color}88)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, color:"#fff", flexShrink:0 }}>
                  {u.name.slice(0,2).toUpperCase()}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:600, fontSize:13, color:"var(--text)" }}>{u.name}</div>
                  <div style={{ fontSize:11, color:"var(--muted)" }}>{u.role} · {u.branch} · {u.year}</div>
                </div>
                <div style={{ display:"flex", gap:6 }}>
                  <button style={{ padding:"4px 10px", borderRadius:8, background:"rgba(16,185,129,0.15)", border:"1px solid rgba(16,185,129,0.3)", color:"#10b981", fontSize:11, fontWeight:700, cursor:"pointer" }}>Approve</button>
                  <button style={{ padding:"4px 9px", borderRadius:8, background:"rgba(244,63,94,0.1)", border:"1px solid rgba(244,63,94,0.2)", color:"#f43f5e", fontSize:11, cursor:"pointer" }}>Reject</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

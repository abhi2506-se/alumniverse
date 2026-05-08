"use client";
// AlumniDashboard
import { useAuthStore } from "@/store/useAuthStore";
import { useUIStore } from "@/store/stores";
import StatCard from "@/components/common/StatCard";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

const viewData = [
  {m:"Jan",v:120},{m:"Feb",v:340},{m:"Mar",v:280},{m:"Apr",v:520},
  {m:"May",v:780},{m:"Jun",v:1100},{m:"Jul",v:1650},{m:"Aug",v:2840},
];

const CHART_STYLE = { background:"var(--sidebar-bg)", border:"1px solid var(--border)", borderRadius:10, color:"var(--text)", fontSize:12 };

const MENTEES = [
  { name:"Rahul Singh", progress:65, goal:"Land Google internship", color:"#06b6d4" },
  { name:"Sneha Patel", progress:40, goal:"Get into product management", color:"#8b5cf6" },
  { name:"Karan Mehta", progress:82, goal:"Master system design", color:"#10b981" },
];

export default function AlumniDashboard() {
  const { user } = useAuthStore();
  const { setSection } = useUIStore();
  const name = user?.profile?.firstName || "Alumni";

  return (
    <div style={{ padding:24, display:"flex", flexDirection:"column", gap:24 }}>
      <div style={{ borderRadius:20, padding:"28px 32px", background:"linear-gradient(135deg,rgba(139,92,246,0.15),rgba(99,102,241,0.08))", border:"1px solid rgba(139,92,246,0.22)", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:16 }}>
        <div>
          <div style={{ fontSize:13, color:"var(--muted)", marginBottom:4 }}>Alumni Dashboard 🚀</div>
          <h2 className="font-display" style={{ fontSize:26, fontWeight:800, color:"var(--text)" }}>
            Welcome, <span className="grad-text">{name}</span>
          </h2>
          <p style={{ fontSize:14, color:"var(--muted)", marginTop:6 }}>You're making an impact. 12 students are following your journey.</p>
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={()=>setSection("chat")} style={{ padding:"10px 22px", borderRadius:12, background:"linear-gradient(135deg,#8b5cf6,#6366f1)", border:"none", color:"#fff", fontWeight:700, fontSize:14, cursor:"pointer" }}>💬 Messages</button>
          <button onClick={()=>setSection("jobs")} style={{ padding:"10px 22px", borderRadius:12, background:"var(--surface)", border:"1px solid var(--border)", color:"var(--text)", fontWeight:600, fontSize:14, cursor:"pointer" }}>Post a Job</button>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:14 }}>
        <StatCard label="Profile Views" value={2840} icon="👁️" color="#8b5cf6" delta={18} delay={0} />
        <StatCard label="Active Mentees" value={12} icon="👥" color="#06b6d4" delta={2} delay={0.08} />
        <StatCard label="Connections" value={348} icon="🤝" color="#10b981" delta={6} delay={0.16} />
        <StatCard label="Blog Reads" value={9400} icon="📖" color="#f59e0b" delta={31} delay={0.24} />
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:16 }}>
        <div className="glass" style={{ borderRadius:16, padding:24 }}>
          <div className="font-display" style={{ fontWeight:700, color:"var(--text)", marginBottom:4 }}>Profile Views Trend</div>
          <div style={{ fontSize:13, color:"var(--muted)", marginBottom:20 }}>How many students viewed your profile</div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={viewData}>
              <defs>
                <linearGradient id="gV" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.35}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="m" stroke="transparent" tick={{fill:"var(--muted)",fontSize:11}}/>
              <YAxis stroke="transparent" tick={{fill:"var(--muted)",fontSize:11}}/>
              <Tooltip contentStyle={CHART_STYLE}/>
              <Area type="monotone" dataKey="v" stroke="#8b5cf6" strokeWidth={2} fill="url(#gV)"/>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass" style={{ borderRadius:16, padding:24 }}>
          <div className="font-display" style={{ fontWeight:700, color:"var(--text)", marginBottom:16 }}>Mentee Progress</div>
          {MENTEES.map((m,i)=>(
            <div key={i} style={{ marginBottom:18 }}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, marginBottom:6 }}>
                <span style={{ fontWeight:600, color:"var(--text)" }}>{m.name}</span>
                <span style={{ color:m.color, fontWeight:700 }}>{m.progress}%</span>
              </div>
              <div style={{ fontSize:11, color:"var(--muted)", marginBottom:6 }}>Goal: {m.goal}</div>
              <div style={{ height:4, borderRadius:2, background:"var(--border)" }}>
                <div style={{ height:"100%", borderRadius:2, width:`${m.progress}%`, background:`linear-gradient(90deg,${m.color},${m.color}88)`, transition:"width 1s" }}/>
              </div>
            </div>
          ))}
          <button onClick={()=>setSection("mentorship")} style={{ width:"100%", padding:"9px", borderRadius:10, background:"rgba(139,92,246,0.15)", border:"1px solid rgba(139,92,246,0.3)", color:"#a78bfa", fontSize:13, fontWeight:700, cursor:"pointer" }}>
            Manage All Mentees →
          </button>
        </div>
      </div>
    </div>
  );
}

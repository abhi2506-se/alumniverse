"use client";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import StatCard from "@/components/common/StatCard";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

const CHART_STYLE = { background:"var(--sidebar-bg)", border:"1px solid var(--border)", borderRadius:10, color:"var(--text)", fontSize:12 };

const uptimeData = Array.from({length:24},(_,i)=>({ h:`${i}h`, cpu: 20+Math.random()*40, mem: 50+Math.random()*25 }));

const LOGS = [
  { level:"INFO",  time:"11:42:01", msg:"Socket.IO: 847 clients connected",           color:"#06b6d4" },
  { level:"WARN",  time:"11:38:15", msg:"Rate limit hit: /api/alumni/search - 192.168.1.104", color:"#f59e0b" },
  { level:"ERROR", time:"11:35:02", msg:"DB pool timeout after 5000ms on read replica", color:"#f43f5e" },
  { level:"INFO",  time:"11:30:00", msg:"Prisma migration: 0044_add_index_mentorship",  color:"#10b981" },
  { level:"WARN",  time:"11:25:44", msg:"Suspicious login from 45.33.32.156 – alerted", color:"#f59e0b" },
  { level:"INFO",  time:"11:20:11", msg:"Email sent via Resend: 42 emails dispatched",  color:"#10b981" },
];

const ENDPOINTS = [
  { ep:"POST /api/auth/login",             rps:42,  avg:"46ms",  ok:true },
  { ep:"GET  /api/alumni",                 rps:120, avg:"108ms", ok:false },
  { ep:"GET  /api/dashboard/stats",        rps:56,  avg:"22ms",  ok:true },
  { ep:"POST /api/chat/[roomId]/messages", rps:340, avg:"7ms",   ok:true },
  { ep:"POST /api/mentorship/meetings",    rps:8,   avg:"84ms",  ok:true },
  { ep:"POST /api/complaints",             rps:2,   avg:"91ms",  ok:true },
];

export default function DevDashboard() {
  const { accessToken } = useAuthStore();
  const [devStats, setDevStats] = useState<any>(null);

  useEffect(() => {
    fetch("/api/developer/stats", { headers: { Authorization: `Bearer ${accessToken}` } })
      .then(r => r.json())
      .then(d => setDevStats(d))
      .catch(() => {});
  }, []);

  return (
    <div style={{ padding:24, display:"flex", flexDirection:"column", gap:24 }}>
      {/* Warning Banner */}
      <div style={{ padding:"14px 20px", borderRadius:14, background:"rgba(244,63,94,0.08)", border:"1px solid rgba(244,63,94,0.25)", display:"flex", alignItems:"center", gap:12 }}>
        <span style={{ fontSize:20 }}>🔒</span>
        <div>
          <span style={{ fontWeight:700, color:"#f43f5e", fontSize:14 }}>DEVELOPER ACCESS — RESTRICTED ZONE</span>
          <span style={{ fontSize:13, color:"var(--muted)", marginLeft:12 }}>All actions are logged and audited in real time.</span>
        </div>
        <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:6 }}>
          <div className="status-dot" />
          <span style={{ fontSize:12, color:"#10b981" }}>Live</span>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:14 }}>
        <StatCard label="Total Users" value={devStats?.dbTableCounts?.users ?? 20642} icon="👥" color="#6366f1" delta={12} delay={0} />
        <StatCard label="Total Messages" value={devStats?.dbTableCounts?.messages ?? 184000} icon="💬" color="#06b6d4" delay={0.08} />
        <StatCard label="Connections" value={devStats?.dbTableCounts?.connections ?? 9400} icon="🤝" color="#10b981" delay={0.16} />
        <StatCard label="Meetings" value={devStats?.dbTableCounts?.meetings ?? 1832} icon="📅" color="#8b5cf6" delay={0.24} />
      </div>

      {/* Server Health + Logs */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        <div className="glass" style={{ borderRadius:16, padding:24 }}>
          <div className="font-display" style={{ fontWeight:700, color:"var(--text)", marginBottom:4 }}>Server Health</div>
          <div style={{ fontSize:13, color:"var(--muted)", marginBottom:20 }}>CPU & Memory over last 24 hours</div>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={uptimeData}>
              <XAxis dataKey="h" stroke="transparent" tick={{fill:"var(--muted)",fontSize:10}}/>
              <YAxis stroke="transparent" tick={{fill:"var(--muted)",fontSize:10}} domain={[0,100]}/>
              <Tooltip contentStyle={CHART_STYLE}/>
              <Line type="monotone" dataKey="cpu" stroke="#6366f1" strokeWidth={2} dot={false} name="CPU %"/>
              <Line type="monotone" dataKey="mem" stroke="#10b981" strokeWidth={2} dot={false} name="Memory %"/>
            </LineChart>
          </ResponsiveContainer>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginTop:16 }}>
            {[
              ["Uptime","99.97%","#10b981"], ["Node.js", devStats?.serverInfo?.nodeVersion ?? "v20","#06b6d4"],
              ["API Calls/hr","24,891","#6366f1"], ["Error Rate","0.02%","#10b981"],
            ].map(([l,v,c])=>(
              <div key={l} style={{ padding:"9px 12px", borderRadius:10, background:`${c}10`, border:`1px solid ${c}20`, textAlign:"center" }}>
                <div className="font-mono" style={{ fontSize:15, fontWeight:700, color:c as string }}>{v}</div>
                <div style={{ fontSize:11, color:"var(--muted)", marginTop:2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass" style={{ borderRadius:16, padding:24 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <div className="font-display" style={{ fontWeight:700, color:"var(--text)" }}>Live Error Logs</div>
            <div className="status-dot" />
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:8, maxHeight:280, overflowY:"auto" }}>
            {LOGS.map((l,i)=>(
              <div key={i} style={{ padding:"9px 12px", borderRadius:10, background:`${l.color}08`, border:`1px solid ${l.color}18` }}>
                <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:4 }}>
                  <span style={{ fontSize:10, padding:"2px 8px", borderRadius:100, background:`${l.color}20`, color:l.color, fontFamily:"Space Mono,monospace", fontWeight:700 }}>{l.level}</span>
                  <span className="font-mono" style={{ fontSize:10, color:"var(--muted)" }}>{l.time}</span>
                </div>
                <div className="font-mono" style={{ fontSize:11, color:"var(--text)", lineHeight:1.5 }}>{l.msg}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* API Monitor */}
      <div className="glass" style={{ borderRadius:16, padding:24 }}>
        <div className="font-display" style={{ fontWeight:700, color:"var(--text)", marginBottom:16 }}>API Endpoint Monitor</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:12 }}>
          {ENDPOINTS.map((e,i)=>(
            <div key={i} style={{ padding:"12px 14px", borderRadius:12, background:"var(--card-bg)", border:`1px solid ${e.ok?"rgba(16,185,129,0.2)":"rgba(244,63,94,0.2)"}` }}>
              <div className="font-mono" style={{ fontSize:11, color:e.ok?"#10b981":"#f43f5e", marginBottom:8, wordBreak:"break-all" }}>{e.ep}</div>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:12 }}>
                <span style={{ color:"var(--muted)" }}>RPS: <strong style={{ color:"var(--text)" }}>{e.rps}</strong></span>
                <span style={{ color:"var(--muted)" }}>Avg: <strong style={{ color:e.ok?"#10b981":"#f59e0b" }}>{e.avg}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

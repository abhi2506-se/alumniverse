// ── ComplaintsPage ───────────────────────────────────────────────────────────
"use client";
import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";

const STATUS_COLORS: Record<string,string> = { PENDING:"#64748b", UNDER_REVIEW:"#f59e0b", INVESTIGATING:"#06b6d4", RESOLVED:"#10b981", REJECTED:"#f43f5e" };
const CATS = ["Academic","Infrastructure","Faculty Conduct","Hostel","Library","Harassment","Other"];

const SAMPLE: any[] = [
  { id:"c1", complaintId:"CMP-0001", subject:"Unfair grading in semester exam", status:"UNDER_REVIEW", date:"Jun 1", category:"Academic" },
  { id:"c2", complaintId:"CMP-0002", subject:"Library access revoked without notice", status:"RESOLVED",    date:"May 28", category:"Library" },
  { id:"c3", complaintId:"CMP-0003", subject:"Hostel maintenance delayed 2+ weeks",  status:"INVESTIGATING",date:"Jun 5", category:"Infrastructure" },
];

export function ComplaintsPage() {
  const { user } = useAuthStore();
  const isAdmin = user?.role==="ADMIN"||user?.role==="DEVELOPER";
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ category:"Academic", subject:"", description:"" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => { if(!form.subject||!form.description) return; setSubmitted(true); setShow(false); };

  return (
    <div style={{ padding:24 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
        <div>
          <h2 className="font-display" style={{ fontSize:22, fontWeight:800, color:"var(--text)" }}>Complaint Portal</h2>
          <p style={{ color:"var(--muted)", fontSize:14, marginTop:4 }}>Track and manage complaints transparently</p>
        </div>
        {!isAdmin && <button onClick={()=>setShow(!show)} style={{ padding:"10px 24px", borderRadius:12, background:"linear-gradient(135deg,#6366f1,#8b5cf6)", border:"none", color:"#fff", fontWeight:700, fontSize:14, cursor:"pointer" }}>+ File Complaint</button>}
      </div>

      {submitted && <div style={{ padding:"12px 18px", borderRadius:12, background:"rgba(16,185,129,0.1)", border:"1px solid rgba(16,185,129,0.3)", color:"#10b981", marginBottom:20, display:"flex", gap:10, alignItems:"center" }}>✅ <span>Your complaint has been registered! Check your email for the complaint ID.</span></div>}

      {show && (
        <div className="glass animated-border animate-scale-in" style={{ borderRadius:20, padding:28, marginBottom:24 }}>
          <h3 className="font-display" style={{ fontWeight:700, color:"var(--text)", marginBottom:20 }}>File New Complaint</h3>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
            <div>
              <label style={{ fontSize:13, color:"var(--muted)", display:"block", marginBottom:8 }}>Category</label>
              <select value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))} style={{ width:"100%", background:"var(--input-bg)", border:"1px solid var(--input-border)", borderRadius:12, padding:"10px 12px", fontSize:14, color:"var(--text)", outline:"none", fontFamily:"Space Grotesk,sans-serif" }}>
                {CATS.map(c=><option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize:13, color:"var(--muted)", display:"block", marginBottom:8 }}>Against</label>
              <select style={{ width:"100%", background:"var(--input-bg)", border:"1px solid var(--input-border)", borderRadius:12, padding:"10px 12px", fontSize:14, color:"var(--text)", outline:"none" }}>
                <option>Faculty</option><option>Student</option><option>Alumni</option><option>Administration</option>
              </select>
            </div>
          </div>
          <div style={{ marginBottom:16 }}>
            <label style={{ fontSize:13, color:"var(--muted)", display:"block", marginBottom:8 }}>Subject *</label>
            <input value={form.subject} onChange={e=>setForm(f=>({...f,subject:e.target.value}))} placeholder="Brief subject of your complaint" style={{ width:"100%", background:"var(--input-bg)", border:"1px solid var(--input-border)", borderRadius:12, padding:"10px 14px", fontSize:14, color:"var(--text)", outline:"none", fontFamily:"Space Grotesk,sans-serif" }}/>
          </div>
          <div style={{ marginBottom:20 }}>
            <label style={{ fontSize:13, color:"var(--muted)", display:"block", marginBottom:8 }}>Description *</label>
            <textarea value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} placeholder="Provide detailed description of the issue…" style={{ width:"100%", background:"var(--input-bg)", border:"1px solid var(--input-border)", borderRadius:12, padding:14, fontSize:14, color:"var(--text)", outline:"none", minHeight:100, resize:"none", fontFamily:"Space Grotesk,sans-serif" }}/>
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <button onClick={handleSubmit} style={{ padding:"10px 28px", borderRadius:12, background:"linear-gradient(135deg,#6366f1,#8b5cf6)", border:"none", color:"#fff", fontSize:14, fontWeight:700, cursor:"pointer" }}>Submit Complaint</button>
            <button onClick={()=>setShow(false)} style={{ padding:"10px 20px", borderRadius:12, background:"var(--surface)", border:"1px solid var(--border)", color:"var(--text)", fontSize:14, cursor:"pointer" }}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {SAMPLE.map(c=>(
          <div key={c.id} className="glass card-hover" style={{ borderRadius:16, padding:"16px 20px", display:"flex", alignItems:"center", gap:16, flexWrap:"wrap" }}>
            <div style={{ width:46, height:46, borderRadius:12, background:`${STATUS_COLORS[c.status]}15`, border:`1px solid ${STATUS_COLORS[c.status]}30`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>🛡️</div>
            <div style={{ flex:1, minWidth:200 }}>
              <div style={{ fontWeight:600, color:"var(--text)", marginBottom:4 }}>{c.subject}</div>
              <div style={{ fontSize:12, color:"var(--muted)" }}>ID: <strong style={{ fontFamily:"Space Mono,monospace", color:"var(--accent)" }}>{c.complaintId}</strong> · {c.category} · Filed {c.date}</div>
            </div>
            <div style={{ display:"flex", gap:12, alignItems:"center" }}>
              <span style={{ fontSize:12, padding:"5px 12px", borderRadius:100, background:`${STATUS_COLORS[c.status]}18`, color:STATUS_COLORS[c.status], border:`1px solid ${STATUS_COLORS[c.status]}30`, fontWeight:700 }}>● {c.status.replace("_"," ")}</span>
              <button style={{ padding:"7px 16px", borderRadius:10, background:"var(--surface)", border:"1px solid var(--border)", color:"var(--text)", fontSize:13, cursor:"pointer" }}>{isAdmin?"Manage →":"Track →"}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ComplaintsPage;

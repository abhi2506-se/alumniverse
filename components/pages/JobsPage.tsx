// ── components/pages/JobsPage.tsx ─────────────────────────────────────────
"use client";
import { useState } from "react";

const JOBS = [
  { id:"j1", title:"Frontend Developer Intern", company:"Google",    pkg:"₹80K/mo", type:"Internship", deadline:"Jun 20", color:"#10b981", skills:["React","TypeScript","CSS"],    branches:["CSE"] },
  { id:"j2", title:"SDE-1 Full Stack",          company:"Google",    pkg:"₹28-35 LPA",type:"Full Time",deadline:"Jul 1",  color:"#6366f1", skills:["React","Node.js","Python"],  branches:["CSE"] },
  { id:"j3", title:"Data Analyst",              company:"CRED",      pkg:"₹12 LPA", type:"Full Time", deadline:"Jun 25", color:"#06b6d4", skills:["SQL","Python","Tableau"],     branches:["CSE","ECE"] },
  { id:"j4", title:"Product Manager",           company:"Meesho",    pkg:"₹22 LPA", type:"Full Time", deadline:"Jul 1",  color:"#8b5cf6", skills:["Strategy","Analytics"],       branches:["MBA","CSE"] },
  { id:"j5", title:"Backend Engineer",          company:"Razorpay",  pkg:"₹18 LPA", type:"Full Time", deadline:"Jun 28", color:"#f59e0b", skills:["Node.js","Go","PostgreSQL"], branches:["CSE"] },
  { id:"j6", title:"ML Engineer Intern",        company:"Amazon",    pkg:"₹60K/mo", type:"Internship", deadline:"Jul 5", color:"#f43f5e", skills:["PyTorch","Python","ML"],      branches:["CSE"] },
];

const TYPES = ["All","Full Time","Internship","Part Time"];

export function JobsPage() {
  const [type, setType] = useState("All");
  const [search, setSearch] = useState("");
  const [saved, setSaved] = useState<Set<string>>(new Set());

  const filtered = JOBS.filter(j=>{
    const mt = type==="All"||j.type===type;
    const ms = !search||j.title.toLowerCase().includes(search.toLowerCase())||j.company.toLowerCase().includes(search.toLowerCase());
    return mt&&ms;
  });

  return (
    <div style={{ padding:24 }}>
      <div style={{ display:"flex", gap:12, marginBottom:22, flexWrap:"wrap", alignItems:"center" }}>
        <div style={{ position:"relative", flex:1, minWidth:200 }}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search jobs, companies, skills…"
            style={{ width:"100%", background:"var(--input-bg)", border:"1px solid var(--input-border)", borderRadius:12, padding:"10px 12px 10px 38px", fontSize:14, color:"var(--text)", outline:"none", fontFamily:"Space Grotesk,sans-serif" }}/>
          <span style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)", color:"var(--muted)" }}>🔍</span>
        </div>
        <div style={{ display:"flex", gap:6 }}>
          {TYPES.map(t=>(
            <button key={t} onClick={()=>setType(t)} style={{ padding:"8px 16px", borderRadius:10, fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"Space Grotesk,sans-serif", background:type===t?"linear-gradient(135deg,#6366f1,#8b5cf6)":"var(--surface)", border:type===t?"none":"1px solid var(--border)", color:type===t?"#fff":"var(--muted)" }}>{t}</button>
          ))}
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:16 }}>
        {filtered.map(j=>(
          <div key={j.id} className="glass card-hover" style={{ borderRadius:16, padding:22, position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:-20, right:-20, width:80, height:80, background:`radial-gradient(circle,${j.color}15 0%,transparent 70%)`, pointerEvents:"none" }}/>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
              <div>
                <div className="font-display" style={{ fontSize:16, fontWeight:700, color:"var(--text)", marginBottom:4 }}>{j.title}</div>
                <div style={{ fontSize:13, color:"var(--muted)" }}>{j.company}</div>
              </div>
              <button onClick={()=>setSaved(p=>{ const n=new Set(p); n.has(j.id)?n.delete(j.id):n.add(j.id); return n; })} style={{ fontSize:18, background:"none", border:"none", cursor:"pointer" }}>
                {saved.has(j.id)?"🔖":"🏷️"}
              </button>
            </div>
            <div style={{ display:"flex", gap:7, flexWrap:"wrap", marginBottom:14 }}>
              {j.skills.map(s=><span key={s} style={{ fontSize:11, padding:"3px 9px", borderRadius:100, background:`${j.color}15`, color:j.color, border:`1px solid ${j.color}30` }}>{s}</span>)}
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, marginBottom:16 }}>
              <span style={{ padding:"4px 10px", borderRadius:100, background:"var(--surface)", border:"1px solid var(--border)", color:"var(--muted)" }}>{j.type}</span>
              <span style={{ fontSize:16, fontWeight:800, color:j.color }}>{j.pkg}</span>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:"var(--muted)", marginBottom:14 }}>
              <span>Eligible: {j.branches.join(", ")}</span>
              <span>Deadline: {j.deadline}</span>
            </div>
            <button style={{ width:"100%", padding:"9px", borderRadius:10, background:`linear-gradient(135deg,${j.color},${j.color}cc)`, border:"none", color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"Space Grotesk,sans-serif" }}>Apply Now →</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default JobsPage;

"use client";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useUIStore } from "@/store/stores";

const ALUMNI = [
  { id:"1", slug:"arjun-mehta",  name:"Arjun Mehta",  company:"Google",    role:"Senior SWE",          batch:2019, color:"#6366f1", skills:["React","Python","ML"],        verified:true,  rating:4.9, isMentor:true },
  { id:"2", slug:"priya-sharma", name:"Priya Sharma", company:"Microsoft", role:"Product Manager",     batch:2020, color:"#8b5cf6", skills:["Product","Strategy","Data"],   verified:true,  rating:4.8, isMentor:true },
  { id:"3", slug:"rohan-verma",  name:"Rohan Verma",  company:"Stripe",    role:"Backend Engineer",    batch:2018, color:"#06b6d4", skills:["Node.js","Go","AWS"],          verified:true,  rating:4.9, isMentor:true },
  { id:"4", slug:"ananya-rao",   name:"Ananya Rao",   company:"Figma",     role:"Sr. Product Designer",batch:2021, color:"#f59e0b", skills:["UI/UX","Figma","Branding"],   verified:true,  rating:4.7, isMentor:false },
  { id:"5", slug:"vikram-nair",  name:"Vikram Nair",  company:"Amazon",    role:"SDE-2",               batch:2019, color:"#10b981", skills:["Java","Spring","AWS","DynamoDB"],verified:false,rating:4.6, isMentor:true },
  { id:"6", slug:"sneha-kumar",  name:"Sneha Kumar",  company:"Meta",      role:"ML Engineer",         batch:2020, color:"#f43f5e", skills:["PyTorch","CUDA","Python"],     verified:true,  rating:4.8, isMentor:false },
  { id:"7", slug:"aditya-joshi", name:"Aditya Joshi", company:"Razorpay",  role:"FullStack Engineer",  batch:2021, color:"#06b6d4", skills:["React","Node.js","PostgreSQL"],verified:false, rating:4.5, isMentor:true },
  { id:"8", slug:"meera-patel",  name:"Meera Patel",  company:"Zomato",    role:"Data Scientist",      batch:2022, color:"#8b5cf6", skills:["Python","Pandas","ML","SQL"],  verified:true,  rating:4.7, isMentor:false },
];

const COMPANIES = ["All", "Google", "Microsoft", "Stripe", "Figma", "Amazon", "Meta", "Razorpay", "Zomato"];

export default function AlumniNetworkPage() {
  const { setSection } = useUIStore();
  const [search, setSearch] = useState("");
  const [company, setCompany] = useState("All");
  const [mentorOnly, setMentorOnly] = useState(false);
  const [connected, setConnected] = useState<Set<string>>(new Set());

  const filtered = ALUMNI.filter((a) => {
    const q = search.toLowerCase();
    const matchSearch = !q || a.name.toLowerCase().includes(q) || a.company.toLowerCase().includes(q) || a.role.toLowerCase().includes(q) || a.skills.some((s) => s.toLowerCase().includes(q));
    const matchCompany = company === "All" || a.company === company;
    const matchMentor = !mentorOnly || a.isMentor;
    return matchSearch && matchCompany && matchMentor;
  });

  const handleConnect = (id: string) => {
    setConnected((prev) => new Set([...prev, id]));
  };

  return (
    <div style={{ padding: 24 }}>
      {/* Featured Alumni Banner */}
      <div className="animated-border" style={{ borderRadius: 20, marginBottom: 24, overflow: "hidden" }}>
        <div style={{ padding: "28px 32px", background: "linear-gradient(135deg,rgba(99,102,241,0.12),rgba(139,92,246,0.07))", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 100, background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)", marginBottom: 12 }}>
              <span style={{ fontSize: 11, color: "#a5b4fc", fontWeight: 600 }}>⚡ Featured Alumni</span>
            </div>
            <h2 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: "var(--text)", marginBottom: 6 }}>Arjun Mehta 🇮🇳</h2>
            <p style={{ color: "var(--muted)", fontSize: 14 }}>Senior Software Engineer @ Google · CSE Batch 2019</p>
            <div style={{ display: "flex", gap: 7, marginTop: 12, flexWrap: "wrap" }}>
              {["React", "Python", "ML", "System Design", "Distributed Systems"].map((s) => (
                <span key={s} style={{ fontSize: 11, padding: "3px 10px", borderRadius: 100, background: "rgba(99,102,241,0.15)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.2)" }}>{s}</span>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button onClick={() => setSection("mentorship")} style={{ padding: "11px 28px", borderRadius: 12, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
              Request Mentorship
            </button>
            <button style={{ padding: "11px 28px", borderRadius: 12, background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
              View Portfolio
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, company, skills…"
            style={{ width: "100%", background: "var(--input-bg)", border: "1px solid var(--input-border)", borderRadius: 12, padding: "10px 12px 10px 38px", fontSize: 14, color: "var(--text)", outline: "none", fontFamily: "Space Grotesk,sans-serif" }} />
          <span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "var(--muted)", fontSize: 16 }}>🔍</span>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {COMPANIES.map((c) => (
            <button key={c} onClick={() => setCompany(c)} style={{ padding: "8px 16px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "Space Grotesk,sans-serif", background: company === c ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "var(--surface)", border: company === c ? "none" : "1px solid var(--border)", color: company === c ? "#fff" : "var(--muted)" }}>
              {c}
            </button>
          ))}
        </div>
        <button onClick={() => setMentorOnly(!mentorOnly)} style={{ padding: "8px 16px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "Space Grotesk,sans-serif", background: mentorOnly ? "rgba(16,185,129,0.2)" : "var(--surface)", border: mentorOnly ? "1px solid rgba(16,185,129,0.4)" : "1px solid var(--border)", color: mentorOnly ? "#10b981" : "var(--muted)" }}>
          {mentorOnly ? "✓" : ""} Mentors Only
        </button>
      </div>

      {/* Results count */}
      <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16 }}>
        Showing <strong style={{ color: "var(--text)" }}>{filtered.length}</strong> alumni
      </div>

      {/* Cards Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 16 }}>
        {filtered.map((a) => (
          <div key={a.id} className="glass card-hover" style={{ borderRadius: 16, padding: 20, position: "relative", overflow: "hidden" }}>
            {/* glow blob */}
            <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, background: `radial-gradient(circle,${a.color}20 0%,transparent 70%)`, pointerEvents: "none" }} />

            <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
              <div style={{ position: "relative", flexShrink: 0 }}>
                <div style={{ width: 52, height: 52, borderRadius: "50%", background: `linear-gradient(135deg,${a.color},${a.color}88)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: "#fff" }}>
                  {a.name.slice(0, 2).toUpperCase()}
                </div>
                {a.verified && (
                  <div style={{ position: "absolute", bottom: -2, right: -2, width: 16, height: 16, borderRadius: "50%", background: "#10b981", border: "2px solid var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8 }}>✓</div>
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="font-display" style={{ fontWeight: 700, fontSize: 16, color: "var(--text)" }}>{a.name}</div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>{a.role}</div>
                <div style={{ fontSize: 12, color: a.color, fontWeight: 600 }}>@ {a.company}</div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 12 }}>
              {a.skills.slice(0, 3).map((s) => (
                <span key={s} style={{ fontSize: 11, padding: "3px 9px", borderRadius: 100, background: `${a.color}15`, color: a.color, border: `1px solid ${a.color}30` }}>{s}</span>
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--muted)", marginBottom: 14 }}>
              <span>Batch {a.batch}</span>
              <span>⭐ {a.rating}</span>
              {a.isMentor && <span style={{ color: "#10b981", fontWeight: 600 }}>✦ Mentor</span>}
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              {connected.has(a.id) ? (
                <div style={{ flex: 1, padding: "8px", borderRadius: 10, background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)", color: "#10b981", fontSize: 13, fontWeight: 700, textAlign: "center" }}>
                  ✓ Connected
                </div>
              ) : (
                <button onClick={() => handleConnect(a.id)} style={{ flex: 1, padding: "8px", borderRadius: 10, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                  Connect
                </button>
              )}
              {a.isMentor && (
                <button onClick={() => setSection("mentorship")} style={{ flex: 1, padding: "8px", borderRadius: 10, background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                  Mentorship
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--muted)" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
          <div style={{ fontSize: 18, fontWeight: 600, color: "var(--text)", marginBottom: 8 }}>No alumni found</div>
          <div style={{ fontSize: 14 }}>Try adjusting your search or filters</div>
        </div>
      )}
    </div>
  );
}

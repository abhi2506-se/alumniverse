"use client";
import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { ROLE_COLORS, calculateProfileScore } from "@/lib/utils";

const ALL_SKILLS = ["React","Node.js","Python","Java","ML","Data Science","UI/UX","Product","Go","AWS","System Design","SQL","TypeScript","Docker","Kubernetes"];

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    firstName: user?.profile?.firstName || "",
    lastName: user?.profile?.lastName || "",
    bio: "",
    linkedinUrl: "",
    githubUrl: "",
    skills: ["React","Node.js","Python"] as string[],
  });
  const [saved, setSaved] = useState(false);

  const color = ROLE_COLORS[user?.role||"STUDENT"]||"#6366f1";
  const name = user?.profile ? `${user.profile.firstName} ${user.profile.lastName}` : user?.email||"";
  const initials = user?.profile ? `${user.profile.firstName[0]}${user.profile.lastName[0]}`.toUpperCase() : "??";
  const profileScore = calculateProfileScore({ bio: form.bio||null, avatarUrl: null, resumeUrl: null, linkedinUrl: form.linkedinUrl||null, githubUrl: form.githubUrl||null, skills: form.skills });

  const toggleSkill = (s:string)=>setForm(f=>({ ...f, skills: f.skills.includes(s)?f.skills.filter(x=>x!==s):[...f.skills,s] }));

  const handleSave = ()=>{ setSaved(true); setEditing(false); setTimeout(()=>setSaved(false),3000); };

  const inp = { width:"100%", background:"var(--input-bg)", border:"1px solid var(--input-border)", borderRadius:12, padding:"10px 14px", fontSize:14, color:"var(--text)", outline:"none", fontFamily:"Space Grotesk,sans-serif" } as React.CSSProperties;

  return (
    <div style={{ padding:24, maxWidth:900, margin:"0 auto" }}>
      {saved && <div style={{ padding:"12px 18px", borderRadius:12, background:"rgba(16,185,129,0.1)", border:"1px solid rgba(16,185,129,0.3)", color:"#10b981", marginBottom:20 }}>✅ Profile updated successfully!</div>}

      {/* Header */}
      <div className="glass" style={{ borderRadius:20, padding:28, marginBottom:24, display:"flex", gap:24, alignItems:"flex-start", flexWrap:"wrap" }}>
        <div style={{ position:"relative" }}>
          {user?.profile?.avatarUrl ? (
            <img src={user.profile.avatarUrl} alt="" style={{ width:96, height:96, borderRadius:"50%", objectFit:"cover", border:`3px solid ${color}40` }}/>
          ) : (
            <div style={{ width:96, height:96, borderRadius:"50%", background:`linear-gradient(135deg,${color},${color}88)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:30, fontWeight:800, color:"#fff", border:`3px solid ${color}30` }}>
              {initials}
            </div>
          )}
          <button style={{ position:"absolute", bottom:0, right:0, width:28, height:28, borderRadius:"50%", background:"linear-gradient(135deg,#6366f1,#8b5cf6)", border:"2px solid var(--bg)", cursor:"pointer", fontSize:13, display:"flex", alignItems:"center", justifyContent:"center" }}>📷</button>
        </div>
        <div style={{ flex:1, minWidth:200 }}>
          <div style={{ display:"flex", gap:10, alignItems:"center", flexWrap:"wrap", marginBottom:8 }}>
            <h2 className="font-display" style={{ fontSize:24, fontWeight:800, color:"var(--text)", margin:0 }}>{name}</h2>
            <span style={{ fontSize:11, padding:"3px 10px", borderRadius:100, background:`${color}18`, color, border:`1px solid ${color}30`, fontWeight:700 }}>{user?.role}</span>
          </div>
          <div style={{ fontSize:14, color:"var(--muted)", marginBottom:12 }}>{user?.email}</div>
          <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
            {form.linkedinUrl&&<a href={form.linkedinUrl} style={{ fontSize:12, color:"#0077b5", textDecoration:"none" }}>🔗 LinkedIn</a>}
            {form.githubUrl&&<a href={form.githubUrl} style={{ fontSize:12, color:"var(--text)", textDecoration:"none" }}>🐙 GitHub</a>}
          </div>
        </div>
        {/* Profile Score */}
        <div style={{ textAlign:"center", padding:"16px 24px", borderRadius:16, background:`${color}10`, border:`1px solid ${color}25` }}>
          <div className="font-display" style={{ fontSize:36, fontWeight:800, color }}>{profileScore}%</div>
          <div style={{ fontSize:12, color:"var(--muted)", marginTop:4 }}>Profile Score</div>
        </div>
        <button onClick={()=>setEditing(!editing)} style={{ padding:"10px 24px", borderRadius:12, background:editing?"var(--surface)":"linear-gradient(135deg,#6366f1,#8b5cf6)", border:editing?"1px solid var(--border)":"none", color:editing?"var(--text)":"#fff", fontWeight:700, fontSize:14, cursor:"pointer", alignSelf:"flex-start" }}>
          {editing?"Cancel":"Edit Profile"}
        </button>
      </div>

      {editing ? (
        <div className="glass" style={{ borderRadius:20, padding:28 }}>
          <h3 className="font-display" style={{ fontWeight:700, color:"var(--text)", marginBottom:22, fontSize:18 }}>Edit Profile</h3>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
            <div><label style={{ fontSize:13, color:"var(--muted)", display:"block", marginBottom:8 }}>First Name</label><input style={inp} value={form.firstName} onChange={e=>setForm(f=>({...f,firstName:e.target.value}))}/></div>
            <div><label style={{ fontSize:13, color:"var(--muted)", display:"block", marginBottom:8 }}>Last Name</label><input style={inp} value={form.lastName} onChange={e=>setForm(f=>({...f,lastName:e.target.value}))}/></div>
          </div>
          <div style={{ marginBottom:16 }}><label style={{ fontSize:13, color:"var(--muted)", display:"block", marginBottom:8 }}>Bio</label><textarea style={{ ...inp, minHeight:80, resize:"none" } as any} value={form.bio} onChange={e=>setForm(f=>({...f,bio:e.target.value}))} placeholder="Tell people about yourself…"/></div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:20 }}>
            <div><label style={{ fontSize:13, color:"var(--muted)", display:"block", marginBottom:8 }}>LinkedIn URL</label><input style={inp} value={form.linkedinUrl} onChange={e=>setForm(f=>({...f,linkedinUrl:e.target.value}))} placeholder="https://linkedin.com/in/…"/></div>
            <div><label style={{ fontSize:13, color:"var(--muted)", display:"block", marginBottom:8 }}>GitHub URL</label><input style={inp} value={form.githubUrl} onChange={e=>setForm(f=>({...f,githubUrl:e.target.value}))} placeholder="https://github.com/…"/></div>
          </div>
          <div style={{ marginBottom:24 }}>
            <label style={{ fontSize:13, color:"var(--muted)", display:"block", marginBottom:12 }}>Skills</label>
            <div style={{ display:"flex", gap:7, flexWrap:"wrap" }}>
              {ALL_SKILLS.map(s=>(
                <button key={s} onClick={()=>toggleSkill(s)} style={{ padding:"6px 14px", borderRadius:100, fontSize:12, cursor:"pointer", fontFamily:"Space Grotesk,sans-serif", background:form.skills.includes(s)?"rgba(99,102,241,0.18)":"var(--surface)", border:`1px solid ${form.skills.includes(s)?"rgba(99,102,241,0.45)":"var(--border)"}`, color:form.skills.includes(s)?"#a5b4fc":"var(--muted)", fontWeight:form.skills.includes(s)?700:400 }}>{s}</button>
              ))}
            </div>
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <button onClick={handleSave} style={{ padding:"11px 32px", borderRadius:12, background:"linear-gradient(135deg,#6366f1,#8b5cf6)", border:"none", color:"#fff", fontSize:14, fontWeight:700, cursor:"pointer" }}>Save Changes</button>
            <button onClick={()=>setEditing(false)} style={{ padding:"11px 20px", borderRadius:12, background:"var(--surface)", border:"1px solid var(--border)", color:"var(--text)", fontSize:14, cursor:"pointer" }}>Cancel</button>
          </div>
        </div>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:16 }}>
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            <div className="glass" style={{ borderRadius:16, padding:24 }}>
              <div className="font-display" style={{ fontWeight:700, color:"var(--text)", marginBottom:16 }}>About</div>
              <p style={{ color:"var(--muted)", lineHeight:1.7, fontSize:14 }}>{form.bio||"No bio added yet. Click Edit Profile to add your story."}</p>
            </div>
            <div className="glass" style={{ borderRadius:16, padding:24 }}>
              <div className="font-display" style={{ fontWeight:700, color:"var(--text)", marginBottom:14 }}>Skills</div>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                {form.skills.map(s=><span key={s} style={{ fontSize:13, padding:"5px 14px", borderRadius:100, background:`${color}15`, color, border:`1px solid ${color}30`, fontWeight:600 }}>{s}</span>)}
              </div>
            </div>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            <div className="glass" style={{ borderRadius:16, padding:24 }}>
              <div className="font-display" style={{ fontWeight:700, color:"var(--text)", marginBottom:16 }}>Profile Completion</div>
              {[
                { label:"Photo", done:!!user?.profile?.avatarUrl },
                { label:"Bio", done:!!form.bio },
                { label:"Skills", done:form.skills.length>0 },
                { label:"LinkedIn", done:!!form.linkedinUrl },
                { label:"GitHub", done:!!form.githubUrl },
              ].map(item=>(
                <div key={item.label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0", borderBottom:"1px solid var(--border)" }}>
                  <span style={{ fontSize:13, color:"var(--text)" }}>{item.label}</span>
                  <span style={{ fontSize:14 }}>{item.done?"✅":"⬜"}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

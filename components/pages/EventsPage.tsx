"use client";
import { useState } from "react";

const EVENTS = [
  { id:"e1", title:"Annual Alumni Meetup 2025",      date:"Jun 15", time:"10:00 AM", type:"Offline", color:"#6366f1", attendees:234, max:500,  venue:"Main Auditorium", tags:["Networking","Annual"] },
  { id:"e2", title:"AI & ML Career Panel",           date:"Jun 22", time:"3:00 PM",  type:"Online",  color:"#06b6d4", attendees:512, max:1000, venue:"Jitsi Meet",      tags:["AI","ML","Career"] },
  { id:"e3", title:"Startup Pitch Competition",      date:"Jul 5",  time:"11:00 AM", type:"Hybrid",  color:"#8b5cf6", attendees:89,  max:200,  venue:"Innovation Hub",  tags:["Startup","Entrepreneurship"] },
  { id:"e4", title:"Resume & Interview Masterclass", date:"Jul 12", time:"2:00 PM",  type:"Online",  color:"#10b981", attendees:320, max:300,  venue:"Jitsi Meet",      tags:["Resume","Interview"] },
  { id:"e5", title:"Cloud Computing Workshop",       date:"Jul 20", time:"10:00 AM", type:"Offline", color:"#f59e0b", attendees:78,  max:150,  venue:"Lab Block C",     tags:["AWS","Cloud","Workshop"] },
  { id:"e6", title:"Open Source Hackathon",          date:"Aug 2",  time:"9:00 AM",  type:"Hybrid",  color:"#f43f5e", attendees:145, max:300,  venue:"Campus + Online", tags:["Hackathon","OpenSource"] },
];

export default function EventsPage() {
  const [filter, setFilter] = useState("All");
  const [registered, setRegistered] = useState<Set<string>>(new Set());

  const filtered = filter==="All" ? EVENTS : EVENTS.filter(e=>e.type===filter);

  return (
    <div style={{ padding:24 }}>
      <div style={{ display:"flex", gap:8, marginBottom:24, flexWrap:"wrap" }}>
        {["All","Online","Offline","Hybrid"].map(f=>(
          <button key={f} onClick={()=>setFilter(f)} style={{ padding:"8px 20px", borderRadius:10, fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"Space Grotesk,sans-serif", background:filter===f?"linear-gradient(135deg,#6366f1,#8b5cf6)":"var(--surface)", border:filter===f?"none":"1px solid var(--border)", color:filter===f?"#fff":"var(--muted)" }}>{f}</button>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:16 }}>
        {filtered.map(ev=>{
          const full = ev.attendees>=ev.max;
          const isReg = registered.has(ev.id);
          return (
            <div key={ev.id} className="glass card-hover" style={{ borderRadius:16, overflow:"hidden" }}>
              <div style={{ height:6, background:`linear-gradient(90deg,${ev.color},${ev.color}80)` }}/>
              <div style={{ padding:22 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
                  <div style={{ width:48, height:48, borderRadius:12, background:`${ev.color}18`, border:`1px solid ${ev.color}30`, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
                    <div style={{ fontSize:16, fontWeight:800, color:ev.color, lineHeight:1 }}>{ev.date.split(" ")[1]}</div>
                    <div style={{ fontSize:9, color:ev.color, opacity:0.7 }}>{ev.date.split(" ")[0]}</div>
                  </div>
                  <span style={{ fontSize:11, padding:"4px 10px", borderRadius:100, background:`${ev.color}15`, color:ev.color, border:`1px solid ${ev.color}30`, fontWeight:600 }}>{ev.type}</span>
                </div>
                <div className="font-display" style={{ fontSize:17, fontWeight:700, color:"var(--text)", marginBottom:6 }}>{ev.title}</div>
                <div style={{ fontSize:13, color:"var(--muted)", marginBottom:12 }}>⏰ {ev.time} · 📍 {ev.venue}</div>
                <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:14 }}>
                  {ev.tags.map(t=><span key={t} style={{ fontSize:11, padding:"2px 8px", borderRadius:100, background:"var(--surface)", border:"1px solid var(--border)", color:"var(--muted)" }}>{t}</span>)}
                </div>
                <div style={{ marginBottom:14 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:"var(--muted)", marginBottom:6 }}>
                    <span>{ev.attendees} / {ev.max} registered</span>
                    <span style={{ color:full?"#f43f5e":"#10b981", fontWeight:600 }}>{full?"Full":"Open"}</span>
                  </div>
                  <div style={{ height:4, borderRadius:2, background:"var(--border)" }}>
                    <div style={{ height:"100%", borderRadius:2, width:`${Math.min((ev.attendees/ev.max)*100,100)}%`, background:full?`linear-gradient(90deg,#f43f5e,#f43f5e80)`:`linear-gradient(90deg,${ev.color},${ev.color}80)`, transition:"width 1s" }}/>
                  </div>
                </div>
                <button
                  onClick={()=>{ if(!full&&!isReg) setRegistered(p=>new Set([...p,ev.id])); }}
                  style={{ width:"100%", padding:"9px", borderRadius:10, fontSize:13, fontWeight:700, cursor:full||isReg?"default":"pointer", fontFamily:"Space Grotesk,sans-serif", background:isReg?"rgba(16,185,129,0.15)":full?"var(--surface)":"linear-gradient(135deg,#6366f1,#8b5cf6)", border:isReg?"1px solid rgba(16,185,129,0.3)":full?"1px solid var(--border)":"none", color:isReg?"#10b981":full?"var(--muted)":"#fff" }}>
                  {isReg?"✓ Registered":full?"Event Full":"Register Now"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

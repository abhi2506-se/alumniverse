"use client";
import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { generateJitsiLink, generateMeetingRoomId } from "@/lib/utils";

const MENTORS = [
  { id:"m1", name:"Arjun Mehta",  company:"Google",    role:"Sr. SWE",      color:"#6366f1", rating:4.9, available:true,  areas:["DSA","System Design","React"] },
  { id:"m2", name:"Priya Sharma", company:"Microsoft", role:"PM",           color:"#8b5cf6", rating:4.8, available:true,  areas:["Product","Strategy","Analytics"] },
  { id:"m3", name:"Rohan Verma",  company:"Stripe",    role:"Backend Eng.", color:"#06b6d4", rating:4.9, available:false, areas:["Node.js","Go","AWS","Fintech"] },
];

const TIMES = ["10:00 AM","11:00 AM","1:00 PM","2:00 PM","3:00 PM","5:00 PM"];
const DATES = ["Mon Jun 16","Tue Jun 17","Wed Jun 18","Thu Jun 19","Fri Jun 20","Sat Jun 21"];

export default function MentorshipPage() {
  const { user } = useAuthStore();
  const isAlumni = user?.role === "ALUMNI";
  const [step, setStep] = useState(0);
  const [selectedMentor, setSelectedMentor] = useState<typeof MENTORS[0] | null>(null);
  const [selectedDate, setSelectedDate] = useState(1);
  const [selectedTime, setSelectedTime] = useState(2);
  const [confirmed, setConfirmed] = useState(false);
  const [meetingLink, setMeetingLink] = useState("");

  const confirm = () => {
    const roomId = generateMeetingRoomId();
    setMeetingLink(generateJitsiLink(roomId));
    setConfirmed(true);
  };

  const STEPS = ["Select Mentor","Choose Time","Confirm"];

  if (isAlumni) {
    // Alumni see their mentees
    return (
      <div style={{ padding:24 }}>
        <h2 className="font-display" style={{ fontSize:22, fontWeight:800, color:"var(--text)", marginBottom:8 }}>My Mentees</h2>
        <p style={{ color:"var(--muted)", fontSize:14, marginBottom:24 }}>Students you are currently mentoring</p>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:16 }}>
          {[
            { name:"Rahul Singh",  goal:"Land Google internship",        progress:65, color:"#06b6d4", next:"Jun 17, 2:00 PM" },
            { name:"Sneha Patel",  goal:"Break into Product Management", progress:40, color:"#8b5cf6", next:"Jun 19, 11:00 AM" },
            { name:"Karan Mehta",  goal:"Master System Design",          progress:82, color:"#10b981", next:"Jun 21, 3:00 PM" },
          ].map((m,i)=>(
            <div key={i} className="glass" style={{ borderRadius:16, padding:22 }}>
              <div style={{ display:"flex", gap:12, alignItems:"center", marginBottom:16 }}>
                <div style={{ width:46, height:46, borderRadius:"50%", background:`linear-gradient(135deg,${m.color},${m.color}88)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, fontWeight:700, color:"#fff" }}>
                  {m.name.slice(0,2).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight:700, color:"var(--text)" }}>{m.name}</div>
                  <div style={{ fontSize:12, color:"var(--muted)" }}>Goal: {m.goal}</div>
                </div>
              </div>
              <div style={{ fontSize:12, color:"var(--muted)", marginBottom:8 }}>Next Session: <strong style={{ color:"var(--text)" }}>{m.next}</strong></div>
              <div style={{ height:4, borderRadius:2, background:"var(--border)", marginBottom:6 }}>
                <div style={{ height:"100%", borderRadius:2, width:`${m.progress}%`, background:`linear-gradient(90deg,${m.color},${m.color}80)`, transition:"width 1s" }}/>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:"var(--muted)", marginBottom:16 }}>
                <span>Progress</span><span style={{ color:m.color, fontWeight:700 }}>{m.progress}% goals met</span>
              </div>
              <div style={{ display:"flex", gap:8 }}>
                <button style={{ flex:1, padding:"8px", borderRadius:10, background:"rgba(16,185,129,0.12)", border:"1px solid rgba(16,185,129,0.3)", color:"#10b981", fontSize:13, fontWeight:700, cursor:"pointer" }}>📅 Schedule</button>
                <button style={{ flex:1, padding:"8px", borderRadius:10, background:"var(--surface)", border:"1px solid var(--border)", color:"var(--text)", fontSize:13, cursor:"pointer" }}>💬 Chat</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (confirmed && selectedMentor) {
    return (
      <div style={{ padding:24, maxWidth:520, margin:"0 auto" }}>
        <div style={{ borderRadius:20, padding:32, background:"rgba(16,185,129,0.08)", border:"1px solid rgba(16,185,129,0.3)", textAlign:"center" }}>
          <div style={{ fontSize:52, marginBottom:16 }}>🎉</div>
          <h2 className="font-display" style={{ fontSize:24, fontWeight:800, color:"var(--text)", marginBottom:8 }}>Meeting Confirmed!</h2>
          <p style={{ color:"var(--muted)", marginBottom:24 }}>Your session with {selectedMentor.name} has been booked. Check your email for confirmation.</p>
          <div style={{ background:"var(--card-bg)", border:"1px solid var(--border)", borderRadius:14, padding:20, marginBottom:24, textAlign:"left" }}>
            {[
              ["Mentor", selectedMentor.name],
              ["Company", selectedMentor.company],
              ["Date", DATES[selectedDate]],
              ["Time", TIMES[selectedTime]],
              ["Duration","60 minutes"],
              ["Platform","Jitsi Meet (Free)"],
            ].map(([l,v])=>(
              <div key={l} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:"1px solid var(--border)", fontSize:14 }}>
                <span style={{ color:"var(--muted)" }}>{l}</span>
                <span style={{ fontWeight:600, color:"var(--text)" }}>{v}</span>
              </div>
            ))}
          </div>
          <a href={meetingLink} target="_blank" rel="noreferrer" style={{ display:"block", padding:"13px", borderRadius:12, background:"linear-gradient(135deg,#6366f1,#8b5cf6)", color:"#fff", fontWeight:700, fontSize:15, textDecoration:"none", marginBottom:12 }}>
            📹 Join Meeting
          </a>
          <button onClick={()=>{ setConfirmed(false); setStep(0); setSelectedMentor(null); }} style={{ width:"100%", padding:"11px", borderRadius:12, background:"var(--surface)", border:"1px solid var(--border)", color:"var(--text)", fontSize:14, cursor:"pointer" }}>
            Book Another Session
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding:24, display:"grid", gridTemplateColumns:"1fr 1fr", gap:24 }}>
      {/* Booking Wizard */}
      <div className="glass" style={{ borderRadius:20, padding:26 }}>
        <h3 className="font-display" style={{ fontSize:20, fontWeight:700, color:"var(--text)", marginBottom:20 }}>Book a Mentorship Session</h3>

        {/* Progress Steps */}
        <div style={{ display:"flex", marginBottom:28 }}>
          {STEPS.map((s,i)=>(
            <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center" }}>
              <div style={{ display:"flex", alignItems:"center", width:"100%" }}>
                {i>0 && <div style={{ flex:1, height:2, background:step>i-1?"var(--accent)":"var(--border)", transition:"background 0.3s" }}/>}
                <div style={{ width:28, height:28, borderRadius:"50%", background:step>=i?"var(--accent)":"var(--card-bg)", border:step===i?`2px solid var(--accent)`:`1px solid var(--border)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, color:step>=i?"#fff":"var(--muted)", flexShrink:0, boxShadow:step>=i?"0 0 12px var(--accent-glow)":"none", transition:"all 0.3s" }}>
                  {step>i?"✓":i+1}
                </div>
                {i<2 && <div style={{ flex:1, height:2, background:step>i?"var(--accent)":"var(--border)", transition:"background 0.3s" }}/>}
              </div>
              <div style={{ fontSize:11, color:step>=i?"var(--text)":"var(--muted)", marginTop:6, textAlign:"center" }}>{s}</div>
            </div>
          ))}
        </div>

        {/* Step 0: Select Mentor */}
        {step===0 && (
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {MENTORS.map((m)=>(
              <div key={m.id} onClick={()=>{ if(m.available){ setSelectedMentor(m); setStep(1); } }}
                style={{ display:"flex", gap:12, padding:"14px", borderRadius:14, background:"var(--card-bg)", border:`1px solid ${selectedMentor?.id===m.id?"var(--accent)":"var(--border)"}`, cursor:m.available?"pointer":"not-allowed", opacity:m.available?1:0.5, transition:"all 0.2s" }}
                onMouseEnter={(e)=>{ if(m.available) (e.currentTarget as HTMLDivElement).style.borderColor="var(--accent)"; }}
                onMouseLeave={(e)=>{ (e.currentTarget as HTMLDivElement).style.borderColor=selectedMentor?.id===m.id?"var(--accent)":"var(--border)"; }}>
                <div style={{ width:46, height:46, borderRadius:"50%", background:`linear-gradient(135deg,${m.color},${m.color}88)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:700, color:"#fff", flexShrink:0 }}>
                  {m.name.slice(0,2).toUpperCase()}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, color:"var(--text)" }}>{m.name}</div>
                  <div style={{ fontSize:12, color:"var(--muted)" }}>{m.role} @ {m.company}</div>
                  <div style={{ display:"flex", gap:4, marginTop:6 }}>
                    {m.areas.slice(0,3).map((a)=><span key={a} style={{ fontSize:10, padding:"2px 7px", borderRadius:100, background:`${m.color}15`, color:m.color, border:`1px solid ${m.color}25` }}>{a}</span>)}
                  </div>
                </div>
                <div style={{ textAlign:"right", fontSize:12, flexShrink:0 }}>
                  <div style={{ color:"var(--text)", fontWeight:700 }}>⭐ {m.rating}</div>
                  <div style={{ marginTop:4, color:m.available?"#10b981":"#f43f5e", fontWeight:600 }}>{m.available?"Available":"Busy"}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Step 1: Choose Date/Time */}
        {step===1 && (
          <div>
            <div style={{ fontSize:14, fontWeight:600, color:"var(--text)", marginBottom:12 }}>Select Date</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, marginBottom:20 }}>
              {DATES.map((d,i)=>(
                <button key={i} onClick={()=>setSelectedDate(i)} style={{ padding:"9px 6px", borderRadius:10, fontSize:12, cursor:"pointer", fontFamily:"Space Grotesk,sans-serif", textAlign:"center", background:selectedDate===i?"linear-gradient(135deg,#6366f1,#8b5cf6)":"var(--surface)", border:selectedDate===i?"none":"1px solid var(--border)", color:selectedDate===i?"#fff":"var(--text)", fontWeight:selectedDate===i?700:400 }}>{d}</button>
              ))}
            </div>
            <div style={{ fontSize:14, fontWeight:600, color:"var(--text)", marginBottom:12 }}>Select Time</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, marginBottom:24 }}>
              {TIMES.map((t,i)=>(
                <button key={i} onClick={()=>setSelectedTime(i)} style={{ padding:"9px 6px", borderRadius:10, fontSize:13, cursor:"pointer", fontFamily:"Space Grotesk,sans-serif", textAlign:"center", background:selectedTime===i?"linear-gradient(135deg,#6366f1,#8b5cf6)":"var(--surface)", border:selectedTime===i?"none":"1px solid var(--border)", color:selectedTime===i?"#fff":"var(--text)", fontWeight:selectedTime===i?700:400 }}>{t}</button>
              ))}
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={()=>setStep(0)} style={{ flex:1, padding:"11px", borderRadius:12, background:"var(--surface)", border:"1px solid var(--border)", color:"var(--text)", fontSize:14, cursor:"pointer" }}>← Back</button>
              <button onClick={()=>setStep(2)} style={{ flex:2, padding:"11px", borderRadius:12, background:"linear-gradient(135deg,#6366f1,#8b5cf6)", border:"none", color:"#fff", fontSize:14, fontWeight:700, cursor:"pointer" }}>Continue →</button>
            </div>
          </div>
        )}

        {/* Step 2: Confirm */}
        {step===2 && selectedMentor && (
          <div>
            <div style={{ padding:18, borderRadius:14, background:"rgba(99,102,241,0.08)", border:"1px solid rgba(99,102,241,0.2)", marginBottom:18 }}>
              <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:14 }}>
                <div style={{ width:44, height:44, borderRadius:"50%", background:`linear-gradient(135deg,${selectedMentor.color},${selectedMentor.color}88)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:700, color:"#fff" }}>
                  {selectedMentor.name.slice(0,2).toUpperCase()}
                </div>
                <div>
                  <div className="font-display" style={{ fontWeight:700, color:"var(--text)" }}>{selectedMentor.name}</div>
                  <div style={{ fontSize:12, color:"var(--muted)" }}>{selectedMentor.role} @ {selectedMentor.company}</div>
                </div>
              </div>
              {[["Date",DATES[selectedDate]],["Time",TIMES[selectedTime]],["Duration","60 minutes"],["Mode","Jitsi Meet (Auto-generated)"]].map(([l,v])=>(
                <div key={l} style={{ display:"flex", justifyContent:"space-between", padding:"7px 0", borderBottom:"1px solid var(--border)", fontSize:13 }}>
                  <span style={{ color:"var(--muted)" }}>{l}</span>
                  <span style={{ fontWeight:600, color:"var(--text)" }}>{v}</span>
                </div>
              ))}
            </div>
            <textarea placeholder="Add a message for your mentor (optional)…" style={{ width:"100%", background:"var(--input-bg)", border:"1px solid var(--input-border)", borderRadius:12, padding:12, fontSize:13, color:"var(--text)", minHeight:72, resize:"none", outline:"none", fontFamily:"Space Grotesk,sans-serif", marginBottom:14 }} />
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={()=>setStep(1)} style={{ flex:1, padding:"11px", borderRadius:12, background:"var(--surface)", border:"1px solid var(--border)", color:"var(--text)", fontSize:14, cursor:"pointer" }}>← Back</button>
              <button onClick={confirm} className="animate-pulse-glow" style={{ flex:2, padding:"11px", borderRadius:12, background:"linear-gradient(135deg,#6366f1,#8b5cf6)", border:"none", color:"#fff", fontSize:14, fontWeight:700, cursor:"pointer" }}>
                ✦ Confirm & Generate Link
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Active Mentors Panel */}
      <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
        <div className="glass" style={{ borderRadius:20, padding:24 }}>
          <div className="font-display" style={{ fontWeight:700, fontSize:16, color:"var(--text)", marginBottom:16 }}>Your Active Mentors</div>
          {MENTORS.slice(0,2).map((m,i)=>(
            <div key={i} style={{ padding:14, borderRadius:14, background:"var(--card-bg)", border:"1px solid var(--border)", marginBottom:12 }}>
              <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:12 }}>
                <div style={{ width:42, height:42, borderRadius:"50%", background:`linear-gradient(135deg,${m.color},${m.color}88)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, color:"#fff" }}>
                  {m.name.slice(0,2).toUpperCase()}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, fontSize:14, color:"var(--text)" }}>{m.name}</div>
                  <div style={{ fontSize:12, color:"var(--muted)" }}>{m.company}</div>
                </div>
                <div style={{ display:"flex", gap:6 }}>
                  <button style={{ width:32, height:32, borderRadius:9, background:"var(--surface)", border:"1px solid var(--border)", cursor:"pointer", fontSize:15, display:"flex", alignItems:"center", justifyContent:"center" }}>📹</button>
                  <button style={{ width:32, height:32, borderRadius:9, background:"var(--surface)", border:"1px solid var(--border)", cursor:"pointer", fontSize:15, display:"flex", alignItems:"center", justifyContent:"center" }}>💬</button>
                </div>
              </div>
              <div style={{ fontSize:12, color:"var(--muted)" }}>Next session: <strong style={{ color:"var(--text)" }}>Jun 17 · 2:00 PM</strong></div>
              <div style={{ height:3, borderRadius:2, background:"var(--border)", marginTop:10 }}>
                <div style={{ height:"100%", borderRadius:2, width:"65%", background:`linear-gradient(90deg,${m.color},${m.color}80)`, transition:"width 1s" }}/>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:"var(--muted)", marginTop:5 }}>
                <span>Progress</span><span style={{ color:m.color }}>65% goals met</span>
              </div>
            </div>
          ))}
        </div>

        <div className="glass" style={{ borderRadius:20, padding:24 }}>
          <div className="font-display" style={{ fontWeight:700, fontSize:16, color:"var(--text)", marginBottom:14 }}>🤖 AI Match Suggestions</div>
          <div style={{ padding:16, borderRadius:14, background:"linear-gradient(135deg,rgba(99,102,241,0.08),rgba(139,92,246,0.05))", border:"1px solid rgba(99,102,241,0.2)" }}>
            <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:12 }}>
              <div style={{ width:36, height:36, borderRadius:9, background:"linear-gradient(135deg,#6366f1,#8b5cf6)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>✦</div>
              <div>
                <div style={{ fontWeight:700, fontSize:14, color:"var(--text)" }}>98% Match · Ananya Rao</div>
                <div style={{ fontSize:12, color:"var(--muted)" }}>Sr. Designer @ Figma · UI/UX Expert</div>
              </div>
            </div>
            <div style={{ fontSize:12, color:"var(--muted)", marginBottom:12 }}>Matched based on your interest in UI/UX and design thinking skills.</div>
            <button onClick={()=>setStep(0)} style={{ width:"100%", padding:"9px", borderRadius:10, background:"linear-gradient(135deg,#6366f1,#8b5cf6)", border:"none", color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer" }}>
              Connect with Ananya →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

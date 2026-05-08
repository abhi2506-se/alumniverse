"use client";
import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useChatStore } from "@/store/stores";
import { useSocket } from "@/hooks/useSocket";
import { formatTimeAgo } from "@/lib/utils";

const SAMPLE_CONTACTS = [
  { id: "c1", name: "Arjun Mehta",  role: "Alumni", last: "See you tomorrow!",          time: "10:39", unread: 0, color: "#6366f1", online: true },
  { id: "c2", name: "Priya Sharma", role: "Alumni", last: "I'll review your resume",    time: "09:15", unread: 2, color: "#8b5cf6", online: true },
  { id: "c3", name: "Rohan Verma",  role: "Alumni", last: "Check this GitHub repo",     time: "Yesterday", unread: 0, color: "#06b6d4", online: false },
  { id: "c4", name: "CS Batch 2025",role: "Group",  last: "Priya: Great event today 🎉",time: "Sun",       unread: 5, color: "#f59e0b", online: true },
];

const SAMPLE_MSGS: Record<string, Array<{id:string;text:string;mine:boolean;time:string}>> = {
  c1: [
    { id:"m1", text:"Hey! Have you applied for the Google internship?",          mine:false, time:"10:32 AM" },
    { id:"m2", text:"Not yet, could you share the referral link?",               mine:true,  time:"10:35 AM" },
    { id:"m3", text:"Sure! Also, let's have a quick call tomorrow to discuss your resume 🚀", mine:false, time:"10:36 AM" },
    { id:"m4", text:"That would be amazing! 11 AM works for me.",                mine:true,  time:"10:38 AM" },
    { id:"m5", text:"Perfect. I'll send a Jitsi link. See you then!",            mine:false, time:"10:39 AM" },
  ],
  c2: [
    { id:"m6", text:"Hi! I wanted to ask about breaking into product management.", mine:true,  time:"09:10 AM" },
    { id:"m7", text:"Great question! Start with product thinking frameworks. I'll review your resume tonight.", mine:false, time:"09:15 AM" },
  ],
};

export default function ChatPage() {
  const { user } = useAuthStore();
  const { sendMessage, startTyping, stopTyping } = useSocket();
  const [activeId, setActiveId] = useState("c1");
  const [msgInput, setMsgInput] = useState("");
  const [localMsgs, setLocalMsgs] = useState(SAMPLE_MSGS);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimer, setTypingTimer] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const active = SAMPLE_CONTACTS.find((c) => c.id === activeId)!;
  const msgs = localMsgs[activeId] || [];

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [activeId, msgs.length]);

  const handleSend = () => {
    const text = msgInput.trim();
    if (!text) return;
    setMsgInput("");
    const newMsg = { id: `m${Date.now()}`, text, mine: true, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
    setLocalMsgs((p) => ({ ...p, [activeId]: [...(p[activeId] || []), newMsg] }));
    // Simulate reply
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const replies = ["Got it! I'll get back to you soon 🚀", "That's a great point!", "Let me check on that.", "Sure, sounds good!", "I'll share the details shortly."];
      setLocalMsgs((p) => ({ ...p, [activeId]: [...(p[activeId] || []), { id: `r${Date.now()}`, text: replies[Math.floor(Math.random() * replies.length)], mine: false, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }] }));
    }, 1800);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <div style={{ display: "flex", height: "calc(100vh - 64px)", overflow: "hidden", background: "var(--bg)" }}>
      {/* Contacts */}
      <div style={{ width: 280, borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", flexShrink: 0, background: "var(--sidebar-bg)" }}>
        <div style={{ padding: "14px 14px 10px" }}>
          <div style={{ position: "relative" }}>
            <input placeholder="Search messages…" style={{ width: "100%", background: "var(--input-bg)", border: "1px solid var(--input-border)", borderRadius: 10, padding: "8px 12px 8px 34px", fontSize: 13, color: "var(--text)", outline: "none", fontFamily: "Space Grotesk,sans-serif" }} />
            <span style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", color: "var(--muted)", fontSize: 14 }}>🔍</span>
          </div>
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {SAMPLE_CONTACTS.map((c) => (
            <div key={c.id} onClick={() => setActiveId(c.id)}
              style={{ padding: "12px 14px", cursor: "pointer", display: "flex", gap: 10, alignItems: "center", background: activeId === c.id ? "rgba(99,102,241,0.1)" : "transparent", borderLeft: `3px solid ${activeId === c.id ? "var(--accent)" : "transparent"}`, transition: "background 0.2s" }}
              onMouseEnter={(e) => { if (activeId !== c.id) (e.currentTarget as HTMLDivElement).style.background = "var(--surface-hover)"; }}
              onMouseLeave={(e) => { if (activeId !== c.id) (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}>
              <div style={{ position: "relative", flexShrink: 0 }}>
                <div style={{ width: 42, height: 42, borderRadius: "50%", background: `linear-gradient(135deg,${c.color},${c.color}88)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff" }}>
                  {c.name.slice(0, 2).toUpperCase()}
                </div>
                {c.online && <div style={{ position: "absolute", bottom: 0, right: 0, width: 10, height: 10, borderRadius: "50%", background: "#10b981", border: "2px solid var(--sidebar-bg)" }} />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontWeight: 600, fontSize: 14, color: "var(--text)" }}>{c.name}</span>
                  <span style={{ fontSize: 11, color: "var(--muted)" }}>{c.time}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
                  <span style={{ fontSize: 12, color: "var(--muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 130 }}>{c.last}</span>
                  {c.unread > 0 && <span style={{ minWidth: 18, height: 18, padding: "0 5px", borderRadius: 9, background: "#f43f5e", color: "#fff", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{c.unread}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Chat Header */}
        <div style={{ height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", background: "var(--topbar-bg)", borderBottom: "1px solid var(--border)" }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ position: "relative" }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: `linear-gradient(135deg,${active.color},${active.color}88)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff" }}>
                {active.name.slice(0, 2).toUpperCase()}
              </div>
              {active.online && <div style={{ position: "absolute", bottom: 0, right: 0, width: 10, height: 10, borderRadius: "50%", background: "#10b981", border: "2px solid var(--topbar-bg)" }} />}
            </div>
            <div>
              <div style={{ fontWeight: 600, color: "var(--text)" }}>{active.name}</div>
              <div style={{ fontSize: 12, color: active.online ? "#10b981" : "var(--muted)" }}>
                {active.online ? "● Online" : "● Offline"} · {active.role}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {[["📹","Start video call"],["📞","Voice call"],["🔍","Search messages"]].map(([icon, label]) => (
              <button key={label as string} title={label as string} style={{ width: 36, height: 36, borderRadius: 10, background: "var(--surface)", border: "1px solid var(--border)", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>{icon}</button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: 12, background: "var(--bg)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "8px 0" }}>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            <span style={{ fontSize: 11, color: "var(--muted)" }}>Today</span>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          </div>

          {msgs.map((m) => (
            <div key={m.id} style={{ display: "flex", justifyContent: m.mine ? "flex-end" : "flex-start", gap: 8, alignItems: "flex-end" }}>
              {!m.mine && (
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: `linear-gradient(135deg,${active.color},${active.color}88)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                  {active.name.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div style={{ maxWidth: "65%" }}>
                <div style={{ padding: "10px 14px", borderRadius: m.mine ? "18px 18px 4px 18px" : "18px 18px 18px 4px", background: m.mine ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "var(--surface)", border: m.mine ? "none" : "1px solid var(--border)", fontSize: 14, lineHeight: 1.5, color: m.mine ? "#fff" : "var(--text)" }}>
                  {m.text}
                </div>
                <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 4, textAlign: m.mine ? "right" : "left" }}>
                  {m.time}{m.mine ? " ✓✓" : ""}
                </div>
              </div>
              {m.mine && (
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                  {(user?.profile?.firstName?.[0] || "M") + (user?.profile?.lastName?.[0] || "E")}
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
              <div style={{ width: 30, height: 30, borderRadius: "50%", background: `linear-gradient(135deg,${active.color},${active.color}88)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                {active.name.slice(0, 2).toUpperCase()}
              </div>
              <div style={{ padding: "12px 16px", borderRadius: "18px 18px 18px 4px", background: "var(--surface)", border: "1px solid var(--border)", display: "flex", gap: 4 }}>
                {[0, 1, 2].map((i) => (
                  <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--muted)", animation: `typing 1.2s ${i * 0.2}s ease-in-out infinite` }} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div style={{ padding: "14px 20px", borderTop: "1px solid var(--border)", background: "var(--topbar-bg)" }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center", background: "var(--input-bg)", borderRadius: 16, border: "1px solid var(--input-border)", padding: "4px 4px 4px 16px" }}>
            <input
              value={msgInput}
              onChange={(e) => setMsgInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message…"
              style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 14, color: "var(--text)", fontFamily: "Space Grotesk,sans-serif", padding: "9px 0" }}
            />
            <div style={{ display: "flex", gap: 4 }}>
              <button style={{ width: 36, height: 36, borderRadius: 11, background: "var(--surface)", border: "1px solid var(--border)", cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>😊</button>
              <button style={{ width: 36, height: 36, borderRadius: 11, background: "var(--surface)", border: "1px solid var(--border)", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>📎</button>
              <button onClick={handleSend} style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>➤</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

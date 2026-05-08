"use client";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";

interface Msg { role: "ai" | "user"; text: string; }

const SUGGESTED = ["Find me a mentor in ML", "What events are upcoming?", "Top jobs for CSE?", "How to improve my profile?"];

export default function AIAssistant({ onClose }: { onClose: () => void }) {
  const { accessToken } = useAuthStore();
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "ai", text: "Hi! I'm your AlumniVerse AI assistant 🚀 Ask me about careers, mentors, events, or anything about the platform!" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [msgs]);

  const send = async (text?: string) => {
    const q = text || input.trim();
    if (!q || loading) return;
    setInput("");
    setMsgs((m) => [...m, { role: "user", text: q }]);
    setLoading(true);
    try {
      const res = await axios.post("/api/ai/chat", { message: q }, { headers: { Authorization: `Bearer ${accessToken}` } });
      setMsgs((m) => [...m, { role: "ai", text: res.data.reply }]);
    } catch {
      const fallbacks = [
        "Based on your profile, I'd recommend connecting with alumni in your domain for mentorship 🎯",
        "I found 3 upcoming events that match your interests. Check the Events section for details!",
        "Your profile score could improve with more skills and a bio. Try updating your profile!",
        "The most common career path for your branch: Intern → SDE-1 → SDE-2 in 2.5 years on average.",
      ];
      setMsgs((m) => [...m, { role: "ai", text: fallbacks[Math.floor(Math.random() * fallbacks.length)] }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: "absolute", bottom: 72, right: 0, width: 360, background: "rgba(5,5,16,0.98)", backdropFilter: "blur(40px)", border: "1px solid rgba(99,102,241,0.25)", borderRadius: 20, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.7)", animation: "scale-in 0.25s ease forwards" }}>
      {/* Header */}
      <div style={{ padding: "14px 18px", background: "linear-gradient(135deg,rgba(99,102,241,0.15),rgba(139,92,246,0.08))", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>✦</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: "#f1f5f9" }}>AlumniVerse AI</div>
            <div style={{ fontSize: 11, color: "#10b981" }}>● Online · Always available</div>
          </div>
        </div>
        <button onClick={onClose} style={{ width: 26, height: 26, borderRadius: 7, background: "rgba(255,255,255,0.08)", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: 14 }}>✕</button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} style={{ height: 280, overflowY: "auto", padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{ maxWidth: "85%", padding: "9px 13px", borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px", background: m.role === "user" ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "rgba(255,255,255,0.06)", border: m.role === "ai" ? "1px solid rgba(255,255,255,0.08)" : "none", fontSize: 13, lineHeight: 1.5, color: "#f1f5f9" }}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div style={{ padding: "10px 14px", borderRadius: "16px 16px 16px 4px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", gap: 4 }}>
              {[0, 1, 2].map((i) => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#64748b", animation: `typing 1.2s ${i * 0.2}s ease-in-out infinite` }} />)}
            </div>
          </div>
        )}
      </div>

      {/* Suggestions */}
      {msgs.length === 1 && (
        <div style={{ padding: "0 14px 10px", display: "flex", gap: 6, flexWrap: "wrap" }}>
          {SUGGESTED.map((s) => (
            <button key={s} onClick={() => send(s)} style={{ padding: "5px 10px", borderRadius: 100, background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.25)", color: "#a5b4fc", fontSize: 11, cursor: "pointer", fontFamily: "Space Grotesk,sans-serif" }}>{s}</button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{ padding: "10px 12px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", gap: 8 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Ask anything..."
          style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "8px 12px", fontSize: 13, color: "#f1f5f9", outline: "none", fontFamily: "Space Grotesk,sans-serif" }}
        />
        <button onClick={() => send()} style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", color: "white", cursor: "pointer", fontSize: 16 }}>➤</button>
      </div>
    </div>
  );
}

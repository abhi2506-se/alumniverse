"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const PHRASES = ["Alumni Network", "Career Gateway", "Mentorship Hub", "Success Stories"];

const STATS = [
  { n: 12400, s: "+", l: "Students" },
  { n: 8200, s: "+", l: "Alumni" },
  { n: 340, s: "+", l: "Companies" },
  { n: 1800, s: "+", l: "Placements" },
];

const ROLES = [
  { role: "student", label: "Student", icon: "🎓", color: "#06b6d4", desc: "Access mentors, internships & career tools" },
  { role: "alumni", label: "Alumni", icon: "👔", color: "#8b5cf6", desc: "Share your journey, mentor students" },
  { role: "admin", label: "Admin", icon: "🛡️", color: "#10b981", desc: "Manage the entire ecosystem" },
  { role: "developer", label: "Developer", icon: "⚡", color: "#f43f5e", desc: "Full system access & monitoring" },
];

const FEATURES = [
  { icon: "🤝", title: "Smart Connections", desc: "AI-powered alumni matching based on your skills, interests, and career goals." },
  { icon: "🧠", title: "1:1 Mentorship", desc: "Book sessions with industry experts. Auto-generates Jitsi meeting links instantly." },
  { icon: "💬", title: "Encrypted Chat", desc: "Real-time messaging with typing indicators, reactions, voice notes & media sharing." },
  { icon: "📊", title: "Career Analytics", desc: "AI resume scorer, profile insights, and personalized career roadmaps." },
  { icon: "🚀", title: "Live Placements", desc: "Alumni-posted jobs with smart matching to your branch, skills & CGPA." },
  { icon: "🎯", title: "Event Hub", desc: "Offline, online & hybrid events with auto-reminders and Jitsi integration." },
];

function AnimatedCounter({ to, suffix = "" }: { to: number; suffix: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const duration = 2000;
    const tick = () => {
      const p = Math.min((Date.now() - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 4);
      setCount(Math.round(to * ease));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [to]);
  return <>{count.toLocaleString()}{suffix}</>;
}

function Particle({ left, delay, duration, size }: any) {
  return (
    <div style={{
      position: "absolute", left: `${left}%`, bottom: -10,
      width: size, height: size, borderRadius: "50%",
      background: `rgba(99,102,241,0.4)`,
      animation: `particle ${duration}s ${delay}s ease-in-out infinite`,
      pointerEvents: "none",
    }} />
  );
}

export default function LandingPage() {
  const router = useRouter();
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [typed, setTyped] = useState("");
  const [particles] = useState(() =>
    Array.from({ length: 18 }, (_, i) => ({
      id: i, left: Math.random() * 100,
      delay: Math.random() * 12,
      duration: 15 + Math.random() * 18,
      size: 2 + Math.random() * 4,
    }))
  );

  useEffect(() => {
    let i = 0;
    const phrase = PHRASES[phraseIdx];
    setTyped("");
    const iv = setInterval(() => {
      if (i <= phrase.length) { setTyped(phrase.slice(0, i)); i++; }
      else { clearInterval(iv); setTimeout(() => setPhraseIdx((p) => (p + 1) % PHRASES.length), 1500); }
    }, 65);
    return () => clearInterval(iv);
  }, [phraseIdx]);

  return (
    <div style={{ minHeight: "100vh", background: "#050510", color: "#f1f5f9", position: "relative", overflow: "hidden" }}>
      {/* Background */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 50% -20%, rgba(99,102,241,0.18) 0%, transparent 60%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 50% at -10% 80%, rgba(139,92,246,0.1) 0%, transparent 50%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 50% at 110% 80%, rgba(6,182,212,0.08) 0%, transparent 50%)" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        {particles.map((p) => <Particle key={p.id} {...p} />)}
      </div>

      {/* Nav */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 clamp(20px,4vw,48px)", background: "rgba(5,5,16,0.85)", backdropFilter: "blur(40px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 20px rgba(99,102,241,0.5)" }}>⚡</div>
          <span style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: 18, background: "linear-gradient(135deg,#6366f1,#06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>AlumniVerse</span>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {["Features", "Alumni", "Events"].map((l) => (
            <button key={l} style={{ padding: "7px 14px", borderRadius: 10, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8", fontSize: 13, cursor: "pointer", fontFamily: "Space Grotesk,sans-serif" }}>{l}</button>
          ))}
          <button onClick={() => router.push("/login")} style={{ padding: "8px 20px", borderRadius: 10, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", color: "white", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "Space Grotesk,sans-serif" }}>
            Launch Portal →
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ position: "relative", zIndex: 1, padding: "clamp(60px,10vw,120px) clamp(20px,5vw,64px) 80px", textAlign: "center", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 100, background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.3)", marginBottom: 28, animation: "slide-up 0.6s ease forwards" }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#6366f1" }} />
          <span style={{ fontSize: 13, color: "#a5b4fc", fontWeight: 600 }}>Next-Generation Alumni Ecosystem</span>
        </div>

        <h1 style={{ fontFamily: "Syne,sans-serif", fontSize: "clamp(36px,7vw,88px)", fontWeight: 800, lineHeight: 1.05, marginBottom: 0, animation: "slide-up 0.6s 0.1s ease both" }}>
          Your College's<br />
          <span style={{ background: "linear-gradient(135deg,#6366f1,#06b6d4,#8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            {typed}<span style={{ opacity: 0.7 }}>|</span>
          </span>
        </h1>

        <p style={{ fontSize: "clamp(15px,2vw,18px)", color: "#64748b", maxWidth: 580, margin: "24px auto", lineHeight: 1.7, animation: "slide-up 0.6s 0.2s ease both" }}>
          The most advanced alumni platform ever built. Connect students, alumni and institutions in a futuristic AI-powered ecosystem.
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", animation: "slide-up 0.6s 0.3s ease both" }}>
          <button onClick={() => router.push("/login")} style={{ padding: "14px 36px", borderRadius: 50, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", color: "white", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "Space Grotesk,sans-serif", boxShadow: "0 8px 32px rgba(99,102,241,0.4)", animation: "pulse-glow 2s infinite" }}>
            Enter Portal ✦
          </button>
          <button onClick={() => router.push("/register")} style={{ padding: "14px 36px", borderRadius: 50, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)", color: "#f1f5f9", fontSize: 16, fontWeight: 600, cursor: "pointer", fontFamily: "Space Grotesk,sans-serif" }}>
            Create Account →
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: "clamp(24px,5vw,64px)", justifyContent: "center", marginTop: 80, flexWrap: "wrap", animation: "slide-up 0.6s 0.4s ease both" }}>
          {STATS.map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "Syne,sans-serif", fontSize: "clamp(28px,4vw,40px)", fontWeight: 800, background: "linear-gradient(135deg,#6366f1,#06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                <AnimatedCounter to={s.n} suffix={s.s} />
              </div>
              <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Role Cards */}
      <section style={{ position: "relative", zIndex: 1, padding: "0 clamp(20px,5vw,64px) 80px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h2 style={{ fontFamily: "Syne,sans-serif", fontSize: "clamp(24px,4vw,40px)", fontWeight: 800, marginBottom: 12 }}>Choose Your Role</h2>
          <p style={{ color: "#64748b", fontSize: 15 }}>One platform, four powerful dashboards</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 16 }}>
          {ROLES.map((r, i) => (
            <div key={r.role} onClick={() => router.push("/login")} style={{ padding: "24px 20px", borderRadius: 20, cursor: "pointer", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", transition: "all 0.3s", animation: `slide-up 0.6s ${0.1 * i}s ease both` }}
              onMouseEnter={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.transform = "translateY(-6px)"; el.style.borderColor = `${r.color}40`; el.style.background = `${r.color}08`; el.style.boxShadow = `0 20px 60px ${r.color}20`; }}
              onMouseLeave={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.transform = ""; el.style.borderColor = "rgba(255,255,255,0.08)"; el.style.background = "rgba(255,255,255,0.03)"; el.style.boxShadow = ""; }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: `${r.color}20`, border: `1px solid ${r.color}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 16 }}>{r.icon}</div>
              <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: 18, marginBottom: 8 }}>{r.label}</div>
              <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.5, marginBottom: 18 }}>{r.desc}</div>
              <button style={{ width: "100%", padding: "9px", borderRadius: 10, background: `${r.color}20`, border: `1px solid ${r.color}40`, color: r.color, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "Space Grotesk,sans-serif" }}>
                Enter as {r.label} →
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ position: "relative", zIndex: 1, padding: "80px clamp(20px,5vw,64px)", background: "rgba(255,255,255,0.01)", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontFamily: "Syne,sans-serif", fontSize: "clamp(24px,4vw,40px)", fontWeight: 800, marginBottom: 12 }}>Everything You Need</h2>
            <p style={{ color: "#64748b", fontSize: 15 }}>Built with cutting-edge tech for the next generation</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 16 }}>
            {FEATURES.map((f, i) => (
              <div key={i} style={{ padding: "24px 22px", borderRadius: 16, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", transition: "all 0.25s" }}
                onMouseEnter={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.background = "rgba(99,102,241,0.05)"; el.style.borderColor = "rgba(99,102,241,0.2)"; el.style.transform = "translateY(-3px)"; }}
                onMouseLeave={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.background = "rgba(255,255,255,0.03)"; el.style.borderColor = "rgba(255,255,255,0.07)"; el.style.transform = ""; }}>
                <div style={{ fontSize: 28, marginBottom: 14 }}>{f.icon}</div>
                <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{f.title}</div>
                <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ position: "relative", zIndex: 1, padding: "100px clamp(20px,5vw,64px)", textAlign: "center" }}>
        <h2 style={{ fontFamily: "Syne,sans-serif", fontSize: "clamp(28px,5vw,56px)", fontWeight: 800, marginBottom: 16 }}>
          Ready to connect with your <span style={{ background: "linear-gradient(135deg,#6366f1,#06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>alumni universe?</span>
        </h2>
        <p style={{ color: "#64748b", fontSize: 16, marginBottom: 36 }}>Join thousands of students and alumni already on the platform.</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => router.push("/register")} style={{ padding: "15px 40px", borderRadius: 50, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", color: "white", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "Space Grotesk,sans-serif", boxShadow: "0 8px 32px rgba(99,102,241,0.4)" }}>
            Get Started Free →
          </button>
          <button onClick={() => router.push("/login")} style={{ padding: "15px 40px", borderRadius: 50, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)", color: "#f1f5f9", fontSize: 16, fontWeight: 600, cursor: "pointer", fontFamily: "Space Grotesk,sans-serif" }}>
            Sign In
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ position: "relative", zIndex: 1, borderTop: "1px solid rgba(255,255,255,0.06)", padding: "32px clamp(20px,5vw,64px)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 18 }}>⚡</span>
          <span style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, background: "linear-gradient(135deg,#6366f1,#06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>AlumniVerse</span>
        </div>
        <div style={{ fontSize: 13, color: "#475569" }}>© {new Date().getFullYear()} AlumniVerse. Built with ❤️ for the next generation.</div>
        <div style={{ display: "flex", gap: 20 }}>
          {["Privacy", "Terms", "Contact"].map((l) => (
            <span key={l} style={{ fontSize: 13, color: "#475569", cursor: "pointer" }}>{l}</span>
          ))}
        </div>
      </footer>
    </div>
  );
}

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const BRANCHES: Record<string, string[]> = {
  CSE: ["B.Tech CSE", "B.Tech CSE (AI & ML)", "B.Tech CSE (Data Science)"],
  ECE: ["B.Tech ECE", "B.Tech ECE (VLSI)"],
  MBA: ["MBA General", "MBA Finance", "MBA Marketing"],
  BCA: ["BCA"],
  MECH: ["B.Tech Mechanical"],
};

const SKILLS = ["React", "Node.js", "Python", "Java", "Machine Learning", "Data Science", "UI/UX", "Product Management", "Go", "AWS", "System Design", "SQL"];

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<"student" | "alumni">("student");
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", password: "", phone: "",
    rollNumber: "", branch: "CSE", course: "", year: 3, section: "", admissionYear: 2022,
    passingYear: 2022, currentCompany: "", currentRole: "", currentLocation: "",
    bio: "", linkedinUrl: "", githubUrl: "", skills: [] as string[],
    interests: [] as string[], isMentor: false,
  });

  const update = (key: string, value: any) => setForm((f) => ({ ...f, [key]: value }));
  const toggleSkill = (s: string) => update("skills", form.skills.includes(s) ? form.skills.filter((x) => x !== s) : [...form.skills, s]);

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      await axios.post("/api/auth/register", { ...form, role });
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "11px 14px", fontSize: 14, color: "#f1f5f9", outline: "none", fontFamily: "Space Grotesk,sans-serif" };
  const labelStyle = { fontSize: 13, color: "#94a3b8", display: "block" as const, marginBottom: 7 };

  if (success) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#050510", textAlign: "center", padding: 20 }}>
        <div>
          <div style={{ fontSize: 60, marginBottom: 20 }}>🎉</div>
          <h1 style={{ fontFamily: "Syne,sans-serif", fontSize: 28, fontWeight: 800, color: "#f1f5f9", marginBottom: 12 }}>Account Created!</h1>
          <p style={{ color: "#94a3b8", fontSize: 15, marginBottom: 8 }}>Please check your email to verify your account.</p>
          <p style={{ color: "#64748b", fontSize: 13, marginBottom: 28 }}>After verification, an admin will review and approve your account.</p>
          <button onClick={() => router.push("/login")} style={{ padding: "12px 32px", borderRadius: 12, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", color: "white", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
            Go to Login →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#050510", padding: 20, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "fixed", inset: 0, background: "radial-gradient(ellipse 80% 60% at 50% -20%, rgba(99,102,241,0.12) 0%, transparent 60%)", pointerEvents: "none" }} />

      <div style={{ width: "100%", maxWidth: 560, position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>⚡</div>
            <span style={{ fontFamily: "Syne,sans-serif", fontSize: 20, fontWeight: 800, background: "linear-gradient(135deg,#6366f1,#06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>AlumniVerse</span>
          </div>
          <h1 style={{ fontFamily: "Syne,sans-serif", fontSize: 24, fontWeight: 800, color: "#f1f5f9", margin: 0 }}>Create your account</h1>
        </div>

        {/* Role selector */}
        {step === 0 && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
              {(["student", "alumni"] as const).map((r) => (
                <div key={r} onClick={() => setRole(r)} style={{ padding: "20px 16px", borderRadius: 16, cursor: "pointer", background: role === r ? "rgba(99,102,241,0.1)" : "rgba(255,255,255,0.03)", border: `1px solid ${role === r ? "rgba(99,102,241,0.4)" : "rgba(255,255,255,0.08)"}`, textAlign: "center" }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>{r === "student" ? "🎓" : "👔"}</div>
                  <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: 16, color: "#f1f5f9", textTransform: "capitalize" }}>{r}</div>
                  <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>{r === "student" ? "I'm currently studying" : "I've already graduated"}</div>
                </div>
              ))}
            </div>
            <button onClick={() => setStep(1)} style={{ width: "100%", padding: "13px", borderRadius: 12, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", color: "white", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "Space Grotesk,sans-serif" }}>
              Continue as {role === "student" ? "Student" : "Alumni"} →
            </button>
          </div>
        )}

        {/* Form steps */}
        {step > 0 && (
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 28 }}>
            {/* Progress */}
            <div style={{ display: "flex", gap: 6, marginBottom: 24 }}>
              {[1, 2, 3].map((s) => (
                <div key={s} style={{ flex: 1, height: 3, borderRadius: 2, background: step >= s ? "#6366f1" : "rgba(255,255,255,0.1)", transition: "background 0.3s" }} />
              ))}
            </div>

            {error && <div style={{ background: "rgba(244,63,94,0.1)", border: "1px solid rgba(244,63,94,0.3)", borderRadius: 10, padding: "10px 14px", color: "#fda4af", fontSize: 13, marginBottom: 16 }}>⚠️ {error}</div>}

            {step === 1 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <h3 style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: 17, margin: 0, marginBottom: 4 }}>Personal Information</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div><label style={labelStyle}>First Name *</label><input style={inputStyle} value={form.firstName} onChange={(e) => update("firstName", e.target.value)} placeholder="John" /></div>
                  <div><label style={labelStyle}>Last Name *</label><input style={inputStyle} value={form.lastName} onChange={(e) => update("lastName", e.target.value)} placeholder="Doe" /></div>
                </div>
                <div><label style={labelStyle}>Email Address *</label><input style={inputStyle} type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@example.com" /></div>
                <div><label style={labelStyle}>Phone Number</label><input style={inputStyle} value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+91 9876543210" /></div>
                <div><label style={labelStyle}>Password * (min 8 chars, uppercase, number, special)</label><input style={inputStyle} type="password" value={form.password} onChange={(e) => update("password", e.target.value)} placeholder="••••••••" /></div>
                {role === "student" && (
                  <div><label style={labelStyle}>Roll Number *</label><input style={inputStyle} value={form.rollNumber} onChange={(e) => update("rollNumber", e.target.value)} placeholder="CS2025001" /></div>
                )}
              </div>
            )}

            {step === 2 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <h3 style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: 17, margin: 0, marginBottom: 4 }}>Academic Details</h3>
                <div>
                  <label style={labelStyle}>Branch *</label>
                  <select style={{ ...inputStyle, appearance: "none" }} value={form.branch} onChange={(e) => { update("branch", e.target.value); update("course", ""); }}>
                    {Object.keys(BRANCHES).map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Course *</label>
                  <select style={{ ...inputStyle, appearance: "none" }} value={form.course} onChange={(e) => update("course", e.target.value)}>
                    <option value="">Select course</option>
                    {(BRANCHES[form.branch] || []).map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                {role === "student" ? (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div><label style={labelStyle}>Current Year</label><select style={{ ...inputStyle, appearance: "none" }} value={form.year} onChange={(e) => update("year", Number(e.target.value))}>{[1,2,3,4,5,6].map((y) => <option key={y} value={y}>Year {y}</option>)}</select></div>
                    <div><label style={labelStyle}>Section</label><input style={inputStyle} value={form.section} onChange={(e) => update("section", e.target.value)} placeholder="A" /></div>
                  </div>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div><label style={labelStyle}>Current Company</label><input style={inputStyle} value={form.currentCompany} onChange={(e) => update("currentCompany", e.target.value)} placeholder="Google" /></div>
                    <div><label style={labelStyle}>Current Role</label><input style={inputStyle} value={form.currentRole} onChange={(e) => update("currentRole", e.target.value)} placeholder="SWE" /></div>
                  </div>
                )}
                <div><label style={labelStyle}>Bio (optional)</label><textarea style={{ ...inputStyle, minHeight: 72, resize: "none" } as any} value={form.bio} onChange={(e) => update("bio", e.target.value)} placeholder="Tell others about yourself..." /></div>
              </div>
            )}

            {step === 3 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <h3 style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: 17, margin: 0, marginBottom: 4 }}>Skills & Links</h3>
                <div>
                  <label style={labelStyle}>Skills (select all that apply)</label>
                  <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                    {SKILLS.map((s) => (
                      <button key={s} type="button" onClick={() => toggleSkill(s)} style={{ padding: "5px 12px", borderRadius: 100, fontSize: 12, cursor: "pointer", fontFamily: "Space Grotesk,sans-serif", background: form.skills.includes(s) ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.04)", border: `1px solid ${form.skills.includes(s) ? "rgba(99,102,241,0.5)" : "rgba(255,255,255,0.1)"}`, color: form.skills.includes(s) ? "#a5b4fc" : "#64748b" }}>{s}</button>
                    ))}
                  </div>
                </div>
                <div><label style={labelStyle}>LinkedIn URL</label><input style={inputStyle} value={form.linkedinUrl} onChange={(e) => update("linkedinUrl", e.target.value)} placeholder="https://linkedin.com/in/yourname" /></div>
                <div><label style={labelStyle}>GitHub URL</label><input style={inputStyle} value={form.githubUrl} onChange={(e) => update("githubUrl", e.target.value)} placeholder="https://github.com/yourname" /></div>
                {role === "alumni" && (
                  <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                    <input type="checkbox" checked={form.isMentor} onChange={(e) => update("isMentor", e.target.checked)} style={{ width: 16, height: 16, accentColor: "#6366f1" }} />
                    <span style={{ fontSize: 14, color: "#f1f5f9" }}>I want to mentor students on AlumniVerse</span>
                  </label>
                )}
              </div>
            )}

            {/* Navigation */}
            <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
              <button onClick={() => setStep(step - 1)} style={{ flex: 1, padding: "12px", borderRadius: 12, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#f1f5f9", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "Space Grotesk,sans-serif" }}>
                ← Back
              </button>
              {step < 3 ? (
                <button onClick={() => setStep(step + 1)} style={{ flex: 2, padding: "12px", borderRadius: 12, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", color: "white", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "Space Grotesk,sans-serif" }}>
                  Continue →
                </button>
              ) : (
                <button onClick={handleSubmit} disabled={loading} style={{ flex: 2, padding: "12px", borderRadius: 12, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", color: "white", fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "Space Grotesk,sans-serif", opacity: loading ? 0.7 : 1 }}>
                  {loading ? "Creating account..." : "Create Account ✦"}
                </button>
              )}
            </div>
          </div>
        )}

        <p style={{ textAlign: "center", marginTop: 18, color: "#64748b", fontSize: 14 }}>
          Already have an account?{" "}
          <span onClick={() => router.push("/login")} style={{ color: "#6366f1", cursor: "pointer", fontWeight: 600 }}>Sign in →</span>
        </p>
      </div>
    </div>
  );
}

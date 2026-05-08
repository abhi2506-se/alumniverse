"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setSent(true);
    } catch {}
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)", padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 420, textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>{sent ? "📧" : "🔒"}</div>
        <h1 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: "var(--text)", marginBottom: 8 }}>
          {sent ? "Check your email" : "Forgot password?"}
        </h1>
        <p style={{ color: "var(--muted)", marginBottom: 28, fontSize: 14 }}>
          {sent ? `We sent a reset link to ${email}` : "Enter your email and we'll send you a reset OTP"}
        </p>
        {!sent && (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 20, padding: 28 }}>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com"
              style={{ background: "var(--input-bg)", border: "1px solid var(--input-border)", borderRadius: 12, padding: "11px 14px", fontSize: 14, color: "var(--text)", outline: "none", fontFamily: "Space Grotesk,sans-serif" }} />
            <button type="submit" disabled={loading} style={{ padding: "12px", borderRadius: 12, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
              {loading ? "Sending…" : "Send Reset OTP"}
            </button>
          </form>
        )}
        <button onClick={() => router.push("/login")} style={{ marginTop: 20, background: "none", border: "none", color: "var(--accent)", cursor: "pointer", fontSize: 14 }}>
          ← Back to login
        </button>
      </div>
    </div>
  );
}

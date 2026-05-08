"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const router = useRouter();
  const { login, verifyOTP, isLoading } = useAuth();
  const [step, setStep] = useState<"credentials" | "otp">("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userId, setUserId] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await login(email, password);
      setUserId(res.userId);
      setStep("otp");
    } catch (err: any) {
      setError(err.response?.data?.error || "Login failed. Please try again.");
    }
  };

  const handleOTP = async () => {
    setError("");
    const code = otp.join("");
    if (code.length !== 6) return setError("Enter complete 6-digit OTP");
    try {
      await verifyOTP(userId, code, "login");
    } catch (err: any) {
      setError(err.response?.data?.error || "Invalid OTP");
    }
  };

  const handleOtpChange = (i: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[i] = val.slice(-1);
    setOtp(next);
    if (val && i < 5) {
      document.getElementById(`otp-${i + 1}`)?.focus();
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#050510", padding: 20, position: "relative", overflow: "hidden" }}>
      {/* Background */}
      <div style={{ position: "fixed", inset: 0, background: "radial-gradient(ellipse 80% 60% at 50% -20%, rgba(99,102,241,0.15) 0%, transparent 60%)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none" }} />

      <div style={{ width: "100%", maxWidth: 440, position: "relative", zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, boxShadow: "0 0 30px rgba(99,102,241,0.5)" }}>⚡</div>
            <span style={{ fontFamily: "Syne,sans-serif", fontSize: 22, fontWeight: 800, background: "linear-gradient(135deg,#6366f1,#06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>AlumniVerse</span>
          </div>
          <h1 style={{ fontFamily: "Syne,sans-serif", fontSize: 26, fontWeight: 800, color: "#f1f5f9", margin: 0 }}>
            {step === "credentials" ? "Welcome back" : "Check your email"}
          </h1>
          <p style={{ color: "#64748b", marginTop: 8, fontSize: 14 }}>
            {step === "credentials" ? "Sign in to your AlumniVerse account" : `OTP sent to ${email.replace(/(.{2}).+(@.+)/, "$1***$2")}`}
          </p>
        </div>

        {/* Card */}
        <div style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 32 }}>
          {error && (
            <div style={{ background: "rgba(244,63,94,0.1)", border: "1px solid rgba(244,63,94,0.3)", borderRadius: 10, padding: "10px 14px", color: "#fda4af", fontSize: 13, marginBottom: 20 }}>
              ⚠️ {error}
            </div>
          )}

          {step === "credentials" ? (
            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ fontSize: 13, color: "#94a3b8", display: "block", marginBottom: 8 }}>Email address</label>
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                  placeholder="you@example.com"
                  style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "11px 14px", fontSize: 14, color: "#f1f5f9", outline: "none", fontFamily: "Space Grotesk,sans-serif" }}
                />
              </div>
              <div>
                <label style={{ fontSize: 13, color: "#94a3b8", display: "block", marginBottom: 8 }}>Password</label>
                <input
                  type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                  placeholder="Enter your password"
                  style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "11px 14px", fontSize: 14, color: "#f1f5f9", outline: "none", fontFamily: "Space Grotesk,sans-serif" }}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <span onClick={() => router.push("/forgot-password")} style={{ fontSize: 13, color: "#6366f1", cursor: "pointer" }}>Forgot password?</span>
              </div>
              <button type="submit" disabled={isLoading} style={{ width: "100%", padding: "13px", borderRadius: 12, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", color: "white", fontSize: 15, fontWeight: 700, cursor: isLoading ? "not-allowed" : "pointer", fontFamily: "Space Grotesk,sans-serif", opacity: isLoading ? 0.7 : 1 }}>
                {isLoading ? "Sending OTP..." : "Continue →"}
              </button>
            </form>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 20 }}>Enter the 6-digit code sent to your email</p>
                <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                  {otp.map((digit, i) => (
                    <input
                      key={i} id={`otp-${i}`} value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Backspace" && !digit && i > 0) document.getElementById(`otp-${i - 1}`)?.focus(); }}
                      maxLength={1}
                      style={{ width: 48, height: 56, textAlign: "center", fontSize: 22, fontWeight: 800, background: "rgba(255,255,255,0.06)", border: `1px solid ${digit ? "rgba(99,102,241,0.6)" : "rgba(255,255,255,0.12)"}`, borderRadius: 12, color: "#f1f5f9", outline: "none", fontFamily: "Space Mono,monospace" }}
                    />
                  ))}
                </div>
                <p style={{ fontSize: 12, color: "#475569", marginTop: 12 }}>Code expires in 10 minutes</p>
              </div>
              <button onClick={handleOTP} disabled={isLoading} style={{ width: "100%", padding: "13px", borderRadius: 12, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", color: "white", fontSize: 15, fontWeight: 700, cursor: isLoading ? "not-allowed" : "pointer", fontFamily: "Space Grotesk,sans-serif", opacity: isLoading ? 0.7 : 1 }}>
                {isLoading ? "Verifying..." : "Verify & Sign In ✦"}
              </button>
              <button onClick={() => setStep("credentials")} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 13, fontFamily: "Space Grotesk,sans-serif" }}>← Back to login</button>
            </div>
          )}
        </div>

        <p style={{ textAlign: "center", marginTop: 20, color: "#64748b", fontSize: 14 }}>
          Don't have an account?{" "}
          <span onClick={() => router.push("/register")} style={{ color: "#6366f1", cursor: "pointer", fontWeight: 600 }}>Create one →</span>
        </p>
      </div>
    </div>
  );
}

"use client";
import { useEffect, useRef, useState } from "react";
import { useThemeStore } from "@/store/useThemeStore";

interface StatCardProps {
  label: string;
  value: number;
  suffix?: string;
  icon: string;
  color: string;
  delta?: number;
  delay?: number;
}

function Counter({ to, suffix = "", duration = 1800 }: { to: number; suffix: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      const start = Date.now();
      const tick = () => {
        const p = Math.min((Date.now() - start) / duration, 1);
        setCount(Math.round(to * (1 - Math.pow(1 - p, 4))));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to, duration]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

export default function StatCard({ label, value, suffix = "", icon, color, delta, delay = 0 }: StatCardProps) {
  const { theme } = useThemeStore();

  return (
    <div
      className="glass card-hover animate-slide-up"
      style={{
        borderRadius: 16, padding: "20px 22px",
        position: "relative", overflow: "hidden",
        animationDelay: `${delay}s`,
        background: "var(--card-bg)",
        border: "1px solid var(--border)",
      }}
    >
      {/* glow blob */}
      <div style={{ position: "absolute", top: -24, right: -24, width: 90, height: 90, borderRadius: "50%", background: `${color}18`, filter: "blur(18px)", pointerEvents: "none" }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: `${color}20`, border: `1px solid ${color}35`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
          {icon}
        </div>
        {delta !== undefined && (
          <span style={{
            fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 100,
            color: delta >= 0 ? "var(--emerald)" : "var(--rose)",
            background: delta >= 0 ? "rgba(16,185,129,0.12)" : "rgba(244,63,94,0.12)",
          }}>
            {delta >= 0 ? "+" : ""}{delta}%
          </span>
        )}
      </div>

      <div className="font-display" style={{ fontSize: 30, fontWeight: 800, color: "var(--text)", lineHeight: 1 }}>
        <Counter to={value} suffix={suffix} />
      </div>
      <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 6, fontWeight: 500 }}>{label}</div>

      {/* progress accent line */}
      <div style={{ height: 3, borderRadius: 2, background: `linear-gradient(90deg, ${color}, transparent)`, marginTop: 16, opacity: 0.55 }} />
    </div>
  );
}

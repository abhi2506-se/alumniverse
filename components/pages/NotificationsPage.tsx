// ── NotificationsPage ────────────────────────────────────────────────────────
"use client";
import { useNotificationStore } from "@/store/stores";
import { formatTimeAgo } from "@/lib/utils";

const ICONS: Record<string,string> = {
  CONNECTION_REQUEST:"🤝", CONNECTION_ACCEPTED:"🎉", MENTORSHIP_REQUEST:"⚡",
  MEETING_SCHEDULED:"📅", JOB_POSTED:"💼", COMPLAINT_UPDATE:"🛡️",
  ANNOUNCEMENT:"📢", MESSAGE_RECEIVED:"💬", ACCOUNT_APPROVED:"✅", SECURITY_ALERT:"⚠️",
};

export function NotificationsPage() {
  const { notifications, markRead, markAllRead } = useNotificationStore();

  return (
    <div style={{ padding:24, maxWidth:700, margin:"0 auto" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
        <div>
          <h2 className="font-display" style={{ fontSize:22, fontWeight:800, color:"var(--text)" }}>Notifications</h2>
          <p style={{ color:"var(--muted)", fontSize:14, marginTop:4 }}>{notifications.filter(n=>!n.isRead).length} unread</p>
        </div>
        <button onClick={markAllRead} style={{ padding:"8px 18px", borderRadius:10, background:"var(--surface)", border:"1px solid var(--border)", color:"var(--text)", fontSize:13, cursor:"pointer" }}>Mark all read</button>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {notifications.length===0 && (
          <div style={{ textAlign:"center", padding:"60px 20px", color:"var(--muted)" }}>
            <div style={{ fontSize:48, marginBottom:16 }}>🔔</div>
            <div style={{ fontSize:16, fontWeight:600, color:"var(--text)" }}>All caught up!</div>
            <div style={{ fontSize:14, marginTop:6 }}>You have no notifications at the moment.</div>
          </div>
        )}
        {notifications.map(n=>(
          <div key={n.id} onClick={()=>markRead([n.id])} style={{ display:"flex", gap:14, padding:"14px 18px", borderRadius:14, cursor:"pointer", background:n.isRead?"var(--card-bg)":"rgba(99,102,241,0.06)", border:n.isRead?"1px solid var(--border)":"1px solid rgba(99,102,241,0.15)", opacity:n.isRead?0.7:1, transition:"all 0.2s" }}
            onMouseEnter={e=>(e.currentTarget as HTMLDivElement).style.background="var(--surface-hover)"}
            onMouseLeave={e=>(e.currentTarget as HTMLDivElement).style.background=n.isRead?"var(--card-bg)":"rgba(99,102,241,0.06)"}>
            <div style={{ width:40, height:40, borderRadius:11, background:"rgba(99,102,241,0.12)", border:"1px solid rgba(99,102,241,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>
              {ICONS[n.type]||"📩"}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontWeight:600, fontSize:14, color:"var(--text)", lineHeight:1.4 }}>{n.title}</div>
              <div style={{ fontSize:13, color:"var(--muted)", marginTop:3 }}>{n.body}</div>
              <div style={{ fontSize:11, color:"var(--muted)", marginTop:5 }}>{formatTimeAgo(n.createdAt)}</div>
            </div>
            {!n.isRead && <div style={{ width:8, height:8, borderRadius:"50%", background:"var(--accent)", marginTop:6, flexShrink:0 }}/>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default NotificationsPage;

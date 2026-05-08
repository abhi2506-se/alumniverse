import nodemailer from "nodemailer";

// ── HTML Email Templates ──────────────────────────────────────────────────────
const base = (body: string) => `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{background:#050510;font-family:'Segoe UI',Arial,sans-serif;color:#f1f5f9}
  .wrap{max-width:600px;margin:0 auto;padding:40px 20px}
  .card{background:linear-gradient(135deg,rgba(99,102,241,0.08),rgba(139,92,246,0.04));border:1px solid rgba(99,102,241,0.2);border-radius:20px;padding:40px}
  .logo{font-size:22px;font-weight:800;background:linear-gradient(135deg,#6366f1,#06b6d4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:28px}
  h1{font-size:26px;font-weight:800;color:#f1f5f9;margin-bottom:12px}
  p{color:#94a3b8;font-size:15px;line-height:1.7;margin-bottom:14px}
  .otp{background:rgba(99,102,241,0.15);border:1px solid rgba(99,102,241,0.3);border-radius:16px;padding:28px;text-align:center;margin:28px 0}
  .otp-code{font-size:52px;font-weight:800;letter-spacing:14px;background:linear-gradient(135deg,#6366f1,#06b6d4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-family:monospace}
  .btn{display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff!important;text-decoration:none;border-radius:12px;font-weight:700;font-size:15px;margin:18px 0}
  .alert{background:rgba(244,63,94,0.1);border:1px solid rgba(244,63,94,0.3);border-radius:12px;padding:16px 20px;color:#fda4af;margin:20px 0}
  .success{background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.3);border-radius:12px;padding:16px 20px;color:#6ee7b7;margin:20px 0}
  .row{display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06);font-size:14px}
  .label{color:#64748b}.val{color:#f1f5f9;font-weight:600}
  .footer{text-align:center;color:#475569;font-size:12px;margin-top:28px;padding-top:20px;border-top:1px solid rgba(255,255,255,0.06)}
</style></head><body><div class="wrap"><div class="card">
<div class="logo">⚡ AlumniVerse</div>
${body}
</div>
<div class="footer"><p>© ${new Date().getFullYear()} AlumniVerse · <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="color:#6366f1">alumniverse.app</a></p></div>
</div></body></html>`;

export const templates: Record<string, (d: any) => string> = {
  otp: (d) => base(`<h1>Your Login Code 🔐</h1><p>Hi ${d.name},</p><p>Use the code below to sign in. Expires in <strong style="color:#f1f5f9">10 minutes</strong>.</p><div class="otp"><div class="otp-code">${d.otp}</div></div><p>Didn't request this? Ignore this email.</p>`),

  "email-verify": (d) => base(`<h1>Verify Your Email ✉️</h1><p>Hi ${d.name}, welcome to AlumniVerse! Verify your email to get started.</p><div class="otp"><div class="otp-code">${d.otp}</div></div><p>This code expires in 10 minutes. Your account needs admin approval before you can sign in.</p>`),

  "account-approved": (_d) => base(`<h1>Account Approved! 🎉</h1><div class="success">✓ Your AlumniVerse account has been approved.</div><p>Welcome to AlumniVerse! You can now sign in and access all features — connect with alumni, find mentors, apply for jobs, and more.</p><a href="${process.env.NEXT_PUBLIC_APP_URL}/login" class="btn">Sign In Now →</a>`),

  "account-rejected": (_d) => base(`<h1>Account Review Update</h1><div class="alert">⚠ Your registration could not be approved at this time.</div><p>This may be due to incomplete or unverifiable information. Please contact your institution's administration for guidance.</p>`),

  "security-alert": (d) => base(`<h1>⚠️ Suspicious Login Detected</h1><div class="alert">A login was detected from an unrecognized device or location.</div><p>Hi ${d.name},</p><div><div class="row"><span class="label">IP Address</span><span class="val">${d.ip}</span></div><div class="row"><span class="label">Time</span><span class="val">${new Date(d.time).toLocaleString()}</span></div><div class="row"><span class="label">Device</span><span class="val">${String(d.device).slice(0, 60)}</span></div></div><p style="margin-top:18px">If this was you, no action needed. Otherwise:</p><a href="${process.env.NEXT_PUBLIC_APP_URL}/reset-password" class="btn" style="background:linear-gradient(135deg,#f43f5e,#ef4444)">Secure My Account →</a>`),

  "connection-request": (d) => base(`<h1>New Connection Request 🤝</h1><p>Someone wants to connect with you on AlumniVerse!</p>${d.message ? `<div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:16px;margin:20px 0;font-style:italic;color:#e2e8f0">"${d.message}"</div>` : ""}<a href="${process.env.NEXT_PUBLIC_APP_URL}/connections" class="btn">View Request →</a>`),

  "connection-accepted": (_d) => base(`<h1>Connection Accepted! 🎉</h1><div class="success">✓ You are now connected. A private chat room has been created.</div><p>Start a conversation, share knowledge, and grow your professional network.</p><a href="${process.env.NEXT_PUBLIC_APP_URL}/chat" class="btn">Open Chat →</a>`),

  "meeting-confirmation": (d) => base(`<h1>Meeting Confirmed 📅</h1><p>Hi ${d.name}, your mentorship session is confirmed!</p><div style="background:rgba(99,102,241,0.1);border:1px solid rgba(99,102,241,0.2);border-radius:16px;padding:24px;margin:24px 0"><div style="font-size:20px;font-weight:800;color:#f1f5f9;margin-bottom:14px">${d.title}</div><div class="row"><span class="label">Date & Time</span><span class="val">${d.scheduledAt}</span></div><div class="row"><span class="label">Duration</span><span class="val">${d.duration} minutes</span></div><div class="row"><span class="label">Platform</span><span class="val">Jitsi Meet (Free)</span></div></div><a href="${d.meetingLink}" class="btn">Join Meeting →</a><p style="font-size:13px;color:#64748b;margin-top:8px">Link: <a href="${d.meetingLink}" style="color:#6366f1">${d.meetingLink}</a></p>`),

  "complaint-registered": (d) => base(`<h1>Complaint Registered 📋</h1><div class="success">✓ Your complaint has been received and assigned a unique tracking ID.</div><div style="margin:20px 0"><div class="row"><span class="label">Complaint ID</span><span class="val" style="font-family:monospace;color:#6366f1">${d.complaintId}</span></div><div class="row"><span class="label">Subject</span><span class="val">${d.subject}</span></div><div class="row"><span class="label">Status</span><span class="val">Pending Review</span></div></div><a href="${process.env.NEXT_PUBLIC_APP_URL}/complaints" class="btn">Track Complaint →</a>`),

  "complaint-update": (d) => base(`<h1>Complaint Status Updated</h1><div class="row"><span class="label">ID</span><span class="val" style="font-family:monospace;color:#6366f1">${d.complaintId}</span></div><div class="row"><span class="label">New Status</span><span class="val">${d.status}</span></div>${d.remarks ? `<div class="row"><span class="label">Remarks</span><span class="val">${d.remarks}</span></div>` : ""}<a href="${process.env.NEXT_PUBLIC_APP_URL}/complaints" class="btn">View Complaint →</a>`),

  "event-reminder": (d) => base(`<h1>Event Reminder 🔔</h1><p>Your registered event starts soon!</p><div class="row"><span class="label">Event</span><span class="val">${d.title}</span></div><div class="row"><span class="label">Date</span><span class="val">${d.date}</span></div>${d.link ? `<a href="${d.link}" class="btn">Join Event →</a>` : ""}`),

  "placement-alert": (d) => base(`<h1>🚨 New Placement Opportunity</h1><div style="background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.3);border-radius:16px;padding:24px;margin:24px 0"><div style="font-size:20px;font-weight:800;color:#f1f5f9">${d.title}</div><div style="color:#6ee7b7;margin-top:4px">${d.company}</div><div class="row" style="margin-top:12px"><span class="label">Package</span><span class="val" style="color:#10b981">${d.package}</span></div><div class="row"><span class="label">Deadline</span><span class="val">${d.deadline}</span></div></div><a href="${process.env.NEXT_PUBLIC_APP_URL}/jobs" class="btn">Apply Now →</a>`),
};

// ── Sender ─────────────────────────────────────────────────────────────────────
interface EmailOptions {
  to: string;
  subject: string;
  template: string;
  data?: Record<string, any>;
}

let resendClient: any = null;
async function getResend() {
  if (!resendClient) {
    const { Resend } = await import("resend");
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

const smtpTransport = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

export async function sendEmail({ to, subject, template, data = {} }: EmailOptions) {
  const html = templates[template]?.(data) || `<p>${subject}</p>`;
  const from = `AlumniVerse <${process.env.EMAIL_FROM || "noreply@alumniverse.app"}>`;

  // Try Resend first
  if (process.env.RESEND_API_KEY) {
    try {
      const resend = await getResend();
      return await resend.emails.send({ from, to, subject, html });
    } catch (err) {
      console.warn("[Email] Resend failed, falling back to SMTP:", err);
    }
  }

  // Fallback: Nodemailer / Gmail SMTP
  return smtpTransport.sendMail({ from, to, subject, html });
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

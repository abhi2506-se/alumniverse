# ⚡ AlumniVerse — Next-Generation College Alumni Portal

> The most advanced alumni platform ever built. LinkedIn + Discord + Notion + Stripe combined into one futuristic ecosystem.

---

## 🚀 Quick Start

```bash
# 1. Clone and install
git clone https://github.com/yourorg/alumniverse.git
cd alumniverse
npm install

# 2. Copy environment variables
cp .env.example .env.local
# Fill in all values (see Environment Variables section)

# 3. Setup database (Neon Free Tier recommended)
npx prisma db push
npx prisma db seed

# 4. Start development
npm run dev         # Next.js on port 3000
npm run socket:dev  # Socket.IO on port 3001
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🔑 Test Credentials (after seed)

| Role      | Email                                      | Password   |
|-----------|--------------------------------------------|------------|
| Developer | developer@alumniverse.app                  | Admin@123  |
| Admin     | admin@alumniverse.app                      | Admin@123  |
| Alumni    | arjun.mehta@example.com                    | Admin@123  |
| Alumni    | priya.sharma@example.com                   | Admin@123  |
| Student   | rahul.singh@student.alumniverse.app        | Admin@123  |

> OTP will be sent to registered email. For local dev, check server logs for OTP output.

---

## 🏗️ Tech Stack

| Layer        | Technology                                    |
|--------------|-----------------------------------------------|
| Frontend     | Next.js 15, React 19, TypeScript              |
| Styling      | Tailwind CSS, CSS Variables (Dark/Light mode) |
| Animations   | CSS Keyframes, Framer Motion ready            |
| Charts       | Recharts                                      |
| State        | Zustand (auth, chat, UI, notifications, theme)|
| Data Fetching| Axios + React Query ready                     |
| Backend      | Next.js API Routes + Express Socket.IO server |
| Database     | PostgreSQL via Prisma ORM (Neon free tier)    |
| Auth         | JWT (15min access + 7day refresh) + OTP email |
| Realtime     | Socket.IO                                     |
| Email        | Resend (primary) + Nodemailer/Gmail (fallback)|
| Storage      | Cloudinary free tier                          |
| Video        | Jitsi Meet (100% free, no API key)            |
| Deployment   | Vercel (frontend) + Railway (socket server)   |

---

## 📁 Project Structure

```
alumniverse/
├── app/
│   ├── (auth)/           # Login, Register, Forgot Password
│   ├── (dashboard)/      # All protected dashboard pages
│   ├── api/              # All API routes
│   └── globals.css       # CSS variables for dark/light theme
├── components/
│   ├── layout/           # Sidebar, TopBar (with ThemeToggle)
│   ├── auth/             # LoginPage, RegisterPage
│   ├── dashboard/        # Student/Alumni/Admin/Dev dashboards
│   ├── alumni/           # AlumniNetworkPage
│   ├── chat/             # ChatPage (realtime)
│   ├── mentorship/       # MentorshipPage (3-step booking)
│   ├── pages/            # Jobs, Events, Complaints, Notifications, Profile
│   └── common/           # StatCard, ThemeToggle, AIAssistant
├── lib/
│   ├── prisma.ts         # Prisma client singleton
│   ├── jwt.ts            # Access + refresh token signing/verification
│   ├── email.ts          # Resend + Nodemailer, all HTML templates
│   ├── cloudinary.ts     # File upload helpers
│   ├── rateLimit.ts      # DB-backed rate limiting
│   └── utils.ts          # Helpers: slug, Jitsi link, profile score, etc.
├── store/
│   ├── useAuthStore.ts   # User auth state (persisted)
│   ├── useThemeStore.ts  # Dark/Light theme (persisted)
│   ├── stores.ts         # Chat, UI, Notification stores
├── hooks/
│   ├── useSocket.ts      # Socket.IO client hook
│   └── useAuth.ts        # Login, verifyOTP, logout, refresh
├── server/
│   └── index.ts          # Express + Socket.IO standalone server
├── prisma/
│   ├── schema.prisma     # Full 35+ model DB schema
│   └── seed.ts           # Demo data seeder
└── middleware.ts          # JWT auth + RBAC route protection
```

---

## 🎨 Dark / Light Mode

The app uses **CSS custom properties** (`var(--bg)`, `var(--text)`, etc.) that change when `data-theme="light"` is set on `<html>`.

Toggle is available in the **TopBar** (☀️/🌙 button). Theme persists across sessions via Zustand + localStorage.

---

## 🔐 Security Features

- ✅ Passwords hashed with bcrypt (12 rounds)
- ✅ JWT Access Token: 15-minute expiry
- ✅ JWT Refresh Token: 7-day with rotation
- ✅ OTP: 6-digit, 10-minute expiry, max 5 attempts
- ✅ Brute force: lockout after 10 failed logins (30 min)
- ✅ Rate limiting: per-IP per-endpoint (DB-backed)
- ✅ Suspicious login detection + email alert
- ✅ RBAC middleware on all routes
- ✅ Developer routes require `DEVELOPER` role only
- ✅ Audit logs for all sensitive actions
- ✅ SQL injection protection via Prisma
- ✅ XSS protection via Next.js headers

---

## 📧 Email Templates

All emails are premium HTML with glass-morphism design:

| Template              | Trigger                          |
|-----------------------|----------------------------------|
| `otp`                 | Login OTP                        |
| `email-verify`        | Email verification on register   |
| `account-approved`    | Admin approves account           |
| `account-rejected`    | Admin rejects account            |
| `security-alert`      | Suspicious login detected        |
| `connection-request`  | Someone sends connection request |
| `connection-accepted` | Connection accepted              |
| `meeting-confirmation`| Meeting booked via Jitsi         |
| `complaint-registered`| Complaint filed                  |
| `complaint-update`    | Admin updates complaint status   |
| `placement-alert`     | New job matching student profile |
| `event-reminder`      | Upcoming event reminder          |

---

## 🚀 Deployment

### Vercel + Neon + Railway (Recommended Free Stack)

```bash
# Deploy frontend to Vercel
npx vercel --prod

# Add all .env vars in Vercel Dashboard > Settings > Environment Variables

# Deploy Socket.IO server to Railway
# Push to GitHub, connect Railway, set start command:
# tsx server/index.ts
```

### Required Environment Variables

```env
DATABASE_URL=           # Neon PostgreSQL connection string
DIRECT_URL=             # Neon direct connection (for Prisma)
JWT_ACCESS_SECRET=      # Min 32 chars random string
JWT_REFRESH_SECRET=     # Min 32 chars random string
RESEND_API_KEY=         # From resend.com (free 3000/mo)
CLOUDINARY_CLOUD_NAME=  # From cloudinary.com
CLOUDINARY_API_KEY=     # From cloudinary.com
CLOUDINARY_API_SECRET=  # From cloudinary.com
NEXT_PUBLIC_APP_URL=    # Your deployed URL
NEXT_PUBLIC_SOCKET_URL= # Your Railway Socket.IO URL
```

---

## 🧩 Role-Based Dashboards

| Role      | Dashboard Features                                              |
|-----------|-----------------------------------------------------------------|
| Student   | Stats, alumni network, mentorship booking, chat, jobs, events  |
| Alumni    | Profile views, mentee management, job posting, blogs           |
| Admin     | User approval, complaints, analytics, announcements            |
| Developer | System health, API monitor, error logs, DB stats               |

---

*Built with ❤️ for the next generation of alumni networking.*

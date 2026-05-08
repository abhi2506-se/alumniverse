# AlumniVerse — Setup Guide

## Errors Fixed in This Build

| # | Error | Fix Applied |
|---|-------|-------------|
| 1 | `Environment variable not found: DATABASE_URL` | Created `.env` file with all variables |
| 2 | `routes-manifest.json` not found / stale `.next` chunks | Deleted stale `.next` build folder |
| 3 | Next.js workspace root warning (wrong lockfile detected) | Added `outputFileTracingRoot` to `next.config.js` |
| 4 | `rateLimitEntry` DB call crashing before DB is ready | Wrapped all DB calls in rateLimit.ts in try/catch |

---

## Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Open `.env` and fill in the required fields marked 🔴:

#### Database (pick one free option)

**Option A — Neon (recommended, free)**
1. Go to https://neon.tech → create a free project
2. Copy the connection string
3. In `.env`, set:
   ```
   DATABASE_URL="postgresql://user:pass@ep-xxx.us-east-1.aws.neon.tech/alumniverse?sslmode=require"
   DIRECT_URL="postgresql://user:pass@ep-xxx.us-east-1.aws.neon.tech/alumniverse?sslmode=require"
   ```

**Option B — Supabase (free)**
1. Go to https://supabase.com → create a project
2. Go to Settings → Database → Connection string
3. Copy both "Connection pooling" (→ `DATABASE_URL`) and "Direct" (→ `DIRECT_URL`) strings

**Option C — Local PostgreSQL**
1. Install PostgreSQL locally
2. Create a database: `createdb alumniverse`
3. In `.env`, set:
   ```
   DATABASE_URL="postgresql://postgres:password@localhost:5432/alumniverse"
   DIRECT_URL="postgresql://postgres:password@localhost:5432/alumniverse"
   ```

#### JWT Secrets
Generate two random secrets (run this in your terminal):
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Set them as `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` in `.env`.

#### Email (pick one)
- **Resend** (easiest): Sign up at https://resend.com → get API key → set `RESEND_API_KEY`
- **Gmail SMTP**: Enable 2FA, create an App Password, set `SMTP_USER` and `SMTP_PASS`

### 3. Push Database Schema

```bash
npm run db:push
```
This creates all tables in your database.

### 4. Seed the Database (optional but recommended)

```bash
npm run db:seed
```
This creates sample branches, departments, and a default admin user.

### 5. Start the Dev Server

```bash
npm run dev
```
Visit http://localhost:3000

---

## Common Errors & Solutions

### `Environment variable not found: DATABASE_URL`
→ You haven't filled in `.env`. Follow Step 2 above.

### `Can't reach database server`
→ Your `DATABASE_URL` is wrong or the database isn't running. Double-check the connection string.

### `Module not found` / `.next` chunk errors
→ Delete the `.next` folder and re-run `npm run dev`:
```bash
rm -rf .next
npm run dev
```

### `prisma:error Invalid invocation`
→ Run `npm run db:push` to sync your schema to the database first.

### Workspace root warning in Next.js
→ Already fixed in `next.config.js`. If it still appears, ignore it — it's a warning, not an error.

---

## Project Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run db:push` | Sync Prisma schema → database (no migration history) |
| `npm run db:migrate` | Create a migration (for production) |
| `npm run db:seed` | Seed database with sample data |
| `npm run db:studio` | Open Prisma Studio (visual DB editor) |
| `npm run socket:dev` | Start Socket.IO server (for real-time chat) |

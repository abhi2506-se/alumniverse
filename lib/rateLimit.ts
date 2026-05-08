// ── lib/rateLimit.ts ──────────────────────────────────────────────────────────
import { prisma } from "./prisma";

export async function rateLimiter(key: string, max: number, windowSecs: number) {
  const windowStart = new Date(Date.now() - windowSecs * 1000);

  let entry;
  try {
    entry = await prisma.rateLimitEntry.findUnique({ where: { key } });
  } catch {
    // DB not available (e.g. DATABASE_URL not configured) — skip rate limiting
    return;
  }

  try {
    if (!entry || entry.windowStart < windowStart) {
      await prisma.rateLimitEntry.upsert({
        where: { key },
        update: { hits: 1, windowStart: new Date() },
        create: { key, hits: 1, windowStart: new Date() },
      });
      return;
    }

    if (entry.hits >= max) {
      const err: any = new Error(`Rate limit exceeded`);
      err.statusCode = 429;
      throw err;
    }

    await prisma.rateLimitEntry.update({
      where: { key },
      data: { hits: { increment: 1 } },
    });
  } catch (err: any) {
    if (err.statusCode === 429) throw err;
    // Silently ignore other DB errors during rate-limit tracking
    return;
  }
}

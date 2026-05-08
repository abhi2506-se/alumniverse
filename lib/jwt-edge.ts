/**
 * lib/jwt-edge.ts
 *
 * Edge Runtime–compatible JWT verification using the Web Crypto API.
 *
 * WHY THIS FILE EXISTS:
 * `jsonwebtoken` (used in lib/jwt.ts) depends on Node.js built-ins
 * (process.version, process.nextTick, crypto streams) that are NOT available
 * in the Next.js Edge Runtime where middleware.ts runs.
 *
 * This file re-implements ONLY the verification logic with the standard
 * Web Crypto API, which is available in every modern JS runtime including
 * Vercel's Edge Runtime, Cloudflare Workers, and Deno.
 *
 * lib/jwt.ts (with jsonwebtoken) is still used for SIGNING tokens inside
 * API route handlers, which run in the Node.js runtime — that's fine.
 */

export interface JwtEdgePayload {
  userId: string;
  role: string;
  iat?: number;
  exp?: number;
  [key: string]: unknown;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Base64URL → Uint8Array */
function base64UrlDecode(str: string): Uint8Array {
  // Restore standard Base64 padding
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  const binary = atob(padded);
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}

/** Import a raw HMAC-SHA256 key from a UTF-8 secret string */
async function importHmacKey(secret: string): Promise<CryptoKey> {
  const keyBytes = new TextEncoder().encode(secret);
  return crypto.subtle.importKey(
    "raw",
    keyBytes,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"]
  );
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Verify a HS256 JWT in the Edge Runtime.
 *
 * Throws an Error (with a descriptive message) if:
 *  - the token is malformed
 *  - the algorithm is not HS256
 *  - the signature is invalid
 *  - the token is expired
 *
 * Returns the decoded payload on success.
 */
export async function verifyJwtEdge(
  token: string,
  secret: string
): Promise<JwtEdgePayload> {
  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new Error("Invalid JWT: expected 3 parts");
  }

  const [headerB64, payloadB64, signatureB64] = parts;

  // 1. Decode & validate header
  let header: { alg?: string; typ?: string };
  try {
    header = JSON.parse(new TextDecoder().decode(base64UrlDecode(headerB64)));
  } catch {
    throw new Error("Invalid JWT: malformed header");
  }

  if (header.alg !== "HS256") {
    throw new Error(`Invalid JWT: unsupported algorithm "${header.alg}". Expected HS256`);
  }

  // 2. Verify signature
  const signingInput = new TextEncoder().encode(`${headerB64}.${payloadB64}`);
  const signature = base64UrlDecode(signatureB64);
  const cryptoKey = await importHmacKey(secret);

  const valid = await crypto.subtle.verify("HMAC", cryptoKey, signature.buffer.slice(signature.byteOffset, signature.byteOffset + signature.byteLength) as ArrayBuffer, signingInput.buffer.slice(signingInput.byteOffset, signingInput.byteOffset + signingInput.byteLength) as ArrayBuffer);
  if (!valid) {
    throw new Error("Invalid JWT: signature verification failed");
  }

  // 3. Decode payload
  let payload: JwtEdgePayload;
  try {
    payload = JSON.parse(
      new TextDecoder().decode(base64UrlDecode(payloadB64))
    ) as JwtEdgePayload;
  } catch {
    throw new Error("Invalid JWT: malformed payload");
  }

  // 4. Check expiry
  if (payload.exp !== undefined && Date.now() / 1000 > payload.exp) {
    throw new Error("Invalid JWT: token has expired");
  }

  return payload;
}

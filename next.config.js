const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fix: Prevents Next.js from picking up a wrong workspace root
  // when there are multiple package-lock.json files on the system
  outputFileTracingRoot: path.join(__dirname),

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },

  // serverActions is stable in Next.js 15 — no longer needs experimental flag
  // (kept here for backward compatibility with older Next versions)
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000"],
    },
  },
};

module.exports = nextConfig;

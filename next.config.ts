import type { NextConfig } from "next";

/**
 * Photo CDN (see src/content/README.md → "Photos on a CDN").
 * NEXT_PUBLIC_IMAGE_CDN_URL, e.g. "https://cdn.example.com/adidev". Only that
 * host and path are allowed through the image optimiser.
 */
const cdn = process.env.NEXT_PUBLIC_IMAGE_CDN_URL ? new URL(process.env.NEXT_PUBLIC_IMAGE_CDN_URL) : null;

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  images: {
    remotePatterns: cdn
      ? [{ protocol: cdn.protocol.replace(":", "") as "http" | "https", hostname: cdn.hostname, pathname: `${cdn.pathname.replace(/\/$/, "")}/**` }]
      : [],
  },
  partialPrefetching: true,
  experimental: {
    // Tailwind output is small: shipping it in the HTML removes the
    // render-blocking stylesheet request on first visits (biggest win on slow mobile networks).
    inlineCss: true,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

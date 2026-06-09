/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true, // required for static export
  },
  // Disable server-side output file tracing (not needed for static export,
  // and causes a crash in Next.js 14.2 App-Router-only projects)
  outputFileTracing: false,
};

export default nextConfig;

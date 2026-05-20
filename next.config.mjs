/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // A stray ~/package-lock.json makes Next infer the wrong workspace root; pin it.
  outputFileTracingRoot: import.meta.dirname,
};

export default nextConfig;

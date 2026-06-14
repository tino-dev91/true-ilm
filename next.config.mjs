/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // A stray ~/package-lock.json makes Next infer the wrong workspace root; pin it.
  outputFileTracingRoot: import.meta.dirname,
  // The live campaign is the New Year "gift of knowledge" flow. Lock the root to
  // it (307 so it's easily reverted); the old Eid creator at / is retired but
  // its files remain, and shared /gift links keep working.
  async redirects() {
    return [{ source: "/", destination: "/newyear", permanent: false }];
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp']
  },
  async redirects() {
    return [
      // Canonical character spelling changed Flow → Flo (May 2026 site audit).
      // 301 the old URL so any shared links keep working.
      {
        source: '/universe/characters/flow',
        destination: '/universe/characters/flo',
        permanent: true
      }
    ];
  }
};

export default nextConfig;

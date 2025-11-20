/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  eslint: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has ESLint errors.
    // !! WARN !!
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['images.unsplash.com'],
  },
  // Increase the body size limit for API routes
  api: {
    bodyParser: {
      sizeLimit: '25mb', // Match this with your backend limit
    },
  },
  // For Server Actions
  experimental: {
    serverActions: {
      bodySizeLimit: '25mb', // Match this with your backend limit
    },
  },
  // Disable static optimization for dynamic routes
  generateBuildId: async () => {
    return 'build-cache-bust-' + Date.now()
  },
  // Force dynamic rendering for blog pages
  async headers() {
    return [
      {
        source: '/api/Blog/:slug',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
        ],
      },
      {
        source: '/api/Blog',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig

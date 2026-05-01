/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
     {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-src 'self' https://www.instagram.com; img-src 'self' https://*.instagram.com https://*.cdninstagram.com;",
          },
        ],
      },
    ];
    
    images: { unoptimized: true }
  },

  typescript: {
    // Allows builds to complete even with linting/type errors
    ignoreBuildErrors: true,
  },
  images: {
    // Useful for static exports or specific hosting environments
    unoptimized: true,
  },
};

export default nextConfig;
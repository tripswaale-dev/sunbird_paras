import type { NextConfig } from 'next';

const apiOrigin = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api').replace(
  /\/api\/?$/,
  ''
);

function laravelUploadPattern() {
  try {
    const url = new URL(apiOrigin);

    return {
      protocol: (url.protocol.replace(':', '') || 'http') as 'http' | 'https',
      hostname: url.hostname,
      ...(url.port ? { port: url.port } : {}),
      pathname: '/uploads/**',
    };
  } catch {
    return {
      protocol: 'http' as const,
      hostname: 'localhost',
      port: '8000',
      pathname: '/uploads/**',
    };
  }
}

function localUploadPatterns() {
  return [
    {
      protocol: 'http' as const,
      hostname: 'localhost',
      port: '8000',
      pathname: '/uploads/**',
    },
    {
      protocol: 'http' as const,
      hostname: '127.0.0.1',
      port: '8000',
      pathname: '/uploads/**',
    },
  ];
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
      laravelUploadPattern(),
      ...localUploadPatterns(),
    ],
  },
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: `${apiOrigin}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;

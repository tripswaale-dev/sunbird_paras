import type { NextConfig } from 'next';

const apiOrigin = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api').replace(
  /\/api\/?$/,
  ''
);

function laravelAssetPattern(pathname: string) {
  try {
    const url = new URL(apiOrigin);

    return {
      protocol: (url.protocol.replace(':', '') || 'http') as 'http' | 'https',
      hostname: url.hostname,
      ...(url.port ? { port: url.port } : {}),
      pathname,
    };
  } catch {
    return {
      protocol: 'http' as const,
      hostname: 'localhost',
      port: '8000',
      pathname,
    };
  }
}

function laravelUploadPattern() {
  return laravelAssetPattern('/uploads/**');
}

function laravelImagePattern() {
  return laravelAssetPattern('/images/**');
}

function localAssetPatterns(pathname: string) {
  return [
    {
      protocol: 'http' as const,
      hostname: 'localhost',
      port: '8000',
      pathname,
    },
    {
      protocol: 'http' as const,
      hostname: '127.0.0.1',
      port: '8000',
      pathname,
    },
  ];
}

function localUploadPatterns() {
  return localAssetPatterns('/uploads/**');
}

function localImagePatterns() {
  return localAssetPatterns('/images/**');
}

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
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
      laravelImagePattern(),
      ...localUploadPatterns(),
      ...localImagePatterns(),
    ],
  },
};

export default nextConfig;

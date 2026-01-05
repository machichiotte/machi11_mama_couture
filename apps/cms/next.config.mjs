import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // On expose la variable existante au navigateur pour que le bouton Delete sache où taper en direct
  env: {
    PAYLOAD_PUBLIC_SERVER_URL: process.env.PAYLOAD_PUBLIC_SERVER_URL,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
      allowedOrigins: [
        process.env.PAYLOAD_PUBLIC_SITE_URL,
        process.env.PAYLOAD_PUBLIC_SERVER_URL
      ].filter(Boolean),
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })

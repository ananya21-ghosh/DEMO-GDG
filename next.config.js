/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true
  },
  experimental: {
    outputFileTracingIncludes: {
      '/*': ['./prisma/dev.db']
    }
  }
}

module.exports = nextConfig

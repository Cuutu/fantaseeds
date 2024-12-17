/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['i.imgur.com', 'leafly-cms-production.imgix.net'],
  },
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig 
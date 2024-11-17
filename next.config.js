/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.pexels.com', 'i.imgur.com', 'leafly-cms-production.imgix.net'],
    unoptimized: true
  }
}

module.exports = nextConfig 
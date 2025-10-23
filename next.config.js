/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/shopping-list-app' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/shopping-list-app/' : '',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
}

module.exports = nextConfig

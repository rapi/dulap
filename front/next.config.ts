// next.config.js
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname, // lock the root to /dulap/front
  },
  reactStrictMode: true,

module.exports = {
  async rewrites() {
    return [
      // handle the root
      // { source: '/', destination: '/ro' },

      // match anything that does NOT start with ro or ru
      // and capture it as :path
      { source: '/:path((?!ro|ru).*)', destination: '/ro/:path' },
    ]
  },
}

export default nextConfig

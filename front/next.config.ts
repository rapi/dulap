import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  i18n: {
    locales: ['default', 'ro', 'ru'],
    defaultLocale: 'default',
    localeDetection: false,
  },
  trailingSlash: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/ro',
        permanent: false, // use true if it's a permanent redirect
      },
    ]
  },
}

export default nextConfig

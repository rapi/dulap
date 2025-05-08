import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  i18n: {
    locales: ['default', 'ro', 'ru'],
    defaultLocale: 'default',
    localeDetection: false,
  },
  trailingSlash: true,
}

export default nextConfig

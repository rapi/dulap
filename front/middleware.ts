import { NextRequest, NextResponse } from 'next/server'

const locales = ['ro', 'ru']

// Get the preferred locale, similar to the above or using a library
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getLocale(_request: NextRequest) {
  return 'ro'
}

export function middleware(request: NextRequest) {
  // Check if there is any supported locale in the pathname
  const { pathname } = request.nextUrl

  if (/\.(png|jpe?g|gif|svg|webp|avif|mp4)$/.test(pathname)) {
    const url = request.nextUrl.clone()

    // point it at your remote host:
    url.protocol = 'https'
    url.hostname = 'dulap.md'
    url.port = '' // leave blank if default 443
    return NextResponse.rewrite(url)
  }
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) return

  // Redirect if there is no locale
  const locale = getLocale(request)
  request.nextUrl.pathname = `/${locale}${pathname}`
  // e.g. incoming request is /products
  // The new URL is now /en-US/products
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next).*)',
    // Optional: only run on root (/) URL
    // '/'
  ],
}

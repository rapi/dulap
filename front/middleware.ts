import { NextRequest, NextResponse } from 'next/server'

const locales = ['ro', 'ru']
const LOCALE_COOKIE_NAME = 'NEXT_LOCALE'

function getLocaleFromRequest(request: NextRequest): string {
  // Try to get locale from cookie
  const cookieLocale = request.cookies.get(LOCALE_COOKIE_NAME)?.value
  if (cookieLocale && locales.includes(cookieLocale)) return cookieLocale

  // Fallback to default if not in cookie
  return 'ro'
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (
    pathname.startsWith('/api') ||
    pathname.endsWith('sitemap.xml') ||
    pathname.endsWith('robots.txt')
  ) {
    return
  }

  // Skip asset files
  if (/\.(png|jpe?g|gif|svg|webp|avif|mp4)$/.test(pathname)) {
    const url = request.nextUrl.clone()
    url.protocol = 'https'
    url.hostname = 'dulap.md'
    url.port = ''
    url.pathname = url.pathname.replace(/^\/(ro|ru)/, '')
    return NextResponse.rewrite(url)
  }

  // Check if pathname starts with a supported locale
  const matchedLocale = locales.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (matchedLocale) {
    // Set locale cookie if not already set or mismatched
    const response = NextResponse.next()
    const currentCookie = request.cookies.get(LOCALE_COOKIE_NAME)?.value
    if (currentCookie !== matchedLocale) {
      response.cookies.set(LOCALE_COOKIE_NAME, matchedLocale, {
        path: '/',
        maxAge: 60 * 60 * 24 * 30, // 30 days
      })
    }
    return response
  }

  // Redirect to locale-prefixed URL using cookie or default
  const locale = getLocaleFromRequest(request)
  const newUrl = request.nextUrl.clone()
  newUrl.pathname = `/${locale}${pathname}`
  const response = NextResponse.redirect(newUrl)
  response.cookies.set(LOCALE_COOKIE_NAME, locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  })
  return response
}

export const config = {
  matcher: ['/((?!_next).*)'],
}

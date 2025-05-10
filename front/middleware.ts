import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_FILE = /\.(.*)$/

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const response = NextResponse.next()

  if (/\.(png|jpe?g|gif|svg|webp|avif)$/.test(pathname)) {
    const url = req.nextUrl.clone()

    // point it at your remote host:
    url.protocol = 'https'
    url.hostname = 'dulap.md'
    url.port = '' // leave blank if default 443
    return NextResponse.rewrite(url)
  }
  if (
    req.nextUrl.pathname.startsWith('/_next') ||
    req.nextUrl.pathname.includes('/api/') ||
    PUBLIC_FILE.test(req.nextUrl.pathname)
  ) {
    return
  }
  console.log({ pathname, locale: req.nextUrl.locale, req })

  if (req.nextUrl.locale === 'default') {
    const locale = req.cookies.get('NEXT_LOCALE')?.value || 'ro'
    console.log('get cookie', locale)
    return NextResponse.redirect(
      new URL(`/${locale}${req.nextUrl.pathname}${req.nextUrl.search}`, req.url)
    )
  } else {
    let locale = req.nextUrl.locale
    if (!locale) {
      locale = pathname.split('/')[1]
    }
    if (locale) {
      console.log('set cookie', req.nextUrl.locale)
      response.cookies.set('NEXT_LOCALE', locale)
    }
  }
  return response
}

import { ReactNode, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Script from 'next/script'
import { useIntl } from 'react-intl'

import { Menu } from '~/components/Menu/Menu'
import { Footer } from '~/components/Footer/Footer'
import * as gtag from '~/lib/gtag'
import './Layout.css'

type LayoutProps = {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const intl = useIntl()
  const title = intl.formatMessage({ id: 'meta.title' })

  const router = useRouter()
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      gtag.pageview(url)
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  return (
    <>
      {/* 1. Load GA library */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=495928571`}
        strategy="afterInteractive"
      />
      {/* 2. Initialize gtag */}
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '495928571', {
            page_path: window.location.pathname,
          });
        `}
      </Script>

      <Head>
        <title>{title}</title>
        <meta
          name="keywords"
          content="dulap.md, dulap personalizat Chișinău, mobilier la comandă Moldova, dulap la comandă, mobilă la comandă Chișinău, мебель на заказ Кишинев, тумбочка кишинев, тумба, комод кишинев, тумба молдова, комод Молдова, мебель на заказ Молдова"
        />
        <meta
          name="description"
          content="Dulap.md – Dulapuri și mobilier la comandă în Chișinău și Moldova. Configurator online. Livrare rapidă."
        />
        <meta property="og:title" content={title} />
        <meta
          property="og:description"
          content="Dulap.md – Dulapuri și mobilier la comandă în Chișinău și Moldova."
        />
        <meta property="og:url" content="https://www.dulap.md" />
        <meta property="og:type" content="website" />
      </Head>

      <div className="layout">
        <Menu />
        <main className="main">{children}</main>
        <Footer />
      </div>
    </>
  )
}

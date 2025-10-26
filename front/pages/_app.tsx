// pages/_app.tsx
import type { AppProps } from 'next/app'
import Layout from '~/components/Layout/Layout'
import '~/components/Layout/Layout.css'
import ro from '../locales/ro.json'
import ru from '../locales/ru.json'
import { IntlProvider } from 'react-intl'
import { CartProvider } from '~/context/cartContext'
import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { Modal } from '~/components/Modal/Modal'
import { CopyButton } from '~/components/CopyButton/CopyButton'
import { FormattedMessage, useIntl } from 'react-intl'
import Script from 'next/script'
import Head from 'next/head'

const localeMap: Record<string, Record<string, string>> = { ro, ru }
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID as string | undefined

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const { locale: queryLocale } = router.query
  const currentLocale = (queryLocale as string) ?? 'ro'
  const messages = localeMap[currentLocale] ?? ro

  // Single SPA pageview + custom events
  useEffect(() => {
    // const handleRouteChange = (url: string) => {
    //   window.gtag?.('event', 'page_view', {
    //     page_title: document.title,
    //     page_location: window.location.href,
    //     page_path: url,
    //   })
    //   if (url === '/configurator')
    //     window.gtag?.('event', 'view_configurator', { value: 1 })
    //   if (url === '/products')
    //     window.gtag?.('event', 'view_products', { value: 1 })
    // }
    // router.events.on('routeChangeComplete', handleRouteChange)
    // first load
    // handleRouteChange(window.location.pathname + window.location.search)
    // return () => router.events.off('routeChangeComplete', handleRouteChange)
  }, [router.events])

  // SEO meta
  const path = router.pathname.replace('/[locale]', '/').replace('//', '/')
  const metaCode =
    router.pathname
      .replace('/[locale]/', '')
      .replace('/[locale]', '')
      .replace('/', '.') || 'default'
  const metaDescription = messages[`meta_description.${metaCode}`]
  const metaTitle = messages[`meta_title.${metaCode}`]
  const canonicalUrl = `https://dulap.md${path}`

  // Promo modal timer
  useEffect(() => {
    const delayMs = 30000
    const already = localStorage.getItem('promoShown')
    if (!already) {
      const timer = setTimeout(() => {
        window.dispatchEvent(new Event('openPromo'))
        localStorage.setItem('promoShown', 'true')
      }, delayMs)
      return () => clearTimeout(timer)
    }
  }, [])

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <link
          rel="alternate"
          hrefLang="ro-RO"
          href={`https://dulap.md${router.pathname.replace('/[locale]', '/ro')}`}
        />
        <link
          rel="alternate"
          hrefLang="ru-RU"
          href={`https://dulap.md${router.pathname.replace('/[locale]', '/ru')}`}
        />
        <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />
      </Head>

      {/* GA4 via gtag.js (only if not using GTM) */}
      {GA_MEASUREMENT_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = window.gtag || gtag;
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: false });
            `}
          </Script>
        </>
      )}

      <CartProvider>
        <IntlProvider locale={currentLocale} messages={messages}>
          <Layout>
            <Component {...pageProps} />
            <PromoListener />
          </Layout>
        </IntlProvider>
      </CartProvider>
    </>
  )
}

function PromoListener() {
  const intl = useIntl()
  const [isOpen, setIsOpen] = React.useState(false)

  useEffect(() => {
    const handler = () => setIsOpen(true)
    window.addEventListener('openPromo', handler)
    return () => window.removeEventListener('openPromo', handler)
  }, [])

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <h2>
        <FormattedMessage id="homepage.modal.promo.title" />
      </h2>
      <p className="promocode">
        <FormattedMessage id="homepage.modal.promo.preorder10" />
      </p>
      <CopyButton
        textToCopy={intl.formatMessage({
          id: 'homepage.modal.promo.preorder10',
        })}
      />
    </Modal>
  )
}

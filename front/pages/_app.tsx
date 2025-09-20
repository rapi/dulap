// pages/_app.tsx
import type { AppProps } from 'next/app'
import Layout from '~/components/Layout/Layout'
import '~/components/Layout/Layout.css'
import ro from '../locales/ro.json'
import ru from '../locales/ru.json'
import { IntlProvider } from 'react-intl'
import { CartProvider } from '~/context/cartContext'
import React, { useEffect } from 'react'
import { Router, useRouter } from 'next/router'
import { Modal } from '~/components/Modal/Modal'
import { CopyButton } from '~/components/CopyButton/CopyButton'
import { FormattedMessage, useIntl } from 'react-intl'
import Script from 'next/script'
import Head from 'next/head'

const localeMap: Record<string, Record<string, string>> = { ro, ru }
function pageview(url: string) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  window.gtag?.('event', 'page_view', { page_location: url })
}
function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const { locale: queryLocale } = router.query
  const currentLocale = (queryLocale as string) ?? 'ro'
  const messages = localeMap[queryLocale as string] ?? ro
  Router.events.on('routeChangeComplete', pageview)
  const canonicalUrl = `https://dulap.md${router.pathname.replace('[locale]', 'ro')}`
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
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=G-K9E49M4GJ5`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-K9E49M4GJ5', { send_page_view: false });
            `}
      </Script>
      <Head>
        <link rel="canonical" href={canonicalUrl} />
        <link
          rel="alternate"
          hrefLang="ru"
          href={canonicalUrl.replace('ro', 'ru')}
        />
        <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />
      </Head>
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

export default MyApp

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

// pages/_app.tsx
import type { AppProps } from 'next/app'
import Layout from '~/components/Layout/Layout'
import '~/components/Layout/Layout.css'
import ro from '../locales/ro.json'
import ru from '../locales/ru.json'
import { IntlProvider } from 'react-intl'
import { CartProvider } from '~/context/cartContext'
import React, { useEffect } from 'react';
import { useRouter } from 'next/router'
import { Modal } from '~/components/Modal/Modal'
import { CopyButton } from '~/components/CopyButton/CopyButton'
import { FormattedMessage, useIntl } from 'react-intl'

const localeMap: Record<string, Record<string, string>> = { ro, ru }

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const { locale: queryLocale } = router.query
  const currentLocale = 'ro'
  const messages = localeMap[queryLocale as string] ?? ro

  useEffect(() => {
    const delayMs = 30000; 
    const already = localStorage.getItem('promoShown');
    if (!already) {
      const timer = setTimeout(() => {
        window.dispatchEvent(new Event('openPromo'));
        localStorage.setItem('promoShown', 'true');
      }, delayMs);

      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <CartProvider>
      <IntlProvider locale={currentLocale} messages={messages}>
        <Layout>
          <Component {...pageProps} />
          <PromoListener />
        </Layout>
      </IntlProvider>
    </CartProvider>
  )
}

export default MyApp

function PromoListener() {
  const intl = useIntl()
  const [isOpen, setIsOpen] = React.useState(false);

  useEffect(() => {
    const handler = () => setIsOpen(true);
    window.addEventListener('openPromo', handler);
    return () => window.removeEventListener('openPromo', handler);
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <h2><FormattedMessage id="homepage.modal.promo.title" /></h2>
      <p className='promocode'><FormattedMessage id="homepage.modal.promo.preorder15" /></p>
      <CopyButton textToCopy={intl.formatMessage({id: 'homepage.modal.promo.preorder15'})} />
    </Modal>
  );
}

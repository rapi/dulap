import type { AppProps } from 'next/app'
import Layout from '~/components/Layout/Layout'
import ro from '../locales/ro.json'
import { IntlProvider } from 'react-intl'
import { useRouter } from 'next/router'
import ru from '../locales/ru.json'
import { CartProvider } from '~/context/cartContext'
const localeMap: Record<string, Record<string, string>> = {
  ro,
  ru,
}
function MyApp({ Component, pageProps }: AppProps) {
  const { query } = useRouter()
  const { locale } = query

  const currentLocale = 'ro'
  const messages = localeMap[locale as string] ?? ro
  return (
    <CartProvider>
      <IntlProvider locale={currentLocale} messages={messages}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </IntlProvider>
    </CartProvider>
  )
}
export default MyApp

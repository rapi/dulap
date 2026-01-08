// pages/_app.tsx
import type { AppProps } from 'next/app'
import Layout from '~/components/Layout/Layout'
import '~/components/Layout/Layout.css'
import ro from '../locales/ro.json'
import ru from '../locales/ru.json'
import { IntlProvider, FormattedMessage, useIntl } from 'react-intl'
import { CartProvider } from '~/context/cartContext'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { preloadPBRTextures } from '~/components/ThreeDModel/furnitureUtils'
import { Modal } from '~/components/Modal/Modal'
import styles from '~/components/Contacts/Contacts.module.css'
import { CustomButton } from '~/components/CustomButton/CustomButton'
import { CopyButton } from '~/components/CopyButton/CopyButton'
import axios from 'axios'

const localeMap: Record<string, Record<string, string>> = { ro, ru }

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const { locale: queryLocale } = router.query
  const currentLocale = (queryLocale as string) ?? 'ro'
  const messages = localeMap[currentLocale] ?? ro

  useEffect(() => {
    preloadPBRTextures()
  }, [])

  const path = router.pathname.replace('/[locale]', '/').replace('//', '/')
  const metaCode =
    router.pathname
      .replace('/[locale]/', '')
      .replace('/[locale]', '')
      .replace('/', '.') || 'default'
  const metaDescription = messages[`meta_description.${metaCode}`]
  const metaTitle = messages[`meta_title.${metaCode}`]
  const canonicalUrl = `https://dulap.md${path}`

  useEffect(() => {
    const delayMs = 40000
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

// ✅ IMPORTANT: no "export" here
function PromoListener() {
  const intl = useIntl()

  const [promoOpen, setPromoOpen] = useState(false)
  const [successOpen, setSuccessOpen] = useState(false)

  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const handler = () => setPromoOpen(true)
    window.addEventListener('openPromo', handler)
    return () => window.removeEventListener('openPromo', handler)
  }, [])

  const validateEmail = (value: string) => {
    const v = value.trim()
    if (!v)
      return intl.formatMessage({
        id: 'checkout.error.required',
        defaultMessage: 'Required',
      })
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
    if (!ok)
      return intl.formatMessage({
        id: 'contacts.email.invalid',
        defaultMessage: 'Invalid email',
      })
    return ''
  }

  const handleSubmit = async () => {
    const e = validateEmail(email)
    if (e) {
      setError(e)
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      await axios.post('/api/contact-form', {
        text: `<b>Promo request</b>
               <b>Email:</b> ${email.trim()}
               <b>Source:</b> Promo modal`,
      })

      setPromoOpen(false)
      setSuccessOpen(true)
      setEmail('')
    } catch {
      setError(
        intl.formatMessage({
          id: 'homepage.modal.promo.error',
          defaultMessage: 'Something went wrong. Please try again.',
        })
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Modal isOpen={promoOpen} onClose={() => setPromoOpen(false)}>
        <h2 className={styles.modalTitle}>
          <FormattedMessage
            id="homepage.modal.promo.title"
            defaultMessage="Special offer"
          />
        </h2>

        <p>
          <FormattedMessage
            id="homepage.modal.promo.subtitle"
            defaultMessage="Leave your email and we’ll send you the promo details."
          />
        </p>

        <div className={styles.emailForm}>
          <input
            type="email"
            id="promo-email"
            value={email}
            onChange={(ev) => {
              setEmail(ev.target.value)
              setError('')
            }}
            placeholder={intl.formatMessage({
              id: 'contactBox.placeholder.email',
              defaultMessage: 'Your Email',
            })}
          />

          {error && <p className={styles.error}>{error}</p>}
        </div>
        <br />
        <CustomButton onClick={handleSubmit} disabled={isSubmitting}>
          <FormattedMessage
            id={
              isSubmitting
                ? 'homepage.button.sending'
                : 'homepage.button.sendMessage'
            }
            defaultMessage={isSubmitting ? 'Sending…' : 'Send Message'}
          />
        </CustomButton>
      </Modal>

      <Modal isOpen={successOpen} onClose={() => setSuccessOpen(false)}>
        <h2 className={styles.modalTitle}>
          <FormattedMessage
            id="homepage.modal.success.title"
            defaultMessage="Success!"
          />
        </h2>
        <p className="promocode">
          <FormattedMessage id="homepage.modal.promo.welcome10" />
        </p>
        <CopyButton
          textToCopy={intl.formatMessage({
            id: 'homepage.modal.promo.welcome10',
          })}
        />
      </Modal>
    </>
  )
}

import { ReactNode, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

import { Menu } from '~/components/Menu/Menu'
import { Footer } from '~/components/Footer/Footer'
import * as gtag from '~/lib/gtag'
import './Layout.css'
import Gtm from '~/components/Gtm'

type LayoutProps = {
  children: ReactNode
}
export default function Layout({ children }: LayoutProps) {
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
      <Gtm />
      <Head>
        <meta
          name="keywords"
          content="dulap.md, dulap personalizat Chișinău, mobilier la comandă Moldova, dulap la comandă, mobilă la comandă Chișinău, мебель на заказ Кишинев, тумбочка кишинев, тумба, комод кишинев, тумба молдова, комод Молдова, мебель на заказ Молдова"
        />
      </Head>

      <div className="layout">
        <Menu />
        <main className="main">{children}</main>
        <Footer />
      </div>
    </>
  )
}

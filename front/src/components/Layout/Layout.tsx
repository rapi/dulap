import { ReactNode } from 'react'
import { Menu } from '~/components/Menu/Menu'
import './Layout.css'
import { Footer } from '~/components/Footer/Footer'
import Head from 'next/head';
import { useIntl } from 'react-intl'

type LayoutProps = {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const intl = useIntl()
  
  const title = intl.formatMessage({id: 'meta.title'})
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="keywords" content="dulap.md, dulap personalizat Chișinău, mobilier la comandă Moldova, dulap la comandă, mobilă la comandă Chișinău, мебель на заказ Кишинев, тумбочка кишинев, тумба, комод кишинев, тумба молдова, комод Молдова, мебель на заказ Молдова" />
        <meta name="description" content="Dulap.md – Dulapuri și mobilier la comandă în Chișinău și Moldova. Configurator online. Livrare rapidă." />
        <meta property="og:title" content={title} />
        <meta property="og:description" content="Dulap.md – Dulapuri și mobilier la comandă în Chișinău și Moldova." />
        <meta property="og:url" content="https://www.dulap.md" />
        <meta property="og:type" content="website" />
      </Head>
      <div className='layout'>
        <Menu />
        <main className='main'>{children}</main>
        <Footer />
      </div>
    </>
  )
}

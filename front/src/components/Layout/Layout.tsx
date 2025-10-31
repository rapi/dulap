import { ReactNode } from 'react'
import Head from 'next/head'
import { Menu } from '~/components/Menu/Menu'
import { Footer } from '~/components/Footer/Footer'
import './Layout.css'

type LayoutProps = { children: ReactNode }

export default function Layout({ children }: LayoutProps) {
  return (
    <>
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

import { ReactNode } from 'react'
import { Menu } from '~/components/Menu/Menu'
import './Layout.css'
import { Footer } from '~/components/Footer/Footer'
type LayoutProps = {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Menu />
      <main>{children}</main>
      <Footer />
    </>
  )
}

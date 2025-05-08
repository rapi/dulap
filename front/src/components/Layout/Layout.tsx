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
      <div className='layout'>
        <Menu />
        <main className='main'>{children}</main>
        <Footer />
      </div>
    </>
  )
}

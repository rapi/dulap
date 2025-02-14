import { ReactNode } from 'react'
import { Menu } from '~/components/Menu/Menu'
import './Layout.css'
type LayoutProps = {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Menu />
      <main>{children}</main>
    </>
  )
}

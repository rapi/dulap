import classes from './Menu.module.css'
import React from 'react'
import Image from 'next/image'
import { CustomButton } from '~/components/CustomButton/CustomButton'
import { WardrobeIconMedium } from '~/components/Icons/Icons'
import Link from 'next/link'
export const Menu = () => {
  return (
    <header className={classes.header}>
      <div className="logo">
        <Link href="/">
          <Image width={134} height={30} src="/logo.svg" alt="Dulap.md Logo" />
        </Link>
      </div>
      <nav className={classes.navigation}>
        <a href="#">Dulapuri</a>
        <a href="#">Comode</a>
        <a href="#">Rafturi</a>
        <CustomButton 
          icon={<WardrobeIconMedium/>}
          size='medium'
        >
          Încearcă aici
        </CustomButton>
        <div className="icons">
          <Link href="/cart">
            <Image
              width={30}
              height={30}
              src="/cart.svg"
              alt="Dulap.md shopping cart"
            />
          </Link>
        </div>
      </nav>
    </header>
  )
}

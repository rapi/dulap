import classes from './Menu.module.css'
import React from 'react'
import Image from 'next/image'
import { CustomButton } from '~/components/CustomButton/CustomButton'
import { WardrobeIcon } from '~/components/Icons/Icons'
export const Menu = () => {
  return (
    <header className={classes.header}>
      <div className="logo">
        <Image width={134} height={30} src="/logo.svg" alt="Dulap.md Logo" />
      </div>
      <nav className={classes.navigation}>
        <a href="#">Dulapuri</a>
        <a href="#">Comode</a>
        <a href="#">Rafturi</a>
        <CustomButton icon={<WardrobeIcon />}>Încearcă aici</CustomButton>
        <div className="icons">
          <Image
            width={30}
            height={30}
            src="/cart.svg"
            alt="Dulap.md shopping cart"
          />
        </div>
      </nav>
    </header>
  )
}

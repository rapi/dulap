import classes from './Menu.module.css'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import Image from 'next/image'
import Button from '@mui/material/Button'
import { CustomButton } from '~/components/CustomButton/CustomButton'
import { WardrobeIconMedium } from '~/components/Icons/Icons'
import MenuMui from '@mui/material/Menu'
import MenuIcon from '@mui/icons-material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { grey } from '@mui/material/colors'
import Link from 'next/link'
export const Menu = () => {
  const router = useRouter()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  return (
    <header className={classes.header}>
      <div className={classes.headerContainer}>
        <div className="logo">
          <Link href="/">
            <Image
              width={115}
              height={25}
              src="/logo.svg"
              alt="Dulap.md Logo"
            />
          </Link>
        </div>
        <Button
          id="basic-button"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          className={classes.menuButton}
          onClick={handleClick}
        >
          <MenuIcon sx={{ color: grey[800] }} fontSize="large"></MenuIcon>
        </Button>
        <MenuMui
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          sx={{
            width: '200px',
            fontSize: '12px',
            fontFamily: 'Onest, sans-serif',
          }}
        >
          <MenuItem
            onClick={() => {
              handleClose()
              router.push('/products')
            }}
            className={classes.menuItem}
          >
            Produse
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleClose()
              router.push('/')
            }}
            className={classes.menuItem}
          >
            Despre noi
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleClose()
              router.push('/products')
            }}
            className={classes.menuItem}
          >
            Contacte
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <CustomButton
              icon={<WardrobeIconMedium />}
              size="medium"
              href="/products"
            >
              Încearcă aici
            </CustomButton>
          </MenuItem>
          <MenuItem onClick={handleClose}>
            {/*<Select*/}
            {/*  options={['ro', 'ru']}*/}
            {/*  onChange={(e) => router.push(`/${e}/`)}*/}
            {/*/>*/}
          </MenuItem>
        </MenuMui>

        <nav className={classes.navigation}>
          <a href="#">Produse</a>
          <a href="#">Despre noi</a>
          <a href="#">Contacte</a>
          <CustomButton
            icon={<WardrobeIconMedium />}
            size="medium"
            href="/products"
          >
            Încearcă aici
          </CustomButton>
          <div className="icons">
            <Link href="/[locale]/cart">
              <Image
                width={30}
                height={30}
                src="/cart.svg"
                alt="Dulap.md shopping cart"
              />
            </Link>
            {/*<Select*/}
            {/*  options={['ro', 'ru']}*/}
            {/*  onChange={(e) => router.push(`/${e}/`)}*/}
            {/*/>*/}
          </div>
        </nav>
      </div>
    </header>
  )
}

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
import { FormattedMessage } from 'react-intl'
import Select from '~/components/Select/Select'
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
            <FormattedMessage id="homepage.menu.productsTitle" />
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleClose()
              router.push('/about-us')
            }}
            className={classes.menuItem}
          >
            <FormattedMessage id="homepage.menu.aboutUsTitle" />
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleClose()
              router.push('/contacts')
            }}
            className={classes.menuItem}
          >
            <FormattedMessage id="homepage.menu.contactsTitle" />
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <CustomButton size="medium" href="/office-table" variant="danger">
              Office Table
            </CustomButton>
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <CustomButton
              icon={<WardrobeIconMedium />}
              size="medium"
              href="/products"
            >
              <FormattedMessage id="homepage.button.yourWardrobe" />
            </CustomButton>
          </MenuItem>
          {/* <MenuItem onClick={handleClose}> */}
          {/*<Select*/}
          {/*  options={['ro', 'ru']}*/}
          {/*  onChange={(e) => router.push(`/${e}/`)}*/}
          {/*/>*/}
          {/* </MenuItem> */}
        </MenuMui>

        <nav className={classes.navigation}>
          <Link href="/products">
            <FormattedMessage id="homepage.menu.productsTitle" />
          </Link>
          <Link href="/about-us">
            <FormattedMessage id="homepage.menu.aboutUsTitle" />
          </Link>
          <Link href="/contacts">
            <FormattedMessage id="homepage.menu.contactsTitle" />
          </Link>

          <CustomButton size="medium" href="/office-table" variant="danger">
            Office Table
          </CustomButton>

          <CustomButton
            icon={<WardrobeIconMedium />}
            size="medium"
            href="/products"
          >
            <FormattedMessage id="homepage.button.yourWardrobe" />
          </CustomButton>
          <Select
            options={['ro', 'ru']}
            onChange={(e) => router.push(`/${e}/`)}
          />
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
      </div>
    </header>
  )
}

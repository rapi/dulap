import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import classes from './Menu.module.css'
import Image from 'next/image'
import Button from '@mui/material/Button'
import { CartIcon } from '~/components/Icons/Icons'
import MenuMui from '@mui/material/Menu'
import MenuIcon from '@mui/icons-material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { grey } from '@mui/material/colors'
import Link from 'next/link'
import { FormattedMessage } from 'react-intl'
import Select from '~/components/Select/Select'
import { useCart } from '~/context/cartContext'
import { Badge } from '@mui/material'

export const Menu: React.FC = () => {
  const router = useRouter()
  const { asPath, query } = router

  const { itemCount } = useCart()

  // Menu open state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  // Header visibility on scroll (mobile)
  const lastScrollY = useRef(0)
  const [showHeader, setShowHeader] = useState(true)

  useEffect(() => {
    // only wire up on mobile
    if (window.innerWidth > 900) return

    // initialize
    lastScrollY.current = window.pageYOffset

    const handleScroll = () => {
      const currentScrollY = window.pageYOffset

      if (currentScrollY <= 0) {
        // at very top → always show
        setShowHeader(true)
      } else if (currentScrollY > lastScrollY.current) {
        // scrolling down → hide
        setShowHeader(false)
      } else {
        // scrolling up → show
        setShowHeader(true)
      }

      lastScrollY.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const headerClass = `${classes.header} ${!showHeader ? classes.hidden : ''}`

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget)
  }
  const handleClose = () => setAnchorEl(null)

  const handleLocaleChange = (newLocale: string) => {
    const pathWithoutLocale = asPath.replace(/^\/(ro|ru)/, '')
    router.push(`/${newLocale}${pathWithoutLocale}`)
  }
  // const handleLocaleChange = (newLocale: string) => {
  //   // Next.js will automatically swap out the locale segment
  //   router.push(pathname, asPath, { locale: newLocale })
  // }

  return (
    <header className={headerClass}>
      <div className={classes.headerContainer}>
        <div className="logo">
          <Link href="/">
            <Image
              width={158}
              height={25}
              src="/logo-red.svg"
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
          <MenuIcon sx={{ color: grey[800] }} fontSize="large" />
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
          <MenuItem onClick={handleClose}>
            <Select
              options={['ro', 'ru']}
              defaultValue={(query.locale as string) ?? 'ro'}
              onChange={handleLocaleChange}
              size="small"
            />
            
          </MenuItem>
        
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
              router.push('/blog')
            }}
            className={classes.menuItem}
          >
            <FormattedMessage id="homepage.menu.blogTitle" />
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
            <Link href="/cart">
              <Badge badgeContent={itemCount} color="primary">
                <CartIcon />
              </Badge>
            </Link>
          </MenuItem>
          {/* <MenuItem onClick={handleClose}>
            <CustomButton
              icon={<WardrobeIconMedium />}
              size="medium"
              href="/products"
            >
              <FormattedMessage id="homepage.button.yourWardrobe" />
            </CustomButton>
          </MenuItem> */}
        </MenuMui>

        <nav className={classes.navigation}>
          <Link href="/products">
            <FormattedMessage id="homepage.menu.productsTitle" />
          </Link>
          <Link href="/about-us">
            <FormattedMessage id="homepage.menu.aboutUsTitle" />
          </Link>
          <Link href="/blog">
            <FormattedMessage id="homepage.menu.blogTitle" />
          </Link>
          <Link href="/contacts">
            <FormattedMessage id="homepage.menu.contactsTitle" />
          </Link>

          {/* <CustomButton
            icon={<WardrobeIconMedium />}
            size="medium"
            href="/products"
          >
            <FormattedMessage id="homepage.button.yourWardrobe" />
          </CustomButton> */}

          <Select
            options={['ro', 'ru']}
            defaultValue={(query.locale as string) ?? 'ro'}
            onChange={handleLocaleChange}
            size="small"
          />

          <div className="icons">
            <Link href="/cart">
              <Badge badgeContent={itemCount} color="primary">
                <CartIcon />
              </Badge>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}
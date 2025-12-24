import React from 'react'
import styles from './Footer.module.css'
import Link from 'next/link'
import { FormattedMessage } from 'react-intl'

export const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <nav className={styles.menu}>
          <ul>
            <li>
              <Link href="/products">
                <FormattedMessage id="homepage.footer.products" />
              </Link>
            </li>
            <li>
              <Link href="/configurator/stand">
                <FormattedMessage id="homepage.footer.stands" />
              </Link>
            </li>
            <li>
              <Link href="/configurator/tv-stand">
                <FormattedMessage id="homepage.footer.tvstands" />
              </Link>
            </li>
            <li>
              <Link href="/configurator/bedside">
                <FormattedMessage id="homepage.footer.bedsides" />
              </Link>
            </li>
          </ul>
        </nav>
        <nav className={styles.menu}>
          <ul>
            <li>
              <Link href="/about-us">
                <FormattedMessage id="homepage.menu.aboutUsTitle" />
              </Link>
            </li>
            <li>
              <Link href="/blog">
                <FormattedMessage id="homepage.menu.blogTitle" />
              </Link>
            </li>
            <li>
              <Link href="/faq">
                <FormattedMessage id="homepage.menu.faqTitle" />
              </Link>
            </li>
            <li>
              <Link href="/contacts">
                <FormattedMessage id="homepage.menu.contactsTitle" />
              </Link>
            </li>
            <li>
              <Link href="/terms">
                <FormattedMessage id="homepage.footer.termsAndConditions" />
              </Link>
            </li>
          </ul>
        </nav>
        <div className={styles.logoSection}>
          <Link href="/">
            <img alt="logo" src="/logo-red.svg" width={200} />
          </Link>
          <p>
            <FormattedMessage id="homepage.footer.followUs" />
          </p>
          <div className={styles.socialIcons}>
            <a
              href="https://www.instagram.com/dulap.md_?igsh=MTEzNWR4cXBpbXdwbQ=="
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/soclial/instagram.png" alt="Instagram" />
            </a>
            <a
              href="https://www.facebook.com/share/15j84TravW/?mibextid=wwXIfr"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/soclial/facebook.png" alt="Facebook" />
            </a>
          </div>
          {/* <p className={styles.location}>Chișinău, Republica Moldova</p> */}
        </div>
      </div>
    </footer>
  )
}

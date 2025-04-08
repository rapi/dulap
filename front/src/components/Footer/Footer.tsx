import React from 'react'
import styles from './Footer.module.css'

export const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <nav className={styles.menu}>
          <ul>
            <li>Dulapuri</li>
            <li>Comode</li>
            <li>Rafturi</li>
          </ul>
        </nav>
        <nav className={styles.menu}>
          <ul>
            <li>Despre noi</li>
            <li>Contacte</li>
          </ul>
        </nav>
        <div className={styles.logoSection}>
          <img alt="logo" src="/logo.svg" width={130} />
          <p>Abonează-te!</p>
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

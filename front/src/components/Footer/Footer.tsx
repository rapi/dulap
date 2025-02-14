import React from 'react'
import styles from './Footer.module.css'

export const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.menu}>
          <ul>
            <li>Dulapuri</li>
            <li>Comode</li>
            <li>Rafturi</li>
          </ul>
        </div>
        <div className={styles.menu}>
          <ul>
            <li>Despre noi</li>
            <li>Contacte</li>
          </ul>
        </div>
        <div className={styles.logoSection}>
          <div className={styles.logo}>
            <span>dulap.</span>
            <span className={styles.highlight}>md</span>
          </div>
          <p>Abonează-te!</p>
          <div className={styles.socialIcons}>
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/instagram.png" alt="Instagram" />
            </a>
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/facebook.png" alt="Facebook" />
            </a>
          </div>
        </div>
      </div>
      <p className={styles.location}>Chișinău, Republica Moldova</p>
    </footer>
  )
}

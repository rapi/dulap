import React from 'react'
import styles from './AboutUs.module.css'
import { FormattedMessage } from 'react-intl'

export { AboutUs }

const AboutUs: React.FC = () => {
  return (
    <div className={styles.about}>
      <section className={styles.aboutSection}>
        <div className={styles.container}>
          <h2 className={styles.title}>
            <FormattedMessage id="aboutUs.title" />
          </h2>
          <h3 className={styles.intro}>
            <FormattedMessage id="aboutUs.subtitle" />
          </h3>

          <div className={styles.teamGrid}>
            {/* Founder 1 */}
            <div className={styles.founderCard}>
              <img
                src="/about-us/Elizabet.jpg"
                alt="Elizabet"
                className={styles.founderImage}
              />
              <h3 className={styles.founderName}>Elizabet Grinciuc</h3>
              <p className={styles.founderRole}>
                <FormattedMessage id="aboutUs.founder1.subtitle" />
              </p>
              <p className={styles.founderDetails}>
                <FormattedMessage id="aboutUs.founder1.details" />
              </p>
            </div>

            {/* Founder 2 */}
            <div className={styles.founderCard}>
              <img
                src="/about-us/Vasile.jpg"
                alt="Vasile"
                className={styles.founderImage}
              />
              <h3 className={styles.founderName}>Vasile Grinciuc</h3>
              <p className={styles.founderRole}>
                <FormattedMessage id="aboutUs.founder3.subtitle" />
              </p>
              <p className={styles.founderDetails}>
                <FormattedMessage id="aboutUs.founder3.details" />
              </p>
            </div>

            {/* Founder 3 */}
            <div className={styles.founderCard}>
              <img
                src="/about-us/Margareta-new.jpg"
                alt="Margareta"
                className={styles.founderImage}
              />
              <h3 className={styles.founderName}>Margareta Galaju</h3>
              <p className={styles.founderRole}>
                <FormattedMessage id="aboutUs.founder5.subtitle" />
              </p>
              <p className={styles.founderDetails}>
                <FormattedMessage id="aboutUs.founder5.details" />
              </p>
            </div>

            {/* Founder 4 */}
            <div className={styles.founderCard}>
              <img
                src="/about-us/Roman.jpg"
                alt="Roman"
                className={styles.founderImage}
              />
              <h3 className={styles.founderName}>Roman Picunov</h3>
              <p className={styles.founderRole}>
                <FormattedMessage id="aboutUs.founder2.subtitle" />
              </p>
              <p className={styles.founderDetails}>
                <FormattedMessage id="aboutUs.founder2.details" />
              </p>
            </div>

            {/* Founder 5 */}
            <div className={styles.founderCard}>
              <img
                src="/about-us/Iulia.jpg"
                alt="Iulia"
                className={styles.founderImage}
              />
              <h3 className={styles.founderName}>Iulia Picunova</h3>
              <p className={styles.founderRole}>
                <FormattedMessage id="aboutUs.founder4.subtitle" />
              </p>
              <p className={styles.founderDetails}>
                <FormattedMessage id="aboutUs.founder4.details" />
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

import React from 'react';
import styles from './AboutUs.module.css'
import { FormattedMessage } from 'react-intl';

export { AboutUs }

const AboutUs: React.FC = () => {
    
  return (
    <div className={styles.about}>
        <section className={styles.aboutSection}>
            <div className={styles.container}>
                <h1 className={styles.title}><FormattedMessage id="aboutUs.title"/></h1>
                <p className={styles.intro}>
                <FormattedMessage id="aboutUs.subtitle"/>
                </p>

                <div className={styles.teamGrid}>
                {/* Founder 1 */}
                <div className={styles.founderCard}>
                    <img
                    src="/about-us/Elizabet.jpg"
                    alt="Elizabet"
                    className={styles.founderImage}
                    />
                    <h3 className={styles.founderName}>Elizabet Grinciuc</h3>
                    <p className={styles.founderRole}><FormattedMessage id="aboutUs.founder1.subtitle"/></p>
                    <h5><FormattedMessage id="aboutUs.founder1.details"/></h5>
                </div>

                {/* Founder 2 */}
                <div className={styles.founderCard}>
                    <img
                    src="/about-us/Roman.jpg"
                    alt="Roman"
                    className={styles.founderImage}
                    />
                    <h3 className={styles.founderName}>Roman Picunov</h3>
                    <p className={styles.founderRole}><FormattedMessage id="aboutUs.founder2.subtitle"/></p>
                    <h5><FormattedMessage id="aboutUs.founder2.details"/></h5>
                </div>

                {/* Founder 3 */}
                <div className={styles.founderCard}>
                    <img
                    src="/about-us/Vasile.jpg"
                    alt="Vasile"
                    className={styles.founderImage}
                    />
                    <h3 className={styles.founderName}>Vasile Grinciuc</h3>
                    <p className={styles.founderRole}><FormattedMessage id="aboutUs.founder3.subtitle"/></p>
                    <h5><FormattedMessage id="aboutUs.founder3.details"/></h5>
                </div>
                </div>
            </div>
        </section>
    </div>
  )
}
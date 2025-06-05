import React from 'react';
import styles from './AboutUs.module.css'
import { FormattedMessage } from 'react-intl';

export { AboutUs }

const AboutUs: React.FC = () => {
    
  return (
    <div className={styles.test}>
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
                    src="/assets/founder1.jpg"
                    alt="Fondator 1"
                    className={styles.founderImage}
                    />
                    <h3 className={styles.founderName}>Elizabet Grinciuc</h3>
                    <p className={styles.founderRole}><FormattedMessage id="aboutUs.founder1.subtitle"/></p>
                    <h5><FormattedMessage id="aboutUs.founder1.details"/></h5>
                </div>

                {/* Founder 2 */}
                <div className={styles.founderCard}>
                    <img
                    src="/assets/founder2.jpg"
                    alt="Fondator 2"
                    className={styles.founderImage}
                    />
                    <h3 className={styles.founderName}>Roman Picunov</h3>
                    <p className={styles.founderRole}><FormattedMessage id="aboutUs.founder2.subtitle"/></p>
                    <h5><FormattedMessage id="aboutUs.founder2.details"/></h5>
                </div>

                {/* Founder 3 */}
                <div className={styles.founderCard}>
                    <img
                    src="/assets/founder3.jpg"
                    alt="Fondator 3"
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
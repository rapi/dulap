import React from 'react'
import { FAQcontent } from './FAQcontent'
import styles from './FAQ.module.css'
import ProductDescription from '../ProductDescription/ProductDescription'
import { FormattedMessage } from 'react-intl'

export const FAQ: React.FC = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        <FormattedMessage id="faqPage.title" />
      </h2>
      <h3 className={styles.intro}>
        <FormattedMessage id="faqPage.subtitle" />
      </h3>
      <ProductDescription sections={FAQcontent} heading={'faq.title'} />
    </div>
  )
}

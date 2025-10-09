// /components/FAQ/FAQ.tsx (you can keep your current filename)
import React from 'react'
import styles from './FAQ.module.css'
import ProductDescription from '../ProductDescription/ProductDescription'
import { FormattedMessage } from 'react-intl'
import FaqStructuredDataIntl from '../SEO/FaqStructuredDataIntl'

export type ContentId = string
export type DescriptionSection = {
  title: string
  content: ContentId | ContentId[]
}

export const FAQcontent: DescriptionSection[] = [
  { title: 'faq.question.1', content: 'faq.answer.1.1' },
  { title: 'faq.question.2', content: ['faq.answer.2.1', 'faq.answer.2.2'] },
  { title: 'faq.question.3', content: ['faq.answer.3.1', 'faq.answer.3.2'] },
  { title: 'faq.question.4', content: ['faq.answer.4.1'] },
  { title: 'faq.question.5', content: ['faq.answer.5.1', 'faq.answer.5.2'] },
  { title: 'faq.question.6', content: ['faq.answer.6.1', 'faq.answer.6.2'] },
  { title: 'faq.question.7', content: ['faq.answer.7.1', 'faq.answer.7.2'] },
  { title: 'faq.question.8', content: ['faq.answer.8.1', 'faq.answer.8.2'] },
  { title: 'faq.question.9', content: ['faq.answer.9.1', 'faq.answer.9.2'] },
]

export const FAQ: React.FC = () => {
  return (
    <div className={styles.container}>
      <FaqStructuredDataIntl items={FAQcontent} />

      <h2 className={styles.title}>
        <FormattedMessage id="faqPage.title" />
      </h2>
      <h3 className={styles.intro}>
        <FormattedMessage id="faqPage.subtitle" />
      </h3>

      <ProductDescription sections={FAQcontent} heading="faq.title" />
    </div>
  )
}

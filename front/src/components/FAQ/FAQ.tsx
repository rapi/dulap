import React from 'react'
import styles from './FAQ.module.css'
import ProductDescription from '../ProductDescription/ProductDescription'
import { FormattedMessage } from 'react-intl'
import FaqStructuredDataIntl from '../SEO/FaqStructuredDataIntl'

// If this type lives elsewhere, import it instead of redefining.
export type ContentId = string
export type DescriptionSection = {
  title: string
  content: ContentId | ContentId[]
}

type FAQProps = {
  content: DescriptionSection[]
  titleId?: string // default: 'faqPage.title'
  subtitleId?: string // default: 'faqPage.subtitle'
  headingId?: string // default: 'faq.title' (passed to ProductDescription)
  className?: string
  withStructuredData?: boolean // default: true
}

export const FAQ: React.FC<FAQProps> = ({
  content,
  titleId = 'faqPage.title',
  subtitleId = 'faqPage.subtitle',
  headingId = 'faq.title',
  className,
  withStructuredData = true,
}) => {
  const containerClass = [styles.container, className].filter(Boolean).join(' ')

  return (
    <div className={containerClass}>
      {withStructuredData && content?.length > 0 && (
        <FaqStructuredDataIntl items={content} />
      )}

      <h2 className={styles.title}>
        <FormattedMessage id={titleId} />
      </h2>
      <h3 className={styles.intro}>
        <FormattedMessage id={subtitleId} />
      </h3>

      <ProductDescription sections={content} heading={headingId} />
    </div>
  )
}

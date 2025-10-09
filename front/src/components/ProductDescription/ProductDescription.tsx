// /components/ProductDescription/ProductDescription.tsx
import React, { useState } from 'react'
import styles from './ProductDescription.module.css'
import { FormattedMessage, useIntl } from 'react-intl'

type ContentId = string
export type DescriptionSection = {
  title: string
  content: ContentId | ContentId[]
}

type Props = {
  sections: DescriptionSection[]
  heading: string
  defaultOpenTitles?: string[]
  className?: string
}

export default function ProductDescription({
  sections,
  heading,
  defaultOpenTitles = [],
  className,
}: Props) {
  const [openSections, setOpenSections] = useState<string[]>(defaultOpenTitles)
  const intl = useIntl()

  const toggle = (title: string) => {
    setOpenSections((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    )
  }

  return (
    <div className={`${styles.wrapper} ${className ?? ''}`}>
      <h2>
        <FormattedMessage id={heading} />
      </h2>

      <div className={styles.panel}>
        {sections.map((section, index) => {
          const isOpen = openSections.includes(section.title)
          const contentArray = Array.isArray(section.content)
            ? section.content
            : [section.content]
          const panelId = `pd-panel-${index}`
          const buttonId = `pd-button-${index}`

          return (
            <section
              key={section.title}
              className={`${styles.section} ${index === 0 ? styles.first : ''}`}
              aria-labelledby={buttonId}
            >
              <button
                id={buttonId}
                className={styles.button}
                onClick={() => toggle(section.title)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                type="button"
              >
                {intl.formatMessage({ id: section.title })}
                <span className={`${styles.icon} ${isOpen ? styles.open : ''}`}>
                  +
                </span>
              </button>

              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                className={`${styles.contentWrapper} ${isOpen ? styles.expanded : ''}`}
              >
                {contentArray.map((line, i) => (
                  <p key={i} className={styles.text}>
                    {intl.formatMessage({ id: line })}
                  </p>
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}

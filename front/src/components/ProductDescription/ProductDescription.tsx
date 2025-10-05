import React, { useState } from 'react'
import styles from './ProductDescription.module.css'
import { ProductDescriptionDetails } from './ProductDescriptionDetails'
import { FormattedMessage, useIntl } from 'react-intl'

type Props = { productType: string }

export default function ProductDescription({ productType }: Props) {
  // 1️⃣ change: use array instead of single string
  const [openSections, setOpenSections] = useState<string[]>([])
  const intl = useIntl()

  // 2️⃣ change: toggle now adds/removes from array
  const toggle = (title: string) => {
    setOpenSections(
      (prev) =>
        prev.includes(title)
          ? prev.filter((t) => t !== title) // close if already open
          : [...prev, title] // open new one without closing others
    )
  }

  return (
    <div className={styles.wrapper}>
      <h2>
        <FormattedMessage id={'productPage.details.title'} />
      </h2>

      <div className={styles.panel}>
        {ProductDescriptionDetails.map((section, index) => {
          const item = section.value.find((v) => {
            const types = Array.isArray(v.productType)
              ? v.productType
              : [v.productType]
            return types.includes(productType)
          })
          if (!item || !item.content) return null

          const isOpen = openSections.includes(section.title) // 3️⃣ changed condition
          const contentArray = Array.isArray(item.content)
            ? item.content
            : [item.content]

          return (
            <section
              key={section.title}
              className={`${styles.section} ${index === 0 ? styles.first : ''}`}
            >
              <button
                className={styles.button}
                onClick={() => toggle(section.title)}
              >
                {intl.formatMessage({ id: section.title })}
                <span className={`${styles.icon} ${isOpen ? styles.open : ''}`}>
                  +
                </span>
              </button>

              <div
                className={`${styles.contentWrapper} ${
                  isOpen ? styles.expanded : ''
                }`}
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

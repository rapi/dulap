// import React, { useState } from 'react'
// import styles from './ProductDescription.module.css'
// import { ProductDescriptionDetails } from './ProductDescriptionDetails'
// import { FormattedMessage, useIntl } from 'react-intl'
//
// type Props = {
//   productType?: string
// }
//
// export default function ProductDescription({ productType }: Props) {
//   const [openSections, setOpenSections] = useState<string[]>([])
//   const intl = useIntl()
//
//   const toggle = (title: string) => {
//     setOpenSections((prev) =>
//       prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
//     )
//   }
//
//   return (
//     <div className={styles.wrapper}>
//       <h2>
//         <FormattedMessage id={'productPage.details.title'} />
//       </h2>
//
//       <div className={styles.panel}>
//         {ProductDescriptionDetails.map((section, index) => {
//           const item = section.value.find((v) => {
//             const types = Array.isArray(v.productType)
//               ? v.productType
//               : [v.productType]
//             // if no productType is provided, show all
//             return !productType || types.includes(productType)
//           })
//           if (!item || !item.content) return null
//
//           const isOpen = openSections.includes(section.title)
//           const contentArray = Array.isArray(item.content)
//             ? item.content
//             : [item.content]
//
//           return (
//             <section
//               key={section.title}
//               className={`${styles.section} ${index === 0 ? styles.first : ''}`}
//             >
//               <button
//                 className={styles.button}
//                 onClick={() => toggle(section.title)}
//               >
//                 {intl.formatMessage({ id: section.title })}
//                 <span className={`${styles.icon} ${isOpen ? styles.open : ''}`}>
//                   +
//                 </span>
//               </button>
//
//               <div
//                 className={`${styles.contentWrapper} ${
//                   isOpen ? styles.expanded : ''
//                 }`}
//               >
//                 {contentArray.map((line, i) => (
//                   <p key={i} className={styles.text}>
//                     {intl.formatMessage({ id: line })}
//                   </p>
//                 ))}
//               </div>
//             </section>
//           )
//         })}
//       </div>
//     </div>
//   )
// }

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
  heading: string // i18n id to show as the title for all sections
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

          return (
            <section
              key={section.title}
              className={`${styles.section} ${index === 0 ? styles.first : ''}`}
            >
              <button
                className={styles.button}
                onClick={() => toggle(section.title)}
                aria-expanded={isOpen}
                aria-controls={`section-${index}`}
              >
                {intl.formatMessage({ id: section.title })}
                <span className={`${styles.icon} ${isOpen ? styles.open : ''}`}>
                  +
                </span>
              </button>

              <div
                id={`section-${index}`}
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

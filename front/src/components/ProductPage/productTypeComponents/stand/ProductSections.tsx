// import React, { FC } from 'react'
// import { FormattedMessage } from 'react-intl'
// import {
//   ButtonOptionsType,
//   ButtonSelect,
// } from '~/components/ButtonSelect/ButtonSelect'
// import styles from '~/components/ProductPageLayout/ProductPageLayout.module.css'
// export type ProductSectionsComponent = {
//   type: 'sections'
//   selectedSections: number
//   setSelectedSections: (value: number) => void
// }
// interface ProductSectionsProps {
//   configuration: ProductSectionsComponent
//   predefinedValue?: number
// }
// export const sectionsOptions: ButtonOptionsType[] = [
//   { value: '3', label: 3 },
//   { value: '4', label: 4 },
//   { value: '5', label: 5 },
// ]
// export const ProductSections: FC<ProductSectionsProps> = ({
//   configuration,
//   predefinedValue
// }) => {
//   return (
//     <div>
//       <p className={styles.sectionsTitle}><FormattedMessage id="homepage.configurator.options.title" defaultMessage="Opțiuni" /></p>

//       <label className={styles.furnitureLabel}>
//         <p><FormattedMessage id="homepage.configurator.sections.title" defaultMessage="Secțiuni" /></p>
//         {predefinedValue ?? (
//           <ButtonSelect
//             options={sectionsOptions}
//             defaultSelected={configuration.selectedSections.toString()}
//             onChange={(value) => {
//               configuration.setSelectedSections(parseInt(value))
//             }}
//           />
//         )}
//       </label>
//     </div>
//   )
// }

import React, { FC } from 'react'
import { FormattedMessage } from 'react-intl'
import {
  ButtonOptionsType,
  ButtonSelect,
} from '~/components/ButtonSelect/ButtonSelect'
import styles from '~/components/ProductPageLayout/ProductPageLayout.module.css'
import { use3DVersion } from '~/hooks/use3DVersion'
import { useMediaQuery } from '@mui/material'
export type ProductSectionsComponent = {
  type: 'sections'
  selectedSections: number
  setSelectedSections: (value: number) => void
}
interface ProductSectionsProps {
  configuration: ProductSectionsComponent
  predefinedValue?: number
  options?: ButtonOptionsType[]
}
export const sectionsOptions: ButtonOptionsType[] = [
  { value: '3', label: 3 },
  { value: '4', label: 4 },
  { value: '5', label: 5 },
]
export const ProductSections: FC<ProductSectionsProps> = ({
  configuration,
  predefinedValue,
  options = sectionsOptions,
}) => {
  const is3DVersion = use3DVersion()
  const isMobile = useMediaQuery('(max-width: 768px)')

  return (
    <div>
      {!isMobile && (
        <p className={styles.sectionsTitle}>
          <FormattedMessage
            id="homepage.configurator.options.title"
            defaultMessage="Opțiuni"
          />
        </p>
      )}
      <label className={styles.furnitureLabel}>
        {!isMobile && (
          <p>
            <FormattedMessage
              id="homepage.configurator.sections.title"
              defaultMessage="Secțiuni"
            />
          </p>
        )}
        {predefinedValue ?? (
          <ButtonSelect
            options={options}
            defaultSelected={configuration.selectedSections.toString()}
            // onChange={(value) => {
            //   configuration.setSelectedSections(parseInt(value))
            // }}
            onChange={(value) => {
              // ignore clicks on disabled options
              const opt = options.find((o) => o.value === value)
              if (!opt?.disabled) {
                configuration.setSelectedSections(parseInt(value))
              }
            }}
          />
        )}
      </label>
    </div>
  )
}

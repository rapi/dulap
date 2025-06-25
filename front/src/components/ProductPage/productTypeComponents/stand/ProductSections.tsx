import React, { FC } from 'react'
import { FormattedMessage } from 'react-intl'
import {
  ButtonOptionsType,
  ButtonSelect,
} from '~/components/ButtonSelect/ButtonSelect'
import styles from '~/components/ProductPageLayout/ProductPageLayout.module.css'
export type ProductSectionsComponent = {
  type: 'sections'
  selectedSections: number
  setSelectedSections: (value: number) => void
}
interface ProductSectionsProps {
  configuration: ProductSectionsComponent
  predefinedValue?: number
}
export const sectionsOptions: ButtonOptionsType[] = [
  { value: '3', label: 3 },
  { value: '4', label: 4 },
]
export const ProductSections: FC<ProductSectionsProps> = ({
  configuration,
  predefinedValue
}) => {
  return (
    <div>
      <p className={styles.sectionsTitle}><FormattedMessage id="homepage.configurator.options.title" defaultMessage="Opțiuni" /></p>

      <label className={styles.furnitureLabel}>
        <p><FormattedMessage id="homepage.configurator.sections.title" defaultMessage="Secțiuni" /></p>
        {predefinedValue ?? (
          <ButtonSelect
            options={sectionsOptions}
            defaultSelected={configuration.selectedSections.toString()}
            onChange={(value) => {
              configuration.setSelectedSections(parseInt(value))
            }}
          />
        )}
      </label>
    </div>
  )
}

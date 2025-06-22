import React, { FC } from 'react'
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
  { value: '1', label: 1 },
  { value: '2', label: 2 },
  { value: '3', label: 3 },
  { value: '4', label: 4 },
]
export const ProductSections: FC<ProductSectionsProps> = ({
  configuration,
}) => {
  return (
    <div>
      <p className={styles.sectionsTitle}>Opțiuni</p>

      <label className={styles.furnitureLabel}>
        <p>Secțiuni</p>
        <ButtonSelect
          options={sectionsOptions}
          defaultSelected={configuration.selectedSections.toString()}
          onChange={(value) => {
            configuration.setSelectedSections(parseInt(value))
          }}
        />
      </label>
    </div>
  )
}

import React, { FC } from 'react'
import { 
  ButtonOptionsType,
  ButtonSelect 
} from '~/components/ButtonSelect/ButtonSelect'
import styles from '~/components/ProductPageLayout/ProductPageLayout.module.css'
import Select from '~/components/Select/Select'
export type ProductFurnitureComponent = {
  type: 'furniture',
  selectedOpeningMethod: string,
  setSelectedOpeningMethod: (value: string) => void
}
export const openingOptions: ButtonOptionsType[] = [
  { value: 'maner', label: 'mâner' },
  { value: 'push', label: 'push-to-open' },
]
interface ProductSelectProps {
  configuration: ProductFurnitureComponent
}
export const ProductFurniture: FC<ProductSelectProps> = (
  { configuration: {
    setSelectedOpeningMethod
  } }
) => {
  return (
    <div>
      <p className={styles.furnitureTitle}>Furnitura</p>
      
      <label className={styles.furnitureLabel}>
        <p>Tip deschidere</p>
        <div className={styles.openingTypeContent}>
          <ButtonSelect
            options={openingOptions}
            defaultSelected={'maner'}
            onChange={(value) => {
              setSelectedOpeningMethod(value)
            }}
          />
        </div>
      </label>

      <label className={styles.furnitureLabel}>
        <p>Balamale</p>
          <Select options={['standard', 'premium', 'deluxe']} />
      </label>
      <label className={styles.furnitureLabel}>
        <p>Glisiere</p>
          <Select options={['standard', 'premium', 'deluxe']} />
      </label>
    </div>
  )
}

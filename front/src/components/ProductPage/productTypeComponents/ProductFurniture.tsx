import React, { FC } from 'react'
import { ButtonSelect } from '~/components/ButtonSelect/ButtonSelect'
import { openingOptions } from '~/components/ProductWardrobe/ProductWardrobe'
import styles from './ProductFurniture.module.css'
import Select from '~/components/Select/Select'
export type ProductFurnitureComponent = {
  type: 'furniture',
  selectedOpeningMethod: string,
  setSelectedOpeningMethod: (value: string) => void
}
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
      <p className={styles.sectionTitle}>Furnitura</p>
      
      <label className={styles.furnitureLabel}>
        <p>Tip deschidere</p>
        <ButtonSelect
          options={openingOptions}
          defaultSelected={'maner'}
          onChange={(value) => {
            setSelectedOpeningMethod(value)
          }}
        />
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

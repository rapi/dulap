import React, { FC } from 'react'
import SelectColor from '~/components/SelectColor/SelectColor'
import styles from '~/components/ProductPageLayout/ProductPageLayout.module.css'
export type ProductColorsComponent = {
  type: 'colors'
  colors: string[]
  selectedColor: string
  setSelectedColor: (value: string) => void
}
interface ProductColorsProps {
  configuration: ProductColorsComponent
}
export const ProductColors: FC<ProductColorsProps> = ({ configuration: {
  colors, 
  setSelectedColor
} }) => {
  return (
    <>
      <label className={styles.colorsLabel}>
        <p>Culori</p>
        <SelectColor
          colors={colors}
          onChange={(value) => { setSelectedColor(value) }}
          defaultSelected={colors[0]}
          size="medium"
        />
      </label>
    </>
  )
}

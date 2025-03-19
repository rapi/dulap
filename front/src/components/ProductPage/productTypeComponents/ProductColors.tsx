import React, { FC } from 'react'
import SelectColor from '~/components/SelectColor/SelectColor'
import styles from '~/components/ProductPageLayout/ProductPageLayout.module.css'
export type ProductColorsComponent = {
  type: 'colors'
  colors: string[]
}
interface ProductColorsProps {
  configuration: ProductColorsComponent
}
export const ProductColors: FC<ProductColorsProps> = ({ configuration }) => {
  return (
    <>
      <label className={styles.colorsLabel}>
        <p>Culori</p>
        <SelectColor
          colors={configuration.colors}
          onChange={() => {}}
          defaultSelected={configuration.colors[0]}
          size="medium"
        />
      </label>
    </>
  )
}

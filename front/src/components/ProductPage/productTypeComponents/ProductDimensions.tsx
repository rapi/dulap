import React, { FC } from 'react'
import styles from '~/components/ProductPageLayout/ProductPageLayout.module.css'
import { Slider } from '~/components/Slider/Slider'
export type ProductDimensionsComponent = {
  type: 'dimensions'
  widthRange: [number, number]
  heightRange: [number, number]
  depthRange: [number, number]
}
interface ProductDimensionsProps {
  configuration: ProductDimensionsComponent
}
export const ProductDimensions: FC<ProductDimensionsProps> = ({
  configuration,
}) => {
  return (
    <>
      <h3>Dimensiuni</h3>
      <div className={styles.dimensionsGrid}>
        <label className={styles.dimensionLabel}>
          <p className={styles.dimensionTitle}>Lățime (cm)</p>
          <Slider
            min={configuration.widthRange[0]}
            max={configuration.widthRange[1]}
            step={10}
            value={80}
            onChange={(newValue) => console.log(newValue)}
          />
        </label>
        <label className={styles.dimensionLabel}>
          <p className={styles.dimensionTitle}>Înălțime (cm)</p>
          <Slider
            min={configuration.heightRange[0]}
            max={configuration.heightRange[1]}
            step={10}
            value={120}
            onChange={(newValue) => console.log(newValue)}
          />
        </label>
        <label className={styles.dimensionLabel}>
          <p className={styles.dimensionTitle}>Adâncime (cm)</p>
          <Slider
            min={configuration.depthRange[0]}
            max={configuration.depthRange[1]}
            step={10}
            value={50}
            onChange={(newValue) => console.log(newValue)}
          />
        </label>
      </div>
    </>
  )
}

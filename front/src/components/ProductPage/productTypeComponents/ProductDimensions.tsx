import React, { FC } from 'react'
import { Slider } from '~/components/Slider/Slider'
import styles from './ProductDimensions.module.css'
export type ProductDimensionsComponent = {
  type: 'dimensions'
  widthRange: [number, number]
  heightRange: [number, number]
  depthRange: [number, number]
  width: number
  setWidth: (value: number) => void
}
interface ProductDimensionsProps {
  configuration: ProductDimensionsComponent
}
export const ProductDimensions: FC<ProductDimensionsProps> = ({
  configuration,
}) => {
  return (
    <>
      <h3 className={styles.header}>Dimensiuni</h3>
      <div className={styles.dimensionsGrid}>
        <label className={styles.dimensionLabel}>
          <p className={styles.dimensionTitle}>Lățime </p>
          <Slider
            min={configuration.widthRange[0]}
            max={configuration.widthRange[1]}
            step={10}
            value={configuration.width}
            onChange={configuration.setWidth}
          />
        </label>
        <label className={styles.dimensionLabel}>
          <p className={styles.dimensionTitle}>Înălțime </p>
          <Slider
            min={configuration.heightRange[0]}
            max={configuration.heightRange[1]}
            step={10}
            value={210}
            onChange={() => {}}
          />
        </label>
        <label className={styles.dimensionLabel}>
          <p className={styles.dimensionTitle}>Adâncime </p>
          <Slider
            min={configuration.depthRange[0]}
            max={configuration.depthRange[1]}
            step={10}
            value={50}
            onChange={() => {}}
          />
        </label>
      </div>
    </>
  )
}

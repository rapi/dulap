import React, { FC } from 'react'
import { Slider } from '~/components/Slider/Slider'
import styles from './ProductDimensions.module.css'
export type ProductDimensionsComponent = {
  type: 'dimensions'
  widthRange: [number, number]
  heightRange: [number, number]
  depthRange: [number, number]
  plintHeightRange: [number, number]
  width: number
  setWidth: (value: number) => void
  height: number
  setHeight: (value: number) => void
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
            value={configuration.height}
            onChange={configuration.setHeight}
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
        <label className={styles.dimensionLabel}>
          <p className={styles.dimensionTitle}>Înălțimea plintei </p>
          <Slider
            min={configuration.plintHeightRange[0]}
            max={configuration.plintHeightRange[1]}
            step={1}
            value={6}
            onChange={() => {}}
          />
        </label>
      </div>
    </>
  )
}

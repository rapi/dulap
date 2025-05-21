import React, { FC, useState } from 'react'
import { Slider } from '~/components/Slider/Slider'
import styles from '~/components/ProductPageLayout/ProductPageLayout.module.css'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { Modal } from '~/components/Modal/Modal'

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
  plintHeight: number
  setPlintHeight: (value: number) => void
}
interface ProductDimensionsProps {
  configuration: ProductDimensionsComponent
  predefinedValue?: string
}

export const ProductDimensions: FC<ProductDimensionsProps> = ({
  configuration,
  predefinedValue,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [predefinedWidth, predefinedHeight, predefinedDepth, predefinedPlint] =
    predefinedValue?.split('x') ?? []
  return (
    <>
      <h3 className={styles.dimensionsHeaderTitle}>Dimensiuni</h3>
      <div className={styles.dimensionsGrid}>
        <label className={styles.dimensionLabel}>
          <p className={styles.dimensionTitle}>Lățime </p>
          {predefinedWidth ?? (
            <Slider
              min={configuration.widthRange[0]}
              max={configuration.widthRange[1]}
              step={10}
              value={configuration.width}
              onChange={configuration.setWidth}
            />
          )}
        </label>
        <label className={styles.dimensionLabel}>
          <p className={styles.dimensionTitle}>Înălțime </p>
          {predefinedHeight ?? (
            <Slider
              min={configuration.heightRange[0]}
              max={configuration.heightRange[1]}
              step={10}
              value={configuration.height}
              onChange={configuration.setHeight}
            />
          )}
        </label>
        <label className={styles.dimensionLabel}>
          <p className={styles.dimensionTitle}>Adâncime </p>
          {predefinedDepth ?? (
            <Slider
              min={configuration.depthRange[0]}
              max={configuration.depthRange[1]}
              step={5}
              value={50}
              onChange={() => {}}
            />
          )}
        </label>
        <label className={styles.dimensionLabel}>
          <div className={styles.dimensionTitle}>
            Înălțimea plintei
            <div
              className={styles.tooltipContainer}
              onClick={() => setIsModalOpen(true)}
            >
              <InfoOutlinedIcon color="action" sx={{ fontSize: 20 }} />
              <span className={styles.tooltipText}>
                <img src="/wardrobe/base-tooltip.png" alt="base tooltip"></img>
              </span>
            </div>
          </div>
          {predefinedPlint ?? (
            <Slider
              min={configuration.plintHeightRange[0]}
              max={configuration.plintHeightRange[1]}
              step={1}
              value={5}
              onChange={configuration.setPlintHeight}
            />
          )}
        </label>
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
          }}
        >
          <h4>Ce este înălțimea plintei?</h4>
          <div className={styles.modalChildren}>
            <img
              src="/wardrobe/base-tooltip.png"
              alt="base tooltip"
              className={styles.modalImg}
            ></img>
            <p className={styles.modalText}>
              Înălțimea plintei este distanța de la podea până la fațade (ușile
              dulapului).
              <br></br>
              <br></br>
              <b>Ce înălțime să alegi?</b>
              <ul>
                <li>
                  Dacă optezi pentru un stil minimalist, alege înălțimea plintei
                  2 cm.
                </li>
                <li>
                  Dacă ai plinte la pereți, optează pentru o plintă de aceeași
                  înălțime la dulap, pentru un design uniform.
                </li>
              </ul>
            </p>
          </div>
        </Modal>
      </div>
    </>
  )
}
